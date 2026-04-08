import type { ChatSession, Message } from "@/types";
import apiClient from "@/utils/apiClient";
import axios from "axios";

export type CreateChatPayload = {
  doc_ids: string[];
};

// ================= SERVICE =================

export const chatApiService = {
  // ---------- CHAT ----------

  async createChat(payload: CreateChatPayload): Promise<ChatSession> {
    try {
      const res = await apiClient.post("/chats/", payload);
      return res.data;
    } catch (error) {
      throw new Error("Failed to create chat session ");
    }
  },

  async getChats(): Promise<ChatSession[]> {
    try {
      const res = await apiClient.get("/chats/");
      return res.data;
    } catch (error) {
      throw new Error("Failed to fetch chat sessions ");
    }
  },

  async getChat(chatSessionId: string): Promise<ChatSession> {
    try {
      const res = await apiClient.get(`/chats/${chatSessionId}/`);
      return res.data;
    } catch (error) {
      throw new Error("Failed to fetch chat session details ");
    }
  },

  async deleteChat(chatSessionId: string): Promise<void> {
    try {
      await apiClient.delete(`/chats/${chatSessionId}/`);
    } catch (error) {
      throw new Error("Failed to delete chat session ");
    }
  },

  async renameChat(chatSessionId: string, title: string): Promise<ChatSession> {
    try {
      const res = await apiClient.patch(`/chats/${chatSessionId}/`, { title });
      return res.data;
    } catch (error) {
      throw new Error("Failed to rename chat session ");
    }
  },

  // ---------- MESSAGES ----------

  async getMessages(chatSessionId: string): Promise<Message[]> {
    try {
      const res = await apiClient.get(`/chats/${chatSessionId}/messages/`);
      return res.data;
    } catch (error) {
      throw new Error("Failed to fetch messages for this chat session ");
    }
  },

  async sendMessage(chatSessionId: string, query: string): Promise<Message> {
    try {
      const res = await apiClient.post(`/chats/${chatSessionId}/messages/`, {
        query,
      });
      return res.data;
    } catch (error) {
      throw new Error("Failed to send message ");
    }
  },

  // ---------- STREAMING ----------
  // async streamMessage(
  //   chatSessionId: string,
  //   content: string,
  //   onChunk: (chunk: string) => void,
  // ): Promise<void> {
  //   try {
  //     const response = await fetch(`/apiClient/chats/${chatSessionId}/stream/`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //       body: JSON.stringify({ content }),
  //     });

  //     if (!response.body) {
  //       throw new Error("No response stream");
  //     }

  //     const reader = response.body.getReader();
  //     const decoder = new TextDecoder();

  //     while (true) {
  //       const { done, value } = await reader.read();
  //       if (done) break;

  //       const chunk = decoder.decode(value);
  //       onChunk(chunk);
  //     }
  //   } catch (error) {
  //     handleError(error);
  //   }
  // },
};
