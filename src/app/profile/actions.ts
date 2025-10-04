"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";

export async function getUserData(id: string) {
    const supabase = await createClient();

    try {
        const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", id)
            .single();

        if (error || !data) {
            console.error("Database fetching error: ", error);
        }
        return data;
    } catch (error) {
        console.error("Error fetching user data:", error);
        return {};
    }
}
