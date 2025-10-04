export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
            <div className="text-center space-y-8 max-w-2xl">
                <h1 className="text-6xl font-bold text-white mb-4">
                    A Game of Chance
                </h1>
                <p className="text-xl text-gray-200 mb-8">
                    How many heads can you flip in a row?
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                        href="/coin"
                        className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-4 px-8 rounded-lg text-xl transition-colors"
                    >
                        Play Game
                    </a>
                </div>
            </div>
        </div>
    );
}
