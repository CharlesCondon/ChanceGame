import * as React from "react";

export default function Footer() {
    return (
        <footer className=" px-4 sm:px-6 lg:px-8 absolute bottom-0 w-full">
            <div className="text-gray-400 text-xs md:text-sm flex row justify-between items-center pb-2 max-w-7xl mx-auto ">
                <p>
                    Made by
                    <a
                        href="https://www.charlescon.com/"
                        className={`hover:text-white pl-1 underline`}
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        Charles
                    </a>
                </p>
                <p>
                    <a
                        href="https://youtu.be/GNo_BZIWIdg?si=p5tlGZweiEKg86Xf&t=1373"
                        className={`hover:text-white`}
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        Origin
                    </a>
                </p>
            </div>
        </footer>
    );
}
