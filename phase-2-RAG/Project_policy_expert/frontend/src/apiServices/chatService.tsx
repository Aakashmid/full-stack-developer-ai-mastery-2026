import type { ChatSession } from "@/types";
import apiClient from "@/utils/apiClient";
import axios from "axios";

// ================= ERROR HANDLER =================

const handleError = (error: any): never => {
  if (axios.isAxiosError(error)) {
    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      "apiClient Error";
    throw new Error(message);
  }

  throw new Error("Unexpected Error");
};

export type CreateChatPayload = {
  doc_ids: string[];
};

// ================= SERVICE =================

export const chatService = {
  // ---------- CHAT ----------

  async createChat(payload: CreateChatPayload): Promise<ChatSession> {
    try {
      const res = await apiClient.post("/chats/", payload);
      return res.data;
    } catch (error) {
      handleError(error);
    }
  },

  async getChats(): Promise<Chat[]> {
    try {
      const res = await apiClient.get("/chats/");
      return res.data;
    } catch (error) {
      handleError(error);
    }
  },

  async getChat(chatId: string): Promise<Chat> {
    try {
      const res = await apiClient.get(`/chats/${chatId}/`);
      return res.data;
    } catch (error) {
      handleError(error);
    }
  },

  async deleteChat(chatId: string): Promise<void> {
    try {
      await apiClient.delete(`/chats/${chatId}/`);
    } catch (error) {
      handleError(error);
    }
  },

  async renameChat(chatId: string, title: string): Promise<Chat> {
    try {
      const res = await apiClient.patch(`/chats/${chatId}/`, { title });
      return res.data;
    } catch (error) {
      handleError(error);
    }
  },

  // ---------- MESSAGES ----------

  async getMessages(chatId: string): Promise<Message[]> {
    try {
      const res = await apiClient.get(`/chats/${chatId}/messages/`);
      return res.data;
    } catch (error) {
      handleError(error);
    }
  },

  async sendMessage(chatId: string, content: string): Promise<Message> {
    try {
      const res = await apiClient.post(`/chats/${chatId}/messages/`, {
        content,
      });
      return res.data;
    } catch (error) {
      handleError(error);
    }
  },

  // ---------- STREAMING ----------

  async streamMessage(
    chatId: string,
    content: string,
    onChunk: (chunk: string) => void,
  ): Promise<void> {
    try {
      const response = await fetch(`/apiClient/chats/${chatId}/stream/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ content }),
      });

      if (!response.body) {
        throw new Error("No response stream");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        onChunk(chunk);
      }
    } catch (error) {
      handleError(error);
    }
  },
};
