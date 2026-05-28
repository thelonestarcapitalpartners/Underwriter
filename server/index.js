import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fetchPropertyData } from './services/propertyService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Property data endpoint
app.post('/api/property', async (req, res) => {
  try {
    const { address } = req.body;
    
    if (!address) {
      return res.status(400).json({ error: 'Address is required' });
    }
    
    const propertyData = await fetchPropertyData(address);
    
    if (!propertyData) {
      return res.status(404).json({ error: 'Property not found' });
    }
    
    res.json(propertyData);
  } catch (error) {
    console.error('Property fetch error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🏢 Real Estate API Server running on port ${PORT}`);
  console.log(`📍 POST /api/property - Fetch property data by address`);
});
