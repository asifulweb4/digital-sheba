"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Copy, CheckCircle, Smartphone, Hash, Wallet, Zap, ShieldCheck, AlertTriangle, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { addBalanceAction } from "@/lib/actions";
import {  withdrawBalanceAction } from "@/lib/actions";

// Replace with your real withdraw action:
// import { withdrawBalanceAction } from "@/lib/actions";

export default function RechargePage() {
    const router = useRouter();

    // "recharge" or "withdraw"
    const [tab, setTab] = useState<"recharge" | "withdraw">("recharge");

    // ── Recharge state ──
    const [accountType, setAccountType] = useState<"Personal" | "Business">("Personal");
    const [rechargeForm, setRechargeForm] = useState({
        senderNumber: "",
        gmail: "",
        transactionId: "",
        amount: ""
    });
    const [rechargeError, setRechargeError] = useState("");
    const [rechargeMethod, setRechargeMethod] = useState<"bKash" | "Nagad">("bKash");
    const [rechargeCopied, setRechargeCopied] = useState<string | null>(null);
    const [rechargeSubmitting, setRechargeSubmitting] = useState(false);

    // ── Withdraw state ──
    const [withdrawMethod, setWithdrawMethod] = useState<"bKash" | "Nagad">("bKash");
    const [withdrawForm, setWithdrawForm] = useState({
        receiverNumber: "",
        amount: ""
    });
    const [withdrawError, setWithdrawError] = useState("");
    const [withdrawSubmitting, setWithdrawSubmitting] = useState(false);

    // ── Constants ──
    const minRecharge = accountType === "Personal" ? 500 : 1450;
    const minWithdraw = 200;
    const maxWithdraw = 10000;

    const paymentNumbers = {
        bKash: "01333379358",
        Nagad: ""
    };

    // ── Handlers ──
    const handleCopy = (num: string, type: string) => {
        navigator.clipboard.writeText(num);
        setRechargeCopied(type);
        setTimeout(() => setRechargeCopied(null), 2000);
    };

    const handleRechargeSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setRechargeError("");

        const amountNum = parseFloat(rechargeForm.amount);
        if (amountNum < minRecharge) {
            setRechargeError(`${accountType} একাউন্ট এর জন্য সর্বনিম্ন ${minRecharge} টাকা রিচার্জ করতে হবে।`);
            return;
        }

        setRechargeSubmitting(true);

        const res = await addBalanceAction(
            amountNum,
            rechargeForm.transactionId.trim().toUpperCase(),
            rechargeMethod,
            `Recharge: ${accountType}, Sender: ${rechargeForm.senderNumber}, Gmail: ${rechargeForm.gmail}`
        );

        setRechargeSubmitting(false);

        if (!res.success) {
            setRechargeError(res.message || "এই TrxID টি আগে ব্যবহার হয়েছে অথবা ভুল!");
        } else {
            alert("✅ পেমেন্ট রিকোয়েস্ট সাবমিট হয়েছে! এডমিন ভেরিফাই করার পর আপনার ব্যালেন্স যোগ হবে।");
            setRechargeForm({ senderNumber: "", gmail: "", transactionId: "", amount: "" });
            router.push("/dashboard");
        }
    };

    const handleWithdrawSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setWithdrawError("");

        const amountNum = parseFloat(withdrawForm.amount);
        if (isNaN(amountNum) || amountNum < minWithdraw) {
            setWithdrawError(`সর্বনিম্ন উইথড্র পরিমাণ ${minWithdraw} টাকা।`);
            return;
        }
        if (amountNum > maxWithdraw) {
            setWithdrawError(`একসাথে সর্বোচ্চ ${maxWithdraw} টাকা উইথড্র করা যাবে।`);
            return;
        }

        setWithdrawSubmitting(true);

        // ── Replace with your real action ──
        const res = await withdrawBalanceAction(amountNum, withdrawMethod, withdrawForm.receiverNumber.trim());
        
        // ────────────────────────────────────

        setWithdrawSubmitting(false);

        if (!res.success) {
            setWithdrawError(res.message || "উইথড্র রিকোয়েস্ট ব্যর্থ হয়েছে। আবার চেষ্টা করুন।");
        } else {
            alert("✅ উইথড্র রিকোয়েস্ট সাবমিট হয়েছে! এডমিন ভেরিফাই করার পর আপনার নম্বরে টাকা পাঠানো হবে।");
            setWithdrawForm({ receiverNumber: "", amount: "" });
            router.push("/dashboard");
        }
    };

    // ── Shared styles ──
    const inputStyle: React.CSSProperties = {
        width: "100%", paddingLeft: "48px", paddingRight: "16px",
        paddingTop: "16px", paddingBottom: "16px",
        borderRadius: "16px", border: "2px solid #ecfdf5",
        outline: "none", background: "#f9fafb",
        fontWeight: "700", fontSize: "14px", color: "#022c22",
        boxSizing: "border-box", transition: "border-color 0.2s"
    };

    const labelStyle: React.CSSProperties = {
        fontSize: "11px", fontWeight: "900", color: "#9ca3af",
        textTransform: "uppercase", letterSpacing: "0.15em"
    };

    return (
        <main style={{ minHeight: "100vh", background: "#f6fdf9" }}>
            <div style={{ maxWidth: "680px", margin: "0 auto", padding: "clamp(24px, 5vw, 60px) 16px 100px" }}>

                {/* ── Back Button ── */}
                <button
                    onClick={() => router.push("/dashboard")}
                    style={{
                        display: "flex", alignItems: "center", gap: "8px",
                        color: "#065f46", background: "none", border: "none",
                        cursor: "pointer", fontWeight: "800", fontSize: "14px",
                        marginBottom: "24px", transition: "color 0.2s"
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#059669")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#065f46")}
                >
                    <ArrowLeft size={18} />
                    ড্যাশবোর্ডে ফিরে যান
                </button>

                {/* ── Header ── */}
                <div style={{ textAlign: "center", marginBottom: "40px" }}>
                    <div style={{
                        width: "80px", height: "80px",
                        background: tab === "recharge"
                            ? "#059669"
                            : "linear-gradient(135deg, #0369a1 0%, #0284c7 100%)",
                        borderRadius: "32px", display: "flex", alignItems: "center",
                        justifyContent: "center", margin: "0 auto 24px",
                        boxShadow: tab === "recharge"
                            ? "0 20px 40px rgba(5,150,105,0.25)"
                            : "0 20px 40px rgba(3,105,161,0.25)",
                        transition: "all 0.4s ease"
                    }}>
                        {tab === "recharge"
                            ? <Wallet size={32} color="white" />
                            : <ArrowDownCircle size={32} color="white" />
                        }
                    </div>
                    <h1 style={{
                        fontSize: "clamp(26px, 5vw, 36px)", fontWeight: "900",
                        color: "#022c22", margin: "0 0 12px", transition: "all 0.3s"
                    }}>
                        {tab === "recharge" ? "ব্যালেন্স রিচার্জ করুন" : "টাকা উইথড্র করুন"}
                    </h1>
                    <p style={{ color: "#6b7280", fontWeight: "700", fontSize: "14px", margin: 0 }}>
                        {tab === "recharge"
                            ? "আপনার একাউন্টে ব্যালেন্স যোগ করতে নিচের ফর্মটি পূরণ করুন"
                            : "আপনার ব্যালেন্স থেকে bKash বা Nagad এ টাকা উইথড্র করুন"
                        }
                    </p>
                </div>

                {/* ══════════════════════════════════
                    MAIN TAB SWITCHER
                ══════════════════════════════════ */}
                <div style={{
                    display: "flex", background: "white",
                    padding: "6px", borderRadius: "28px",
                    marginBottom: "28px",
                    border: "1px solid #d1fae5",
                    boxShadow: "0 4px 20px rgba(2,44,34,0.06)"
                }}>
                    <button
                        onClick={() => setTab("recharge")}
                        style={{
                            flex: 1, padding: "16px", borderRadius: "22px", border: "none",
                            background: tab === "recharge" ? "#059669" : "transparent",
                            color: tab === "recharge" ? "white" : "#065f46",
                            cursor: "pointer", fontWeight: "900", fontSize: "14px",
                            transition: "all 0.3s ease",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                            boxShadow: tab === "recharge" ? "0 8px 20px rgba(5,150,105,0.3)" : "none"
                        }}
                    >
                        <ArrowUpCircle size={18} />
                        রিচার্জ করুন
                    </button>
                    <button
                        onClick={() => setTab("withdraw")}
                        style={{
                            flex: 1, padding: "16px", borderRadius: "22px", border: "none",
                            background: tab === "withdraw"
                                ? "linear-gradient(135deg, #0369a1 0%, #0284c7 100%)"
                                : "transparent",
                            color: tab === "withdraw" ? "white" : "#065f46",
                            cursor: "pointer", fontWeight: "900", fontSize: "14px",
                            transition: "all 0.3s ease",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                            boxShadow: tab === "withdraw" ? "0 8px 20px rgba(3,105,161,0.3)" : "none"
                        }}
                    >
                        <ArrowDownCircle size={18} />
                        উইথড্র করুন
                    </button>
                </div>

                {/* ── Main Card ── */}
                <div style={{
                    background: "white", borderRadius: "48px",
                    padding: "clamp(24px, 5vw, 40px)",
                    boxShadow: "0 25px 50px rgba(2,44,34,0.05)",
                    border: "1px solid #ecfdf5"
                }}>

                    {/* ════════════════════════════════
                        RECHARGE TAB
                    ════════════════════════════════ */}
                    {tab === "recharge" && (
                        <>
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
                                            <span style={{ color: "#fbbf24" }}>{minRecharge} টাকা</span> অ্যাড করতে হবে।
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Sub Admin Promo Card */}
                            <div
                                onClick={() => setRechargeForm({ ...rechargeForm, amount: "2950" })}
                                style={{
                                    background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 60%, #6d28d9 100%)",
                                    borderRadius: "24px", padding: "24px", marginBottom: "24px",
                                    position: "relative", overflow: "hidden", cursor: "pointer", userSelect: "none"
                                }}
                            >
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
                                <div style={{ position: "relative", zIndex: 1, display: "flex", gap: "18px", alignItems: "flex-start" }}>
                                    <div style={{
                                        width: "60px", height: "60px", flexShrink: 0,
                                        background: "rgba(255,255,255,0.15)", borderRadius: "20px",
                                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: "30px"
                                    }}>
                                        👑
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: "18px", fontWeight: "900", color: "white", margin: "0 0 8px", lineHeight: 1.3 }}>
                                            সাব এডমিন হওয়ার সুযোগ!
                                        </p>
                                        <p style={{ fontSize: "13px", fontWeight: "600", color: "rgba(255,255,255,0.85)", margin: "0 0 14px", lineHeight: 1.7 }}>
                                            আমাদের একাউন্টে{" "}
                                            <span style={{ background: "rgba(255,255,255,0.2)", padding: "2px 8px", borderRadius: "6px", fontWeight: "900", color: "white" }}>সাব</span>{" "}
                                            <span style={{ background: "rgba(255,255,255,0.2)", padding: "2px 8px", borderRadius: "6px", fontWeight: "900", color: "white" }}>এডমিন</span>{" "}
                                            নিতে চাইলে মাত্র
                                        </p>
                                        <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "8px", flexWrap: "wrap" }}>
                                            <span style={{ fontSize: "clamp(32px, 8vw, 40px)", fontWeight: "900", color: "white", letterSpacing: "-0.02em", lineHeight: 1 }}>
                                                ২,৯৫০
                                            </span>
                                            <span style={{ fontSize: "clamp(20px, 5vw, 24px)", fontWeight: "900", color: "rgba(255,255,255,0.9)" }}>৳</span>
                                        </div>
                                        <p style={{ fontSize: "12px", fontWeight: "700", color: "rgba(255,255,255,0.75)", margin: 0 }}>
                                            একবার যোগ করুন — সারাজীবন সুবিধা উপভোগ করুন
                                        </p>
                                    </div>
                                </div>
                                <div style={{
                                    position: "relative", zIndex: 1, marginTop: "18px",
                                    background: "rgba(255,255,255,0.15)", borderRadius: "14px",
                                    padding: "10px 16px", textAlign: "center",
                                    border: "1px solid rgba(255,255,255,0.2)"
                                }}>
                                    <p style={{ fontSize: "12px", fontWeight: "800", color: "white", margin: 0, letterSpacing: "0.04em" }}>
                                        ✨ এখানে ট্যাপ করলে Amount অটো ফিলআপ হবে
                                    </p>
                                </div>
                            </div>

                            {/* Method Tabs */}
                            <div style={{
                                display: "flex", background: "rgba(236,253,245,0.5)",
                                padding: "6px", borderRadius: "24px",
                                marginBottom: "24px", border: "1px solid #d1fae5"
                            }}>
                                {(["bKash", "Nagad"] as const).map((m) => (
                                    <button
                                        key={m}
                                        onClick={() => setRechargeMethod(m)}
                                        style={{
                                            flex: 1, padding: "14px", borderRadius: "18px", border: "none",
                                            background: rechargeMethod === m ? "#059669" : "transparent",
                                            color: rechargeMethod === m ? "white" : "#065f46",
                                            cursor: "pointer", fontWeight: "900", fontSize: "14px",
                                            transition: "all 0.3s ease",
                                            boxShadow: rechargeMethod === m ? "0 8px 20px rgba(5,150,105,0.3)" : "none"
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
                                    {rechargeMethod} Personal Number
                                </p>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
                                    <span style={{ fontSize: "clamp(24px, 5vw, 36px)", fontWeight: "900", color: "#022c22", letterSpacing: "-0.03em" }}>
                                        {paymentNumbers[rechargeMethod]}
                                    </span>
                                    <button
                                        onClick={() => handleCopy(paymentNumbers[rechargeMethod], rechargeMethod)}
                                        style={{
                                            display: "flex", alignItems: "center", gap: "8px", background: "white",
                                            border: `2px solid ${rechargeCopied === rechargeMethod ? "#059669" : "#d1fae5"}`,
                                            padding: "10px 24px", borderRadius: "16px", fontSize: "14px", fontWeight: "900",
                                            color: rechargeCopied === rechargeMethod ? "#059669" : "#065f46",
                                            cursor: "pointer", transition: "all 0.3s ease"
                                        }}
                                    >
                                        {rechargeCopied === rechargeMethod
                                            ? <><CheckCircle size={16} /> Copied!</>
                                            : <><Copy size={16} /> Copy Number</>
                                        }
                                    </button>
                                </div>
                            </div>

                            {/* Recharge Form */}
                            <form onSubmit={handleRechargeSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                                {/* Sender Number */}
                                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                    <label style={labelStyle}>প্রেরকের নম্বর (যেখান থেকে টাকা পাঠিয়েছেন)</label>
                                    <div style={{ position: "relative" }}>
                                        <Smartphone size={18} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "rgba(5,150,105,0.5)" }} />
                                        <input
                                            type="tel" required placeholder="01XXXXXXXXX"
                                            style={inputStyle}
                                            onFocus={e => (e.currentTarget.style.borderColor = "#059669")}
                                            onBlur={e => (e.currentTarget.style.borderColor = "#ecfdf5")}
                                            value={rechargeForm.senderNumber}
                                            onChange={(e) => setRechargeForm({ ...rechargeForm, senderNumber: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Transaction ID */}
                                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                    <label style={labelStyle}>Transaction ID (TrxID)</label>
                                    <div style={{ position: "relative" }}>
                                        <Hash size={18} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "rgba(5,150,105,0.5)" }} />
                                        <input
                                            type="text" required placeholder="বিকাশ/নগদ এর মেসেজ থেকে TrxID দিন"
                                            style={{ ...inputStyle, textTransform: "uppercase" }}
                                            onFocus={e => (e.currentTarget.style.borderColor = "#059669")}
                                            onBlur={e => (e.currentTarget.style.borderColor = "#ecfdf5")}
                                            value={rechargeForm.transactionId}
                                            onChange={(e) => setRechargeForm({ ...rechargeForm, transactionId: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Amount */}
                                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                    <label style={labelStyle}>Amount (টাকা)</label>
                                    <input
                                        type="number" required placeholder={`সর্বনিম্ন ${minRecharge} টাকা`}
                                        style={{ ...inputStyle, paddingLeft: "16px" }}
                                        onFocus={e => (e.currentTarget.style.borderColor = "#059669")}
                                        onBlur={e => (e.currentTarget.style.borderColor = "#ecfdf5")}
                                        value={rechargeForm.amount}
                                        onChange={(e) => setRechargeForm({ ...rechargeForm, amount: e.target.value })}
                                    />
                                </div>

                                {rechargeError && (
                                    <p style={{
                                        color: "#dc2626", fontSize: "14px", textAlign: "center",
                                        fontWeight: "700", background: "#fef2f2",
                                        padding: "12px 16px", borderRadius: "12px",
                                        border: "1px solid #fecaca", margin: 0
                                    }}>
                                        {rechargeError}
                                    </p>
                                )}

                                <div style={{ paddingTop: "8px" }}>
                                    <button
                                        type="submit" disabled={rechargeSubmitting}
                                        style={{
                                            width: "100%", padding: "20px",
                                            background: "#059669", color: "white",
                                            border: "none", borderRadius: "24px",
                                            fontWeight: "900", fontSize: "17px",
                                            cursor: rechargeSubmitting ? "not-allowed" : "pointer",
                                            opacity: rechargeSubmitting ? 0.7 : 1,
                                            display: "flex", alignItems: "center",
                                            justifyContent: "center", gap: "10px",
                                            boxShadow: "0 15px 30px rgba(5,150,105,0.3)",
                                            transition: "all 0.3s ease"
                                        }}
                                    >
                                        {rechargeSubmitting
                                            ? <div style={{ width: "24px", height: "24px", border: "3px solid rgba(255,255,255,0.4)", borderTop: "3px solid white", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                                            : <><ShieldCheck size={24} /> পেমেন্ট সাবমিট করুন</>
                                        }
                                    </button>
                                    <p style={{ textAlign: "center", fontSize: "10px", fontWeight: "700", color: "#9ca3af", marginTop: "16px", textTransform: "uppercase", letterSpacing: "0.2em" }}>
                                        নিরাপদ ও এনক্রিপ্টেড পেমেন্ট গেটওয়ে
                                    </p>
                                </div>

                                <button
                                    type="button" onClick={() => router.push("/dashboard")}
                                    style={{
                                        background: "transparent", border: "2px solid #d1fae5",
                                        color: "#6b7280", padding: "14px", borderRadius: "16px",
                                        cursor: "pointer", fontSize: "14px", fontWeight: "700", transition: "all 0.3s ease"
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#059669"; e.currentTarget.style.color = "#059669"; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#d1fae5"; e.currentTarget.style.color = "#6b7280"; }}
                                >
                                    রিচার্জ করতে চাই না, ড্যাশবোর্ডে ফিরে যান
                                </button>
                            </form>
                        </>
                    )}

                    {/* ════════════════════════════════
                        WITHDRAW TAB
                    ════════════════════════════════ */}
                    {tab === "withdraw" && (
                        <>
                            {/* Limit Notice */}
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
                                        <p style={{ fontSize: "11px", fontWeight: "900", color: "#6ee7b7", textTransform: "uppercase", letterSpacing: "0.15em", margin: "0 0 4px" }}>
                                            উইথড্র সীমা
                                        </p>
                                        <p style={{ fontSize: "14px", fontWeight: "700", margin: 0, lineHeight: 1.6 }}>
                                            সর্বনিম্ন <span style={{ color: "#fbbf24" }}>{minWithdraw} টাকা</span> — সর্বোচ্চ <span style={{ color: "#fbbf24" }}>{maxWithdraw} টাকা</span> একসাথে উইথড্র করা যাবে।
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Warning */}
                            <div style={{
                                background: "#fffbeb", border: "2px solid #fde68a",
                                borderRadius: "20px", padding: "16px 20px", marginBottom: "24px",
                                display: "flex", alignItems: "flex-start", gap: "12px"
                            }}>
                                <AlertTriangle size={20} color="#d97706" style={{ flexShrink: 0, marginTop: "2px" }} />
                                <p style={{ fontSize: "13px", fontWeight: "700", color: "#92400e", margin: 0, lineHeight: 1.6 }}>
                                    উইথড্র রিকোয়েস্ট সাবমিটের পর এডমিন ভেরিফাই করবেন।{" "}
                                    <span style={{ color: "#b45309" }}>১–২৪ ঘণ্টার মধ্যে</span> আপনার নম্বরে টাকা পাঠানো হবে।
                                </p>
                            </div>

                            {/* Method Tabs */}
                            <div style={{
                                display: "flex", background: "rgba(236,253,245,0.5)",
                                padding: "6px", borderRadius: "24px",
                                marginBottom: "32px", border: "1px solid #d1fae5"
                            }}>
                                {(["bKash", "Nagad"] as const).map((m) => (
                                    <button
                                        key={m}
                                        onClick={() => setWithdrawMethod(m)}
                                        style={{
                                            flex: 1, padding: "14px", borderRadius: "18px", border: "none",
                                            background: withdrawMethod === m ? "#059669" : "transparent",
                                            color: withdrawMethod === m ? "white" : "#065f46",
                                            cursor: "pointer", fontWeight: "900", fontSize: "14px",
                                            transition: "all 0.3s ease",
                                            boxShadow: withdrawMethod === m ? "0 8px 20px rgba(5,150,105,0.3)" : "none"
                                        }}
                                    >
                                        {m === "bKash" ? "bKash বিকাশ" : "Nagad নগদ"}
                                    </button>
                                ))}
                            </div>

                            {/* Withdraw Form */}
                            <form onSubmit={handleWithdrawSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                                {/* Receiver Number */}
                                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                    <label style={labelStyle}>{withdrawMethod} নম্বর (যেখানে টাকা পাঠাতে চান)</label>
                                    <div style={{ position: "relative" }}>
                                        <Smartphone size={18} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "rgba(5,150,105,0.5)" }} />
                                        <input
                                            type="tel" required placeholder="01XXXXXXXXX"
                                            style={inputStyle}
                                            onFocus={e => (e.currentTarget.style.borderColor = "#059669")}
                                            onBlur={e => (e.currentTarget.style.borderColor = "#ecfdf5")}
                                            value={withdrawForm.receiverNumber}
                                            onChange={(e) => setWithdrawForm({ ...withdrawForm, receiverNumber: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Amount */}
                                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                    <label style={labelStyle}>Amount (টাকা)</label>
                                    <input
                                        type="number" required placeholder={`সর্বনিম্ন ${minWithdraw} টাকা`}
                                        style={{ ...inputStyle, paddingLeft: "16px" }}
                                        onFocus={e => (e.currentTarget.style.borderColor = "#059669")}
                                        onBlur={e => (e.currentTarget.style.borderColor = "#ecfdf5")}
                                        value={withdrawForm.amount}
                                        onChange={(e) => setWithdrawForm({ ...withdrawForm, amount: e.target.value })}
                                    />
                                </div>

                                {/* Quick Amount Buttons */}
                                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                    <label style={labelStyle}>দ্রুত পরিমাণ বেছে নিন</label>
                                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                        {[500, 1000, 2000, 5000].map((amt) => (
                                            <button
                                                key={amt} type="button"
                                                onClick={() => setWithdrawForm({ ...withdrawForm, amount: String(amt) })}
                                                style={{
                                                    padding: "10px 20px", borderRadius: "14px",
                                                    border: `2px solid ${withdrawForm.amount === String(amt) ? "#059669" : "#d1fae5"}`,
                                                    background: withdrawForm.amount === String(amt) ? "#ecfdf5" : "white",
                                                    color: withdrawForm.amount === String(amt) ? "#059669" : "#6b7280",
                                                    fontWeight: "800", fontSize: "13px",
                                                    cursor: "pointer", transition: "all 0.2s ease"
                                                }}
                                            >
                                                ৳{amt}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {withdrawError && (
                                    <p style={{
                                        color: "#dc2626", fontSize: "14px", textAlign: "center",
                                        fontWeight: "700", background: "#fef2f2",
                                        padding: "12px 16px", borderRadius: "12px",
                                        border: "1px solid #fecaca", margin: 0
                                    }}>
                                        {withdrawError}
                                    </p>
                                )}

                                <div style={{ paddingTop: "8px" }}>
                                    <button
                                        type="submit" disabled={withdrawSubmitting}
                                        style={{
                                            width: "100%", padding: "20px",
                                            background: "linear-gradient(135deg, #0369a1 0%, #0284c7 100%)",
                                            color: "white", border: "none", borderRadius: "24px",
                                            fontWeight: "900", fontSize: "17px",
                                            cursor: withdrawSubmitting ? "not-allowed" : "pointer",
                                            opacity: withdrawSubmitting ? 0.7 : 1,
                                            display: "flex", alignItems: "center",
                                            justifyContent: "center", gap: "10px",
                                            boxShadow: "0 15px 30px rgba(3,105,161,0.3)",
                                            transition: "all 0.3s ease"
                                        }}
                                    >
                                        {withdrawSubmitting
                                            ? <div style={{ width: "24px", height: "24px", border: "3px solid rgba(255,255,255,0.4)", borderTop: "3px solid white", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                                            : <><ShieldCheck size={24} /> উইথড্র রিকোয়েস্ট করুন</>
                                        }
                                    </button>
                                    <p style={{ textAlign: "center", fontSize: "10px", fontWeight: "700", color: "#9ca3af", marginTop: "16px", textTransform: "uppercase", letterSpacing: "0.2em" }}>
                                        নিরাপদ ও এনক্রিপ্টেড পেমেন্ট গেটওয়ে
                                    </p>
                                </div>

                                <button
                                    type="button" onClick={() => router.push("/dashboard")}
                                    style={{
                                        background: "transparent", border: "2px solid #d1fae5",
                                        color: "#6b7280", padding: "14px", borderRadius: "16px",
                                        cursor: "pointer", fontSize: "14px", fontWeight: "700", transition: "all 0.3s ease"
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#059669"; e.currentTarget.style.color = "#059669"; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#d1fae5"; e.currentTarget.style.color = "#6b7280"; }}
                                >
                                    উইথড্র করতে চাই না, ড্যাশবোর্ডে ফিরে যান
                                </button>
                            </form>
                        </>
                    )}
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