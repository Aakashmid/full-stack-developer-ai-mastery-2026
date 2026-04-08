import type { ChatSession, Message } from "@/types";
import { createContext, useState, type ReactNode } from "react";

// ================= TYPES =================

type ChatContextType = {
  // state
  chats: ChatSession[];
  activeChatId: string | null;
  queries: Message[];

  selectedDocIds: string[]; // before chat
  contextDocIds: string[]; // locked after chat
  isContextLocked: boolean;

  // actions
  selectDocs: (docIds: string[]) => void;
  resetDocSelection: () => void;

  createChat: () => Promise<void>;
  startNewChatWithContext: (docIds: string[]) => Promise<void>;

  setActiveChat: (chatId: string) => void;

  sendMessage: (content: string) => Promise<void>;
  loadMessages: (chatId: string) => Promise<void>;
};

// ================= CONTEXT =================

const ChatContext = createContext<ChatContextType | null>(null);

// ================= PROVIDER =================
export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);
  const [contextDocIds, setContextDocIds] = useState<string[]>([]);
  const [isContextLocked, setIsContextLocked] = useState(false);

  // ================= DOC SELECTION =================
  const selectDocs = (docIds: string[]) => {
    if (isContextLocked) return;
    setSelectedDocIds(docIds);
  };

  const resetDocSelection = () => {
    setSelectedDocIds([]);
  };

  // ================= CHAT =================
  const createChat = async () => {
    if (selectedDocIds.length === 0) {
      throw new Error("No documents selected");
    }

    const newChat = await chatService.createChat(selectedDocIds);

    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);

    setContextDocIds(selectedDocIds);
    setIsContextLocked(true);

    setSelectedDocIds([]); // reset staging
  };

  const startNewChatWithContext = async (docIds: string[]) => {
    setIsContextLocked(false);
    setSelectedDocIds(docIds);
    await createChat();
  };

  const setActiveChat = (chatId: string) => {
    const chat = chats.find((c) => c.id === chatId);
    if (!chat) return;

    setActiveChatId(chatId);
    setContextDocIds(chat.doc_ids);
    setIsContextLocked(true);
  };

  // ================= MESSAGES =================

  const sendMessage = async (content: string) => {
    if (!activeChatId) throw new Error("No active chat");

    const userMessage: Message = {
      id: crypto.randomUUID(),
      chat_id: activeChatId,
      role: "user",
      content,
    };

    // optimistic update
    setMessages((prev) => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), userMessage],
    }));

    const aiMessage = await chatService.sendMessage(activeChatId, content);

    setMessages((prev) => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), aiMessage],
    }));
  };

  const loadMessages = async (chatId: string) => {
    const msgs = await chatService.getMessages(chatId);

    setMessages((prev) => ({
      ...prev,
      [chatId]: msgs,
    }));
  };

  // ================= PROVIDER =================

  return (
    <ChatContext.Provider
      value={{
        chats,
        activeChatId,
        messages,

        selectedDocIds,
        contextDocIds,
        isContextLocked,

        selectDocs,
        resetDocSelection,

        createChat,
        startNewChatWithContext,
        setActiveChat,

        sendMessage,
        loadMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// ================= HOOK =================

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within ChatProvider");
  }
  return context;
};
