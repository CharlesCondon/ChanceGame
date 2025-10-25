"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {
    getUserStats,
    getAchievementStats,
    UserStats,
    AchievementStats,
} from "./actions";
import { redirect } from "next/navigation";

export default function Stats() {
    const [userStats, setUserStats] = useState<UserStats | null>(null);
    const [achievementStats, setAchievementStats] =
        useState<AchievementStats | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const init = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                redirect("/auth");
                return;
            }

            const [stats, achievements] = await Promise.all([
                getUserStats(user.id),
                getAchievementStats(user.id),
            ]);

            setUserStats(stats);
            setAchievementStats(achievements);
            setLoading(false);
        };

        init();
    }, [supabase.auth]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-white text-xl">Loading stats...</div>
            </div>
        );
    }

    if (!userStats) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-white text-xl">No stats available</div>
            </div>
        );
    }

    const totalTails = userStats.totalFlips - userStats.totalHeads;
    const headsPercentage =
        userStats.totalFlips > 0
            ? ((userStats.totalHeads / userStats.totalFlips) * 100).toFixed(2)
            : "0.00";
    const tailsPercentage =
        userStats.totalFlips > 0
            ? ((totalTails / userStats.totalFlips) * 100).toFixed(2)
            : "0.00";
    const accountAge = Math.floor(
        (Date.now() - new Date(userStats.created_at).getTime()) /
            (1000 * 60 * 60 * 24)
    );
    const avgFlipsPerDay =
        accountAge > 0
            ? (userStats.totalFlips / accountAge).toFixed(1)
            : userStats.totalFlips.toString();
    const completionRate = achievementStats
        ? ((achievementStats.unlocked / achievementStats.total) * 100).toFixed(
              0
          )
        : "0";

    const luckDeviation = (userStats.luckScore - 5).toFixed(2);
    const luckStatus =
        parseFloat(luckDeviation) > 0
            ? "Lucky"
            : parseFloat(luckDeviation) < 0
            ? "Unlucky"
            : "Neutral";

    const rarityColors = {
        common: "bg-gray-200 text-gray-800",
        uncommon: "bg-green-200 text-green-800",
        rare: "bg-blue-200 text-blue-800",
        epic: "bg-purple-200 text-purple-800",
        legendary: "bg-yellow-200 text-yellow-800",
    };

    return (
        <div className="flex items-center justify-center p-4 pt-16 mb-10 md:pt-24 w-full">
            <div className="max-w-2xl w-full">
                <h1 className="text-4xl font-bold text-center mb-8 text-white tracking-wide">
                    Your Statistics
                </h1>

                {/* Hero Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-[#384c5c] rounded-xl p-6 text-center">
                        <div className="text-sm text-gray-300 mb-2">
                            Total Flips
                        </div>
                        <div className="text-3xl font-bold text-white">
                            {userStats.totalFlips.toLocaleString()}
                        </div>
                    </div>
                    <div className="bg-[#384c5c] rounded-xl p-6 text-center">
                        <div className="text-sm text-gray-300 mb-2">
                            High Score
                        </div>
                        <div className="text-3xl font-bold text-purple-400">
                            {userStats.highScore}
                        </div>
                    </div>
                    <div className="bg-[#384c5c] rounded-xl p-6 text-center">
                        <div className="text-sm text-gray-300 mb-2">
                            Luck Score
                        </div>
                        <div className="text-3xl font-bold text-blue-400">
                            {userStats.luckScore.toFixed(2)}
                        </div>
                    </div>
                    <div className="bg-[#384c5c] rounded-xl p-6 text-center">
                        <div className="text-sm text-gray-300 mb-2">
                            Achievements
                        </div>
                        <div className="text-3xl font-bold text-yellow-400">
                            {achievementStats?.unlocked || 0} /{" "}
                            {achievementStats?.total || 0}
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-2 gap-6 mb-6">
                    {/* Flip Distribution */}
                    <div className="bg-[#384c5c] rounded-xl p-6">
                        <h2 className="text-2xl font-bold text-white mb-6">
                            Flip Distribution
                        </h2>
                        <div className="space-y-4">
                            {/* Heads */}
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-300 flex items-center gap-2">
                                        <span className="text-2xl">🟡</span>{" "}
                                        Heads
                                    </span>
                                    <span className="text-white font-semibold">
                                        {userStats.totalHeads.toLocaleString()}{" "}
                                        ({headsPercentage}%)
                                    </span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-4">
                                    <div
                                        className="bg-yellow-400 h-4 rounded-full transition-all"
                                        style={{ width: `${headsPercentage}%` }}
                                    />
                                </div>
                            </div>
                            {/* Tails */}
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-300 flex items-center gap-2">
                                        <span className="text-2xl">⚪</span>{" "}
                                        Tails
                                    </span>
                                    <span className="text-white font-semibold">
                                        {totalTails.toLocaleString()} (
                                        {tailsPercentage}%)
                                    </span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-4">
                                    <div
                                        className="bg-gray-400 h-4 rounded-full transition-all"
                                        style={{ width: `${tailsPercentage}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Luck Analysis */}
                        <div className="mt-6 pt-6 border-t border-gray-600">
                            <h3 className="text-lg font-semibold text-white mb-3">
                                Luck Analysis
                            </h3>
                            <div className="bg-gray-700/50 rounded-lg p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-300">
                                        Status:
                                    </span>
                                    <span
                                        className={`font-bold ${
                                            luckStatus === "Lucky"
                                                ? "text-green-400"
                                                : luckStatus === "Unlucky"
                                                ? "text-red-400"
                                                : "text-gray-400"
                                        }`}
                                    >
                                        {luckStatus}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-300">
                                        Deviation from 50%:
                                    </span>
                                    <span className="text-white font-semibold">
                                        {parseFloat(luckDeviation) > 0
                                            ? "+"
                                            : ""}
                                        {luckDeviation}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Achievement Progress */}
                    <div className="bg-[#384c5c] rounded-xl p-6">
                        <h2 className="text-2xl font-bold text-white mb-6">
                            Achievement Progress
                        </h2>

                        {/* Overall Progress */}
                        <div className="mb-6">
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-300">
                                    Completion
                                </span>
                                <span className="text-white font-semibold">
                                    {completionRate}%
                                </span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-3">
                                <div
                                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all"
                                    style={{ width: `${completionRate}%` }}
                                />
                            </div>
                            <div className="text-center mt-2 text-gray-400 text-sm">
                                {achievementStats?.points || 0} points earned
                            </div>
                        </div>

                        {/* By Rarity */}
                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-white">
                                By Rarity
                            </h3>
                            {Object.entries(
                                achievementStats?.byRarity || {}
                            ).map(([rarity, count]) => (
                                <div
                                    key={rarity}
                                    className="flex items-center justify-between"
                                >
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                            rarityColors[
                                                rarity as keyof typeof rarityColors
                                            ]
                                        }`}
                                    >
                                        {rarity.charAt(0).toUpperCase() +
                                            rarity.slice(1)}
                                    </span>
                                    <span className="text-white font-semibold">
                                        {count}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Recent Unlocks */}
                        {achievementStats &&
                            achievementStats.recentUnlocks.length > 0 && (
                                <div className="mt-6 pt-6 border-t border-gray-600">
                                    <h3 className="text-lg font-semibold text-white mb-3">
                                        Recent Unlocks
                                    </h3>
                                    <div className="space-y-2">
                                        {achievementStats.recentUnlocks.map(
                                            (unlock, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-center gap-3 bg-gray-700/50 rounded-lg p-3"
                                                >
                                                    <span className="text-2xl">
                                                        {unlock.icon}
                                                    </span>
                                                    <div className="flex-1">
                                                        <div className="text-white font-medium">
                                                            {unlock.name}
                                                        </div>
                                                        <div className="text-xs text-gray-400">
                                                            {new Date(
                                                                unlock.unlocked_at
                                                            ).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}
                    </div>
                </div>

                {/* Personal Records */}
                <div className="bg-[#384c5c] rounded-xl p-6">
                    <h2 className="text-2xl font-bold text-white mb-6">
                        Personal Records
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-gray-700/50 rounded-lg p-4 text-center">
                            <div className="text-3xl mb-2">🏆</div>
                            <div className="text-2xl font-bold text-white mb-1">
                                {userStats.highScore}
                            </div>
                            <div className="text-sm text-gray-400">
                                Best Streak
                            </div>
                        </div>
                        <div className="bg-gray-700/50 rounded-lg p-4 text-center">
                            <div className="text-3xl mb-2">📅</div>
                            <div className="text-2xl font-bold text-white mb-1">
                                {accountAge}
                            </div>
                            <div className="text-sm text-gray-400">
                                Days Playing
                            </div>
                        </div>
                        <div className="bg-gray-700/50 rounded-lg p-4 text-center">
                            <div className="text-3xl mb-2">⚡</div>
                            <div className="text-2xl font-bold text-white mb-1">
                                {avgFlipsPerDay}
                            </div>
                            <div className="text-sm text-gray-400">
                                Avg Flips/Day
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
