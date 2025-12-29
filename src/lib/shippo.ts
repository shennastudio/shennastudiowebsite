import { Shippo } from 'shippo';

// Initialize Shippo with the API key
// In a real production environment, use process.env.SHIPPO_API_KEY
const SHIPPO_API_KEY = process.env.SHIPPO_API_KEY || 'shippo_test_d98d542ed5ceba3bf8028604c607bffee676c3a8';

export const shippo = new Shippo({ apiKeyHeader: SHIPPO_API_KEY });
