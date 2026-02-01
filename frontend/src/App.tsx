import { useState, useEffect, useRef } from 'react';
import { socket } from './socket';

interface Message {
  user: string;
  message: string;
  timestamp: string;
}

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Connection events
    socket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    // Message receive event
    socket.on('receiveMessage', (data: Message) => {
      console.log('Message received:', data);
      setMessages((prev) => [...prev, data]);
    });

    // Typing indicator event
    socket.on('userTyping', (data: { user: string; isTyping: boolean }) => {
      if (data.isTyping) {
        setTyping(`${data.user} is typing...`);
      } else {
        setTyping('');
      }
      
      // 3 seconds baad typing indicator remove
      setTimeout(() => setTyping(''), 3000);
    });

    // Cleanup on unmount
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('receiveMessage');
      socket.off('userTyping');
    };
  }, []);

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      setIsLoggedIn(true);
      socket.connect();
    }
  };

  // Send message handler
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && isConnected) {
      socket.emit('sendMessage', {
        user: username,
        message: message.trim(),
      });
      setMessage('');
      socket.emit('typing', { user: username, isTyping: false });
    }
  };

  // Typing handler
  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    
    if (e.target.value.length > 0) {
      socket.emit('typing', { user: username, isTyping: true });
    } else {
      socket.emit('typing', { user: username, isTyping: false });
    }
  };

  // Login screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Chat App 💬
          </h1>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Enter your name..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 mb-4"
              autoFocus
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-200"
            >
              Join Chat
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Chat screen
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Chat Room</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm">Welcome, {username}!</span>
            <span
              className={`w-3 h-3 rounded-full ${
                isConnected ? 'bg-green-400' : 'bg-red-400'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 max-w-4xl w-full mx-auto p-4 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-20">
            <p className="text-xl">No messages yet...</p>
            <p className="text-sm">Start chatting! 🚀</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.user === username ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    msg.user === username
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-800 shadow'
                  }`}
                >
                  <p className="font-semibold text-sm mb-1">{msg.user}</p>
                  <p>{msg.message}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Typing Indicator */}
        {typing && (
          <div className="text-sm text-gray-500 italic mt-2">{typing}</div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form
          onSubmit={handleSendMessage}
          className="max-w-4xl mx-auto flex gap-2"
        >
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={handleTyping}
            className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            disabled={!isConnected}
          />
          <button
            type="submit"
            disabled={!isConnected || !message.trim()}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;