const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const app = express();
const axios = require('axios');

const PORT = 8080; // Use the updated port if needed

// Swagger Configuration
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Telecom API',
            version: '1.0.0',
            description: 'API documentation for the Telecom Public Server',
        },
        servers: [
            {
                url: 'http://43.205.191.55:8080', // Adjust for your environment ######################
            },
        ],
    },
    apis: ['./public-server.js'], // Path to API annotations
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.json());

/**
 * @swagger
 * /api/process:
 *   post:
 *     summary: Process data
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: string
 *                 description: Data to be processed
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Internal server error
 */
app.post('/api/process', async (req, res) => {
    const requestData = req.body;

    try {
        const response = await axios.post('http://10.0.2.40:3000/internal/process', requestData);
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error communicating with private server:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/', (req, res) => {
    res.send('Welcome to the Telecom Public Server!');
});


app.listen(PORT, () => {
    console.log(`Public server running on port ${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});