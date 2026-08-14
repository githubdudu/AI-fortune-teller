# ArcanaVerse — Project Fact Sheet

Reference sheet of verified facts about this project, for generating resume bullets,
portfolio blurbs, and interview talking points tailored to different roles.
Everything below is taken from the repository itself, not from memory.

---

## 1. At a glance

| | |
|---|---|
| **Name** | ArcanaVerse (repo `group-project-42`; Docker images `fortune-frontend` / `fortune-backend`) |
| **What it is** | AI-powered fortune telling and tarot card reading web app |
| **Live demo** | https://ai-fortune-teller-fe-demo.up.railway.app/home |
| **Shape** | Monorepo: React 19 SPA + ASP.NET Core 8 REST API |
| **Origin** | University of Auckland group project (COMPSCI, 2025), continued solo afterwards |
| **Timeline** | First commit 2025-03-17 → still active 2026-08 |
| **Commits** | 597 total across 11 contributors |
| **My share** | 309 of 597 commits (~52%) under `dudu_win10` + `githubdudu` — the largest contributor |
| **Size** | ~7.9k lines frontend (JS/JSX/CSS), ~4.7k lines backend (C#) |
| **Tests** | 78 frontend assertions (Vitest + Testing Library), 24 backend tests (xUnit + Moq) |

**One-line pitch:** A full-stack, production-deployed AI application — Firebase auth,
token-streaming LLM readings, clean-architecture .NET API, containerised and shipped to
Kubernetes by CI on every merge.

---

## 2. Tech stack (verified against source)

### Frontend — `frontend/`
- **React 19** + **Vite 6** (`@vitejs/plugin-react-swc`)
- **React Router 7** — routed pages: Fortune, Gallery, UserInput, UserInfoInput, SignUp,
  UserProfile, RootLayout, NotFound
- **State**: React Context + **Immer** (`AppContextProvider`, used in 19 files) for app state;
  **Zustand** for cross-cutting UI slices (`audioStore`, `modalStore`)
- **UI**: **Gestalt** (Pinterest's design system) + **Tailwind CSS 4**
- **Motion** (Framer Motion successor) for animation, **Swiper** for carousels,
  **Sonner** for toasts, **@floating-ui/react** for popovers
- **Auth**: **Firebase Authentication** (Google SSO + email/password) via `react-firebase-hooks`
- **HTTP**: Axios (`utils/apiClient.js`), streaming via a custom `useFortuneStream` hook
- **Markdown**: `marked` / `showdown`, sanitised with **DOMPurify** before render
- **Quality**: ESLint 9 (flat config), Prettier, Husky + lint-staged pre-commit hook
- **Testing**: Vitest 3, Testing Library, jsdom, `axios-mock-adapter`
- Custom hooks written for the project: `useFortuneStream`, `useCardTilt`, `useCardSelection`,
  `useStickToBottom`, `useIdleFloat`, `useAudio`, `useFetchTarotCards`, `useToggle`, `useMountStatus`

### Backend — `backend/Api/`
- **ASP.NET Core 8**, clean layered architecture:
  `Controllers/V1` → `Services/Implementations` (behind interfaces) →
  `Repositories` (generic `IRepository<T>` + 5 domain repos) → `ApplicationDbContext`
- **Entity Framework Core** — InMemory provider in Development, **SQL Server** in Production,
  migrations applied automatically on startup
- **API versioning** — `api/v{version:apiVersion}/[controller]`, selectable by URL segment,
  `X-Api-Version` header, or query string
- **Dual auth** — JWT bearer (also read from an `auth_token` cookie) as the primary API auth,
  plus **Firebase Admin SDK** token verification that upserts a local `User` on login
- **OpenAI Chat Completions** (`gpt-4o`) via a singleton `IOpenAIClient` exposing both
  a sync `GenerateTextAsync` and a streaming `GenerateTextStreamAsync`
- **Server-Sent Events** — `FortunesController.StreamFortuneAsync` writes `text/event-stream`
  directly to `Response.Body` so readings render token-by-token
- **Rate limiting** — .NET `PartitionedRateLimiter` keyed on the JWT email claim
  (100 req/hour global, 20 req/hour on the OpenAI endpoints), returning HTTP 429
- **Centralised error handling** — `GlobalExceptionMiddleware`; production responses omit
  exception detail, logging it instead
- **Swagger / OpenAPI** with per-version documents
- **Testing**: xUnit + Moq over services and repositories
- `Tools/TokenGenerator` — standalone console app minting long-lived test JWTs

### Infrastructure
- **Docker** images for both services, built via per-service `build.sh`
- **Kubernetes** manifests (`kubernetes/`): backend + frontend Deployments, Services,
  Ingress routing `/api/*` → backend and `/*` → frontend, plus a secrets template
- **GitHub Actions** (`.github/workflows/main.yml`): on every PR/push, frontend
  `prettier:check → eslint → vitest` and backend `dotnet build && dotnet test` run as
  required checks; on merge to `main` it builds and pushes both images (tagged `1.0.<run>`),
  generates the `backend-secrets` Secret at deploy time (DB connection string, OpenAI key,
  Firebase credentials — never committed), and rolls out to **DigitalOcean Kubernetes**
- **Cloud services**: AWS S3, Amazon RDS for SQL Server, Firebase, DigitalOcean, OpenRouter
- **Design**: Figma

---

## 3. Notable engineering decisions (the interesting parts)

**Token-streamed AI readings.** Rather than making the user wait on a full LLM completion,
the backend streams chunks over SSE and the frontend's `useFortuneStream` +
`useStickToBottom` hooks render text as it arrives with the viewport following it.
Cancellation propagates end-to-end through `CancellationToken`.

**Rate limiting that costs money if you get it wrong.** OpenAI calls are metered
per-authenticated-user (email claim as partition key), not per-IP, so a shared NAT doesn't
punish everyone and an anonymous flood can't burn the API budget.

**Procedurally synthesised audio, zero audio assets.** `utils/audioEngine.js` builds the
entire ambient soundtrack with the Web Audio API — a slow detuned pad walking a fixed chord
set with sparse random bell tones, plus one-shot effect voices from the same primitives.
Nothing ships, downloads, or decodes. Respects the browser gesture requirement (no
`AudioContext` until `unlock()`) which also keeps it inert under jsdom in tests.

**Secrets never touch the repo.** Firebase service-account credentials are loaded from a raw
JSON *config value* (`GoogleCredential.FromJson`), not a file, so Kubernetes can inject them
as `Firebase__Credentials` from a Secret generated during deploy.

**Environment parity without environment pain.** Development runs on EF Core's InMemory
provider so a fresh clone runs with zero database setup; Production swaps to SQL Server at
`Program.cs` level based on `IsDevelopment()`.

**XSS boundary on AI output.** LLM-generated markdown is rendered through `marked`/`showdown`
and passed through DOMPurify before it reaches the DOM — untrusted-by-default treatment of
model output.

**Enforced consistency.** Husky + lint-staged run Prettier and ESLint pre-commit; CI re-runs
`prettier:check` as a *failing* step, so formatting drift cannot land on `main`.

---

## 4. Domain model

Five EF entities: `User`, `Card` (tarot deck), `Theme` (reading category),
`Fortune` (a generated reading), `DailyFortune`. Request/response shapes are kept out of
domain entities via separate `Models/DTOs`, `Models/Requests`, `Models/Responses` namespaces.

Six V1 controllers: `Auth`, `Users`, `Cards`, `Themes`, `Fortunes`, `DailyFortunes`,
plus a `Health` endpoint for Kubernetes probes.

---

## 5. Angles for different resume targets

**Frontend / React role**
React 19, Vite, Tailwind 4 and a third-party design system; nine custom hooks including a
streaming-response reader and a scroll-follow hook; Context+Immer and Zustand chosen by
scope rather than dogma; 78 tests with Testing Library; Web Audio synthesis; responsive
tarot layout tuned down to iPhone viewports.

**Backend / .NET role**
Clean architecture with interface-backed services and a generic repository; API versioning
across three negotiation mechanisms; dual JWT + Firebase auth; partitioned rate limiting;
SSE streaming; centralised exception middleware; EF Core migrations with provider swapping;
xUnit + Moq coverage.

**DevOps / platform role**
Dockerised two-service app; Kubernetes Deployments/Services/Ingress on DigitalOcean;
GitHub Actions pipeline gating merges on tests and deploying on green, with secrets
materialised at deploy time; health endpoint for probes; image tagging tied to run number.

**AI / LLM engineering role**
OpenAI `gpt-4o` integration with both buffered and streaming paths; prompt assembly from
user profile, chosen theme and drawn cards; SSE transport to the browser with cancellation;
cost control via per-user rate limits; model output sanitised before render.

**Full-stack / generalist**
Owned ~52% of a 597-commit codebase across React, C#, Docker, Kubernetes and CI —
a project taken from a university group assignment to a live, continuously deployed product.

---

## 6. Facts to reuse verbatim

- 597 commits, 11 contributors, 309 mine (~52%)
- ~12.6k lines of first-party code (7.9k frontend, 4.7k backend)
- 102 automated tests across two languages and two frameworks
- 6 versioned REST controllers, 5 EF entities, 5 repositories, 7 services
- 2 Docker images, 4 Kubernetes manifests, 1 CI/CD pipeline
- Rate limits: 100 req/hr global, 20 req/hr on AI endpoints, per authenticated user
- ~17 months of active development (Mar 2025 – Aug 2026)

---

*Generated from the repository at commit `912e21a` on branch `demo`.*
