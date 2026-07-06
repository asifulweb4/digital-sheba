"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Copy, CheckCircle, Smartphone, Hash, Wallet, Zap, ShieldCheck, AlertTriangle, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { addBalanceAction } from "@/lib/actions";
import { withdrawBalanceAction } from "@/lib/actions";

export default function RechargePage() {
    const router = useRouter();

    const [tab, setTab] = useState<"recharge" | "withdraw">("recharge");
    const [view, setView] = useState<"main" | "subAdmin">("main");
    const [accountType, setAccountType] = useState<"Personal" | "Business" | "SubAdmin">("Personal");

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

    const [withdrawMethod, setWithdrawMethod] = useState<"bKash" | "Nagad">("bKash");
    const [withdrawForm, setWithdrawForm] = useState({ receiverNumber: "", amount: "" });
    const [withdrawError, setWithdrawError] = useState("");
    const [withdrawSubmitting, setWithdrawSubmitting] = useState(false);

    const minRecharge = accountType === "Personal" ? 500 : 1450;
    const minWithdraw = 200;
    const maxWithdraw = 10000;

    const paymentNumbers = {
        bKash: "01349739116",
        Nagad: "01625400505"
    };

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
            setRechargeError(`${accountType === "SubAdmin" ? "Business" : accountType} একাউন্ট এর জন্য সর্বনিম্ন ${minRecharge} টাকা রিচার্জ করতে হবে।`);
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

    const handleSubAdminSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setRechargeError("");
        setRechargeSubmitting(true);
        const res = await addBalanceAction(
            2950,
            rechargeForm.transactionId.trim().toUpperCase(),
            rechargeMethod,
            `Sub Admin Recharge, Sender: ${rechargeForm.senderNumber}, Gmail: ${rechargeForm.gmail}`
        );
        setRechargeSubmitting(false);
        if (!res.success) {
            setRechargeError(res.message || "এই TrxID টি আগে ব্যবহার হয়েছে অথবা ভুল!");
        } else {
            alert("✅ পেমেন্ট রিকোয়েস্ট সাবমিট হয়েছে! ভেরিফিকেশন সফল হলে আপনার একাউন্ট সাব এডমিন হয়ে যাবে।");
            setAccountType("SubAdmin");
            setRechargeForm({ senderNumber: "", gmail: "", transactionId: "", amount: "" });
            setView("main");
            router.push("/dashboard");
        }
    };

    const handleWithdrawSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setWithdrawError("");
        if (accountType === "Personal") {
            setWithdrawError("দুঃখিত, পার্সোনাল অ্যাকাউন্ট থেকে উইথড্র করা সম্ভব নয়।");
            return;
        }
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
        const res = await withdrawBalanceAction(amountNum, withdrawMethod, withdrawForm.receiverNumber.trim());
        setWithdrawSubmitting(false);
        if (!res.success) {
            setWithdrawError(res.message || "উইথড্র রিকোয়েস্ট ব্যর্থ হয়েছে। আবার চেষ্টা করুন।");
        } else {
            alert("✅ উইথড্র রিকোয়েস্ট সাবমিটের সাথে সাথে আপনার ওয়ালেটে টাকা যোগ হবে");
            setWithdrawForm({ receiverNumber: "", amount: "" });
            router.push("/dashboard");
        }
    };

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
        textTransform: "uppercase", letterSpacing: "0.15em",
        marginBottom: "8px", display: "block"
    };

    return (
        <main style={{ minHeight: "100vh", background: "#f6fdf9" }}>
            <div style={{ maxWidth: "680px", margin: "0 auto", padding: "clamp(24px, 5vw, 60px) 16px 100px" }}>

                {view === "main" ? (
                    <>
                        <button
                            onClick={() => router.push("/dashboard")}
                            style={{
                                display: "flex", alignItems: "center", gap: "8px",
                                color: tab === "recharge" ? "#065f46" : "#0369a1",
                                background: "none", border: "none",
                                cursor: "pointer", fontWeight: "800", fontSize: "14px",
                                marginBottom: "24px", transition: "color 0.2s"
                            }}
                            onMouseEnter={e => (e.currentTarget.style.color = tab === "recharge" ? "#059669" : "#0284c7")}
                            onMouseLeave={e => (e.currentTarget.style.color = tab === "recharge" ? "#065f46" : "#0369a1")}
                        >
                            <ArrowLeft size={18} />
                            ড্যাশবোর্ডে ফিরে যান
                        </button>

                        <div style={{ textAlign: "center", marginBottom: "40px" }}>
                            <div style={{
                                width: "80px", height: "80px",
                                background: tab === "recharge" ? "#059669" : "linear-gradient(135deg, #0369a1 0%, #0284c7 100%)",
                                borderRadius: "32px", display: "flex", alignItems: "center",
                                justifyContent: "center", margin: "0 auto 24px",
                                boxShadow: tab === "recharge" ? "0 20px 40px rgba(5,150,105,0.25)" : "0 20px 40px rgba(3,105,161,0.25)",
                                transition: "all 0.4s ease"
                            }}>
                                {tab === "recharge" ? <Wallet size={32} color="white" /> : <ArrowDownCircle size={32} color="white" />}
                            </div>
                            <h1 style={{ fontSize: "clamp(26px, 5vw, 36px)", fontWeight: "900", color: "#022c22", margin: "0 0 12px", transition: "all 0.3s" }}>
                                {tab === "recharge" ? "ব্যালেন্স রিচার্জ করুন" : "টাকা উইথড্র করুন"}
                            </h1>
                            <p style={{ color: "#6b7280", fontWeight: "700", fontSize: "14px", margin: 0 }}>
                                {tab === "recharge"
                                    ? "আপনার একাউন্টে ব্যালেন্স যোগ করতে নিচের ফর্মটি পূরণ করুন"
                                    : "আপনার ব্যালেন্স থেকে bKash বা Nagad এ টাকা উইথড্র করুন"
                                }
                            </p>
                        </div>

                        <div style={{
                            display: "flex", background: "white", padding: "6px", borderRadius: "28px",
                            marginBottom: "28px",
                            border: tab === "recharge" ? "1px solid #d1fae5" : "1px solid #bae6fd",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.04)"
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
                                <ArrowUpCircle size={18} /> রিচার্জ করুন
                            </button>
                            <button
                                onClick={() => setTab("withdraw")}
                                style={{
                                    flex: 1, padding: "16px", borderRadius: "22px", border: "none",
                                    background: tab === "withdraw" ? "linear-gradient(135deg, #0369a1 0%, #0284c7 100%)" : "transparent",
                                    color: tab === "withdraw" ? "white" : "#0369a1",
                                    cursor: "pointer", fontWeight: "900", fontSize: "14px",
                                    transition: "all 0.3s ease",
                                    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                                    boxShadow: tab === "withdraw" ? "0 8px 20px rgba(3,105,161,0.3)" : "none"
                                }}
                            >
                                <ArrowDownCircle size={18} /> উইথড্র করুন
                            </button>
                        </div>

                        <div style={{
                            background: "white", borderRadius: "48px",
                            padding: "clamp(24px, 5vw, 40px)",
                            boxShadow: "0 25px 50px rgba(0,0,0,0.04)",
                            border: tab === "recharge" ? "1px solid #ecfdf5" : "1px solid #e0f2fe"
                        }}>
                            {tab === "recharge" && (
                                <>
                                    {/* ✅ BUG FIX: onClick এ amount রিসেট করা হয়েছে */}
                                    <div style={{
                                        display: "flex", background: "rgba(236,253,245,0.5)",
                                        padding: "6px", borderRadius: "24px",
                                        marginBottom: "24px", border: "1px solid #d1fae5"
                                    }}>
                                        {(["Personal", "Business"] as const).map((type) => (
                                            <button
                                                key={type}
                                                onClick={() => {
                                                    setAccountType(type);
                                                    setRechargeForm(prev => ({ ...prev, amount: "" })); // ✅ FIX
                                                }}
                                                style={{
                                                    flex: 1, padding: "14px", borderRadius: "18px", border: "none",
                                                    background: (accountType === type || (type === "Business" && accountType === "SubAdmin")) ? "#059669" : "transparent",
                                                    color: (accountType === type || (type === "Business" && accountType === "SubAdmin")) ? "white" : "#065f46",
                                                    cursor: "pointer", fontWeight: "900", fontSize: "14px",
                                                    transition: "all 0.3s ease",
                                                    boxShadow: (accountType === type || (type === "Business" && accountType === "SubAdmin")) ? "0 8px 20px rgba(5,150,105,0.3)" : "none"
                                                }}
                                            >
                                                {type} Account
                                            </button>
                                        ))}
                                    </div>

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
                                                    সর্বনিম্ন পরিমাণ
                                                </p>
                                                <p style={{ fontSize: "14px", fontWeight: "700", margin: 0, lineHeight: 1.5 }}>
                                                    {accountType === "SubAdmin" ? "Business" : accountType} একাউন্ট এর জন্য সর্বনিম্ন{" "}
                                                    <span style={{ color: "#fbbf24" }}>{minRecharge} টাকা</span> অ্যাড করতে হবে।
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{
                                        background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 60%, #6d28d9 100%)",
                                        borderRadius: "24px", padding: "24px", marginBottom: "24px",
                                        position: "relative", overflow: "hidden"
                                    }}>
                                        <div style={{ position: "absolute", top: "-25px", right: "-25px", width: "130px", height: "130px", background: "rgba(255,255,255,0.07)", borderRadius: "50%" }} />
                                        <div style={{ position: "absolute", bottom: "-35px", left: "45%", width: "90px", height: "90px", background: "rgba(255,255,255,0.05)", borderRadius: "50%" }} />
                                        <div style={{ position: "relative", zIndex: 1, display: "flex", gap: "18px", alignItems: "flex-start" }}>
                                            <div style={{ width: "60px", height: "60px", flexShrink: 0, background: "rgba(255,255,255,0.15)", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "30px" }}>
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
                                                    <span style={{ fontSize: "clamp(32px, 8vw, 40px)", fontWeight: "900", color: "white", letterSpacing: "-0.02em", lineHeight: 1 }}>২,৯৫০</span>
                                                    <span style={{ fontSize: "clamp(20px, 5vw, 24px)", fontWeight: "900", color: "rgba(255,255,255,0.9)" }}>৳</span>
                                                </div>
                                                <p style={{ fontSize: "12px", fontWeight: "700", color: "rgba(255,255,255,0.75)", margin: 0 }}>
                                                    একবার যোগ করুন — সারাজীবন সুবিধা উপভোগ করুন
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                // amount শুধু subAdmin view-এর জন্য set হয়, main form এ যাবে না
                                                setRechargeForm(prev => ({ ...prev, amount: "2950" }));
                                                setView("subAdmin");
                                            }}
                                            style={{
                                                width: "100%", position: "relative", zIndex: 1, marginTop: "18px",
                                                background: "white", borderRadius: "14px", padding: "12px 16px",
                                                textAlign: "center", border: "none", color: "#4f46e5",
                                                fontWeight: "900", fontSize: "14px", cursor: "pointer",
                                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                                                transition: "all 0.2s"
                                            }}
                                            onMouseEnter={e => { e.currentTarget.style.background = "#f3f4f6"; e.currentTarget.style.transform = "scale(1.02)"; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = "white"; e.currentTarget.style.transform = "scale(1)"; }}
                                        >
                                            ✨ সাব এডমিন হতে এখানে ক্লিক করুন
                                        </button>
                                    </div>

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

                                    <div style={{
                                        background: "#f0fdf4", border: "2px solid #d1fae5",
                                        padding: "24px", borderRadius: "24px",
                                        marginBottom: "32px", textAlign: "center"
                                    }}>
                                        <p style={{ color: "#059669", fontSize: "11px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "12px" }}>
                                            {rechargeMethod} Personal Number
                                        </p>
                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
                                            <span style={{ fontSize: "clamp(24px, 5vw, 36px)", fontWeight: "900", color: "#022c22", letterSpacing: "-0.03em" }}>
                                                {paymentNumbers[rechargeMethod]}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => handleCopy(paymentNumbers[rechargeMethod], rechargeMethod)}
                                                style={{
                                                    display: "flex", alignItems: "center", gap: "8px", background: "white",
                                                    border: `2px solid ${rechargeCopied === rechargeMethod ? "#059669" : "#d1fae5"}`,
                                                    padding: "10px 24px", borderRadius: "16px", fontSize: "14px", fontWeight: "900",
                                                    color: rechargeCopied === rechargeMethod ? "#059669" : "#065f46",
                                                    cursor: "pointer", transition: "all 0.3s ease"
                                                }}
                                            >
                                                {rechargeCopied === rechargeMethod ? <><CheckCircle size={16} /> Copied!</> : <><Copy size={16} /> Copy Number</>}
                                            </button>
                                        </div>
                                    </div>

                                    <form onSubmit={handleRechargeSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
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
                                                    onChange={e => setRechargeForm(prev => ({ ...prev, senderNumber: e.target.value }))}
                                                />
                                            </div>
                                        </div>

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
                                                    onChange={e => setRechargeForm(prev => ({ ...prev, transactionId: e.target.value }))}
                                                />
                                            </div>
                                        </div>

                                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                            <label style={labelStyle}>Amount (টাকা)</label>
                                            <input
                                                type="number" required placeholder={`সর্বনিম্ন ${minRecharge} টাকা`}
                                                style={{ ...inputStyle, paddingLeft: "16px" }}
                                                onFocus={e => (e.currentTarget.style.borderColor = "#059669")}
                                                onBlur={e => (e.currentTarget.style.borderColor = "#ecfdf5")}
                                                value={rechargeForm.amount}
                                                onChange={e => setRechargeForm(prev => ({ ...prev, amount: e.target.value }))}
                                            />
                                        </div>

                                        {rechargeError && (
                                            <p style={{ color: "#dc2626", fontSize: "14px", textAlign: "center", fontWeight: "700", background: "#fef2f2", padding: "12px 16px", borderRadius: "12px", border: "1px solid #fecaca", margin: 0 }}>
                                                {rechargeError}
                                            </p>
                                        )}

                                        <div style={{ paddingTop: "8px" }}>
                                            <button
                                                type="submit" disabled={rechargeSubmitting}
                                                style={{
                                                    width: "100%", padding: "20px", background: "#059669", color: "white",
                                                    border: "none", borderRadius: "24px", fontWeight: "900", fontSize: "17px",
                                                    cursor: rechargeSubmitting ? "not-allowed" : "pointer",
                                                    opacity: rechargeSubmitting ? 0.7 : 1,
                                                    display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                                                    boxShadow: "0 15px 30px rgba(5,150,105,0.3)", transition: "all 0.3s ease"
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
                                            style={{ background: "transparent", border: "2px solid #d1fae5", color: "#6b7280", padding: "14px", borderRadius: "16px", cursor: "pointer", fontSize: "14px", fontWeight: "700", transition: "all 0.3s ease" }}
                                            onMouseEnter={e => { e.currentTarget.style.borderColor = "#059669"; e.currentTarget.style.color = "#059669"; }}
                                            onMouseLeave={e => { e.currentTarget.style.borderColor = "#d1fae5"; e.currentTarget.style.color = "#6b7280"; }}
                                        >
                                            রিচার্জ করতে চাই না, ড্যাশবোর্ডে ফিরে যান
                                        </button>
                                    </form>
                                </>
                            )}

                            {tab === "withdraw" && (
                                <>
                                    {accountType === "Personal" ? (
                                        <div style={{ textAlign: "center", padding: "40px 24px", background: "#fcfdfe", borderRadius: "32px", border: "2px dashed #bae6fd", display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }}>
                                            <div style={{ width: "80px", height: "80px", background: "#e0f2fe", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#0369a1" }}>
                                                <AlertTriangle size={36} />
                                            </div>
                                            <div>
                                                <h3 style={{ fontSize: "20px", fontWeight: "900", color: "#0369a1", margin: "0 0 10px" }}>উইথড্র সুবিধা লকড!</h3>
                                                <p style={{ fontSize: "14px", color: "#6b7280", fontWeight: "700", lineHeight: 1.8, margin: 0 }}>
                                                    দুঃখিত! উইথড্র করার সুবিধা শুধুমাত্র <span style={{ color: "#0369a1" }}>বিজনেস একাউন্ট</span> এবং <span style={{ color: "#0369a1" }}>সাব এডমিন একাউন্ট</span> ইউজারদের জন্য প্রযোজ্য।
                                                </p>
                                            </div>
                                            <button
                                                type="button" onClick={() => setTab("recharge")}
                                                style={{ background: "linear-gradient(135deg, #0369a1 0%, #0284c7 100%)", color: "white", padding: "14px 28px", borderRadius: "16px", border: "none", fontWeight: "900", fontSize: "14px", cursor: "pointer", boxShadow: "0 8px 20px rgba(3,105,161,0.2)", transition: "all 0.2s" }}
                                            >
                                                একাউন্ট আপগ্রেড করুন
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <div style={{ background: "linear-gradient(135deg, #0369a1 0%, #0284c7 100%)", borderRadius: "24px", padding: "24px 32px", marginBottom: "28px", color: "white", position: "relative", overflow: "hidden", boxShadow: "0 15px 30px rgba(3,105,161,0.2)" }}>
                                                <div style={{ position: "absolute", top: "-30px", right: "-30px", width: "120px", height: "120px", background: "rgba(255,255,255,0.06)", borderRadius: "50%" }} />
                                                <div style={{ position: "relative", zIndex: 1 }}>
                                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                                                        <span style={{ fontSize: "12px", fontWeight: "800", color: "#bae6fd", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                                            আমার {accountType === "SubAdmin" ? "Sub Admin Account" : "Business Account"}
                                                        </span>
                                                        <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.15)", padding: "4px 8px", borderRadius: "10px", fontSize: "12px", fontWeight: "700" }}>
                                                            <span>01625400511</span>
                                                            <Copy size={12} style={{ cursor: "pointer" }} onClick={() => handleCopy("01625400511", "number")} />
                                                        </div>
                                                    </div>
                                                    <p style={{ fontSize: "12px", color: "#bae6fd", margin: "0 0 4px", fontWeight: "700" }}>বর্তমান ব্যালেন্স</p>
                                                    <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                                                        <span style={{ fontSize: "36px", fontWeight: "900" }}>৳১,৪৫০</span>
                                                        <span style={{ fontSize: "20px", fontWeight: "700", color: "#bae6fd" }}>৳</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div style={{ marginBottom: "28px" }}>
                                                <h3 style={{ fontSize: "12px", fontWeight: "900", color: "#0369a1", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 16px" }}>
                                                    উইথড্র মাধ্যম বেছে নিন
                                                </h3>
                                                <div style={{ display: "flex", gap: "24px" }}>
                                                    {(["bKash", "Nagad"] as const).map((m) => {
                                                        const isActive = withdrawMethod === m;
                                                        return (
                                                            <button
                                                                key={m} type="button" onClick={() => setWithdrawMethod(m)}
                                                                style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", padding: 0 }}
                                                            >
                                                                <div style={{ width: "64px", height: "64px", background: isActive ? "linear-gradient(135deg, #0369a1 0%, #0284c7 100%)" : "#e0f2fe", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: isActive ? "0 8px 20px rgba(3,105,161,0.25)" : "none", transition: "all 0.2s" }}>
                                                                    {m === "bKash" ? <Wallet size={24} color={isActive ? "white" : "#0369a1"} /> : <ArrowDownCircle size={24} color={isActive ? "white" : "#0369a1"} />}
                                                                </div>
                                                                <span style={{ fontSize: "13px", fontWeight: "800", color: isActive ? "#0369a1" : "#6b7280" }}>
                                                                    {m === "bKash" ? "bKash বিকাশ" : "Nagad নগদ"}
                                                                </span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            <form onSubmit={handleWithdrawSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                                                <div>
                                                    <label style={{ ...labelStyle, color: "#6b7280" }}>{withdrawMethod} নম্বর</label>
                                                    <div style={{ position: "relative" }}>
                                                        <Smartphone size={18} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "rgba(3,105,161,0.5)" }} />
                                                        <input
                                                            type="tel" required placeholder="01XXXXXXXXX"
                                                            style={{ ...inputStyle, borderColor: "#e0f2fe" }}
                                                            onFocus={e => (e.currentTarget.style.borderColor = "#0369a1")}
                                                            onBlur={e => (e.currentTarget.style.borderColor = "#e0f2fe")}
                                                            value={withdrawForm.receiverNumber}
                                                            onChange={e => setWithdrawForm(prev => ({ ...prev, receiverNumber: e.target.value }))}
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label style={{ ...labelStyle, color: "#6b7280" }}>Amount (টাকা)</label>
                                                    <input
                                                        type="number" required placeholder={`সর্বনিম্ন ${minWithdraw} টাকা`}
                                                        style={{ ...inputStyle, paddingLeft: "16px", borderColor: "#e0f2fe" }}
                                                        onFocus={e => (e.currentTarget.style.borderColor = "#0369a1")}
                                                        onBlur={e => (e.currentTarget.style.borderColor = "#e0f2fe")}
                                                        value={withdrawForm.amount}
                                                        onChange={e => setWithdrawForm(prev => ({ ...prev, amount: e.target.value }))}
                                                    />
                                                </div>

                                                <div>
                                                    <label style={{ ...labelStyle, color: "#6b7280" }}>দ্রুত পরিমাণ বেছে নিন</label>
                                                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                                        {[500, 1000, 2000, 5000].map((amt) => (
                                                            <button
                                                                key={amt} type="button"
                                                                onClick={() => setWithdrawForm(prev => ({ ...prev, amount: String(amt) }))}
                                                                style={{
                                                                    padding: "10px 20px", borderRadius: "14px",
                                                                    border: `2px solid ${withdrawForm.amount === String(amt) ? "#0369a1" : "#e0f2fe"}`,
                                                                    background: withdrawForm.amount === String(amt) ? "#f0f9ff" : "white",
                                                                    color: withdrawForm.amount === String(amt) ? "#0369a1" : "#6b7280",
                                                                    fontWeight: "800", fontSize: "13px", cursor: "pointer", transition: "all 0.2s ease"
                                                                }}
                                                            >
                                                                ৳{amt}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                {withdrawError && (
                                                    <p style={{ color: "#dc2626", fontSize: "14px", textAlign: "center", fontWeight: "700", background: "#fef2f2", padding: "12px 16px", borderRadius: "12px", border: "1px solid #fecaca", margin: 0 }}>
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
                                                            display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                                                            boxShadow: "0 15px 30px rgba(3,105,161,0.3)", transition: "all 0.3s ease"
                                                        }}
                                                    >
                                                        {withdrawSubmitting
                                                            ? <div style={{ width: "24px", height: "24px", border: "3px solid rgba(255,255,255,0.4)", borderTop: "3px solid white", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                                                            : <><ShieldCheck size={24} /> উইথড্র রিকোয়েস্ট করুন</>
                                                        }
                                                    </button>
                                                </div>

                                                <button
                                                    type="button" onClick={() => router.push("/dashboard")}
                                                    style={{ background: "transparent", border: "2px solid #e0f2fe", color: "#6b7280", padding: "14px", borderRadius: "16px", cursor: "pointer", fontSize: "14px", fontWeight: "700", transition: "all 0.3s ease" }}
                                                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#0369a1"; e.currentTarget.style.color = "#0369a1"; }}
                                                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#e0f2fe"; e.currentTarget.style.color = "#6b7280"; }}
                                                >
                                                    উইথড্র করতে চাই না, ড্যাশবোর্ডে ফিরে যান
                                                </button>
                                            </form>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => {
                                setRechargeForm(prev => ({ ...prev, amount: "" })); // ✅ back গেলেও amount রিসেট
                                setView("main");
                            }}
                            style={{ display: "flex", alignItems: "center", gap: "8px", color: "#4f46e5", background: "none", border: "none", cursor: "pointer", fontWeight: "800", fontSize: "14px", marginBottom: "24px", transition: "color 0.2s" }}
                            onMouseEnter={e => (e.currentTarget.style.color = "#6366f1")}
                            onMouseLeave={e => (e.currentTarget.style.color = "#4f46e5")}
                        >
                            <ArrowLeft size={18} />
                            মূল রিচার্জ পেজে ফিরে যান
                        </button>

                        <div style={{ textAlign: "center", marginBottom: "40px" }}>
                            <div style={{ width: "80px", height: "80px", background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)", borderRadius: "32px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", boxShadow: "0 20px 40px rgba(79,70,229,0.25)" }}>
                                <Zap size={32} color="white" />
                            </div>
                            <h1 style={{ fontSize: "clamp(26px, 5vw, 36px)", fontWeight: "900", color: "#1e1b4b", margin: "0 0 12px" }}>সাব এডমিন পেমেন্ট</h1>
                            <p style={{ color: "#6b7280", fontWeight: "700", fontSize: "14px", margin: 0 }}>
                                সাব এডমিন অ্যাকাউন্ট সুবিধা চালু করতে নিচের ফর্মে পেমেন্ট সম্পন্ন করুন
                            </p>
                        </div>

                        <div style={{ background: "white", borderRadius: "48px", padding: "clamp(24px, 5vw, 40px)", boxShadow: "0 25px 50px rgba(79,70,229,0.05)", border: "1px solid #e0e7ff" }}>
                            <div style={{ background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)", color: "white", padding: "24px", borderRadius: "24px", marginBottom: "32px", textAlign: "center" }}>
                                <p style={{ fontSize: "12px", fontWeight: "800", color: "#c7d2fe", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 8px" }}>প্যাকেজ মূল্য</p>
                                <span style={{ fontSize: "38px", fontWeight: "900" }}>৳২,৯৫০</span>
                            </div>

                            <div style={{ display: "flex", background: "rgba(224,231,255,0.4)", padding: "6px", borderRadius: "24px", marginBottom: "24px", border: "1px solid #e0e7ff" }}>
                                {(["bKash", "Nagad"] as const).map((m) => (
                                    <button
                                        key={m} onClick={() => setRechargeMethod(m)}
                                        style={{ flex: 1, padding: "14px", borderRadius: "18px", border: "none", background: rechargeMethod === m ? "#4f46e5" : "transparent", color: rechargeMethod === m ? "white" : "#4f46e5", cursor: "pointer", fontWeight: "900", fontSize: "14px", transition: "all 0.3s ease", boxShadow: rechargeMethod === m ? "0 8px 20px rgba(79,70,229,0.2)" : "none" }}
                                    >
                                        {m === "bKash" ? "bKash বিকাশ" : "Nagad নগদ"}
                                    </button>
                                ))}
                            </div>

                            <div style={{ background: "#faf5ff", border: "2px solid #f3e8ff", padding: "24px", borderRadius: "24px", marginBottom: "32px", textAlign: "center" }}>
                                <p style={{ color: "#7c3aed", fontSize: "11px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "12px" }}>
                                    {rechargeMethod} Personal Number
                                </p>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
                                    <span style={{ fontSize: "clamp(24px, 5vw, 36px)", fontWeight: "900", color: "#1e1b4b", letterSpacing: "-0.03em" }}>
                                        {paymentNumbers[rechargeMethod]}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => handleCopy(paymentNumbers[rechargeMethod], rechargeMethod)}
                                        style={{ display: "flex", alignItems: "center", gap: "8px", background: "white", border: `2px solid ${rechargeCopied === rechargeMethod ? "#7c3aed" : "#e9d5ff"}`, padding: "10px 24px", borderRadius: "16px", fontSize: "14px", fontWeight: "900", color: "#7c3aed", cursor: "pointer", transition: "all 0.3s ease" }}
                                    >
                                        {rechargeCopied === rechargeMethod ? <><CheckCircle size={16} /> Copied!</> : <><Copy size={16} /> Copy Number</>}
                                    </button>
                                </div>
                            </div>

                            <form onSubmit={handleSubAdminSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                    <label style={labelStyle}>প্রেরকের নম্বর (যেখান থেকে টাকা পাঠিয়েছেন)</label>
                                    <div style={{ position: "relative" }}>
                                        <Smartphone size={18} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "rgba(79,70,229,0.5)" }} />
                                        <input
                                            type="tel" required placeholder="01XXXXXXXXX"
                                            style={{ ...inputStyle, borderColor: "#e0e7ff" }}
                                            onFocus={e => (e.currentTarget.style.borderColor = "#4f46e5")}
                                            onBlur={e => (e.currentTarget.style.borderColor = "#e0e7ff")}
                                            value={rechargeForm.senderNumber}
                                            onChange={e => setRechargeForm(prev => ({ ...prev, senderNumber: e.target.value }))}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                    <label style={labelStyle}>Transaction ID (TrxID)</label>
                                    <div style={{ position: "relative" }}>
                                        <Hash size={18} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "rgba(79,70,229,0.5)" }} />
                                        <input
                                            type="text" required placeholder="বিকাশ/নগদ এর মেসেজ থেকে TrxID দিন"
                                            style={{ ...inputStyle, textTransform: "uppercase", borderColor: "#e0e7ff" }}
                                            onFocus={e => (e.currentTarget.style.borderColor = "#4f46e5")}
                                            onBlur={e => (e.currentTarget.style.borderColor = "#e0e7ff")}
                                            value={rechargeForm.transactionId}
                                            onChange={e => setRechargeForm(prev => ({ ...prev, transactionId: e.target.value }))}
                                        />
                                    </div>
                                </div>

                                {rechargeError && (
                                    <p style={{ color: "#dc2626", fontSize: "14px", textAlign: "center", fontWeight: "700", background: "#fef2f2", padding: "12px 16px", borderRadius: "12px", border: "1px solid #fecaca", margin: 0 }}>
                                        {rechargeError}
                                    </p>
                                )}

                                <div style={{ paddingTop: "8px" }}>
                                    <button
                                        type="submit" disabled={rechargeSubmitting}
                                        style={{
                                            width: "100%", padding: "20px",
                                            background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)", color: "white",
                                            border: "none", borderRadius: "24px", fontWeight: "900", fontSize: "17px",
                                            cursor: rechargeSubmitting ? "not-allowed" : "pointer",
                                            opacity: rechargeSubmitting ? 0.7 : 1,
                                            display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                                            boxShadow: "0 15px 30px rgba(79,70,229,0.3)", transition: "all 0.3s ease"
                                        }}
                                    >
                                        {rechargeSubmitting
                                            ? <div style={{ width: "24px", height: "24px", border: "3px solid rgba(255,255,255,0.4)", borderTop: "3px solid white", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                                            : <><ShieldCheck size={24} /> ৳২,৯৫০ পেমেন্ট সাবমিট করুন</>
                                        }
                                    </button>
                                    <p style={{ textAlign: "center", fontSize: "10px", fontWeight: "700", color: "#9ca3af", marginTop: "16px", textTransform: "uppercase", letterSpacing: "0.2em" }}>
                                        নিরাপদ ও এনক্রিপ্টেড পেমেন্ট গেটওয়ে
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setRechargeForm(prev => ({ ...prev, amount: "" })); // ✅ back গেলেও amount রিসেট
                                        setView("main");
                                    }}
                                    style={{ background: "transparent", border: "2px solid #e0e7ff", color: "#6b7280", padding: "14px", borderRadius: "16px", cursor: "pointer", fontSize: "14px", fontWeight: "700", transition: "all 0.3s ease" }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#4f46e5"; e.currentTarget.style.color = "#4f46e5"; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#e0e7ff"; e.currentTarget.style.color = "#6b7280"; }}
                                >
                                    রিচার্জ করতে চাই না, ড্যাশবোর্ডে ফিরে যান
                                </button>
                            </form>
                        </div>
                    </>
                )}
            </div>

            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </main>
    );
}