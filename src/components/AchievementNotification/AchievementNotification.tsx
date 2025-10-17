"use client";

import { useEffect, useState } from "react";
import { Achievement } from "@/app/achievements/actions";

interface AchievementNotificationProps {
    achievement: Achievement | null;
    onClose: () => void;
}

export default function AchievementNotification({
    achievement,
    onClose,
}: AchievementNotificationProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (achievement) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(onClose, 300); // Wait for fade out animation
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [achievement, onClose]);

    if (!achievement) return null;

    const rarityColors = {
        common: "bg-gray-300 border-gray-500",
        uncommon: "bg-green-300 border-green-500",
        rare: "bg-blue-300 border-blue-500",
        epic: "bg-purple-300 border-purple-500",
        legendary: "bg-yellow-300 border-yellow-500",
    };

    return (
        <div
            className={`fixed top-24 right-8 z-50 transform transition-all duration-300 ${
                isVisible
                    ? "translate-x-0 opacity-100"
                    : "translate-x-full opacity-0"
            }`}
        >
            <div
                className={`achievement-shadow ${
                    rarityColors[
                        achievement.rarity as keyof typeof rarityColors
                    ]
                } text-black rounded-lg shadow-2xl p-6 max-w-sm border-1 border-white/20`}
            >
                <div className="flex items-center gap-4">
                    <div className="text-5xl">{achievement.icon}</div>
                    <div className="flex-1">
                        <div className="text-xs uppercase tracking-wider opacity-90 mb-1">
                            Achievement Unlocked!
                        </div>
                        <div className="font-bold text-xl mb-1">
                            {achievement.name}
                        </div>
                        <div className="text-sm opacity-90 text-gray-600">
                            {achievement.description}
                        </div>
                        <div className="text-xs mt-2 opacity-75">
                            +{achievement.points} points
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
