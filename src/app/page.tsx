export default function Home() {
    return (
        <div className="sm:min-h-screen flex items-center justify-center p-4 pt-[30vh] sm:pt-4">
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
                        className="bg-[#f1b6cd] hover:bg-[#d697af] text-gray-900 font-bold py-4 px-8 rounded-lg text-xl transition-colors tracking-wider"
                    >
                        Play Game
                    </a>
                </div>
            </div>
        </div>
    );
}
