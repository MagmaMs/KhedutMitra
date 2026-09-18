import axios from 'axios';

export class PriceService {
  /**
   * Adapter for AGMARKNET/data.gov.in. 
   * If API key is missing or rate limited, this falls back to demo logic.
   */
  static async getPrices(cropId: string, stateId: string, districtId: string) {
    if (process.env.DATA_GOV_IN_API_KEY) {
      try {
        const url = process.env.DATA_GOV_IN_API_URL || 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070';
        const response = await axios.get(url, {
          params: {
            'api-key': process.env.DATA_GOV_IN_API_KEY,
            'format': 'json',
            'filters[commodity]': cropId,
            'filters[state]': stateId,
            'filters[district]': districtId,
            'limit': 10
          },
          timeout: 8000
        });

        if (response.data && response.data.records && response.data.records.length > 0) {
          return response.data.records.map((record: any) => ({
            marketId: record.market?.toLowerCase().replace(/\s+/g, '-') || 'unknown',
            marketName: record.market || 'Unknown Market',
            districtName: record.district || districtId,
            distanceKm: null, // Distance requires geospatial cross-referencing not provided by API
            minPrice: parseFloat(record.min_price),
            maxPrice: parseFloat(record.max_price),
            modalPrice: parseFloat(record.modal_price),
            previousModalPrice: null, // No historical data in current snapshot
            arrivalDate: record.arrival_date,
            source: 'AGMARKNET',
            isFallback: false
          }));
        }
      } catch (err) {
        console.error('AGMARKNET API Error:', err);
        // Fallthrough to mock
      }
    }

    // Simulate API delay
    await new Promise(r => setTimeout(r, 600));

    // Return mock data for the demo
    return [
      {
        marketId: `${districtId}-apmc`,
        marketName: `${districtId.toUpperCase()} APMC (Demo)`,
        districtName: districtId,
        distanceKm: 12,
        minPrice: 7000,
        maxPrice: 8500,
        modalPrice: 7800,
        previousModalPrice: 7600,
        arrivalDate: new Date().toISOString(),
        source: 'AGMARKNET (Demo Fallback)',
        isFallback: true
      },
      {
        marketId: `nearby-apmc`,
        marketName: `Nearby APMC (Demo)`,
        districtName: 'Nearby',
        distanceKm: 34,
        minPrice: 6800,
        maxPrice: 8000,
        modalPrice: 7400,
        previousModalPrice: 7500,
        arrivalDate: new Date().toISOString(),
        source: 'AGMARKNET (Demo Fallback)',
        isFallback: true
      }
    ];
  }
}
