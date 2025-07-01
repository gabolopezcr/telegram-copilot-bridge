
// telegram_copilot_bridge.js

const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const TELEGRAM_BOT_TOKEN = 'YOUR_TELEGRAM_BOT_TOKEN';
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;
const COPILOT_ENDPOINT = 'https://YOUR_COPILOT_ENDPOINT_URL'; // Replace with your Copilot Studio endpoint

const app = express();
app.use(bodyParser.json());

app.post('/webhook', async (req, res) => {
    const message = req.body.message;
    if (!message || !message.text) {
        return res.sendStatus(200);
    }

    const chatId = message.chat.id;
    const userText = message.text;

    try {
        // Send user message to Copilot Studio endpoint
        const copilotResponse = await axios.post(COPILOT_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text: userText })
        });

        const reply = copilotResponse.data.reply || "No response from Copilot.";

        // Send reply back to Telegram
        await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
            chat_id: chatId,
            text: reply
        });

    } catch (error) {
        console.error("Error:", error.message);
        await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
            chat_id: chatId,
            text: "Hubo un error al procesar tu mensaje."
        });
    }

    res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
