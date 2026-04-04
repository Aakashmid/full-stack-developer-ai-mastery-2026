// src/components/Sidebar.tsx
import React, { useState } from "react";

import {
  MessageCirclePlus,
  Search,
  PanelLeftClose,
  EllipsisVerticalIcon,
  LogOut,
  PanelLeftOpen,
} from "lucide-react";
import Logo from "./sidebar-components/Logo";

const Sidebar = ({
  isOpen,
  toggleSidebar,
}: {
  isOpen: boolean;
  toggleSidebar: () => void;
}) => {
  const [isActive, setIsActive] = useState<number | null>(null); // for active chat highlishting , will have chat token in real implementation instead of index
  return (
    <>
      {/* open sidebar */}
      <div
        className={`${isOpen ? "translate-x-0" : "-translate-x-100"} w-80 flex flex-col bg-surface text-textPrimary h-dvh transition-all duration-300 overflow-hidden fixed  z-50`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3">
          <Logo />
          <button className="cursor-pointer" onClick={() => toggleSidebar()}>
            <PanelLeftClose className="w-7 h-7 text-primary hover:text-lightPrimary" />
          </button>
        </div>

        {/* New Chat option */}
        <div className="px-5 my-4">
          <button className="cursor-pointer flex w-full justify-center items-center py-1.5   border rounded-3xl  border-primary transition-colors hover:text-textPrimary text-primary hover:bg-primary">
            <MessageCirclePlus className="h-6 w-6 " />
            <span className="ml-2.5  ">New Chat</span>
          </button>
        </div>

        <div className="grow flex flex-col min-h-0">
          {/* Chats  list */}
          <div className="grow min-h-0 flex flex-col">
            <div className="px-5 flex items-center justify-between text-textMuted py-2.5">
              <span className="text-textPrimary text-lg font-semibold">
                Chats
              </span>
              <Search className="h-7 w-7 text-primary hover:text-lightPrimary cursor-pointer" />
            </div>

            <ul className="space-y-0.5 overflow-y-auto custom-scrollbar min-h-0 grow">
              {[
                "What is this document about",
                "What is this document about",
                "What is this document about",
                "What is this document about",
                "What is this document about",
                "What is this document about",
                "What is this document about",
                "What is this document about",
                "What is this document about",
                "What is this document about",
                "What is this document about",
                "What is this document about",
                "What is this document about",
                "What is this document about",
              ].map((chat, idx) => (
                <li
                  key={idx}
                  className={`${isActive == idx ? "active-chat-li" : "chat-li"} group`}
                  onClick={() => setIsActive(idx)}
                >
                  <span>{chat}</span>
                  <span>
                    <EllipsisVerticalIcon
                      className="hidden group-hover:inline-flex text-primary h-6 w-6 absolute right-2 top-1/2 -translate-y-1/2 hover:text-lightPrimary"
                      onClick={(e) => {
                        e.stopPropagation(); // prevents li's onClick
                        console.log("icon clicked");
                      }}
                    />
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Profile */}
          <div className="mt-auto p-5  ">
            <div className="flex items-center gap-3 border-textMuted border-t  py-5">
              <div className="h-10 w-10 rounded-full bg-primary" />
              <div>
                <p className="font-medium">Jenny Wilson</p>
                <p className="text-sm text-textSecondary">
                  jen.wilson@example.com
                </p>
              </div>
            </div>
            <button className="secondary-btn flex items-center gap-3 font-medium">
              <LogOut className="h-4 w-4 rotate-180" />
              <span className="">Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* collapsed sidebar */}
      <div
        className={`${isOpen ? "hidden" : "w-fit"} h-dvh transition-all duration-300 bg-surface px-4 py-4 fixed z-40 top-0`}
      >
        <div className="flex flex-col  gap-6">
          <button className="cursor-pointer" onClick={() => toggleSidebar()}>
            <PanelLeftOpen className="icon-btn" />
          </button>
          <button className="cursor-pointer">
            <MessageCirclePlus className="icon-btn" />
          </button>
          <button className="cursor-pointer">
            <Search className="icon-btn" />
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
