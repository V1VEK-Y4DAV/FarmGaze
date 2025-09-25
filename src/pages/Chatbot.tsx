import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, ImagePlus, X } from "lucide-react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  image?: string;
  imageFile?: File;
}

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m FarmGaze AI Assistant. How can I help you with your farming needs today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userMessage: string, hasImage: boolean = false): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (hasImage) {
      return 'I can see you\'ve uploaded an image! I can help analyze crop images, identify plant diseases, assess plant health, or provide insights about soil conditions. What would you like me to analyze in this image?';
    } else if (lowerMessage.includes('crop') || lowerMessage.includes('farming')) {
      return 'I can help you with crop recommendations based on your soil conditions, climate, and location. What specific crop information do you need?';
    } else if (lowerMessage.includes('weather')) {
      return 'I can provide weather forecasts and help you plan your farming activities accordingly. Would you like current weather conditions or forecasts?';
    } else if (lowerMessage.includes('irrigation') || lowerMessage.includes('water')) {
      return 'I can assist with irrigation scheduling and water management. What\'s your current irrigation challenge?';
    } else if (lowerMessage.includes('soil')) {
      return 'I can help analyze soil conditions including pH, nutrients, and moisture levels. Do you have specific soil data you\'d like me to analyze?';
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return 'Hello! I\'m here to help with all your farming needs. You can ask me about crops, weather, irrigation, soil analysis, and more!';
    } else {
      return 'I\'m here to help with farming-related questions! You can ask me about crop recommendations, weather forecasts, irrigation scheduling, soil analysis, and more. What would you like to know?';
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() && !selectedImage) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue || (selectedImage ? 'Uploaded an image' : ''),
      sender: 'user',
      timestamp: new Date(),
      image: imagePreview,
      imageFile: selectedImage || undefined
    };

    setMessages(prev => [...prev, userMessage]);
    const messageText = inputValue;
    const hasImage = !!selectedImage;
    
    setInputValue('');
    setSelectedImage(null);
    setImagePreview('');
    setIsTyping(true);

    // Simulate bot thinking time
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(messageText, hasImage),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 overflow-x-hidden px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto p-4 sm:p-6 max-w-4xl">
      <Card className="h-[600px] shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] dark:shadow-[0_20px_50px_rgba(76,_135,_30,_0.3)] transform-gpu hover:shadow-[0_25px_60px_rgba(8,_112,_184,_0.8)] dark:hover:shadow-[0_25px_60px_rgba(76,_135,_30,_0.4)] transition-all duration-300 ease-in-out border-2 border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-br from-white via-blue-50/30 to-green-50/30 dark:from-gray-800 dark:via-blue-900/20 dark:to-green-900/20 backdrop-blur-lg relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-green-400/10 to-blue-400/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-20 right-16 w-24 h-24 bg-gradient-to-br from-blue-400/10 to-green-400/10 rounded-full blur-lg animate-bounce" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-16 left-20 w-20 h-20 bg-gradient-to-br from-green-500/15 to-blue-500/15 rounded-full blur-lg animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-32 right-12 w-28 h-28 bg-gradient-to-br from-blue-500/10 to-green-500/10 rounded-full blur-xl animate-bounce" style={{animationDelay: '0.5s'}}></div>
        </div>
        <CardHeader className="border-b bg-gradient-to-r from-green-600 via-blue-600 to-green-600 text-white relative overflow-hidden shadow-lg">
          {/* Header Background Animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 via-blue-400/20 to-green-400/20 animate-pulse"></div>
          <div className="absolute -top-2 -left-2 w-8 h-8 bg-white/20 rounded-full blur-sm animate-ping"></div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-white/30 rounded-full blur-sm animate-pulse" style={{animationDelay: '1s'}}></div>
          
          <CardTitle className="flex items-center gap-3 text-xl font-bold relative z-10">
            <div className="relative">
              <Bot className="h-8 w-8 text-white drop-shadow-lg transform hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 h-8 w-8 bg-white/30 rounded-full blur-md animate-pulse"></div>
            </div>
            <span className="bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent drop-shadow-sm">
              🌾 FarmGaze AI Assistant
            </span>
            <div className="ml-auto flex items-center gap-2">
              <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-100">Online</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex flex-col" style={{height: 'calc(600px - 80px)'}}>
          <ScrollArea ref={scrollAreaRef} className="flex-1 p-4" style={{height: 'calc(100% - 120px)'}}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.sender === 'bot' && (
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-300 border-2 border-white/50">
                      <Bot className="h-5 w-5 text-white drop-shadow-sm" />
                      <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] p-4 rounded-2xl transform transition-all duration-300 hover:scale-[1.02] ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-[0_8px_30px_rgba(59,130,246,0.4)] border border-blue-400/50'
                        : 'bg-gradient-to-br from-gray-50 to-white text-gray-800 shadow-[0_8px_30px_rgba(0,0,0,0.1)] border border-gray-200/50 dark:from-gray-700 dark:to-gray-600 dark:text-white dark:border-gray-500/50'
                    }`}
                  >
                    {message.image && (
                      <div className="mb-2">
                        <img 
                          src={message.image} 
                          alt="Uploaded content" 
                          className="max-w-full h-auto rounded-lg max-h-48 object-cover"
                        />
                      </div>
                    )}
                    <p className="text-sm">{message.text}</p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                  {message.sender === 'user' && (
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-300 border-2 border-white/50">
                      <User className="h-5 w-5 text-white drop-shadow-sm" />
                      <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white/50">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.1)] border border-gray-200/50">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-blue-400 rounded-full animate-bounce shadow-sm"></div>
                      <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-green-400 rounded-full animate-bounce shadow-sm" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-blue-400 rounded-full animate-bounce shadow-sm" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <div className="border-t-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-4 relative flex-shrink-0" style={{minHeight: '120px', maxHeight: '200px'}}>
            {/* Input Area Background Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-blue-500/5 to-green-500/5 animate-pulse"></div>
            {/* Image Preview */}
            {imagePreview && (
              <div className="mb-2 relative z-10">
                <div className="relative inline-block">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-16 h-16 object-cover rounded-lg border-2 border-green-400 shadow-lg transform hover:scale-105 transition-all duration-300"
                  />
                  <button
                    onClick={removeSelectedImage}
                    className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full p-1 hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg transform hover:scale-110"
                  >
                    <X className="h-2 w-2" />
                  </button>
                </div>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1 font-medium">📸 Ready</p>
              </div>
            )}
            
            {/* Input Area */}
            <div className="flex gap-2 relative z-10 items-end">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              {/* Image Upload Button */}
              <Button
                onClick={triggerImageUpload}
                variant="outline"
                size="icon"
                className="shrink-0 w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 border-none text-white shadow-lg transform hover:scale-105 transition-all duration-300"
                title="Upload Image 📷"
              >
                <ImagePlus className="h-5 w-5" />
              </Button>
              {/* Text Input */}
              <div className="flex-1">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about farming... 🌱"
                  className="w-full h-10 text-sm rounded-xl border-2 border-gray-300 focus:border-green-500 shadow-md bg-white dark:bg-gray-700 dark:border-gray-500 dark:focus:border-green-400 transition-all duration-300"
                />
              </div>
              {/* Send Button */}
              <Button 
                onClick={handleSendMessage} 
                disabled={!inputValue.trim() && !selectedImage}
                className="shrink-0 w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 border-none text-white shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                title="Send Message 📤"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;