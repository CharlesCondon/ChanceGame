"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";

export async function login(email: string, password: string) {
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        console.log(error);
    }

    revalidatePath("/", "layout");
    redirect("/profile");
}

export async function signup(name: string, email: string, password: string) {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
        console.log(error);
        return;
    }

    if (data.user) {
        createNewUser(data.user.id, name, supabase);
    }

    revalidatePath("/", "layout");
    redirect("/profile");
}

export async function createNewUser(
    id: string,
    name: string,
    supabase: SupabaseClient
) {
    try {
        const { data, error } = await supabase
            .from("users") // Make sure this table exists in your Supabase database
            .insert([
                {
                    id,
                    name,
                    created_at: new Date(),
                },
            ]);

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Error creating user: ", error);
        throw error;
    }
}
