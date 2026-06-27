# Hobbies — archived (not built)

Removed from the live site on 2026-06-27 during the job-search revamp: hobbies/habits
carry no recruiter signal, so the routes, nav entries, and Habits page were dropped.
The **Hobbies** content is parked here in case it's wanted later. Nothing in this
`archive/` folder is built by Astro or served (Astro only builds `src/pages/` and
copies `public/`).

## What's here
- `Hobbies.desktop.tsx` — former `src/components/pages/Hobbies.tsx`
- `Hobbies.mobile.tsx`  — former `src/components/pages/mobile/Hobbies.tsx`
- `anime.json`          — former `src/data/anime.json` (watchlist)
- `books.json`          — former `src/data/books.json` (reading list)

## To restore
1. Move the components back to `src/components/pages/Hobbies.tsx` and
   `src/components/pages/mobile/Hobbies.tsx`.
2. Move `anime.json` / `books.json` back to `src/data/`.
3. Re-add the lazy import + `<Route path="/hobbies">` in `src/components/ReactApp.tsx`.
4. Re-create `src/pages/hobbies.astro` (copy any other page shell, swap SEO props).
5. Re-add the nav entry in `src/components/Navbar.tsx` (and the mobile hero tile in
   `src/components/pages/mobile/Landing.tsx` if wanted).
6. Before re-publishing: the desktop page had a dead **"Spotify integration coming
   soon…"** placeholder card — remove or finish it.

## Habits (deleted, not archived)
The Habits page + `habits.json` were deleted outright (recoverable from git history at
commit prior to this change). The log had gone stale (last entry 2026-03-14), which is
why it wasn't worth keeping.
