
import { GoogleGenAI, Chat } from "@google/genai";
import type { Message } from '../types';

let ai: GoogleGenAI | null = null;

const getAi = () => {
  if (!ai) {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable not set");
    }
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

export const createChatSession = (systemInstruction: string, history: Message[]): Chat => {
  const genAI = getAi();
  
  const mappedHistory = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
  }));

  const chat = genAI.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: systemInstruction,
    },
    history: mappedHistory
  });
  return chat;
};
