import React from "react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LogoutModal({ isOpen, onClose }: LogoutModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleLogout = () => {
    localStorage.clear();
    // Demo logout: just redirect to login page
    router.push("/auth/login");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-[#242424] border border-[#3E3E3E] rounded-2xl w-full max-w-[500px] p-8 flex flex-col items-center text-center shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-full bg-[#3E3E3E] flex items-center justify-center mb-6">
          <LogOut className="w-8 h-8 text-white rotate-180" />
        </div>

        <h2 className="text-2xl font-medium text-white mb-2">Confirm Logout</h2>
        <p className="text-[#A3A3A3] mb-8">
          Are you sure you want to sign out of your account?
        </p>

        <div className="flex items-center gap-4 w-full">
          <button
            onClick={handleLogout}
            className="flex-1 bg-[#3E3E3E] text-white hover:bg-[#4a4a4a] transition-colors py-3.5 rounded-xl font-medium text-sm"
          >
            Yes, Log Out
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-white text-[#242424] hover:bg-gray-100 transition-colors py-3.5 rounded-xl font-medium text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
