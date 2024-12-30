const mongoose = require('mongoose');
const Currency = require('../models/currencySchema');

// Function to update currency price gradually in the database
const updateCurrencyPriceGradually = async (symbolCode, targetPrice, duration = 20000) => {
    const steps = 20; // Total number of steps (20 updates)
    const interval = duration / steps; // Interval per step (20000ms / 20 = 1000ms per step)
    const currency = await Currency.findOne({ symbolCode: symbolCode });

    if (!currency) {
        throw new Error(`Currency with symbolCode ${symbolCode} not found.`);
    }

    const currentPrice = currency.price;
    const priceChangePerStep = (targetPrice - currentPrice) / steps; // Calculate the price change per step

    let currentStep = 0;

    // Function to update price at each step
    const updateStep = async () => {
        if (currentStep < steps) {
            // Calculate the new price with gradual increase
            const newPrice = parseFloat((currentPrice + priceChangePerStep * (currentStep + 1)).toFixed(2));

            // Introduce random fluctuation
            const fluctuation = (Math.random() * 200 - 100); // Random fluctuation between -100 and +100
            const fluctuatedPrice = parseFloat((newPrice + fluctuation).toFixed(2));

            const updown = parseFloat(((fluctuatedPrice - currentPrice) / currentPrice * 100).toFixed(2)); // Calculate up/down percentage

            // Update the currency price in the database
            await Currency.findOneAndUpdate(
                { symbolCode: symbolCode },
                {
                    price: fluctuatedPrice,
                    updown: updown,
                    pointMin: parseFloat(Math.min(fluctuatedPrice, updown).toFixed(2)),
                    pointMax: parseFloat(Math.max(fluctuatedPrice, updown).toFixed(2)),
                    manualUpdateTimestamp: new Date() // Update the timestamp
                },
                { new: true }
            );

            currentStep++;

            // Introduce a delay between steps using Promise
            await new Promise(resolve => setTimeout(resolve, interval));

            // Continue to the next step after the delay
            await updateStep();
        } else {
            // Ensure the final price is set to the target price
            await Currency.findOneAndUpdate(
                { symbolCode: symbolCode },
                {
                    price: targetPrice,
                    updown: parseFloat(((targetPrice - currentPrice) / currentPrice * 100).toFixed(2)), // Final up/down percentage
                    pointMin: parseFloat(Math.min(targetPrice, 0).toFixed(2)), // Adjust as needed
                    pointMax: parseFloat(Math.max(targetPrice, 0).toFixed(2)), // Adjust as needed
                    manualUpdateTimestamp: new Date() // Update the timestamp
                },
                { new: true }
            );

            // Start fluctuation immediately after finishing gradual update
            await new Promise(resolve => setTimeout(resolve, 1000)); // Optional 1-second buffer
            startFluctuation(symbolCode, targetPrice); // Start fluctuation after a buffer
        }
    };

    // Function for fluctuating the price after the gradual update
    const startFluctuation = async (symbolCode, currentPrice) => {
        let fluctuationInterval;

        fluctuationInterval = setInterval(async () => {
            // Random fluctuation
            const fluctuation = (Math.random() * 200 - 100); // Random fluctuation between -100 and +100
            const fluctuatedPrice = parseFloat((currentPrice + fluctuation).toFixed(2));

            // Calculate the up/down percentage
            const updown = parseFloat(((fluctuatedPrice - currentPrice) / currentPrice * 100).toFixed(2));

            // Update the currency price in the database with fluctuation
            await Currency.findOneAndUpdate(
                { symbolCode: symbolCode },
                {
                    price: fluctuatedPrice,
                    updown: updown,
                    pointMin: parseFloat(Math.min(fluctuatedPrice, updown).toFixed(2)),
                    pointMax: parseFloat(Math.max(fluctuatedPrice, updown).toFixed(2)),
                    manualUpdateTimestamp: new Date() // Update the timestamp
                },
                { new: true }
            );

            currentPrice = fluctuatedPrice; // Update the current price with the fluctuated one

        }, 1000); // Fluctuate every second

        // Set a limit for the fluctuation interval, e.g., stop after 10 more seconds
        setTimeout(() => {
            clearInterval(fluctuationInterval); // Stop fluctuating after 10 seconds
        }, 10000);
    };

    // Start the gradual update process
    await updateStep();
};

// Function for manual update
const manualUpdateCurrency = async (symbolCode, newPrice) => {
    await updateCurrencyPriceGradually(symbolCode, newPrice, 20000); // Gradually update over 20 seconds
};

// Automatic update every 3 seconds
setInterval(async () => {
    try {
        const currencies = await Currency.find(); // Fetch all currencies from the database

        for (const currency of currencies) {
            // Check if the symbolCode is not valid before processing
            if (typeof currency.symbolCode !== 'string') {
                console.error('Invalid symbolCode type:', currency.symbolCode);
                continue; // Skip this iteration if symbolCode is invalid
            }

            // If the manual update was made within the last 20 seconds, skip automatic update
            const manualUpdateTime = currency.manualUpdateTimestamp ? new Date(currency.manualUpdateTimestamp) : null;
            if (manualUpdateTime && (new Date() - manualUpdateTime) <= 20000) {
                console.log(`Skipping automatic update for ${currency.symbolCode} due to recent manual update.`);
                continue; // Skip automatic update for 20 seconds
            }

            const maxChangePercentage = 0.004; // Maximum 0.4% price change
            const priceChange = currency.price * (Math.random() * 2 - 1) * maxChangePercentage;
            let newPrice = currency.price + priceChange;

            // Round the new price to two decimal places
            newPrice = parseFloat(newPrice.toFixed(2));

            // Calculate the up/down percentage based on the price change
            const updown = parseFloat(((priceChange / currency.price) * 100).toFixed(2));

            // Update the currency price in the database
            await Currency.findOneAndUpdate(
                { symbolCode: currency.symbolCode },
                {
                    price: newPrice,
                    updown: updown,
                    pointMin: parseFloat(Math.min(newPrice, updown).toFixed(2)),
                    pointMax: parseFloat(Math.max(newPrice, updown).toFixed(2)),
                    manualUpdateTimestamp: null // Reset manual update timestamp
                },
                { new: true }
            );
        }
    } catch (error) {
        console.error("Error updating currencies:", error.message);
    }
}, 3000);

// Fetch all currencies from the database
const getCurrencies = async (req, res) => {
    try {
        const currencies = await Currency.find(); // Fetch from the database
        res.status(200).json(currencies);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch currencies', error: error.message });
    }
};

// Function to get a specific currency by symbol code
const getCurrencyBySymbol = async (symbolCode) => {
    return await Currency.findOne({ symbolCode: symbolCode }); // Fetch currency from the database
};

module.exports = { getCurrencies, updateCurrencyPriceGradually, manualUpdateCurrency, getCurrencyBySymbol };
