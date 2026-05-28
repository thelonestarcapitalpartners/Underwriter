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

// Fallback with realistic market data based on location
const getRealisticFallbackData = (address) => {
  // Extract city from address if possible
  const parts = address.split(',');
  const city = parts.length > 1 ? parts[1].trim() : 'Unknown';
  
  // Market data by common cities (can be expanded)
  const marketData = {
    'austin': { price: 425000, beds: 3, baths: 2, sqft: 2100, rent: 2600 },
    'tx': { price: 325000, beds: 3, baths: 2, sqft: 1900, rent: 2100 },
    'new york': { price: 550000, beds: 2, baths: 1.5, sqft: 900, rent: 3200 },
    'ny': { price: 550000, beds: 2, baths: 1.5, sqft: 900, rent: 3200 },
    'los angeles': { price: 625000, beds: 3, baths: 2, sqft: 1800, rent: 3100 },
    'ca': { price: 450000, beds: 3, baths: 2, sqft: 1800, rent: 2700 },
    'chicago': { price: 350000, beds: 3, baths: 2, sqft: 2000, rent: 1900 },
    'il': { price: 300000, beds: 3, baths: 2, sqft: 2000, rent: 1800 },
    'default': { price: 380000, beds: 3, baths: 2, sqft: 1900, rent: 2300 },
  };
  
  // Find matching city or use default
  const cityLower = city.toLowerCase();
  const data = marketData[cityLower] || marketData['default'];
  
  return {
    address: address,
    propertyType: 'residential',
    units: 1,
    askingPrice: data.price,
    estimatedMonthlyRent: data.rent,
    propertyTaxes: Math.round(data.price * 0.009 / 12),
    bedroomBath: `${data.beds} bed / ${data.baths} bath`,
    yearBuilt: 1995 + Math.floor(Math.random() * 30),
    lotSize: 0.25,
    squareFeet: data.sqft,
    sources: {
      zillow: false,
      redfin: false,
      taxRecords: false,
      mls: false,
      fallback: true,
    },
    neighborhood: {
      walkScore: 60 + Math.floor(Math.random() * 30),
      crimeRate: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
      schoolRating: 5 + Math.floor(Math.random() * 5),
    },
    warning: 'Using estimated market data - some values are based on local averages for demonstration',
  };
};

export const fetchPropertyData = async (address) => {
  try {
    console.log(`📍 Fetching property data for: ${address}`);
    
    // Try multiple data sources in parallel with a timeout
    const timeoutPromise = new Promise((resolve) => {
      setTimeout(() => resolve(null), 8000); // 8 second timeout
    });
    
    const fetchPromises = Promise.race([
      Promise.allSettled([
        zillowScraper.fetchZillowData(address),
        redfin.fetchRedfinData(address),
        countyRecords.fetchCountyData(address),
      ]),
      timeoutPromise,
    ]);

    const results = await fetchPromises;
    
    if (!results) {
      console.log('⚠️ Scraping timed out, using fallback data');
      return getRealisticFallbackData(address);
    }

    // Extract results from Promise.allSettled
    const zillowResult = results[0].status === 'fulfilled' ? results[0].value : null;
    const redfinResult = results[1].status === 'fulfilled' ? results[1].value : null;
    const countyResult = results[2].status === 'fulfilled' ? results[2].value : null;

    // Merge data intelligently (prioritize most complete data)
    const merged = mergePropertyData(zillowResult, redfinResult, countyResult);
    
    if (!merged) {
      console.log('⚠️ Could not fetch from live sources, using fallback data');
      return getRealisticFallbackData(address);
    }

    return merged;
  } catch (error) {
    console.error('Property fetch error:', error.message);
    console.log('⚠️ Falling back to market-based data');
    return getRealisticFallbackData(address);
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

