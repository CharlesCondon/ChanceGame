"use server";

import { createClient } from "@/utils/supabase/server";

interface LeaderboardUser {
    name: string;
    score: number;
}

interface DatabaseUser {
    name: string;
    highScore?: number;
    totalFlips?: number;
    totalHeads?: number;
    luckScore?: number
}

type LeaderboardColumn = "highScore" | "totalFlips" | "totalHeads" | "luckScore";

export async function getLeaderboardData(order: LeaderboardColumn): Promise<LeaderboardUser[]> {
    const supabase = await createClient();

    try {
        const { data, error } = await supabase
            .from("users")
            .select(`name, ${order}`)
            .order(order, { ascending: false })
            .limit(5);

        if (error || !data) {
            console.error("Database fetching error: ", error);
            return [];
        }
        
        const formattedData: LeaderboardUser[] = data.map((user: DatabaseUser) => {
            return {name: user.name as string, score: user[order] as number}
        })

        return formattedData;
    } catch (error) {
        console.error("Error fetching user data:", error);
        return [];
    }
}
