"use client";

import Link from "next/link";
import { PenTool, LogOut, User } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";

export function Header() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authClient.getSession().then((res) => {
      setSession(res.data);
      setLoading(false);
    });
  }, []);

  const handleSignOut = async () => {
    await authClient.signOut();
    setSession(null);
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="flex items-center space-x-2 font-bold">
          <PenTool className="h-6 w-6" />
          <span>CollabDraw</span>
        </Link>
        <nav className="flex items-center space-x-6 ml-6 text-sm font-medium">
          {session && (
            <Link href="/dashboard" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Dashboard
            </Link>
          )}
          <Link href="/about" className="transition-colors hover:text-foreground/80 text-foreground/60">
            About
          </Link>
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          {loading ? (
            <div className="h-8 w-20 animate-pulse bg-gray-200 rounded" />
          ) : session ? (
            <>
              <div className="flex items-center space-x-2 text-sm">
                <User className="h-4 w-4" />
                <span className="text-foreground/80">{session.user.email}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <>
              <Link href="/signin">
                <button className="text-sm font-medium transition-colors hover:text-primary">
                  Sign In
                </button>
              </Link>
              <Link href="/signup">
                <button className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors">
                  Get Started
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
