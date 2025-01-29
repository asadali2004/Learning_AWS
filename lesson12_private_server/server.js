const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
require('dotenv').config(); // Load environment variables from .env
// Simulated database (use a real database in production)
const metricsData = [
    { dimension: 'Activations', value: 120 },
    { dimension: 'Revenue', value: 10000 },
    { dimension: 'Deactivations', value: 5 },
];

// API Endpoint for Metrics
app.get('/metrics', (req, res) => {
    res.json(metricsData);
});

// API Endpoint for Subscriptions
app.get('/subscriptions', (req, res) => {
    const subscriptionData = [
        { type: 'New', count: 50, revenue: 5000 },
        { type: 'Renewals', count: 70, revenue: 7000 },
    ];
    res.json(subscriptionData);
});

// API Endpoint for Payments
app.get('/payments', (req, res) => {
    const paymentData = [
        { transactionCount: 100, transactionAmount: 20000, gateway: 'PayPal' },
    ];
    res.json(paymentData);
});


// Simulated database (use a real database in production)
const networkData = [
    { elementId: 'NE123', elementType: 'Base Station', mccmnc: '310260' },
    { elementId: 'NE124', elementType: 'Router', mccmnc: '310410' },
    { elementId: 'NE125', elementType: 'Switch', mccmnc: '311480' },
    { elementId: 'NE126', elementType: 'Gateway', mccmnc: '310150' },
];

// Network API Endpoint
app.get('/network', (req, res) => {
    try {
        res.json(networkData);
    } catch (error) {
        console.error('Error fetching network data:', error.message);
        res.status(500).send('Unable to fetch network data');
    }
});

// Start API service
app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
});