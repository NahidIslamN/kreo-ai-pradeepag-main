import React from "react";
import { Clock, Trash2 } from "lucide-react";

export interface NotificationItem {
  id: string;
  title: string;
  time: string;
}

interface NotificationDropdownProps {
  notifications: NotificationItem[];
  onDelete: (id: string) => void;
  onRefresh: () => void;
  onClose: () => void;
}

export default function NotificationDropdown({
  notifications,
  onDelete,
  onRefresh,
  onClose,
}: NotificationDropdownProps) {
  return (
    <div className="absolute top-14 right-0 w-[400px] max-w-[90vw] bg-[#2A2A2A] rounded-2xl shadow-2xl border border-[#3E3E3E] overflow-hidden z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#3E3E3E]">
        <h3 className="text-white font-medium text-[16px]">Notification</h3>
        <button 
          onClick={onRefresh}
          className="text-[#FF9F05] text-sm font-medium hover:text-[#FF9F05]/80 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* List Area */}
      <div className="max-h-[400px] overflow-y-auto custom-scrollbar flex flex-col">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-[#A3A3A3] text-sm">
            No new notifications.
          </div>
        ) : (
          notifications.map((notif, index) => (
            <div 
              key={notif.id} 
              className={`flex items-start justify-between gap-4 p-5 hover:bg-[#323232] transition-colors group ${
                index !== notifications.length - 1 ? 'border-b border-[#3E3E3E]/50' : ''
              }`}
            >
              <div className="flex flex-col gap-1.5 flex-1 pr-4">
                <p className="text-white text-sm font-medium leading-snug">
                  {notif.title}
                </p>
                <div className="flex items-center gap-1.5 text-[#A3A3A3]">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-xs">{notif.time}</span>
                </div>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(notif.id);
                }}
                className="text-[#A3A3A3] hover:text-[#FF4C4C] transition-colors p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-white/10"
                aria-label="Delete Notification"
              >
                <Trash2 className="w-[18px] h-[18px]" />
              </button>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        /* Custom scrollbar for this container to match design */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #555555;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #777777;
        }
      `}</style>
    </div>
  );
}
