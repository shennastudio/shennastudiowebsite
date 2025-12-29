import { NextRequest, NextResponse } from 'next/server';
import { shippo } from '@/lib/shippo';

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

export async function POST(request: NextRequest) {
  try {
    const { address } = await request.json();

    if (!address || !address.street1 || !address.city || !address.state || !address.zip) {
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

    // Validate address using Shippo
    const validatedAddress = await shippo.addresses.create({
      name: address.name || '',
      street1: address.street1,
      street2: address.street2 || '',
      city: address.city,
      state: address.state,
      zip: address.zip,
      country: address.country || 'US',
      validate: true,
    });

    const isValid = validatedAddress.validation_results?.is_valid ?? false;
    const messages = validatedAddress.validation_results?.messages?.map((msg) => ({
      source: msg.source || 'shippo',
      code: msg.code || 'UNKNOWN',
      type: (msg.type === 'error' ? 'error' : msg.type === 'warning' ? 'warning' : 'info') as 'error' | 'warning' | 'info',
      text: msg.text || 'Unknown validation message',
    })) || [];

    // If no messages but invalid, add a generic message
    if (!isValid && messages.length === 0) {
      messages.push({
        source: 'shippo',
        code: 'INVALID_ADDRESS',
        type: 'error',
        text: 'The address could not be validated. Please check for typos.',
      });
    }

    const result: AddressValidationResult = {
      isValid,
      messages,
    };

    // Include the validated/corrected address if valid
    if (isValid) {
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
    const message = error instanceof Error ? error.message : 'Failed to validate address';
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
