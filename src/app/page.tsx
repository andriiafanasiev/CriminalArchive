import Link from 'next/link';

export default function Home() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white rounded-3xl shadow-lg p-25 flex flex-col items-center w-full max-w-2xl">
                <Link
                    href="/cases"
                    className="block px-12 py-6 bg-black text-white text-2xl rounded-lg shadow text-center hover:bg-gray-900 transition font-normal"
                >
                    Переглянути справи
                </Link>
            </div>
        </div>
    );
}
