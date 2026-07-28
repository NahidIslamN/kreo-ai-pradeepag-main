"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function VerifyMail() {
    const router = useRouter();
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (index: number, value: string) => {
        // Only allow numbers
        if (value && !/^\d+$/.test(value)) return;

        const newOtp = [...otp];
        // If pasting a whole string
        if (value.length > 1) {
            const pastedData = value.slice(0, 6).split("");
            for (let i = 0; i < pastedData.length; i++) {
                if (i + index < 6) {
                    newOtp[i + index] = pastedData[i];
                }
            }
            setOtp(newOtp);
            // Focus the next empty input or the last one
            const nextIndex = Math.min(index + pastedData.length, 5);
            inputRefs.current[nextIndex]?.focus();
            return;
        }

        newOtp[index] = value;
        setOtp(newOtp);

        // Move to next input if typing a single digit
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            // Move to previous input on backspace if current is empty
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const otpString = otp.join("");
        console.log("Submitting OTP:", otpString);
        router.push(`/auth/set-password`);
        // Proceed with verification...
    };

    return (
        <div className="flex flex-col h-full w-full max-w-[647px] mx-auto text-white">
            <div className="mb-10">
                <h2 className="text-3xl lg:text-[32px] font-medium text-white mb-3">
                    OTP
                </h2>
                <p className="text-white text-sm md:text-base leading-relaxed">
                    We&apos;ve sent a 6-digit verification code to your email address. Enter the code below to continue.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col w-full space-y-8">

                <div className="space-y-4">
                    <label className="text-[15px] font-medium text-white block">
                        Email
                    </label>

                    {/* OTP Inputs */}
                    <div className="flex justify-between items-center gap-2 sm:gap-4 w-full">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => {
                                    inputRefs.current[index] = el;
                                }}
                                type="text"
                                inputMode="numeric"
                                maxLength={6} // allow pasting up to 6
                                value={digit}
                                placeholder="."
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className={`w-12 h-14 sm:w-16 sm:h-16 text-center text-xl font-medium rounded-xl border focus:outline-none focus:ring-1 transition-all placeholder:text-[#888888] ${digit
                                    ? "bg-[#EAEAEA] border-transparent text-[#242424]"
                                    : "bg-transparent border-[#3E3E3E] text-white focus:border-[#777777] focus:ring-[#777777]"
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Timer / Resend */}
                    <div className="flex justify-center pt-2">
                        <p className="text-white text-sm">
                            Resend code after <span className="text-[#FF9F05] font-medium">60s</span>
                        </p>
                    </div>
                </div>

                {/* Verify Button */}
                <button
                    type="submit"
                    className="w-full bg-white text-[#242424] font-medium text-[16px] py-4 rounded-[24px] hover:bg-gray-100 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 mt-4 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                >
                    Verify Now
                </button>
            </form>
        </div>
    );
}
