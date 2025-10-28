"use client";

export default function HacktoberfestBanner() {
  return (
    <div className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 dark:from-indigo-800 dark:via-violet-800 dark:to-pink-700 border-b border-indigo-700/30">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-pink-500 flex items-center justify-center text-white shadow-md animate-bounce-subtle">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
                <path fill="currentColor" d="M12 2a3 3 0 00-3 3v1H8a2 2 0 00-2 2v1H6a2 2 0 00-2 2v4h16v-4a2 2 0 00-2-2h-.99V8a2 2 0 00-2-2h-1V5a3 3 0 00-3-3zM9 20v-2h6v2H9z"/>
              </svg>
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Hacktoberfest 2025 — Get ready to ship</div>
              <div className="text-xs text-white/85">Fork, star, and open a PR to contribute and help others visualize algorithms.</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com/masabinhok/vizit"
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-indigo-700 to-pink-500 text-white shadow-lg hover:scale-102 transition-transform"
            aria-label="Start the repository on GitHub"
          >
            Start the repo
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7l3-7z" />
            </svg>
          </a>

          <a
            href="https://hacktoberfest.com/register/"
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border border-white/30 text-white/95 bg-white/5 hover:bg-white/10 transition-colors"
            aria-label="Register for Hacktoberfest"
          >
            Register
          </a>

          <a
            href="https://github.com/masabinhok/vizit/issues"
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border border-white/30 text-white/95 bg-white/5 hover:bg-white/10 transition-colors"
            aria-label="View issues to contribute"
          >
            Find issues
          </a>
        </div>
      </div>
    </div>
  );
}
