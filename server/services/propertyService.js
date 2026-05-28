import axios from 'axios';
import * as zillowScraper from './scrapers/zillowScraper.js';
import * as redfin from './scrapers/redfinScraper.js';
import * as countyRecords from './scrapers/countyRecords.js';

// Normalize address for API calls
const normalizeAddress = (address) => {
  return address
    .trim()
    .replace(/\s+/g, '+')
    .replace(/[^\w\+\-]/g, '');
};

export const fetchPropertyData = async (address) => {
  try {
    console.log(`📍 Fetching property data for: ${address}`);
    
    // Try multiple data sources in parallel
    const [zillowData, redfinData, countyData] = await Promise.allSettled([
      zillowScraper.fetchZillowData(address),
      redfin.fetchRedfinData(address),
      countyRecords.fetchCountyData(address),
    ]);

    // Extract results from Promise.allSettled
    const zillowResult = zillowData.status === 'fulfilled' ? zillowData.value : null;
    const redfinResult = redfinData.status === 'fulfilled' ? redfinData.value : null;
    const countyResult = countyData.status === 'fulfilled' ? countyData.value : null;

    // Merge data intelligently (prioritize most complete data)
    const merged = mergePropertyData(zillowResult, redfinResult, countyResult);
    
    if (!merged) {
      throw new Error('Could not fetch property data from any source');
    }

    return merged;
  } catch (error) {
    console.error('Property fetch error:', error.message);
    throw error;
  }
};

const mergePropertyData = (zillow, redfin, county) => {
  // Start with the most complete data source
  const primary = zillow || redfin || county;
  
  if (!primary) return null;

  return {
    address: primary.address || '',
    propertyType: primary.propertyType || 'unknown',
    units: primary.units || 1,
    askingPrice: primary.askingPrice || 0,
    estimatedMonthlyRent: primary.estimatedMonthlyRent || 0,
    propertyTaxes: primary.propertyTaxes || 0,
    bedroomBath: primary.bedroomBath || 'N/A',
    yearBuilt: primary.yearBuilt || null,
    lotSize: primary.lotSize || 0,
    squareFeet: primary.squareFeet || 0,
    sources: {
      zillow: !!zillow,
      redfin: !!redfin,
      taxRecords: !!county,
      mls: primary.mls || false,
    },
    neighborhood: {
      walkScore: primary.walkScore || 0,
      crimeRate: primary.crimeRate || 'unknown',
      schoolRating: primary.schoolRating || 0,
    },
    rawData: {
      zillow,
      redfin,
      county,
    },
  };
};
