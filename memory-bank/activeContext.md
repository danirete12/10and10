# Active Context — 10and10

## Current Status
**Phase**: Pre-development. Scaffold + planning complete.
**Branch**: main
**Last activity**: RooFlow integration + roadmap creation (2026-05-03)

## What Was Just Completed
1. Project scaffolded with CLAUDE.md, README, docs/ structure
2. 10 specialized agents created in `.claude/agents/` (adapted from the-noir-studio project)
3. 10 generic skills copied to `.claude/skills/`
4. Full 4-phase roadmap written in `docs/roadmap.md`
5. GitHub repo created at github.com/danirete12/10and10 and initial commit pushed
6. RooFlow integrated (`.roo/`, `.roomodes`, `modules/`, `memory-bank/`)

## What's Next (Phase 1, Task 1.1)
Initialize the actual Next.js application:
```
cd app/
npx create-next-app@latest . --typescript --tailwind --app --src-dir=false
```

Then define the Prisma schema in `db/schema.prisma`.

## Open Questions (the 6 architectural decisions from roadmap)
- **D1**: Slug structure for watches — team recommends `[brand]-[commercial-name]-[reference]`
- **D2**: Movement as separate entity — team recommends yes
- **D3**: Data strategy — team recommends hybrid (20 brands + 100 curated watches)
- **D4**: Collection privacy — team recommends private by default
- **D5**: Auth gates — view/search/read without login; write/save with login
- **D6**: GitHub account confirmed at github.com/danirete12

## Key Files
- `docs/roadmap.md` — full 4-phase roadmap
- `CLAUDE.md` — agent map and stack reference
- `.claude/agents/` — 10 specialized agents
- `.claude/skills/` — 10 generic skills
