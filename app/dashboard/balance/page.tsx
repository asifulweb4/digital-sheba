"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Copy, CheckCircle, Smartphone, Hash, Wallet, Zap, ShieldCheck, Mail } from "lucide-react";
import { addBalanceAction } from "@/lib/actions";

export default function RechargePage() {
    const router = useRouter();
    const [accountType, setAccountType] = useState<"Personal" | "Business">("Personal");
    const [formData, setFormData] = useState({
        senderNumber: "",
        gmail: "",
        transactionId: "",
        amount: ""
    });
    const [error, setError] = useState("");
    const [method, setMethod] = useState<"bKash" | "Nagad">("bKash");
    const [copied, setCopied] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const minAmount = accountType === "Personal" ? 500 : 1200;

    const paymentNumbers = {
        bKash: "01333378924",
        Nagad: ""
    };

    const handleCopy = (num: string, type: string) => {
        navigator.clipboard.writeText(num);
        setCopied(type);
        setTimeout(() => setCopied(null), 2000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const amountNum = parseFloat(formData.amount);
        if (amountNum < minAmount) {
            setError(`${accountType} একাউন্ট এর জন্য সর্বনিম্ন ${minAmount} টাকা রিচার্জ করতে হবে।`);
            return;
        }

        setSubmitting(true);

        const res = await addBalanceAction(
            amountNum,
            formData.transactionId.trim().toUpperCase(),
            method,
            `Recharge: ${accountType}, Sender: ${formData.senderNumber}, Gmail: ${formData.gmail}`
        );

        setSubmitting(false);

        if (!res.success) {
            setError(res.message || "এই TrxID টি আগে ব্যবহার হয়েছে অথবা ভুল!");
        } else {
            alert("✅ পেমেন্ট রিকোয়েস্ট সাবমিট হয়েছে! এডমিন ভেরিফাই করার পর আপনার ব্যালেন্স যোগ হবে।");
            setFormData({ senderNumber: "", gmail: "", transactionId: "", amount: "" });
            router.push("/dashboard");
        }
    };

    return (
        <main style={{ minHeight: "100vh", background: "#f6fdf9" }}>
            <div style={{ maxWidth: "680px", margin: "0 auto", padding: "60px 16px 100px" }}>

                {/* Back Button */}
                <button
                    onClick={() => router.push("/dashboard")}
                    style={{
                        display: "flex", alignItems: "center", gap: "8px",
                        color: "#065f46", background: "none", border: "none",
                        cursor: "pointer", fontWeight: "800", fontSize: "14px",
                        marginBottom: "32px", transition: "color 0.2s"
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#059669")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#065f46")}
                >
                    <ArrowLeft size={18} />
                    ড্যাশবোর্ডে ফিরে যান
                </button>

                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: "40px" }}>
                    <div style={{
                        width: "80px", height: "80px", background: "#059669",
                        borderRadius: "32px", display: "flex", alignItems: "center",
                        justifyContent: "center", margin: "0 auto 24px",
                        boxShadow: "0 20px 40px rgba(5,150,105,0.25)"
                    }}>
                        <Wallet size={32} color="white" />
                    </div>
                    <h1 style={{
                        fontSize: "clamp(26px, 5vw, 36px)", fontWeight: "900",
                        color: "#022c22", margin: "0 0 12px"
                    }}>
                        ব্যালেন্স রিচার্জ করুন
                    </h1>
                    <p style={{ color: "#6b7280", fontWeight: "700", fontSize: "14px", margin: 0 }}>
                        আপনার একাউন্টে ব্যালেন্স যোগ করতে নিচের ফর্মটি পূরণ করুন
                    </p>
                </div>

                {/* Main Card */}
                <div style={{
                    background: "white", borderRadius: "48px",
                    padding: "clamp(24px, 5vw, 40px)",
                    boxShadow: "0 25px 50px rgba(2,44,34,0.05)",
                    border: "1px solid #ecfdf5"
                }}>

                    {/* Account Type Toggle */}
                    <div style={{
                        display: "flex", background: "rgba(236,253,245,0.5)",
                        padding: "6px", borderRadius: "24px",
                        marginBottom: "24px", border: "1px solid #d1fae5"
                    }}>
                        {(["Personal", "Business"] as const).map((type) => (
                            <button
                                key={type}
                                onClick={() => setAccountType(type)}
                                style={{
                                    flex: 1, padding: "14px", borderRadius: "18px", border: "none",
                                    background: accountType === type ? "#059669" : "transparent",
                                    color: accountType === type ? "white" : "#065f46",
                                    cursor: "pointer", fontWeight: "900", fontSize: "14px",
                                    transition: "all 0.3s ease",
                                    boxShadow: accountType === type ? "0 8px 20px rgba(5,150,105,0.3)" : "none"
                                }}
                            >
                                {type} Account
                            </button>
                        ))}
                    </div>

                    {/* Min Amount Notice */}
                    <div style={{
                        background: "#022c22", color: "white", padding: "20px 24px",
                        borderRadius: "24px", marginBottom: "24px",
                        position: "relative", overflow: "hidden"
                    }}>
                        <div style={{
                            position: "absolute", top: "-30px", right: "-30px",
                            width: "100px", height: "100px", background: "#064e3b",
                            borderRadius: "50%", opacity: 0.5
                        }} />
                        <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: "16px" }}>
                            <div style={{
                                width: "44px", height: "44px", background: "rgba(255,255,255,0.1)",
                                borderRadius: "14px", display: "flex", alignItems: "center",
                                justifyContent: "center", flexShrink: 0
                            }}>
                                <Zap color="#fbbf24" size={22} />
                            </div>
                            <div>
                                <p style={{
                                    fontSize: "11px", fontWeight: "900", color: "#6ee7b7",
                                    textTransform: "uppercase", letterSpacing: "0.15em", margin: "0 0 4px"
                                }}>
                                    সর্বনিম্ন পরিমাণ
                                </p>
                                <p style={{ fontSize: "14px", fontWeight: "700", margin: 0, lineHeight: 1.5 }}>
                                    {accountType} একাউন্ট এর জন্য সর্বনিম্ন{" "}
                                    <span style={{ color: "#fbbf24" }}>{minAmount} টাকা</span> অ্যাড করতে হবে।
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ══════════════════════════════════
                        SUB ADMIN PROMOTIONAL CARD
                    ══════════════════════════════════ */}
                    <div
                        onClick={() => setFormData({ ...formData, amount: "2950" })}
                        style={{
                            background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 60%, #6d28d9 100%)",
                            borderRadius: "24px",
                            padding: "24px",
                            marginBottom: "24px",
                            position: "relative",
                            overflow: "hidden",
                            cursor: "pointer",
                            userSelect: "none"
                        }}
                    >
                        {/* Decorative circles */}
                        <div style={{
                            position: "absolute", top: "-25px", right: "-25px",
                            width: "130px", height: "130px",
                            background: "rgba(255,255,255,0.07)", borderRadius: "50%"
                        }} />
                        <div style={{
                            position: "absolute", bottom: "-35px", left: "45%",
                            width: "90px", height: "90px",
                            background: "rgba(255,255,255,0.05)", borderRadius: "50%"
                        }} />

                        {/* Content row */}
                        <div style={{ position: "relative", zIndex: 1, display: "flex", gap: "18px", alignItems: "flex-start" }}>

                            {/* Crown icon */}
                            <div style={{
                                width: "60px", height: "60px", flexShrink: 0,
                                background: "rgba(255,255,255,0.15)",
                                borderRadius: "20px",
                                display: "flex", alignItems: "center",
                                justifyContent: "center", fontSize: "30px"
                            }}>
                                👑
                            </div>

                            {/* Text block */}
                            <div style={{ flex: 1 }}>
                                <p style={{
                                    fontSize: "18px", fontWeight: "900", color: "white",
                                    margin: "0 0 8px", lineHeight: 1.3
                                }}>
                                    সাব এডমিন হওয়ার সুযোগ!
                                </p>

                                <p style={{
                                    fontSize: "13px", fontWeight: "600",
                                    color: "rgba(255,255,255,0.85)",
                                    margin: "0 0 14px", lineHeight: 1.7
                                }}>
                                    আমাদের একাউন্টে{" "}
                                    <span style={{
                                        background: "rgba(255,255,255,0.2)",
                                        padding: "2px 8px", borderRadius: "6px",
                                        fontWeight: "900", color: "white"
                                    }}>সাব</span>{" "}
                                    <span style={{
                                        background: "rgba(255,255,255,0.2)",
                                        padding: "2px 8px", borderRadius: "6px",
                                        fontWeight: "900", color: "white"
                                    }}>এডমিন</span>{" "}
                                    নিতে চাইলে মাত্র
                                </p>

                                {/* Price */}
                                <div style={{
                                    display: "flex", alignItems: "baseline",
                                    gap: "4px", marginBottom: "8px"
                                }}>
                                    <span style={{
                                        fontSize: "40px", fontWeight: "900", color: "white",
                                        letterSpacing: "-0.02em", lineHeight: 1
                                    }}>
                                        ২,৯৫০
                                    </span>
                                    <span style={{
                                        fontSize: "24px", fontWeight: "900",
                                        color: "rgba(255,255,255,0.9)"
                                    }}>
                                        ৳
                                    </span>
                                </div>

                                <p style={{
                                    fontSize: "12px", fontWeight: "700",
                                    color: "rgba(255,255,255,0.75)", margin: 0
                                }}>
                                    একবার যোগ করুন — সারাজীবন সুবিধা উপভোগ করুন
                                </p>
                            </div>
                        </div>

                        {/* Auto-fill hint bar */}
                        <div style={{
                            position: "relative", zIndex: 1,
                            marginTop: "18px",
                            background: "rgba(255,255,255,0.15)",
                            borderRadius: "14px",
                            padding: "10px 16px",
                            textAlign: "center",
                            border: "1px solid rgba(255,255,255,0.2)"
                        }}>
                            <p style={{
                                fontSize: "12px", fontWeight: "800",
                                color: "white", margin: 0, letterSpacing: "0.04em"
                            }}>
                                ✨ এখানে ট্যাপ করলে Amount অটো ফিলআপ হবে
                            </p>
                        </div>
                    </div>
                    {/* ══════════════════════════════════ */}

                    {/* Method Tabs */}
                    <div style={{
                        display: "flex", background: "rgba(236,253,245,0.5)",
                        padding: "6px", borderRadius: "24px",
                        marginBottom: "24px", border: "1px solid #d1fae5"
                    }}>
                        {(["bKash", "Nagad"] as const).map((m) => (
                            <button
                                key={m}
                                onClick={() => setMethod(m)}
                                style={{
                                    flex: 1, padding: "14px", borderRadius: "18px", border: "none",
                                    background: method === m ? "#059669" : "transparent",
                                    color: method === m ? "white" : "#065f46",
                                    cursor: "pointer", fontWeight: "900", fontSize: "14px",
                                    transition: "all 0.3s ease",
                                    boxShadow: method === m ? "0 8px 20px rgba(5,150,105,0.3)" : "none"
                                }}
                            >
                                {m === "bKash" ? "bKash বিকাশ" : "Nagad নগদ"}
                            </button>
                        ))}
                    </div>

                    {/* Payment Number Card */}
                    <div style={{
                        background: "#f0fdf4", border: "2px solid #d1fae5",
                        padding: "24px", borderRadius: "24px",
                        marginBottom: "32px", textAlign: "center"
                    }}>
                        <p style={{
                            color: "#059669", fontSize: "11px", fontWeight: "900",
                            textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "12px"
                        }}>
                            {method} Personal Number
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
                            <span style={{
                                fontSize: "clamp(24px, 5vw, 36px)", fontWeight: "900",
                                color: "#022c22", letterSpacing: "-0.03em"
                            }}>
                                {paymentNumbers[method]}
                            </span>
                            <button
                                onClick={() => handleCopy(paymentNumbers[method], method)}
                                style={{
                                    display: "flex", alignItems: "center", gap: "8px",
                                    background: "white",
                                    border: `2px solid ${copied === method ? "#059669" : "#d1fae5"}`,
                                    padding: "10px 24px", borderRadius: "16px",
                                    fontSize: "14px", fontWeight: "900",
                                    color: copied === method ? "#059669" : "#065f46",
                                    cursor: "pointer", transition: "all 0.3s ease"
                                }}
                            >
                                {copied === method
                                    ? <><CheckCircle size={16} /> Copied!</>
                                    : <><Copy size={16} /> Copy Number</>
                                }
                            </button>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

                        {/* Sender Number */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <label style={{ fontSize: "11px", fontWeight: "900", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.15em" }}>
                                প্রেরকের নম্বর (যেখান থেকে টাকা পাঠিয়েছেন)
                            </label>
                            <div style={{ position: "relative" }}>
                                <Smartphone size={18} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "rgba(5,150,105,0.5)" }} />
                                <input
                                    type="tel" required placeholder="01XXXXXXXXX"
                                    style={{
                                        width: "100%", paddingLeft: "48px", paddingRight: "16px",
                                        paddingTop: "16px", paddingBottom: "16px",
                                        borderRadius: "16px", border: "2px solid #ecfdf5",
                                        outline: "none", background: "#f9fafb",
                                        fontWeight: "700", fontSize: "14px", color: "#022c22",
                                        boxSizing: "border-box", transition: "border-color 0.2s"
                                    }}
                                    onFocus={e => (e.currentTarget.style.borderColor = "#059669")}
                                    onBlur={e => (e.currentTarget.style.borderColor = "#ecfdf5")}
                                    value={formData.senderNumber}
                                    onChange={(e) => setFormData({ ...formData, senderNumber: e.target.value })}
                                />
                            </div>
                        </div>

                       

                        {/* Transaction ID */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <label style={{ fontSize: "11px", fontWeight: "900", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.15em" }}>
                                Transaction ID (TrxID)
                            </label>
                            <div style={{ position: "relative" }}>
                                <Hash size={18} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "rgba(5,150,105,0.5)" }} />
                                <input
                                    type="text" required placeholder="বিকাশ/নগদ এর মেসেজ থেকে TrxID দিন"
                                    style={{
                                        width: "100%", paddingLeft: "48px", paddingRight: "16px",
                                        paddingTop: "16px", paddingBottom: "16px",
                                        borderRadius: "16px", border: "2px solid #ecfdf5",
                                        outline: "none", background: "#f9fafb",
                                        fontWeight: "700", fontSize: "14px", color: "#022c22",
                                        boxSizing: "border-box", textTransform: "uppercase",
                                        transition: "border-color 0.2s"
                                    }}
                                    onFocus={e => (e.currentTarget.style.borderColor = "#059669")}
                                    onBlur={e => (e.currentTarget.style.borderColor = "#ecfdf5")}
                                    value={formData.transactionId}
                                    onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Amount */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <label style={{ fontSize: "11px", fontWeight: "900", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.15em" }}>
                                Amount (টাকা)
                            </label>
                            <input
                                type="number" required placeholder={`সর্বনিম্ন ${minAmount} টাকা`}
                                style={{
                                    width: "100%", padding: "16px",
                                    borderRadius: "16px", border: "2px solid #ecfdf5",
                                    outline: "none", background: "#f9fafb",
                                    fontWeight: "700", fontSize: "14px", color: "#022c22",
                                    boxSizing: "border-box", transition: "border-color 0.2s"
                                }}
                                onFocus={e => (e.currentTarget.style.borderColor = "#059669")}
                                onBlur={e => (e.currentTarget.style.borderColor = "#ecfdf5")}
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            />
                        </div>

                        {/* Error */}
                        {error && (
                            <p style={{
                                color: "#dc2626", fontSize: "14px", textAlign: "center",
                                fontWeight: "700", background: "#fef2f2",
                                padding: "12px 16px", borderRadius: "12px",
                                border: "1px solid #fecaca", margin: 0
                            }}>
                                {error}
                            </p>
                        )}

                        {/* Submit Button */}
                        <div style={{ paddingTop: "8px" }}>
                            <button
                                type="submit"
                                disabled={submitting}
                                style={{
                                    width: "100%", padding: "20px",
                                    background: "#059669", color: "white",
                                    border: "none", borderRadius: "24px",
                                    fontWeight: "900", fontSize: "17px",
                                    cursor: submitting ? "not-allowed" : "pointer",
                                    opacity: submitting ? 0.7 : 1,
                                    display: "flex", alignItems: "center",
                                    justifyContent: "center", gap: "10px",
                                    boxShadow: "0 15px 30px rgba(5,150,105,0.3)",
                                    transition: "all 0.3s ease"
                                }}
                            >
                                {submitting ? (
                                    <div style={{
                                        width: "24px", height: "24px",
                                        border: "3px solid rgba(255,255,255,0.4)",
                                        borderTop: "3px solid white",
                                        borderRadius: "50%",
                                        animation: "spin 0.8s linear infinite"
                                    }} />
                                ) : (
                                    <><ShieldCheck size={24} /> পেমেন্ট সাবমিট করুন</>
                                )}
                            </button>
                            <p style={{
                                textAlign: "center", fontSize: "10px", fontWeight: "700",
                                color: "#9ca3af", marginTop: "16px",
                                textTransform: "uppercase", letterSpacing: "0.2em"
                            }}>
                                নিরাপদ ও এনক্রিপ্টেড পেমেন্ট গেটওয়ে
                            </p>
                        </div>

                        {/* Cancel */}
                        <button
                            type="button"
                            onClick={() => router.push("/dashboard")}
                            style={{
                                background: "transparent", border: "2px solid #d1fae5",
                                color: "#6b7280", padding: "14px", borderRadius: "16px",
                                cursor: "pointer", fontSize: "14px", fontWeight: "700",
                                transition: "all 0.3s ease"
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.borderColor = "#059669";
                                e.currentTarget.style.color = "#059669";
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.borderColor = "#d1fae5";
                                e.currentTarget.style.color = "#6b7280";
                            }}
                        >
                            রিচার্জ করতে চাই না, ড্যাশবোর্ডে ফিরে যান
                        </button>
                    </form>
                </div>
            </div>

            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </main>
    );
}