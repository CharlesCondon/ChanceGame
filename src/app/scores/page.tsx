export default function Scores() {
    const mockScores = [
        { rank: 1, username: "CoinMaster", streak: 15 },
        { rank: 2, username: "HeadsUp", streak: 12 },
        { rank: 3, username: "LuckyFlipper", streak: 10 },
        { rank: 4, username: "Player123", streak: 8 },
        { rank: 5, username: "FlipKing", streak: 7 },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center p-4 pt-20">
            <div className="max-w-2xl w-full">
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
                        Leaderboard
                    </h2>

                    <div className="space-y-3">
                        {mockScores.map((score) => (
                            <div
                                key={score.rank}
                                className={`flex items-center justify-between p-4 rounded-lg ${
                                    score.rank === 1
                                        ? "bg-yellow-100 border-2 border-yellow-400"
                                        : score.rank === 2
                                        ? "bg-gray-100 border-2 border-gray-400"
                                        : score.rank === 3
                                        ? "bg-orange-100 border-2 border-orange-400"
                                        : "bg-gray-50"
                                }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="text-2xl font-bold text-gray-600 w-8">
                                        {score.rank}
                                    </div>
                                    <div className="font-semibold text-gray-800">
                                        {score.username}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-bold text-purple-600">
                                        {score.streak}
                                    </span>
                                    <span className="text-sm text-gray-600">
                                        heads
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 text-center text-sm text-gray-500">
                        Leaderboard will be updated with real data from Supabase
                    </div>
                </div>
            </div>
        </div>
    );
}
