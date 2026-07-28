"use client";

import { Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SetPasswordPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Setting password...");
        // Handle password reset
        router.push("/auth/login"); // Redirect to login after successful reset
    };

    return (
        <div className="flex flex-col h-full w-full max-w-[647px] mx-auto text-white">
            <div className="mb-10">
                <h2 className="text-3xl lg:text-[32px] font-medium text-white mb-3">
                    Set New Password
                </h2>
                <p className="text-white text-sm md:text-base leading-relaxed">
                    Create a strong password to secure your account.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col w-full space-y-8">
                {/* Password Field */}
                <div className="space-y-4">
                    <label className="text-[15px] font-medium text-white block">
                        Password
                    </label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className="h-[18px] w-[18px] text-[#888888] group-focus-within:text-[#cccccc] transition-colors" />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                            className="w-full pl-11 pr-12 py-3.5 bg-transparent border border-[#3E3E3E] rounded-xl text-white placeholder:text-[#666666] focus:outline-none focus:border-[#777777] focus:ring-1 focus:ring-[#777777] transition-all"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#888888] hover:text-white transition-colors"
                        >
                            {showPassword ? (
                                <EyeOff className="h-[18px] w-[18px]" />
                            ) : (
                                <Eye className="h-[18px] w-[18px]" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-white text-[#242424] font-medium text-[16px] py-4 rounded-[24px] hover:bg-gray-100 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                >
                    Set New Password
                </button>
            </form>
        </div>
    );
}
