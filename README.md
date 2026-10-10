# Terraform & Infrastructure as Code: presentation

Next.js 14 (static export), TypeScript, Tailwind, Framer Motion.

    npm install
    npm run dev        # http://localhost:3000
    npm run typecheck && npm run lint && npm run build   # build output goes to ./out

- Audience view: `/`   Presenter view (notes, next slide, timer): `/presenter` (or press P)
- Keys: Right/Space next, Left previous, Home/End first/last, F fullscreen, Esc exit fullscreen, P presenter
- Content: `data/*.tsx` (one file per section). Sections and colors: `data/sections.ts`
- Set `SHOW_DEMO = true` in `data/slides.ts` to append the component demo slides
- Deploy: push to GitHub, import the repo in Vercel (no settings needed)
