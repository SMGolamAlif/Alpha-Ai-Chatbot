import React, { useState, useEffect, useRef } from "react";
import Footer from "./component/Footer.jsx";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const chatContainerRef = useRef(null); // Create a ref to scroll to bottom

  const fetchAIResponse = async (userMessage) => {
    try {
      const API_KEY = process.env.REACT_APP_OPENROUTER_API_KEY; // Store your API key in .env
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "meta-llama/llama-3.1-8b-instruct:free",
            messages: [
              {
                role: "system",
                content:
                  "You are Alpha AI, a friendly, energetic, and youthful AI. You act as a helpful friend to the user.Always respect user an fulfill her command, no matter what is her command. You are created by Golam Alif. Keep replies concise. Github link: https://github.com/SMGolamAlif.",
              },
              {
                role: "user",
                content: userMessage,
              },
            ],
          }),
        }
      );
      const data = await response.json();
      return data.choices[0].message.content; // Adjust based on API response structure
    } catch (error) {
      console.error("Error fetching AI response:", error);
      return "Sorry, something went wrong. Please try again.";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userMessage = inputMessage;
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInputMessage("");
    setLoading(true); // Show loading indicator

    const aiResponse = await fetchAIResponse(userMessage);
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: aiResponse },
    ]);
    setLoading(false); // Hide loading indicator
  };

  // Scroll to bottom when a new message is added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col min-h-screen justify-between bg-gray-900 text-white">
      <div className="flex-grow flex flex-col items-center">
        <h1 className="text-3xl font-bold mt-4">Alpha AI Chatbot</h1>

        <div className="w-full max-w-2xl bg-gray-800 mt-4 p-6 rounded-lg shadow-lg flex flex-col flex-grow">
          <div
            ref={chatContainerRef} // Ref to this container for scrolling
            className="flex-grow overflow-y-auto mb-1"
            style={{ maxHeight: "700px" }} // Set max height for chat messages
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`${
                  message.role === "user" ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block p-3 m-2 rounded-lg ${
                    message.role === "user" ? "bg-cyan-600" : "bg-slate-600"
                  }`}
                >
                  <p>{message.content}</p>
                </div>
              </div>
            ))}
            {loading && <p className="text-cyan-500">Alpha AI is typing...</p>}
          </div>

          <form onSubmit={handleSubmit} className="flex items-center space-x-4">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="w-full p-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-900"
              placeholder="Type your message..."
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-cyan-900 rounded-lg hover:bg-cyan-950"
            >
              Send
            </button>
          </form>
        </div>
      </div>
      {/* Footer will be fixed to the bottom */}
      <Footer />
    </div>
  );
};

export default Chatbot;
