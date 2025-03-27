import React from "react";
import { Users, MessageSquare, Menu } from "lucide-react";
import { useChatContext } from "../context/ChatContext";

interface FiltersProps {
  isVegOnly: boolean;
  setIsVegOnly: (value: boolean) => void;
  peopleCount: number;
  setPeopleCount: (value: number) => void;
}

export const Filters: React.FC<FiltersProps> = ({}) => {
  const { state, dispatch } = useChatContext();

  return (
    <div className="p-3 bg-white/50 backdrop-blur-sm border-b border-white/20 flex items-center justify-between">
      <div className="flex items-center gap-2 justify-center">
        <div></div>
        <div className="flex bg-gray-200 rounded-lg p-1">
          <button
            onClick={() => dispatch({ type: "SET_MODE", payload: "chat" })}
            className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              state.mode === "chat"
                ? "bg-white text-gray-800 shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Chat
          </button>
          <button
            onClick={() => dispatch({ type: "SET_MODE", payload: "browse" })}
            className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              state.mode === "browse"
                ? "bg-white text-gray-800 shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <Menu className="w-4 h-4" />
            Browse
          </button>
        </div>
        <div></div>
      </div>
    </div>
  );
};
