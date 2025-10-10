"use client";

import { useEffect, useState } from "react";
import { getUserHighScore, updateHighScore, updateTotalHeads } from "./actions";
import { createClient } from "@/utils/supabase/client";
import FlipHistory from "@/components/FlipHistory/FlipHistory";

type FlipResult = {
    result: "heads" | "tails";
    timestamp: number;
};

export default function Game() {
    const [currentStreak, setCurrentStreak] = useState(0);
    const [bestStreak, setBestStreak] = useState<number>(0);
    const [isFlipping, setIsFlipping] = useState(true);
    const [rotation, setRotation] = useState(0);
    const [userId, setUserId] = useState<string | null>(null);
    const [flipHistory, setFlipHistory] = useState<FlipResult[]>([]);
    const [totalFlipsCount, setTotalFlipsCount] = useState(0);
    const [totalOpen, setTotalOpen] = useState(false);
    const [totalHeads, setTotalHeads] = useState(0);
    const [userLuck, setUserLuck] = useState(0);

    const supabase = createClient();

    useEffect(() => {
        const initializeUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (user) {
                setUserId(user.id);

                const userScores = await getUserHighScore(user.id);
                if (userScores) {
                    setBestStreak(userScores.highScore);
                    setTotalFlipsCount(userScores.totalFlips);
                    setTotalHeads(userScores.totalHeads);
                    setUserLuck(userScores.luckScore);
                }
            }
            setIsFlipping(false);
        };

        initializeUser();
    }, [supabase.auth]);

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.code === "Space" && !isFlipping) {
                event.preventDefault();
                flipCoin();
            }
        };

        window.addEventListener("keydown", handleKeyPress);

        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFlipping]);

    const flipCoin = () => {
        if (isFlipping) return;

        setIsFlipping(true);

        const result = Math.random() < 0.5 ? "heads" : "tails";

        const spins = 5 + Math.floor(Math.random() * 3);
        const baseRotation = spins * 360;
        const finalRotation =
            result === "heads" ? baseRotation : baseRotation + 180;

        setRotation(finalRotation);

        setTotalFlipsCount((prev) => {
            const newCount = prev + 1;
            return newCount;
        });

        if (result === "heads") {
            setTotalHeads((prev) => {
                const newCount = prev + 1;

                // Every 10 flips, update the database
                if (userId) {
                    updateTotalHeads(
                        userId,
                        newCount,
                        totalFlipsCount,
                        userLuck
                    );
                }

                return newCount;
            });
        }

        setTimeout(() => {
            const newFlip: FlipResult = {
                result: result,
                timestamp: Date.now(),
            };
            setFlipHistory((prev) => [newFlip, ...prev].slice(0, 12));

            if (result === "heads") {
                const newStreak = currentStreak + 1;
                setCurrentStreak(newStreak);

                if (newStreak > bestStreak) {
                    setBestStreak(newStreak);

                    if (userId) {
                        updateHighScore(userId, newStreak);
                    }
                }
            } else {
                setCurrentStreak(0);
            }

            setIsFlipping(false);
        }, 750);
    };

    return (
        <div className="sm:min-h-screen  relative max-w-7xl m-auto flex items-center justify-center p-4 pt-16 md:pt-4 pb-16">
            <FlipHistory history={flipHistory} />
            <div className="max-w-md w-full">
                <div className="flex row items-center justify-evenly mb-4">
                    <h2 className="text-3xl font-bold text-center text-white ">
                        Let the Heads Roll
                    </h2>
                    <div className="flex items-center rounded-full border border-solid border-white w-4 h-4">
                        {totalOpen ? (
                            <button
                                onClick={() => {
                                    setTotalOpen(!totalOpen);
                                }}
                                className="text-xl w-full h-full mb-4 text-white"
                            >
                                -
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    setTotalOpen(!totalOpen);
                                }}
                                className="text-xl w-full h-full mb-4 text-white"
                            >
                                +
                            </button>
                        )}
                    </div>
                </div>
                <div className="relative bg-[#384c5c] rounded-2xl shadow-2xl p-8 space-y-6 ">
                    {totalOpen && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-blue-100 rounded-lg p-4 text-center custom-shadow">
                                <div className="text-xs md:text-sm text-[#171717]">
                                    Total Heads
                                </div>
                                <div className="text-3xl font-bold text-blue-600">
                                    {totalHeads.toLocaleString("en-US")}
                                </div>
                            </div>
                            <div className="bg-blue-100 rounded-lg p-4 text-center custom-shadow">
                                <div className="text-xs md:text-sm text-[#171717]">
                                    Total Flips
                                </div>
                                <div className="text-3xl font-bold text-blue-600">
                                    {totalFlipsCount.toLocaleString("en-US")}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-100 rounded-lg p-4 text-center custom-shadow">
                            <div className="text-xs md:text-sm text-[#171717]">
                                Current Streak
                            </div>
                            <div className="text-3xl font-bold text-blue-600">
                                {currentStreak}
                            </div>
                        </div>
                        <div className="bg-[#f1b6cd] rounded-lg p-4 text-center custom-shadow">
                            <div className="text-xs md:text-sm text-[#171717]">
                                Best Streak
                            </div>
                            <div className="text-3xl font-bold text-purple-600">
                                {bestStreak}
                            </div>
                        </div>
                    </div>

                    {/* Coins */}
                    <div
                        className="flex justify-center my-8"
                        style={{ perspective: "1000px" }}
                    >
                        <div
                            style={{
                                transform: `rotateY(${rotation}deg)`,
                                transition: isFlipping
                                    ? "transform 750ms cubic-bezier(0.25, 0.46, 0.45, 0.94)"
                                    : "none",
                                transformStyle: "preserve-3d",
                            }}
                            className="relative w-32 h-32"
                        >
                            {/* Heads Side */}
                            <div
                                className="absolute w-full h-full rounded-full flex items-center justify-center text-4xl font-bold bg-yellow-400 text-yellow-900 custom-shadow"
                                style={{
                                    backfaceVisibility: "hidden",
                                    transform: "rotateY(0deg)",
                                }}
                            >
                                H
                            </div>

                            {/* Tails Side */}
                            <div
                                className="absolute w-full h-full rounded-full flex items-center justify-center text-4xl font-bold bg-gray-400 text-gray-900 custom-shadow"
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
                            className="w-full hover:cursor-pointer disabled:cursor-not-allowed disabled:text-gray-500 active:text-gray-500 text-white font-bold py-4 px-6 rounded-lg text-xl transition-all neomorph tracking-wider"
                        >
                            Flip Coin
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
