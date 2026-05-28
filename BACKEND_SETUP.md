# Real Estate Underwriter UI - Backend Setup Guide

## 🚀 Running the Application

### Prerequisites
- Node.js 16+
- npm or yarn
- Internet connection (for real property data fetching)

### Installation

```bash
# Install dependencies
npm install
```

### Running Both Frontend and Backend

```bash
# Run both frontend and backend together (requires 2 terminals or terminal multiplexer)
npm run dev

# Or run them separately:
# Terminal 1: Start the backend server
npm run dev:server

# Terminal 2: Start the frontend dev server
npm run dev:frontend
```

### Building for Production

```bash
npm run build
```

## 📍 Backend Data Sources

The backend fetches real property data from multiple sources:

1. **Zillow** (`server/services/scrapers/zillowScraper.js`)
   - Scrapes property listings and market data
   - Extracts: Price, bedrooms, bathrooms, square footage, year built
   - Status: ✓ Implemented

2. **Redfin** (`server/services/scrapers/redfinScraper.js`)
   - Fetches property information from Redfin listings
   - Extracts: Price, beds/baths, square footage, year built
   - Status: ✓ Implemented

3. **County Tax Records** (`server/services/scrapers/countyRecords.js`)
   - Attempts to fetch from public county records APIs
   - Extracts: Assessed value, tax amount, property details
   - Status: ⚠️ Partially implemented (API dependent)

## 🔧 API Endpoints

### POST /api/property
Fetch property data by address

**Request:**
```bash
curl -X POST http://localhost:5000/api/property \
  -H "Content-Type: application/json" \
  -d '{"address": "1234 Main St, New York, NY"}'
```

**Response:**
```json
{
  "address": "1234 Main St, New York, NY",
  "propertyType": "residential",
  "units": 1,
  "askingPrice": 450000,
  "estimatedMonthlyRent": 3600,
  "propertyTaxes": 338,
  "bedroomBath": "3 bed / 2 bath",
  "yearBuilt": 1995,
  "lotSize": 0.25,
  "squareFeet": 2000,
  "sources": {
    "zillow": true,
    "redfin": false,
    "taxRecords": false,
    "mls": true
  },
  "neighborhood": {
    "walkScore": 72,
    "crimeRate": "low",
    "schoolRating": 8
  }
}
```

### GET /api/health
Health check endpoint

```bash
curl http://localhost:5000/api/health
```

## 📊 Data Accuracy Notes

- **Prices**: Pulled from active market listings (Zillow, Redfin)
- **Property Details**: Based on MLS and public records
- **Estimated Rent**: Calculated using 0.8% rule
- **Property Taxes**: Estimated at 0.9% of property value (varies by location)
- **Market Data**: Updated from live sources

### To Improve Accuracy

1. **Add API Keys** (optional):
   - Set up a Rapid API account for enhanced real estate APIs
   - Add API keys to `.env` file
   - Update scrapers to use authenticated endpoints

2. **County Integration**:
   - Integrate with specific county assessor databases
   - Many counties have public APIs for property records

3. **Market Data**:
   - Add integration with Comparables data APIs
   - Implement machine learning models for rent estimation

## 🛠️ Development

### Environment Variables

Create a `.env` file in the root directory:

```
PORT=5000
NODE_ENV=development
ZILLOW_ENABLED=true
REDFIN_ENABLED=true
COUNTY_RECORDS_ENABLED=true
```

### Testing the Backend

```bash
# Terminal 1: Start the server
npm run dev:server

# Terminal 2: Test an address
curl -X POST http://localhost:5000/api/property \
  -H "Content-Type: application/json" \
  -d '{"address": "123 Main St, New York, NY 10001"}'
```

### Troubleshooting

**CORS Errors**: Make sure the backend is running on `http://localhost:5000`

**Address Not Found**: 
- Try with a complete address including city and state
- Example: "1234 Main St, Austin, TX 78701"

**Slow Requests**:
- First request may be slower due to data fetching
- Subsequent requests are cached when possible

## 📚 Architecture

```
server/
├── index.js                          # Express server & route handlers
└── services/
    ├── propertyService.js            # Main property data aggregation
    └── scrapers/
        ├── zillowScraper.js          # Zillow data extraction
        ├── redfinScraper.js          # Redfin data extraction
        └── countyRecords.js          # County records integration

src/
├── App.jsx                           # React frontend
├── main.jsx                          # Entry point
├── index.css                         # Global styles
```

## 🔐 Security Notes

- The backend scrapes public websites only
- No authentication required for basic usage
- Recommended to rate-limit requests in production
- Use environment variables for API keys (never commit them)

## 📈 Future Enhancements

- [ ] Database caching layer for frequently searched addresses
- [ ] Machine learning for price predictions
- [ ] Integration with MLS data APIs
- [ ] Street view and satellite image support
- [ ] Comparable sales analysis
- [ ] School district data integration
- [ ] Crime rate and demographic data APIs

## 📞 Support

For issues or questions about data accuracy, please check:
1. The address format (include city and state)
2. Internet connection status
3. Backend server is running on port 5000
4. Check browser console for detailed error messages
