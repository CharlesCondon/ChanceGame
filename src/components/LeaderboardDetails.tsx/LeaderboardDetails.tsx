"use client";

import { useEffect, useState } from "react";
import { getLeaderboardData } from "@/app/scores/actions";

interface LeaderboardUser {
    name: string;
    score: number;
}

export default function LeaderboardDetails({
    leaderboard,
}: {
    leaderboard: string;
}) {
    const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>(
        []
    );
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const data = await getLeaderboardData(leaderboard);
            setLeaderboardData(data);
            setIsLoading(false);
        };

        fetchData();
    }, [leaderboard]);

    if (isLoading) {
        return (
            <div className="text-center py-8">
                <p className="text-white text-lg">Loading...</p>
            </div>
        );
    }

    return (
        <>
            {leaderboardData.length > 0 ? (
                <div className="space-y-3">
                    {leaderboardData.map((user, index) => {
                        const rank = index + 1;
                        return (
                            <div
                                key={`${user.name}-${rank}`}
                                className={`flex items-center justify-between py-2 px-4 md:p-4 rounded-lg ${
                                    rank === 1
                                        ? "bg-yellow-100 border-2 border-yellow-400"
                                        : rank === 2
                                        ? "bg-gray-100 border-2 border-gray-400"
                                        : rank === 3
                                        ? "bg-orange-100 border-2 border-orange-400"
                                        : "bg-gray-50"
                                }`}
                            >
                                <div className="flex items-center md:gap-2">
                                    <div className="text-2xl font-bold text-gray-600 w-6 md:w-8">
                                        {rank}
                                    </div>
                                    <div className="font-semibold text-gray-800 tracking-wider">
                                        {user.name}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-lg md:text-2xl font-bold text-purple-600">
                                        {user.score.toLocaleString("en-US") ||
                                            0}
                                    </span>
                                    <span className="text-sm text-gray-600">
                                        {leaderboard === "highScore" ||
                                        leaderboard === "totalHeads"
                                            ? "heads"
                                            : leaderboard === "totalFlips"
                                            ? "flips"
                                            : ""}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-8">
                    <p className="text-gray-200 text-lg">
                        No scores yet. Be the first to play!
                    </p>
                </div>
            )}
        </>
    );
}
