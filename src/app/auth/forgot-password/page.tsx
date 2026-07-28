"use client";

import { Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(email);
        router.push(`/auth/verify-mail?email=${email}`);
    };

    return (
        <>
            <h2 className="text-3xl lg:text-[32px] font-medium text-white mb-3">
                Forgot Password
            </h2>
            <p className="text-white mb-10 text-sm md:text-lg leading-relaxed">
                Enter your email address and we&apos;ll send you a secure OTP to reset your password.
            </p>

            <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Email Field */}
                <div className="space-y-2">
                    <label className="text-[15px] font-medium text-white block">
                        Email
                    </label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Mail className="h-[18px] w-[18px] text-[#888888] group-focus-within:text-[#cccccc] transition-colors" />
                        </div>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter email address"
                            required
                            className="w-full pl-11 pr-4 py-3.5 bg-transparent border border-[#3E3E3E] rounded-xl text-white placeholder:text-[#666666] focus:outline-none focus:border-[#777777] focus:ring-1 focus:ring-[#777777] transition-all"
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-white text-[#242424] font-medium text-[16px] py-4 rounded-[24px] hover:bg-gray-100 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 mt-2 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                >
                    Send OTP
                </button>
            </form>
        </>
    );
}
