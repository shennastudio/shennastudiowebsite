import { NextRequest, NextResponse } from 'next/server';
import { shippo, isShippoConfigured } from '@/lib/shippo';

export interface AddressValidationResult {
  isValid: boolean;
  validatedAddress?: {
    name?: string;
    street1: string;
    street2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  messages: Array<{
    source: string;
    code: string;
    type: 'error' | 'warning' | 'info';
    text: string;
  }>;
}

// US State codes for basic validation
const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
  'DC', 'PR', 'VI', 'GU', 'AS', 'MP'
];

// Basic ZIP code validation regex
const ZIP_REGEX = /^\d{5}(-\d{4})?$/;

export async function POST(request: NextRequest) {
  try {
    const { address } = await request.json();

    // Normalize and clean input
    const street1 = address?.street1?.trim() || '';
    const street2 = address?.street2?.trim() || '';
    const city = address?.city?.trim() || '';
    const state = (address?.state?.trim() || '').toUpperCase();
    const zip = address?.zip?.trim() || '';
    const country = (address?.country?.trim() || 'US').toUpperCase();
    const name = address?.name?.trim() || '';

    // Basic validation
    if (!street1 || !city || !state || !zip) {
      return NextResponse.json({
        isValid: false,
        messages: [{
          source: 'validation',
          code: 'INCOMPLETE_ADDRESS',
          type: 'error',
          text: 'Please provide a complete address (street, city, state, zip)'
        }]
      } as AddressValidationResult, { status: 400 });
    }

    // Validate ZIP format for US addresses
    if (country === 'US' && !ZIP_REGEX.test(zip)) {
      return NextResponse.json({
        isValid: false,
        messages: [{
          source: 'validation',
          code: 'INVALID_ZIP',
          type: 'error',
          text: 'Please enter a valid US ZIP code (e.g., 12345 or 12345-6789)'
        }]
      } as AddressValidationResult, { status: 400 });
    }

    // Validate state code for US addresses
    if (country === 'US' && !US_STATES.includes(state)) {
      return NextResponse.json({
        isValid: false,
        messages: [{
          source: 'validation',
          code: 'INVALID_STATE',
          type: 'error',
          text: 'Please enter a valid 2-letter US state code (e.g., TX, CA, NY)'
        }]
      } as AddressValidationResult, { status: 400 });
    }

    // Check if Shippo is configured
    if (!isShippoConfigured() || !shippo) {
      // If Shippo is not configured, do basic validation and return success
      // This allows the checkout to proceed without API-level validation
      console.warn('Shippo not configured, using basic validation only');
      return NextResponse.json({
        isValid: true,
        validatedAddress: {
          name: name || undefined,
          street1,
          street2: street2 || undefined,
          city,
          state,
          zip,
          country,
        },
        messages: [{
          source: 'system',
          code: 'BASIC_VALIDATION',
          type: 'info',
          text: 'Address format validated. Full verification will occur at shipping.'
        }]
      } as AddressValidationResult);
    }

    // Validate address using Shippo
    const validatedAddress = await shippo.addresses.create({
      name: name,
      street1: street1,
      street2: street2,
      city: city,
      state: state,
      zip: zip,
      country: country,
      validate: true,
    });

    const isValid = validatedAddress.validation_results?.is_valid ?? false;
    const messages = validatedAddress.validation_results?.messages?.map((msg) => ({
      source: msg.source || 'shippo',
      code: msg.code || 'UNKNOWN',
      type: (msg.type === 'error' ? 'error' : msg.type === 'warning' ? 'warning' : 'info') as 'error' | 'warning' | 'info',
      text: msg.text || 'Unknown validation message',
    })) || [];

    // If no messages but invalid, add helpful suggestions
    if (!isValid && messages.length === 0) {
      messages.push({
        source: 'shippo',
        code: 'INVALID_ADDRESS',
        type: 'error',
        text: 'Address could not be verified. Please check street number, spelling, and ZIP code match.',
      });
    }

    const result: AddressValidationResult = {
      isValid,
      messages,
    };

    // Include the validated/corrected address if available (even if not 100% valid)
    // Shippo sometimes suggests corrections
    if (validatedAddress.street1) {
      result.validatedAddress = {
        name: validatedAddress.name || undefined,
        street1: validatedAddress.street1,
        street2: validatedAddress.street2 || undefined,
        city: validatedAddress.city,
        state: validatedAddress.state,
        zip: validatedAddress.zip,
        country: validatedAddress.country,
      };
    }

    return NextResponse.json(result);

  } catch (error: unknown) {
    console.error('Address Validation Error:', error);

    // Provide more specific error messages
    let message = 'Failed to validate address. Please try again.';
    if (error instanceof Error) {
      if (error.message.includes('401') || error.message.includes('unauthorized')) {
        message = 'Shipping service configuration error. Please contact support.';
      } else if (error.message.includes('timeout') || error.message.includes('network')) {
        message = 'Unable to reach shipping service. Please try again in a moment.';
      } else {
        message = error.message;
      }
    }

    return NextResponse.json(
      {
        isValid: false,
        messages: [{
          source: 'system',
          code: 'VALIDATION_ERROR',
          type: 'error',
          text: message
        }]
      } as AddressValidationResult,
      { status: 500 }
    );
  }
}
