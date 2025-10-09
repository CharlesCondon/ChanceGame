import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getUserData } from "./actions";

export default async function Profile() {
    const supabase = createClient();

    const {
        data: { user },
    } = await (await supabase).auth.getUser();

    if (!user) {
        redirect("/auth");
    }

    const userData = await getUserData(user.id);

    const handleSignOut = async () => {
        "use server";
        const supabase = await createClient();
        await supabase.auth.signOut();
        redirect("/");
    };

    return (
        <div className="sm:min-h-screen flex items-center justify-center p-4 pt-24 md:pt-4">
            <div className="max-w-2xl w-full">
                <div className="bg-[#384c5c] rounded-2xl shadow-2xl p-8">
                    <div className="text-center mb-8">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <span className="text-white text-4xl font-bold">
                                {userData?.name?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-4 mb-8">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                Username
                            </label>
                            <div className="text-lg text-gray-800">
                                {userData?.name}
                            </div>
                        </div>

                        <div className="flex row gap-4">
                            <div className="bg-gray-50 rounded-lg p-4 flex-1">
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    High Score
                                </label>
                                <div className="text-lg text-gray-800">
                                    {userData?.highScore}
                                </div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 flex-1">
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    Total Flips
                                </label>
                                <div className="text-lg text-gray-800">
                                    {userData?.totalFlips.toLocaleString(
                                        "en-US"
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                Account Created
                            </label>
                            <div className="text-lg text-gray-800">
                                {userData?.created_at
                                    ? new Date(
                                          userData.created_at
                                      ).toLocaleDateString()
                                    : "N/A"}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <a
                            href="/coin"
                            className="flex-1 bg-[#f1b6cd] hover:bg-[#cf93aa] text-gray-800 py-3 px-6 rounded-lg text-center transition-colors"
                        >
                            Play Game
                        </a>
                        <a
                            href="/scores"
                            className="flex-1 bg-blue-100 hover:bg-blue-200 text-gray-800 py-3 px-6 rounded-lg text-center transition-colors"
                        >
                            View Scores
                        </a>
                    </div>

                    <div className="mt-6">
                        <form action={handleSignOut}>
                            <button
                                type="submit"
                                className="w-full bg-red-300 hover:bg-red-400 text-gray-800 py-2 px-6 rounded-lg transition-colors"
                            >
                                Sign Out
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
