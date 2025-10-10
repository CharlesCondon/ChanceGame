"use server";

import { createClient } from "@/utils/supabase/server";

interface LeaderboardUser {
    name: string;
    score: number;
}

export async function getLeaderboardData(order: string): Promise<LeaderboardUser[]> {
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
        
        const formattedData: LeaderboardUser[] = data.map((user) => {
            return {name: user.name, score:user[order]}
        })

        return formattedData;
    } catch (error) {
        console.error("Error fetching user data:", error);
        return [];
    }
}
