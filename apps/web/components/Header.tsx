import Link from "next/link";
import { PenTool } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="flex items-center space-x-2 font-bold">
          <PenTool className="h-6 w-6" />
          <span>CollabDraw</span>
        </Link>
        <nav className="flex items-center space-x-6 ml-6 text-sm font-medium">
          <Link href="/dashboard" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Dashboard
          </Link>
          <Link href="/about" className="transition-colors hover:text-foreground/80 text-foreground/60">
            About
          </Link>
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          <Link href="/api/auth/signin">
            <button className="text-sm font-medium transition-colors hover:text-primary">
              Sign In
            </button>
          </Link>
          <Link href="/api/auth/signup">
             <button className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors">
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}
