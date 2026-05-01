"use client";

import { useState } from "react";
import { signUp } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await signUp.email({
      email,
      password,
      name,
    }, {
      onSuccess: () => {
        toast.success("Account created successfully");
        router.push("/");
      },
      onError: (ctx) => {
        toast.error(ctx.error.message || "Failed to create account");
        setIsLoading(false);
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl shadow-black/5 border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif text-[#1A1A1A] mb-2">Create Account</h1>
          <p className="text-gray-500 font-sans text-sm">Join us for a premium dining experience.</p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 font-sans">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF5C00]/20 focus:border-[#FF5C00] transition-colors"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 font-sans">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF5C00]/20 focus:border-[#FF5C00] transition-colors"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 font-sans">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF5C00]/20 focus:border-[#FF5C00] transition-colors"
              placeholder="Create a password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#1A1A1A] hover:bg-black text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign Up"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500 font-sans">
          Already have an account?{" "}
          <Link href="/login" className="text-[#FF5C00] hover:underline font-medium">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
