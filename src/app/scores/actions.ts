"use server";

import { createClient } from "@/utils/supabase/server";

interface LeaderboardUser {
    name: string;
    highScore: number;
}

export async function getLeaderboardData(): Promise<LeaderboardUser[]> {
    const supabase = await createClient();

    try {
        const { data, error } = await supabase
            .from("users")
            .select("name, highScore")
            .order("highScore", { ascending: false })
            .limit(5);

        if (error || !data) {
            console.error("Database fetching error: ", error);
            return [];
        }
        return data as LeaderboardUser[];
    } catch (error) {
        console.error("Error fetching user data:", error);
        return [];
    }
}
