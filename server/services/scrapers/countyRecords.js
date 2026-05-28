import axios from 'axios';

// Fetch property data from public county records and APIs
export const fetchCountyData = async (address) => {
  try {
    // Try multiple county record sources
    const sources = [
      fetchFromPublicRecords(address),
      fetchFromCoreLogic(address),
    ];

    for (const source of sources) {
      try {
        const result = await source;
        if (result) return result;
      } catch (error) {
        console.error('County source error:', error.message);
        continue;
      }
    }

    return null;
  } catch (error) {
    console.error('County records fetch error:', error.message);
    return null;
  }
};

// Fetch from public records APIs
const fetchFromPublicRecords = async (address) => {
  try {
    // Using a free public records API
    const response = await axios.get(`https://api.publicrecords.com/property/search`, {
      params: {
        query: address,
      },
      timeout: 10000,
    });

    if (!response.data || !response.data.properties || response.data.properties.length === 0) {
      return null;
    }

    const property = response.data.properties[0];
    
    return {
      address: property.address || address,
      propertyType: property.propertyType?.toLowerCase() || 'unknown',
      units: property.units || 1,
      askingPrice: property.marketValue || property.assessedValue || 0,
      estimatedMonthlyRent: calculateEstimatedRent(property.marketValue || property.assessedValue),
      propertyTaxes: property.annualTaxAmount ? Math.round(property.annualTaxAmount / 12) : 0,
      bedroomBath: `${property.bedrooms || 0} bed / ${property.bathrooms || 0} bath`,
      yearBuilt: property.yearBuilt || null,
      lotSize: property.lotSize ? property.lotSize / 43560 : 0,
      squareFeet: property.squareFeet || 0,
      walkScore: 0,
      crimeRate: 'unknown',
      schoolRating: 0,
    };
  } catch (error) {
    console.error('PublicRecords API error:', error.message);
    return null;
  }
};

// Fallback to CoreLogic data if available
const fetchFromCoreLogic = async (address) => {
  try {
    // This would require an API key, but shown as an example
    // In production, you'd need to implement this with proper authentication
    return null;
  } catch (error) {
    console.error('CoreLogic error:', error.message);
    return null;
  }
};

const calculateEstimatedRent = (price) => {
  if (!price) return 0;
  return Math.round(price * 0.008);
};
