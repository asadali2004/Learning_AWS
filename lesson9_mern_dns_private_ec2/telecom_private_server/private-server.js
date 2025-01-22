const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

app.post('/internal/process', (req, res) => {
    const { data } = req.body;

    console.log('Processing data:', data);

    res.status(200).json({ status: 'success', message: 'Data processed successfully' });
});

app.listen(PORT, () => {
    console.log(`Private server running on port ${PORT}`);
});