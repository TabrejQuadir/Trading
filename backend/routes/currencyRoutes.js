const express = require('express');
const { getCurrencies, manualUpdateCurrency, getCurrencyBySymbol } = require('../controllers/currencyController');

const router = express.Router();

// GET /api/currencies - Get all currencies
router.get('/', getCurrencies);

// POST /api/currencies/update - Manual update of currency price
router.post('/update', async (req, res) => {
    const { symbolCode, newPrice } = req.body;
    try {
        await manualUpdateCurrency(symbolCode, newPrice); // Gradually update the price
        res.status(200).json({ message: 'Price update initiated.' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update currency', error: error.message });
    }
});

// PUT /api/currencies/:symbolCode - Update the price of a specific currency (not used in this context)
router.put('/:symbolCode', async (req, res) => {
    res.status(405).json({ message: 'Method not allowed. Use POST /update instead.' });
});

// GET /api/currencies/:symbolCode - Get a specific currency by symbol code
router.get('/:symbolCode', async (req, res) => {
    let { symbolCode } = req.params;

    // Remove USDT from the end of the symbolCode if it exists
    if (symbolCode.endsWith('USDT')) {
        symbolCode = symbolCode.slice(0, -4);
    }

    try {
        const currency = await getCurrencyBySymbol(symbolCode); // Fetch currency by full symbol code
        if (!currency) {
            return res.status(404).json({ message: 'Currency not found.' });
        }
        res.status(200).json(currency);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch currency', error: error.message });
    }
});

module.exports = router;