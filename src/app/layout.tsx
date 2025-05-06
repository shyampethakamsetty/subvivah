import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "शुभ विवाह - Find Your Perfect Life Partner",
  description: "A trusted matrimonial platform for finding your perfect life partner",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className="text-2xl font-bold text-white">
                  शुभ विवाह
                </Link>
              </div>
              <div className="block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <Link
                    href="/"
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-purple-700"
                  >
                    Home
                  </Link>
                  <Link
                    href="/search"
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-purple-700"
                  >
                    Search
                  </Link>
                  <Link
                    href="/dating"
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-purple-700"
                  >
                    Dating
                  </Link>
                  <Link
                    href="/matches"
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-purple-700"
                  >
                    Matches
                  </Link>
                  <Link
                    href="/messages"
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-purple-700"
                  >
                    Messages
                  </Link>
                  <Link
                    href="/kundli"
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-purple-700"
                  >
                    Kundli Generator
                  </Link>
                  <Link
                    href="/brahmand-chat"
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-purple-700"
                  >
                    ब्रह्मांड AI chat
                  </Link>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-purple-700"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-white text-purple-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-50"
                >
                  Register
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main className="min-h-screen bg-gradient-to-b from-red-50 to-white">
          {children}
        </main>
        <footer className="bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold mb-4">शुभ विवाह</h3>
                  <p className="text-gray-600">
                    शुभ विवाह is a trusted matrimonial platform built on the foundation of tradition, respect, and lifelong commitment. Our mission is to bring together individuals who are not just seeking a life partner but a lifelong companion.
                  </p>
                  <p className="text-gray-600">
                    Join <span className="text-purple-600 font-bold">शुभ विवाह</span> — because your forever deserves to begin with trust.
                  </p>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li><Link href="/" className="text-gray-300 hover:text-white">Home</Link></li>
                  <li><Link href="/search" className="text-gray-300 hover:text-white">Search</Link></li>
                  <li><Link href="/matches" className="text-gray-300 hover:text-white">Matches</Link></li>
                  <li><Link href="/messages" className="text-gray-300 hover:text-white">Messages</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
                <ul className="space-y-2">
                  <li><Link href="/privacy" className="text-gray-300 hover:text-white">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="text-gray-300 hover:text-white">Terms of Service</Link></li>
                  <li><Link href="/contact" className="text-gray-300 hover:text-white">Contact Us</Link></li>
                  <li><Link href="/help" className="text-gray-300 hover:text-white">Help & Support</Link></li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
              <p>&copy; {new Date().getFullYear()} शुभ विवाह. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
