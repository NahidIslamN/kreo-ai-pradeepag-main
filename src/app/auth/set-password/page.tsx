/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Lock, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useResetPasswordMutation } from "@/redux/feature/authSlice";
import { toast } from "sonner";

export default function SetPasswordPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const [resetPassword, { isLoading }] = useResetPasswordMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);
        setSuccessMsg(null);

        if (password.length < 6) {
            setErrorMsg("Password must be at least 6 characters long.");
            toast.error("Password must be at least 6 characters long.");
            return;
        }

        try {
            const res = await resetPassword({ new_password: password }).unwrap();
            console.log("Reset password response:", res);

            if (res.success) {
                setSuccessMsg(res.message || "Password reset successfully!");
                toast.success(res.message || "Password reset successfully!");

                // Clean up the verification token
                localStorage.removeItem("verificationToken");

                // Redirect to login after a brief delay
                setTimeout(() => {
                    router.push("/auth/login");
                }, 1500);
            } else {
                const msg = res.message || "Failed to reset password. Please try again.";
                setErrorMsg(msg);
                toast.error(msg);
            }
        } catch (error: any) {
            console.error("Reset password error:", error);
            const msg = error?.data?.message || error?.message || "Failed to reset password. Please try again.";
            setErrorMsg(msg);
            toast.error(msg);
        }
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

            {errorMsg && (
                <div className="flex items-start gap-3 p-4 mb-6 bg-red-500/15 border border-red-500/30 text-red-400 rounded-xl transition-all duration-300">
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <div>
                        <p className="font-semibold text-sm">Error</p>
                        <p className="text-xs text-red-400/90 mt-0.5">{errorMsg}</p>
                    </div>
                </div>
            )}

            {successMsg && (
                <div className="flex items-start gap-3 p-4 mb-6 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-xl transition-all duration-300">
                    <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                    <div>
                        <p className="font-semibold text-sm">Success</p>
                        <p className="text-xs text-emerald-400/90 mt-0.5">{successMsg}</p>
                    </div>
                </div>
            )}

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
                    disabled={isLoading}
                    className="w-full bg-white text-[#242424] font-medium text-[16px] py-4 rounded-[24px] hover:bg-gray-100 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 shadow-[0_0_15px_rgba(255,255,255,0.1)] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {isLoading ? <Loader2 className="h-6 w-6 animate-spin mx-auto" /> : "Set New Password"}
                </button>
            </form>
        </div>
    );
}
