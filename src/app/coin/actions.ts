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

export async function updateTotalFlips(id: string, score: number) {
    const supabase = await createClient();

    try {
        console.log("updating user's toal flips: " + score);
        const { error } = await supabase
            .from("users")
            .update({ totalFlips: score })
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
        console.log("Updating user high score");
        const { data, error } = await supabase
            .from("users")
            .select("highScore, totalFlips")
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
