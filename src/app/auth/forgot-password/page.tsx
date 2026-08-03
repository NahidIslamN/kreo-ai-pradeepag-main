/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForgotPasswordMutation } from "@/redux/feature/authSlice";
import { Mail, Loader2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMsg(null);

        try {
            const res = await forgotPassword({ email }).unwrap();
            console.log("Forgot password response:", res);

            if (res.success) {
                toast.success(res.message || "OTP sent to your email!");
                router.push(`/auth/verify-mail?email=${encodeURIComponent(email)}`);
            } else {
                const msg = res.message || "Failed to send OTP. Please try again.";
                setErrorMsg(msg);
                toast.error(msg);
            }
        } catch (error: any) {
            console.error("Forgot password error:", error);
            const msg = error?.data?.message || error?.message || "Failed to send OTP. Please try again.";
            setErrorMsg(msg);
            toast.error(msg);
        }
    };

    return (
        <>
            <h2 className="text-3xl lg:text-[32px] font-medium text-white mb-3">
                Forgot Password
            </h2>
            <p className="text-white mb-10 text-sm md:text-lg leading-relaxed">
                Enter your email address and we&apos;ll send you a secure OTP to reset your password.
            </p>

            {errorMsg && (
                <div className="flex items-start gap-3 p-4 mb-6 bg-red-500/15 border border-red-500/30 text-red-400 rounded-xl transition-all duration-300">
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <div>
                        <p className="font-semibold text-sm">Error</p>
                        <p className="text-xs text-red-400/90 mt-0.5">{errorMsg}</p>
                    </div>
                </div>
            )}

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
                    disabled={isLoading}
                    className="w-full bg-white text-[#242424] font-medium text-[16px] py-4 rounded-[24px] hover:bg-gray-100 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 mt-2 shadow-[0_0_15px_rgba(255,255,255,0.1)] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {isLoading ? <Loader2 className="h-6 w-6 animate-spin mx-auto" /> : "Send OTP"}
                </button>
            </form>
        </>
    );
}
