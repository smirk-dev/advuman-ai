'use client';

import { useState, useEffect, useRef } from 'react';
import { Message } from '@/types/database.types';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    setLoading(true);
    setError(null);

    // Add user message to UI immediately
    const tempMessage: Message = {
      id: 'temp-' + Date.now(),
      conversation_id: conversationId || '',
      role: 'user',
      content,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, tempMessage]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          message: content,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to send message');
      }

      const data = await response.json();

      // Update conversation ID if it's a new conversation
      if (!conversationId) {
        setConversationId(data.conversationId);
      }

      // Add AI response to messages
      const aiMessage: Message = {
        id: 'ai-' + Date.now(),
        conversation_id: data.conversationId,
        role: 'assistant',
        content: data.message,
        created_at: new Date().toISOString(),
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err: any) {
      setError(err.message || 'Failed to send message');
      // Remove the temporary message on error
      setMessages(prev => prev.filter(m => m.id !== tempMessage.id));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">Advuman</h1>
        <p className="text-sm text-gray-500">Your AI Business Advisor</p>
      </header>

      <div className="flex-1 overflow-hidden flex flex-col">
        <MessageList messages={messages} loading={loading} />

        {error && (
          <div className="px-6 py-2 bg-red-50 border-t border-red-200">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <MessageInput onSend={sendMessage} disabled={loading} />
      </div>
    </div>
  );
}
