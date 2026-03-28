// src/components/Sidebar.tsx
import React, { useState } from "react";

import {
  MessageCirclePlus,
  Search,
  PanelRightClose,
  PanelLeftClose,
} from "lucide-react";
import Logo from "./sidebar-components/Logo";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className={` w-80 flex flex-col bg-surface text-textPrimary min-h-screen transition-all duration-300`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <Logo />
        <button className="">
          <PanelLeftClose className="w-8 h-8 text-primary" />
        </button>
      </div>

      {/* New Chat option */}
      <div className="px-5 my-4">
        <button className="cursor-pointer flex w-full justify-center items-center py-1.5   border rounded-3xl  border-primary transition-colors hover:text-textPrimary text-primary hover:bg-primary">
          <MessageCirclePlus className="h-6 w-6 " />
          <span className="ml-2.5  ">New Chat</span>
        </button>
      </div>

      <div className="grow flex flex-col ">
        {/* Chats  list */}
        <div className="grow">
          <div className="px-5 flex items-center justify-between text-textMuted py-2.5">
            <span className="text-textPrimary text-lg">Chats</span>
            <Search className="h-8 w-8 text-primary " />
          </div>

          <ul className="space-y-2">
            {[
              "What is this document about",
              "What is this document about",
              "What is this document about",
            ].map((chat, idx) => (
              <li
                key={idx}
                className="cursor-pointer py-2.5 px-5 bg-black/20 border-l-2 border-primary bg-grad  hover:"
              >
                <span className="">{chat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Profile */}
        <div className="mt-auto p-4 border-t border-accent">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary" />
            {isOpen && (
              <div>
                <p className="font-medium">Jenny Wilson</p>
                <p className="text-sm text-textSecondary">
                  jen.wilson@example.com
                </p>
              </div>
            )}
          </div>
          <button className="mt-3 flex items-center gap-2 text-sm text-textSecondary hover:text-primary">
            <PanelRightClose className="h-5 w-5" />
            {isOpen && <span>Sign out</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
