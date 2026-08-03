/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useLoginMutation, setUser, setToken } from "@/redux/feature/authSlice";
import { toast } from "sonner";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();
    const [login, { isLoading }] = useLoginMutation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);
        setSuccessMsg(null);
        try {
            const res = await login({ email, password }).unwrap();
            console.log("Login response:", res);
            if (res.success) {
                const user = res.data?.user;
                const accessToken = res.data?.access;

                // Check if user is an admin
                if (user?.user_type === "admin") {
                    setSuccessMsg(res.message || "Login successful!");
                    toast.success(res.message || "Login successful!");

                    if (accessToken) {
                        localStorage.setItem("accessToken", accessToken);
                        dispatch(setToken(accessToken));
                    }

                    if (user) {
                        localStorage.setItem("user", JSON.stringify(user));
                        dispatch(setUser(user));
                    }

                    router.push("/dashboard");
                } else {
                    const msg = "Access Denied: Only Admin users can access the dashboard.";
                    setErrorMsg(msg);
                    toast.error(msg);
                }
            } else {
                const msg = res.message || "Username or password invalid!";
                setErrorMsg(msg);
                toast.error(msg);
            }
        } catch (error: any) {
            console.error("Login error:", error);
            const msg = error?.data?.message || error?.message || "Username or password invalid!";
            setErrorMsg(msg);
            toast.error(msg);
        }
    };

    return (
        <>
            <h2 className="text-3xl lg:text-[32px] font-medium text-white mb-3">
                Kreo AI Login
            </h2>
            <p className="text-white mb-10 text-sm md:text-lg leading-relaxed">
                Welcome back. Access your dashboard and manage your Kreo AI Platform.
            </p>

            {errorMsg && (
                <div className="flex items-start gap-3 p-4 mb-6 bg-red-500/15 border border-red-500/30 text-red-400 rounded-xl transition-all duration-300">
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <div>
                        <p className="font-semibold text-sm">Login Failed</p>
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

            <form className="space-y-6" onSubmit={handleLogin}>
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

                {/* Password Field */}
                <div className="space-y-2">
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

                {/* Forgot Password Link */}
                <div className="flex justify-end pt-1 pb-4">
                    <Link
                        href="/auth/forgot-password"
                        className="text-[#FF9F05] hover:text-[#FF9F05]/90 text-lg font-medium transition-colors"
                    >
                        Forgot Password?
                    </Link>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-white text-[#242424] font-medium text-[16px] py-4 rounded-[24px] hover:bg-gray-100 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 mt-2 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                >
                    {isLoading ? <Loader2 className="h-6 w-6 animate-spin mx-auto" /> : "Log In"}
                </button>
            </form>
        </>
    );
}
