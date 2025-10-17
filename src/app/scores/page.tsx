"use client";

import LeaderboardDetails from "@/components/LeaderboardDetails.tsx/LeaderboardDetails";
import { useState } from "react";

type LeaderboardColumn =
    | "highScore"
    | "totalFlips"
    | "totalHeads"
    | "luckScore";

interface Board {
    type: LeaderboardColumn;
    label: string;
}

export default function Scores() {
    const [leaderboard, setLeaderboard] =
        useState<LeaderboardColumn>("highScore");

    const boardType1: Board[] = [
        { type: "highScore", label: "Streak" },
        { type: "totalFlips", label: "Total Flips" },
    ];
    const boardType2: Board[] = [
        { type: "totalHeads", label: "Total Heads" },
        { type: "luckScore", label: "Luck" },
    ];

    return (
        <div className="flex items-center justify-center p-4 pt-16 md:pt-4 w-full">
            <div className="max-w-2xl w-full">
                <h2 className="text-3xl font-bold text-center mb-6 text-white tracking-wide">
                    Leaderboards
                </h2>
                <div className="bg-[#384c5c] rounded-2xl shadow-2xl p-4 md:p-8 min-h-[27rem] md:min-h-[31.88rem]">
                    <div className="flex flex-col md:flex-row justify-evenly gap-2 md:gap-4 mb-6">
                        <div className="flex flex-row flex-1 gap-2 md:gap-4">
                            {boardType1.map((board) => {
                                return (
                                    <button
                                        key={board.type}
                                        className={`text-black px-4 py-1 md:py-2 rounded-md flex-1 tracking-wide ${
                                            leaderboard === board.type
                                                ? "bg-[#f1b6cd]"
                                                : "border-[#f1b6cd] border text-white hover:bg-[#f1b6cd4b]"
                                        }`}
                                        onClick={() =>
                                            setLeaderboard(board.type)
                                        }
                                    >
                                        {board.label}
                                    </button>
                                );
                            })}
                        </div>
                        <div className="flex flex-row flex-1 gap-2 md:gap-4">
                            {boardType2.map((board) => {
                                return (
                                    <button
                                        key={board.type}
                                        className={`text-black px-4 py-1 md:py-2 rounded-md flex-1 tracking-wide ${
                                            leaderboard === board.type
                                                ? "bg-[#f1b6cd]"
                                                : "border-[#f1b6cd] border text-white hover:bg-[#f1b6cd4b]"
                                        }`}
                                        onClick={() =>
                                            setLeaderboard(board.type)
                                        }
                                    >
                                        {board.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <LeaderboardDetails leaderboard={leaderboard} />
                </div>
            </div>
        </div>
    );
}
