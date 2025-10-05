"use client";

type FlipResult = {
    id: number;
    result: "heads" | "tails";
    timestamp: number;
};

type FlipHistoryProps = {
    history: FlipResult[];
};

export default function FlipHistory({ history }: FlipHistoryProps) {
    return (
        <div className="hidden lg:block fixed right-8 top-16 bottom-8 w-20">
            <div className="h-full flex flex-col-reverse gap-2 overflow-hidden">
                {history.map((flip, index) => (
                    <div
                        key={flip.id}
                        className={`w-16 h-16 min-h-16 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg animate-slide-up ${
                            flip.result === "heads"
                                ? "bg-yellow-400 text-yellow-900"
                                : "bg-gray-400 text-gray-900"
                        }`}
                        style={{
                            animation: `slideUp 0.3s ease-out`,
                            opacity: Math.max(0.3, 1 - index * 0.1),
                        }}
                    >
                        {flip.result === "heads" ? "H" : "T"}
                    </div>
                ))}
            </div>

            <style jsx>{`
                @keyframes slideUp {
                    from {
                        transform: translateY(100px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
}
