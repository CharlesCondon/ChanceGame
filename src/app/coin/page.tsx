"use client";

import { useEffect, useState } from "react";
import { getUserHighScore, updateHighScore } from "./actions";
import { createClient } from "@/utils/supabase/client";

export default function Game() {
    const [currentStreak, setCurrentStreak] = useState(0);
    const [bestStreak, setBestStreak] = useState<number>(0);
    const [isFlipping, setIsFlipping] = useState(false);
    const [lastResult, setLastResult] = useState<"heads" | "tails" | null>(
        null
    );
    const [gameOver, setGameOver] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [userId, setUserId] = useState<string | null>(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true);

    const supabase = createClient();

    useEffect(() => {
        const initializeUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (user) {
                setUserId(user.id);

                const highScore = await getUserHighScore(user.id);
                setBestStreak(highScore);
            }

            setIsLoadingUser(false);
        };

        initializeUser();
    }, [supabase.auth]);

    const flipCoin = () => {
        if (isFlipping) return;

        setIsFlipping(true);
        setGameOver(false);

        // Generate result immediately but don't show it yet
        const result = Math.random() < 0.5 ? "heads" : "tails";

        // Calculate final rotation - ensure it lands on the correct side
        // Heads = 0°, Tails = 180°
        const spins = 5 + Math.floor(Math.random() * 3); // 5-7 full spins
        const baseRotation = spins * 360;
        const finalRotation =
            result === "heads" ? baseRotation : baseRotation + 180;

        setRotation(finalRotation);

        // Show result after animation completes
        setTimeout(() => {
            setLastResult(result);

            if (result === "heads") {
                const newStreak = currentStreak + 1;
                setCurrentStreak(newStreak);

                if (newStreak > bestStreak) {
                    setBestStreak(newStreak);

                    if (userId) {
                        console.log(userId);
                        updateHighScore(userId, newStreak);
                    }
                }
            } else {
                setCurrentStreak(0);
                setGameOver(true);
            }

            setIsFlipping(false);
        }, 200);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
                    <h2 className="text-3xl font-bold text-center text-gray-800">
                        Coin Flip Challenge
                    </h2>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-100 rounded-lg p-4 text-center">
                            <div className="text-sm text-gray-600">
                                Current Streak
                            </div>
                            <div className="text-3xl font-bold text-blue-600">
                                {currentStreak}
                            </div>
                        </div>
                        <div className="bg-purple-100 rounded-lg p-4 text-center">
                            <div className="text-sm text-gray-600">
                                Best Streak
                            </div>
                            <div className="text-3xl font-bold text-purple-600">
                                {bestStreak}
                            </div>
                        </div>
                    </div>

                    <div
                        className="flex justify-center my-8"
                        style={{ perspective: "1000px" }}
                    >
                        <div
                            style={{
                                transform: `rotateY(${rotation}deg)`,
                                transition: isFlipping
                                    ? "transform 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94)"
                                    : "none",
                                transformStyle: "preserve-3d",
                            }}
                            className="relative w-32 h-32"
                        >
                            {/* Heads Side */}
                            <div
                                className="absolute w-full h-full rounded-full flex items-center justify-center text-4xl font-bold bg-yellow-400 text-yellow-900 shadow-lg"
                                style={{
                                    backfaceVisibility: "hidden",
                                    transform: "rotateY(0deg)",
                                }}
                            >
                                H
                            </div>

                            {/* Tails Side */}
                            <div
                                className="absolute w-full h-full rounded-full flex items-center justify-center text-4xl font-bold bg-gray-400 text-gray-900 shadow-lg"
                                style={{
                                    backfaceVisibility: "hidden",
                                    transform: "rotateY(180deg)",
                                }}
                            >
                                T
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={flipCoin}
                            disabled={isFlipping}
                            className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-gray-900 font-bold py-4 px-6 rounded-lg text-xl transition-colors"
                        >
                            Flip Coin
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
