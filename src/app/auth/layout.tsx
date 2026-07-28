"use client";

import AuthLogo from "@/compontens/icon/auth-logo";
import LoginLogo from "@/compontens/icon/login-logo";
import React from "react";
import { usePathname } from "next/navigation";
import ForgotLogo from "@/compontens/icon/forgot-logo";

const OtpIcon = () => (
  <div className="flex gap-4 items-center justify-center text-[#242424] font-bold text-6xl lg:text-7xl">
    <span>*</span>
    <span>*</span>
    <span>*</span>
    <span>*</span>
  </div>
);

const CheckIcon = () => (
  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

// Better approximation of the Kreo logo based on the image: 
// It looks like a K made of rounded stylized paths.


export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  let leftContent = {
    icon: <LoginLogo />,
    title: "Admin Portal Login",
    subtitle: "Securely manage users, content, and business insights",
    rightBg: "bg-primary",
  };

  if (pathname === "/auth/verify-mail") {
    leftContent = {
      icon: <OtpIcon />,
      title: "One More Step!",
      subtitle: "Please enter the verification code sent to your email to securely continue.",
      rightBg: "bg-primary", // Changed back to dark theme
    };
  } else if (pathname === "/auth/forgot-password") {
    leftContent = {
      icon: <ForgotLogo />,
      title: "Forgot Password",
      subtitle: "Securely manage users, content, and business insights",
      rightBg: "bg-primary",
    };
  } else if (pathname === "/auth/set-password") {
    leftContent = {
      icon: <CheckIcon />,
      title: "You Are All Set",
      subtitle: "Create a new password to regain access to your account.",
      rightBg: "bg-primary",
    };
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-primary">
      {/* Navbar */}
      <header className="h-16 flex items-center px-6 border-b border-white/10 z-10 sticky top-0 bg-primary">
        <div className="flex items-center gap-4">
          {pathname !== "/auth/login" && (
            <button
              onClick={() => window.history.back()}
              className="text-white hover:text-gray-300 transition-colors flex items-center justify-center p-1"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
          <AuthLogo />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row">
        {/* Left Side (Branding & Graphic) */}
        <div className="w-full lg:w-[45%] xl:w-1/2 flex flex-col relative overflow-hidden bg-[#CACACA]">
          {/* Top section with Logo */}
          <div className="flex-1 flex flex-col items-center justify-center p-8 min-h-[40vh] lg:min-h-0 pt-12 lg:pt-0 pb-24 lg:pb-0">
            {leftContent.icon}
          </div>

          {/* Bottom section with curved top-left and text */}
          <div className="flex-1 bg-[#faf7f2] rounded-tl-[60px] md:rounded-tl-[100px] lg:rounded-tl-[140px] flex flex-col items-center justify-center p-8 text-center shadow-lg relative min-h-[30vh] lg:min-h-0">
            {/* The curve creates a seamless transition visually */}
            <div className="max-w-md mt-[-40px] lg:mt-[-80px]">
              <h2 className="text-[28px] lg:text-[32px] font-medium text-[#222222] mb-3">
                {leftContent.title}
              </h2>
              <p className="text-[#555555] text-base lg:text-lg">
                {leftContent.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side (Dynamic Forms) */}
        <div className={`w-full lg:w-[55%] xl:w-1/2 ${leftContent.rightBg} flex items-center justify-center p-6 sm:p-12 lg:p-16 xl:p-24 relative min-h-[60vh] lg:min-h-0`}>
          <div className="w-full max-w-[647px]">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
