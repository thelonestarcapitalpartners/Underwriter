import axios from 'axios';

const REDFIN_BASE = 'https://www.redfin.com';

// Fetch property data from Redfin
export const fetchRedfinData = async (address) => {
  try {
    console.log(`🔍 Searching Redfin for: ${address}`);
    
    // Search Redfin for properties
    const searchUrl = `${REDFIN_BASE}/homes/for_sale?searchLocation=${encodeURIComponent(address)}`;
    
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      timeout: 15000,
    });

    // Extract data from HTML
    const html = response.data;
    
    // Look for property data embedded in the page
    const priceMatch = html.match(/"priceDisplay":"([\$\d,]+)"/);
    const bedsMatch = html.match(/"beds":(\d+)/);
    const bathsMatch = html.match(/"baths":([\d.]+)/);
    const sqftMatch = html.match(/"sqft":(\d+)/);
    const yearBuiltMatch = html.match(/"yearBuilt":(\d{4})/);
    
    if (!priceMatch) {
      console.log('⚠️ Could not parse Redfin data');
      return null;
    }

    // Parse price (remove $ and commas)
    const priceStr = priceMatch[1].replace(/[$,]/g, '');
    const price = parseInt(priceStr, 10) || 0;
    
    const beds = bedsMatch ? parseInt(bedsMatch[1], 10) : 3;
    const baths = bathsMatch ? parseFloat(bathsMatch[1]) : 2;
    const sqft = sqftMatch ? parseInt(sqftMatch[1], 10) : 2000;
    const yearBuilt = yearBuiltMatch ? parseInt(yearBuiltMatch[1], 10) : null;

    return {
      address: address,
      propertyType: 'residential',
      units: 1,
      askingPrice: price,
      estimatedMonthlyRent: calculateEstimatedRent(price),
      propertyTaxes: estimatePropertyTaxes(price),
      bedroomBath: `${beds} bed / ${baths} bath`,
      yearBuilt,
      lotSize: 0.25,
      squareFeet: sqft,
      walkScore: 0,
      crimeRate: 'unknown',
      schoolRating: 0,
      mls: true,
      source: 'redfin',
    };
  } catch (error) {
    console.error('❌ Redfin fetch error:', error.message);
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
