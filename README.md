# 🏘️ Real Estate Underwriter UI

A comprehensive real estate underwriting tool that aggregates property data from public sources (Zillow, Redfin, county records) and provides intelligent risk assessment, financial analysis, and investment strategy evaluation for property investors.

## ✨ Features

### 📍 Property Data Aggregation
- **Multi-source data fetching** from Zillow, Redfin, and county tax records
- **Accurate property details** including price, units, square footage, year built
- **Neighborhood data** with walk scores and school ratings
- Real-time market data integration

### 💰 Financial Underwriting
- **Dynamic financial calculations** based on property data
- **Rental income estimation** using market-based 1% rule
- **Operating expense modeling** with customizable assumptions
- **Cash flow analysis** and ROI calculations
- **Expense ratio** analysis

### 🎯 Investment Strategy Selection
- **Multiple strategies**: Buy-and-Hold, Fix-and-Flip, House Hack
- **Strategy-specific calculations** and recommendations
- **Risk-adjusted metrics** based on strategy type

### 🚨 Risk Assessment
- **Automated risk scoring** (0-100 scale)
- **Color-coded risk levels** (Green/Amber/Red)
- **Detailed risk flags** for:
  - Over-leveraged properties
  - High debt-to-income ratios
  - Market risks
  - Property condition issues
  - Vacancy risks

### 📄 Document Management
- **Property document upload** (PDF, images, spreadsheets)
- **Automated conflict detection** between documents
- **Data source aggregation** showing where information comes from

### 🏠 House Hack Tools
- **Multi-unit property analysis**
- **Unit adjustment controls** for rental income modeling
- **Vacancy rate customization**

### 📊 Responsive Design
- **Full-screen layout** optimized for all devices
- **Mobile-friendly** interface with responsive grids
- **Desktop-optimized** for detailed analysis

## 🚀 Quick Start

### Prerequisites
- Node.js 16 or higher
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/thelonestarcapitalpartners/Underwriter.git
cd real-estate-underwriter-ui

# Install dependencies
npm install
```

### Running Development Environment

```bash
# Start both backend and frontend
npm run dev

# Or start separately (requires 2 terminals):
# Terminal 1: Backend server
npm run dev:server

# Terminal 2: Frontend dev server
npm run dev:frontend
```

The application will be available at `http://localhost:5173` (frontend) and `http://localhost:5000` (backend API).

### Building for Production

```bash
npm run build

# Preview production build
npm run preview
```

## 📖 Usage

1. **Enter Address**: Type a property address in the search box
2. **Review Property Data**: System fetches and displays property information from multiple sources
3. **Analyze Financials**: Review calculated metrics for the property
4. **Select Strategy**: Choose an investment strategy (Buy & Hold, Flip, House Hack)
5. **Assess Risk**: Review automated risk flags and metrics
6. **Upload Documents**: Add supporting documents for cross-reference
7. **Export Analysis**: Generate underwriting reports (coming soon)

## 🏗️ Architecture

### Frontend (React + Vite)
- Single-page application with React 19
- Dynamic state management with hooks
- Responsive CSS with mobile-first design
- Real-time calculations and data binding

### Backend (Node.js + Express)
- Multi-source property data aggregation
- Zillow scraping and data extraction
- Redfin API integration
- County records lookup
- CORS-enabled API for frontend communication

## 📁 Project Structure

```
.
├── src/
│   ├── App.jsx                 # Main React component
│   ├── main.jsx                # React entry point
│   ├── index.css               # Global styles
│   └── assets/                 # Static assets
├── server/
│   ├── index.js                # Express server
│   └── services/
│       ├── propertyService.js  # Data aggregation logic
│       └── scrapers/           # Data source scrapers
│           ├── zillowScraper.js
│           ├── redfinScraper.js
│           └── countyRecords.js
├── public/                     # Public static files
├── package.json                # Dependencies
├── vite.config.js              # Vite configuration
├── README.md                   # This file
└── BACKEND_SETUP.md           # Backend detailed documentation
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
NODE_ENV=development
ZILLOW_ENABLED=true
REDFIN_ENABLED=true
COUNTY_RECORDS_ENABLED=true
```

See `BACKEND_SETUP.md` for detailed backend configuration options.

## 📊 Data Sources

| Source | Data Provided | Status |
|--------|--------------|--------|
| **Zillow** | Prices, beds, baths, sqft, MLS data | ✅ Active |
| **Redfin** | Market listings, property details | ✅ Active |
| **County Records** | Tax assessments, official records | ⚠️ Partial |

### Data Accuracy
- Property prices are pulled from active market listings
- Property details sourced from MLS and public records
- Estimated rent calculated using 0.8% rule
- Property taxes estimated at 0.9% of value (varies by location)

## 🎓 How It Works

### Property Search Flow
1. User enters property address
2. Backend queries Zillow, Redfin, and county records
3. Data aggregated and normalized
4. Most accurate/complete data source prioritized
5. Results returned to frontend with source indicators

### Financial Calculation
- Based on property price and market data
- Rent estimated using 1% rule (1% of purchase price per month)
- Operating expenses modeled at 25-35% of rental income
- Cash flow = Rental Income - Mortgage - Expenses - Taxes
- ROI = Annual Cash Flow / Total Investment

### Risk Assessment
- Scoring algorithm analyzes multiple factors
- Flags raised for concerning metrics
- Color-coded visual indicators
- Customizable thresholds

## 🐛 Troubleshooting

### Backend Connection Issues
- Ensure backend is running on port 5000
- Check network connectivity
- Verify CORS settings

### Data Not Loading
- Try with a complete address (include city, state, zip)
- Check internet connection
- Review browser console for errors

### Slow Performance
- First request may take longer while fetching data
- Clear browser cache if issues persist

See `BACKEND_SETUP.md` for more detailed troubleshooting.

## 🔐 Privacy & Security

- No user data is stored
- Addresses queried against public real estate databases
- No authentication required (secure for public properties only)
- Suitable for analysis of publicly available properties

## 📈 Roadmap

- [ ] User accounts and saved analyses
- [ ] Database for historical analysis tracking
- [ ] Advanced comparable sales analysis
- [ ] Machine learning price predictions
- [ ] Integration with lender APIs
- [ ] Detailed market analysis reports
- [ ] Geographic heat maps
- [ ] School and neighborhood detailed data
- [ ] Crime statistics integration
- [ ] Export to PDF reports

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## 📄 License

This project is part of the Lone Star Capital Partners portfolio.

## 📞 Support

For detailed backend setup information, see [BACKEND_SETUP.md](BACKEND_SETUP.md)

For issues, questions, or suggestions, please check the GitHub issues page.

---

**Built with React, Vite, Node.js, and Express**

