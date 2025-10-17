"use client";

import { useEffect, useState } from "react";
import {
    getAllAchievements,
    getUserAchievements,
    Achievement,
} from "./actions";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";

export default function AchievementsPage() {
    const [allAchievements, setAllAchievements] = useState<Achievement[]>([]);
    const [unlockedAchievements, setUnlockedAchievements] = useState<
        Set<string>
    >(new Set());
    const [userId, setUserId] = useState<string | null>(null);
    const supabase = createClient();

    useEffect(() => {
        const init = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (user) {
                setUserId(user.id);
                const [all, unlocked] = await Promise.all([
                    getAllAchievements(),
                    getUserAchievements(user.id),
                ]);

                setAllAchievements(all);
                setUnlockedAchievements(
                    new Set(unlocked.map((a: Achievement) => a.id))
                );
            } else {
                redirect("/auth");
                // const all = await getAllAchievements();
                // setAllAchievements(all);
            }
        };

        init();
    }, [supabase.auth]);

    const rarityColors = {
        common: "bg-gray-100 border-gray-300",
        uncommon: "bg-green-100 border-green-300",
        rare: "bg-blue-100 border-blue-300",
        epic: "bg-purple-100 border-purple-300",
        legendary: "bg-yellow-100 border-yellow-300",
    };

    return (
        <div className="p-4 pt-24 w-full">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-4 text-white tracking-wide">
                    Achievements
                </h1>

                <div className="bg-[#384c5c] rounded-2xl shadow-2xl px-4 py-4 md:py-8 md:px-8 mb-12 min-h-[101.75rem] md:min-h-[57.25rem]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {allAchievements.map((achievement) => {
                            const isUnlocked = unlockedAchievements.has(
                                achievement.id
                            );

                            return (
                                <div
                                    key={achievement.id}
                                    className={`border-2 rounded-lg p-4 transition-all ${
                                        isUnlocked
                                            ? rarityColors[
                                                  achievement.rarity as keyof typeof rarityColors
                                              ]
                                            : "bg-gray-50 border-gray-200 opacity-30 grayscale "
                                    }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="text-4xl">
                                            {isUnlocked
                                                ? achievement.icon
                                                : "🔒"}
                                        </div>
                                        <div
                                            className={`flex-1 ${
                                                !isUnlocked
                                                    ? "blur-sm select-none"
                                                    : ""
                                            }`}
                                        >
                                            <h3 className="font-bold text-lg tracking-wide">
                                                {isUnlocked ? (
                                                    <>{achievement.name}</>
                                                ) : (
                                                    <>Nice Try</>
                                                )}
                                            </h3>
                                            <p className="text-sm text-gray-600 mb-2">
                                                {isUnlocked ? (
                                                    <>
                                                        {
                                                            achievement.description
                                                        }
                                                    </>
                                                ) : (
                                                    <>Keep Playing</>
                                                )}
                                            </p>
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="uppercase font-semibold">
                                                    {isUnlocked ? (
                                                        <>
                                                            {achievement.rarity}
                                                        </>
                                                    ) : (
                                                        <>
                                                            Achievements Are
                                                            Earned
                                                        </>
                                                    )}
                                                </span>
                                                <span>
                                                    {isUnlocked ? (
                                                        <>
                                                            {achievement.points}{" "}
                                                            pts
                                                        </>
                                                    ) : (
                                                        <></>
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
