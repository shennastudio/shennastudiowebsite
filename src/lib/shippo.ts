import { Shippo } from 'shippo';

// Initialize Shippo with the API key
const SHIPPO_API_KEY = process.env.SHIPPO_API_KEY;

if (!SHIPPO_API_KEY) {
  console.warn('⚠️ SHIPPO_API_KEY not configured. Shipping features will not work.');
}

// Create Shippo instance only if API key is available
export const shippo = SHIPPO_API_KEY
  ? new Shippo({ apiKeyHeader: SHIPPO_API_KEY })
  : null;

// Helper to check if Shippo is configured
export const isShippoConfigured = (): boolean => !!SHIPPO_API_KEY;
