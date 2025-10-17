"use server";

import { createClient } from "@/utils/supabase/server";

export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    req_type: string;
    req: number;
    rarity: string;
    points: number;
}

export interface UserAchievement extends Achievement {
    unlocked_at: string;
}

export async function getAllAchievements(): Promise<Achievement[]> {
    const supabase = await createClient();

    try {
        const { data, error } = await supabase
            .from("achievements")
            .select("*")
            .order("points", { ascending: true });

        if (error) {
            console.error("Error fetching achievements:", error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error("Error in getAllAchievements:", error);
        return [];
    }
}

export async function getUserAchievements(userId: string): Promise<UserAchievement[]> {
    const supabase = await createClient();

    try {
        const { data, error } = await supabase
            .from("user_achievements")
            .select(`
                unlocked_at,
                achievements (*)
            `)
            .eq("user_id", userId)
            .order("unlocked_at", { ascending: false });

        if (error) {
            console.error("Error fetching user achievements:", error);
            return [];
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return data?.map((item: any) => ({
            ...item.achievements,
            unlocked_at: item.unlocked_at,
        })) || [];
    } catch (error) {
        console.error("Error in getUserAchievements:", error);
        return [];
    }
}

export async function checkAchievements(
    userId: string,
    stats: {
        totalFlips: number;
        totalHeads: number;
        highScore: number;
    }
): Promise<{ newlyUnlocked: Achievement[] }> {
    const supabase = await createClient();

    try {
        const { data, error } = await supabase.rpc('check_and_unlock_achievements', {
            p_user_id: userId,
            p_total_flips: stats.totalFlips,
            p_total_heads: stats.totalHeads,
            p_high_score: stats.highScore,
        });

        if (error) {
            console.error("Error checking achievements:", error);
            return { newlyUnlocked: [] };
        }

        return { newlyUnlocked: data || [] };
    } catch (error) {
        console.error("Error in checkAchievements:", error);
        return { newlyUnlocked: [] };
    }
}