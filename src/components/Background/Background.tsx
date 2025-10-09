export default function Background() {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-[#172a38] via-[#1C3139] to-[#0E1C26]">
            {/* Floating circles */}
            {[...Array(10)].map((_, i) => (
                <div
                    key={i}
                    className="absolute rounded-full bg-white opacity-[3%] animate-float md:hidden"
                    style={{
                        width: `${Math.random() * 100 + 50}px`,
                        height: `${Math.random() * 100 + 50}px`,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 5}s`,
                        animationDuration: `${Math.random() * 10 + 10}s`,
                    }}
                />
            ))}
            {[...Array(50)].map((_, i) => (
                <div
                    key={i}
                    className="absolute rounded-full bg-white opacity-[3%] animate-float hidden md:block"
                    style={{
                        width: `${Math.random() * 100 + 50}px`,
                        height: `${Math.random() * 100 + 50}px`,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 5}s`,
                        animationDuration: `${Math.random() * 10 + 10}s`,
                    }}
                />
            ))}
        </div>
    );
}
