const WebSocket = require("ws");
const express = require("express");
const http = require("http");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.get("/", (req, res) => {
    res.send("WebSocket Server is running...");
});

wss.on("connection", (ws) => {
    console.log("New client connected");

    ws.on("message", (message) => {
        console.log(`Received: ${message}`);

        // Convert message to text if it's a Buffer or Blob
        const textMessage = message.toString();

        // Broadcast the message to ALL connected clients
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(textMessage);
            }
        });

        // Also send the message back to the sender
        ws.send(textMessage);
    });

    ws.on("close", () => {
        console.log("Client disconnected");
    });
});

// Start the server
server.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});
