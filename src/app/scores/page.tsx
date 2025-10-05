import { getLeaderboardData } from "./actions";

interface LeaderboardUser {
    name: string;
    highScore: number | null;
}

export default async function Scores() {
    const leaderboardData: LeaderboardUser[] =
        (await getLeaderboardData()) ?? [];

    return (
        <div className="min-h-screen bg-[#1b1b27] flex items-center justify-center p-4 pt-20">
            <div className="max-w-2xl w-full">
                <div className="bg-[#29293b] rounded-2xl shadow-2xl p-8">
                    <h2 className="text-3xl font-bold text-center  mb-6">
                        Leaderboard
                    </h2>

                    {leaderboardData && leaderboardData.length > 0 ? (
                        <div className="space-y-3">
                            {leaderboardData.map((user, index) => {
                                const rank = index + 1;
                                return (
                                    <div
                                        key={user.name}
                                        className={`flex items-center justify-between p-4 rounded-lg ${
                                            rank === 1
                                                ? "bg-yellow-100 border-2 border-yellow-400"
                                                : rank === 2
                                                ? "bg-gray-100 border-2 border-gray-400"
                                                : rank === 3
                                                ? "bg-orange-100 border-2 border-orange-400"
                                                : "bg-gray-50"
                                        }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="text-2xl font-bold text-gray-600 w-8">
                                                {rank}
                                            </div>
                                            <div className="font-semibold text-gray-800">
                                                {user.name}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl font-bold text-purple-600">
                                                {user.highScore || 0}
                                            </span>
                                            <span className="text-sm text-gray-600">
                                                heads
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-600 text-lg">
                                No scores yet. Be the first to play!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
