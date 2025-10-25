"use server";

import { createClient } from "@/utils/supabase/server";

export interface UserStats {
    name: string;
    highScore: number;
    totalFlips: number;
    totalHeads: number;
    luckScore: number;
    created_at: string;
}

export interface AchievementStats {
    total: number;
    unlocked: number;
    points: number;
    byRarity: {
        common: number;
        uncommon: number;
        rare: number;
        epic: number;
        legendary: number;
    };
    recentUnlocks: Array<{
        name: string;
        icon: string;
        unlocked_at: string;
    }>;
}

export async function getUserStats(userId: string): Promise<UserStats | null> {
    const supabase = await createClient();

    try {
        const { data, error } = await supabase
            .from("users")
            .select("name, highScore, totalFlips, totalHeads, luckScore, created_at")
            .eq("id", userId)
            .single();

        if (error || !data) {
            console.error("Error fetching user stats:", error);
            return null;
        }

        return data;
    } catch (error) {
        console.error("Error in getUserStats:", error);
        return null;
    }
}

export async function getAchievementStats(userId: string): Promise<AchievementStats | null> {
    const supabase = await createClient();

    try {
        // Get total achievements
        const { count: totalCount } = await supabase
            .from("achievements")
            .select("*", { count: "exact", head: true });

        // Get user's unlocked achievements with details
        const { data: unlockedData, error } = await supabase
            .from("user_achievements")
            .select(`
                unlocked_at,
                achievements (
                    name,
                    icon,
                    rarity,
                    points
                )
            `)
            .eq("user_id", userId)
            .order("unlocked_at", { ascending: false });

        if (error) {
            console.error("Error fetching achievement stats:", error);
            return null;
        }

        // Calculate stats
        const unlocked = unlockedData?.length || 0;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const points = unlockedData?.reduce((sum: number, item: any) => 
            sum + (item.achievements?.points || 0), 0) || 0;

        const byRarity = {
            common: 0,
            uncommon: 0,
            rare: 0,
            epic: 0,
            legendary: 0,
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        unlockedData?.forEach((item: any) => {
            const rarity = item.achievements?.rarity;
            if (rarity && rarity in byRarity) {
                byRarity[rarity as keyof typeof byRarity]++;
            }
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const recentUnlocks = unlockedData?.slice(0, 5).map((item: any) => ({
            name: item.achievements?.name || "Unknown",
            icon: item.achievements?.icon || "🏆",
            unlocked_at: item.unlocked_at,
        })) || [];

        return {
            total: totalCount || 0,
            unlocked,
            points,
            byRarity,
            recentUnlocks,
        };
    } catch (error) {
        console.error("Error in getAchievementStats:", error);
        return null;
    }
}