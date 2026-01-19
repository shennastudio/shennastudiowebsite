import { Shippo } from 'shippo';

// Initialize Shippo client
// Use the provided test key if env var is not set, but prefer env var in production
const shippoToken = process.env.SHIPPO_API_KEY || 'shippo_test_8b7d3bbb74fb934317232cf844059965c52d2f41';

export const shippo = new Shippo({
  apiKeyHeader: `ShippoToken ${shippoToken}`,
});
