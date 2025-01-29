const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
require('dotenv').config(); // Load environment variables from .env

// Configure static files and view engine
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
const PORT = process.env.PORT || 8080;
const PRIVATE_API_URL = process.env.PRIVATE_API_URL || 'http://localhost:3000';

// Replace with your API server's address
const remote_server = 'localhost';

// Metrics Route
app.get('/metrics', async (req, res) => {
  try {
    const response = await axios.get(`${PRIVATE_API_URL}/metrics`);
    res.render('metrics', { data: response.data });
  } catch (error) {
    console.error('Error fetching metrics:', error.message);
    res.status(500).send('Unable to load metrics');
  }
});

// Subscriptions Route
app.get('/subscriptions', async (req, res) => {
  try {
    const response = await axios.get(`${PRIVATE_API_URL}/subscriptions`);
    res.render('subscriptions', { data: response.data });
  } catch (error) {
    console.error('Error fetching subscriptions:', error.message);
    res.status(500).send('Unable to load subscriptions');
  }
});

// Network Route
app.get('/network', async (req, res) => {
  try {
    const response = await axios.get(`${PRIVATE_API_URL}/network`);
    res.render('network', { data: response.data });
  } catch (error) {
    console.error('Error fetching network data:', error.message);
    res.status(500).send('Unable to load network data');
  }
});

// Payments Route
app.get('/payments', async (req, res) => {
  try {
    const response = await axios.get(`${PRIVATE_API_URL}/payments`);
    res.render('payments', { data: response.data });
  } catch (error) {
    console.error('Error fetching payments:', error.message);
    res.status(500).send('Unable to load payments');
  }
});

// Dashboard Route
app.get('/', (req, res) => {
  res.render('dashboard');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Public server running on port ${PORT}`);
});