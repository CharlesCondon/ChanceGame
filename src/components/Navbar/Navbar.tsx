"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const pathname = usePathname();
    const supabase = createClient();

    const isActive = (path: string) => pathname === path;

    const closeMenu = () => setIsOpen(false);

    // Check authentication status
    useEffect(() => {
        const checkAuth = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();
            setIsAuthenticated(!!session);
        };

        checkAuth();

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsAuthenticated(!!session);
        });

        return () => subscription.unsubscribe();
    }, [supabase.auth, pathname]);

    const links = [
        { name: "Play", url: "/coin" },
        { name: "Scores", url: "/scores" },
        {
            name: isAuthenticated ? "Account" : "Sign In",
            url: isAuthenticated ? "/profile" : "/auth",
        },
    ];

    return (
        <>
            <nav className="absolute top-0 left-0 right-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link
                            href="/"
                            className="text-white font-bold text-xl hover:text-gray-200 transition-colors tracking-wider"
                        >
                            Chance
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex gap-6">
                            {links.map((link) => {
                                return (
                                    <Link
                                        key={link.url}
                                        href={link.url}
                                        className={`text-sm font-medium transition-colors ${
                                            isActive(link.url)
                                                ? "text-white"
                                                : "text-gray-300 hover:text-white"
                                        }`}
                                    >
                                        {link.name}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Mobile Hamburger Button */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden text-white hover:text-gray-200 transition-colors"
                            aria-label="Menu"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                {isOpen ? (
                                    <path d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Drawer */}
            <div
                className={`md:hidden fixed top-0 right-0 h-full w-full bg-gray-900 shadow-2xl z-40 transform transition-transform duration-300 ease-in-out ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex justify-end p-4">
                    <button
                        onClick={closeMenu}
                        className="text-white hover:text-gray-300 transition-colors"
                        aria-label="Close menu"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <nav className="flex flex-col gap-2 px-4">
                    <Link
                        href="/"
                        onClick={closeMenu}
                        className={`px-4 py-3 rounded-lg text-lg font-medium transition-colors text-center ${
                            isActive("/")
                                ? "bg-blue-600 text-white"
                                : "text-gray-300 hover:bg-gray-800 hover:text-white"
                        }`}
                    >
                        Home
                    </Link>
                    {links.map((link) => {
                        return (
                            <Link
                                key={link.url}
                                href={link.url}
                                onClick={closeMenu}
                                className={`px-4 py-3 rounded-lg text-lg font-medium transition-colors text-center ${
                                    isActive(link.url)
                                        ? "bg-blue-600 text-white"
                                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                                }`}
                            >
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </>
    );
}
