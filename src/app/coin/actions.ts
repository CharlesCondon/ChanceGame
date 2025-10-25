"use server";

import { createClient } from "@/utils/supabase/server";

export async function updateHighScore(id: string, score: number) {
    const supabase = await createClient();

    try {
        console.log("updating user score " + score);
        console.log(id);
        const { error } = await supabase
            .from("users")
            .update({ highScore: score })
            .eq("id", id);

        if (error) {
            console.error("Database update error: ", error);
        }
    } catch (error) {
        console.error("Error updating user data:", error);
        return {};
    }
}

function calculateLuckScore(totalHeads: number, totalFlips: number, highScore: number): number {
    if (totalFlips === 0) return 50.0;
    
    const headsPercentage = totalHeads / totalFlips;
    const headsDeviation = Math.abs(headsPercentage - 0.5) * 100;
    const headsScore = 50 + (headsPercentage > 0.5 ? headsDeviation : -headsDeviation);
    
    const streakProbability = Math.pow(0.5, highScore);
    const streakScore = 50 + (50 * (1 - Math.min(1, streakProbability * 1000)));
    
    const luckScore = (headsScore * 0.7) + (streakScore * 0.3);
    
    return parseFloat((Math.min(100, Math.max(0, luckScore)) / 10).toFixed(2));
}

export async function updateTotalHeads(id: string, score: number, totalFlips: number, luckScore: number, bestStreak: number) {
    const supabase = await createClient();

    let newLuck = calculateLuckScore(score, totalFlips, bestStreak)
    if (newLuck === luckScore) {
        newLuck = luckScore;
    }

    try {
        const { error } = await supabase
            .from("users")
            .update({ totalHeads: score,  luckScore: newLuck, totalFlips: totalFlips})
            .eq("id", id);

        if (error) {
            console.error("Database update error: ", error);
        }
    } catch (error) {
        console.error("Error updating user data:", error);
        return {};
    }
}

export async function getUserHighScore(userId: string) {
    const supabase = await createClient();

    try {
        const { data, error } = await supabase
            .from("users")
            .select("highScore, totalFlips, totalHeads, luckScore")
            .eq("id", userId)
            .single();

        if (error) {
            console.error("Error fetching high score:", error);
            return 0;
        }

        return data;
    } catch (error) {
        console.error("Error fetching user high score:", error);
        return 0;
    }
}
