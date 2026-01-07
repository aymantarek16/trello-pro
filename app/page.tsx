import Link from "next/link";

export default function Home() {
  return (
    // <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10">
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-zinc-800">

      <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-6xl mb-4">
        Trello Pro
      </h1>
      <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-lg text-center">
        A premium, glassmorphic experience for your tasks.
        <br />
        Built with Next.js, Tailwind, and Zustand.
      </p>

      <div className="flex gap-4">
        <Link
          href="/boards"
          className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/25"
        >
          Go to Boards
        </Link>
      </div>
    </main>
  );
}
