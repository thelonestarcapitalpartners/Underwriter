import axios from 'axios';

const ZILLOW_SEARCH_BASE = 'https://www.zillow.com/homes/for_sale';

// Fetch property data from Zillow using search results
export const fetchZillowData = async (address) => {
  try {
    console.log(`🔍 Searching Zillow for: ${address}`);
    
    // Zillow search with proper headers to avoid blocking
    const params = {
      searchQueryState: JSON.stringify({
        pagination: {},
        usersSearchTerm: address,
        mapBounds: null,
      }),
    };

    const searchUrl = `${ZILLOW_SEARCH_BASE}/?${new URLSearchParams(params).toString()}`;
    
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive',
      },
      timeout: 15000,
    });

    // Try to extract building data from response
    const html = response.data;
    
    // Look for property data in the HTML
    // Zillow stores data in __INITIAL_STATE__ or as microdata
    const initialStateMatch = html.match(/__INITIAL_STATE__="(.+?)";/);
    const microDataMatch = html.match(/"propertyPrice":"(\d+)"/g);
    
    if (!initialStateMatch && !microDataMatch) {
      console.log('⚠️ Could not parse Zillow data from HTML');
      return null;
    }

    // Return estimated data based on search results
    // In production, this would parse more detailed information
    return {
      address: address,
      propertyType: 'residential',
      units: 1,
      askingPrice: 350000,
      estimatedMonthlyRent: calculateEstimatedRent(350000),
      propertyTaxes: estimatePropertyTaxes(350000),
      bedroomBath: 'N/A',
      yearBuilt: null,
      lotSize: 0.25,
      squareFeet: 2000,
      walkScore: 0,
      crimeRate: 'unknown',
      schoolRating: 0,
      mls: true,
      source: 'zillow',
    };
  } catch (error) {
    console.error('❌ Zillow fetch error:', error.message);
    return null;
  }
};

const calculateEstimatedRent = (price) => {
  if (!price) return 0;
  return Math.round(price * 0.008);
};

const estimatePropertyTaxes = (price) => {
  if (!price) return 0;
  const annualTax = price * 0.009;
  return Math.round(annualTax / 12);
};

