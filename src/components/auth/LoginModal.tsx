"use client";

import React, { useState } from "react";
import { X, Lock, Mail, AlertCircle, UserPlus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { DEFAULT_USERS } from "@/lib/mock-data/users";

export const LoginModal: React.FC = () => {
  const { isLoginModalOpen, closeLoginModal, login, signup } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isLoginModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      let success = false;
      if (isSignup) {
        success = await signup(email, password, fullName, "member");
      } else {
        success = await login(email, password);
      }
      if (success) {
        setEmail("");
        setPassword("");
        setFullName("");
        setIsSignup(false);
      } else {
        setError(isSignup ? "Gagal mendaftar. Email mungkin sudah terdaftar." : "Email/Username atau password tidak sesuai!");
      }
    } catch (e) {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = (role: string) => {
    const user = DEFAULT_USERS.find((u) => u.role === role);
    if (user) {
      setEmail(user.email);
      setPassword(user.password);
      setError("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs" onClick={closeLoginModal} />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="text-lg font-bold text-neutral-900">{isSignup ? "Daftar Akun" : "Login to Modesy"}</h2>
          <button onClick={closeLoginModal} aria-label="Close" className="p-1 text-neutral-400 hover:text-neutral-700">
            <X className="h-5 w-5" />
          </button>
        </div>
        {!isSignup && (
          <div className="mt-4">
            <div className="mb-2 text-xs font-semibold text-neutral-500">Pilih Akun Demo (Quick Fill):</div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {DEFAULT_USERS.map((u) => (
                <button key={u.id} type="button" onClick={() => handleQuickFill(u.role)} className="rounded-lg border border-neutral-200 bg-neutral-50 py-1.5 text-xs font-medium capitalize text-neutral-700 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700">
                  {u.role}
                </button>
              ))}
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-rose-50 p-2 text-xs text-rose-600">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {isSignup && (
            <div>
              <label className="text-xs font-medium text-neutral-700">Nama Lengkap</label>
              <div className="relative mt-1 flex items-center">
                <Mail className="absolute left-3 h-4 w-4 text-neutral-400" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nama lengkap"
                  className="w-full rounded-lg border border-neutral-200 py-2 pr-3 pl-9 text-xs text-neutral-900 outline-none focus:border-emerald-600"
                />
              </div>
            </div>
          )}
          <div>
            <label className="text-xs font-medium text-neutral-700">Email</label>
            <div className="relative mt-1 flex items-center">
              <Mail className="absolute left-3 h-4 w-4 text-neutral-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@modesy.com"
                className="w-full rounded-lg border border-neutral-200 py-2 pr-3 pl-9 text-xs text-neutral-900 outline-none focus:border-emerald-600"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-neutral-700">Password</label>
            <div className="relative mt-1 flex items-center">
              <Lock className="absolute left-3 h-4 w-4 text-neutral-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isSignup ? "Minimal 6 karakter" : "••••••••"}
                className="w-full rounded-lg border border-neutral-200 py-2 pr-3 pl-9 text-xs text-neutral-900 outline-none focus:border-emerald-600"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full rounded-lg bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50"
          >
            {isLoading ? "Memproses..." : (isSignup ? "Daftar" : "Login")}
          </button>
        </form>
        <div className="mt-4 text-center text-xs text-neutral-600">
          {isSignup ? (
            <span>Sudah punya akun? </span>
          ) : (
            <span>Belum punya akun? </span>
          )}
          <button
            type="button"
            onClick={() => { setIsSignup(!isSignup); setError(""); }}
            className="font-semibold text-emerald-600 hover:text-emerald-700"
          >
            {isSignup ? "Login" : "Daftar"}
          </button>
        </div>
      </div>
    </div>
  );
};

