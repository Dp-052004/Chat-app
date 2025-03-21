import { useState, useEffect } from "react";

const Chat = () => {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:5000");

        ws.onopen = () => {
            console.log("Connected to WebSocket!");
        };

        ws.onmessage = async (event) => {
            try {
                let receivedMessage = event.data;

                // Convert Blob to text if needed
                if (event.data instanceof Blob) {
                    receivedMessage = await event.data.text();
                }

                // Update state with new message
                setMessages((prev) => [...prev, receivedMessage]);
            } catch (error) {
                console.error("Error processing message:", error);
            }
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        ws.onclose = () => {
            console.log("WebSocket disconnected, attempting to reconnect...");
            setTimeout(() => {
                setSocket(new WebSocket("ws://localhost:5000"));
            }, 3000); // Reconnect after 3 seconds
        };

        setSocket(ws);

        return () => ws.close();
    }, []);

    const sendMessage = () => {
        if (socket && message.trim() !== "") {
            socket.send(message);
            setMessage(""); // Clear input field
        }
    };

    return (
        <div className="chat-container">
            <h2>Chat Room</h2>
            <div className="chat-box">
                {messages.map((msg, index) => (
                    <p key={index}>{msg}</p>
                ))}
            </div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default Chat;
