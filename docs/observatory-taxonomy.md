# Agent Readiness Observatory — Category Taxonomy (ideal-world scope)

The full universe of dev-tool / SDK categories to track. Within each category,
track tools across **tiers**: incumbent/leader · challenger · indie/OSS.
For every tool, the cross-cutting **measures** stay the same: docs/content
legibility, `llms.txt`, MCP/tooling, API/type quality, examples, pricing &
signup friction, version stability.

**★ = high agent-selection signal** — a coding agent picks a discrete SDK for
this *while writing code*, so selection/usage shifts are large and observable.
(Unmarked categories still matter for citations, but the agent picks them less
often mid-build.)

---

## A. Frontend UI & rendering
- ★ UI component libraries / design systems — MUI, Radix, shadcn/ui, Ant Design, Chakra
- CSS / styling frameworks — Tailwind, Panda CSS, StyleX
- ★ Rich text / WYSIWYG editors — Tiptap, CKEditor, TinyMCE, Lexical, ProseMirror
- ★ Canvas / whiteboard / diagramming — tldraw, Excalidraw, Konva, Fabric.js
- ★ Data grids / tables — AG Grid, TanStack Table, Handsontable
- ★ Charts / data viz — Highcharts, Recharts, ECharts, D3, Nivo
- ★ Maps / geospatial — Mapbox, MapTiler, Leaflet, deck.gl, Protomaps
- Animation / motion — Framer Motion, GSAP, Lottie, Rive
- 3D / WebGL / game engines — Three.js, Babylon.js, PlayCanvas, Unity, Godot
- ★ Forms / form builders — React Hook Form, Formik, Formspree, Tally
- ★ Design / creative editing SDKs — IMG.LY CE.SDK, Polotno, Fabric, Pixo
- ★ PDF / document viewer SDKs — Nutrient (PSPDFKit), Apryse, PDF.js, react-pdf

## B. Media & content processing
- ★ Image processing / optimization / CDN — Cloudinary, imgix, ImageKit, Bytescale
- ★ Video (encode/stream/player) — Mux, api.video, Cloudflare Stream, Livepeer
- ★ File upload / handling — Uploadcare, Transloadit (Uppy), Filestack
- Audio / speech-to-text / TTS — Deepgram, AssemblyAI, ElevenLabs
- Generative media (image/video/audio) — Replicate, fal, Stability, Runway
- OCR / document AI — Nutrient, Mindee, Reducto, AWS Textract
- Localization / i18n / translation — Lokalise, Crowdin, Tolgee, DeepL

## C. Content & CMS
- ★ Headless CMS — Sanity, Contentful, Storyblok, Strapi, Hygraph, Payload
- Digital asset management — Cloudinary, Bynder
- E-signature / documents — DocuSign, Dropbox Sign, Documenso
- Workflow automation / iPaaS — n8n, Zapier, Make, Pipedream

## D. Data, storage & backend
- ★ Databases (relational/serverless) — Supabase, Neon, PlanetScale, Turso, CockroachDB
- Databases (NoSQL/document) — MongoDB, DynamoDB, Fauna
- ★ Backend-as-a-service — Supabase, Firebase, Appwrite, Convex, Nhost
- ★ ORMs / data access — Prisma, Drizzle, Kysely, TypeORM
- Caching / KV / in-memory — Redis, Upstash, Momento
- ★ Vector DBs / embeddings — Pinecone, Weaviate, Qdrant, Chroma, pgvector
- Object storage — S3, Cloudflare R2, Backblaze, Tigris
- Data warehouses — Snowflake, BigQuery, ClickHouse, Databricks
- ETL / ELT / pipelines — Fivetran, Airbyte, dbt, RudderStack

## E. Search, sync & realtime
- ★ Search / discovery — Algolia, Meilisearch, Typesense, Elastic
- ★ Realtime / collaboration infra — Liveblocks, Ably, Pusher, PartyKit, Yjs
- Message queues / streaming — Kafka/Confluent, NATS, Redpanda
- Background jobs / workflows — Inngest, Trigger.dev, Temporal, BullMQ
- GraphQL layer — Apollo, Hasura, GraphQL Yoga, WunderGraph
- API gateways / management — Kong, Zuplo, Tyk

## F. AI / ML & LLM infrastructure
- ★ LLM providers / inference — OpenAI, Anthropic, Google, Mistral, Groq, Together
- ★ LLM app frameworks / orchestration — LangChain, LlamaIndex, Vercel AI SDK, Mastra
- ★ Agent frameworks — LangGraph, CrewAI, OpenAI Agents SDK, AutoGen
- LLM observability / eval — LangSmith, Langfuse, Braintrust, Helicone
- Model hosting / fine-tuning / GPUs — Replicate, Modal, Baseten, Hugging Face, Fal
- Voice / realtime agents — Vapi, Retell, LiveKit Agents
- RAG / retrieval infra — (vector DBs above) + LlamaCloud, Ragie
- ML experiment tracking — Weights & Biases, Comet, MLflow

## G. Auth, identity & security
- ★ Authentication / identity — Auth0/Okta, Clerk, WorkOS, Stytch, Ory, Kinde, SuperTokens
- ★ Authorization / permissions — Oso, Permit.io, OpenFGA, Cerbos
- Secrets management — Doppler, Infisical, HashiCorp Vault
- API keys / rate limiting — Unkey, Zuplo
- Security scanning (SAST/deps) — Snyk, Semgrep, Socket, GitGuardian
- Bot / fraud / CAPTCHA — hCaptcha, Arkose, Castle
- Compliance automation — Vanta, Drata, Secureframe

## H. Payments, billing & commerce
- ★ Payments — Stripe, Adyen, Paddle, Lemon Squeezy, Braintree
- ★ Billing / subscriptions / metering — Stripe Billing, Orb, Metronome, Lago
- E-commerce platforms/SDKs — Shopify, Medusa, Saleor, Swell
- Tax — Stripe Tax, Anrok, Sphere
- Banking-as-a-service / cards — Unit, Lithic, Increase
- Crypto / web3 SDKs — Thirdweb, Alchemy, Privy, WalletConnect

## I. Communications & messaging
- ★ Email API — Resend, Postmark, SendGrid, Loops, Mailgun
- ★ SMS / voice / omnichannel — Twilio, Vonage, Bird, Plivo
- ★ Push / in-app notifications — Knock, Novu, Courier, OneSignal
- Chat / messaging SDKs — Stream, Sendbird, PubNub, CometChat
- Video calling / conferencing — Daily, Agora, LiveKit, 100ms

## J. DevOps, deploy & platform
- ★ PaaS / deployment — Vercel, Netlify, Render, Railway, Fly.io
- CI/CD — GitHub Actions, CircleCI, Buildkite, Depot
- IaC / provisioning — Terraform, Pulumi, SST
- Containers / orchestration — Docker, Kubernetes, Nomad
- Dev environments / preview — Gitpod, Coder, Daytona
- ★ Feature flags / experimentation — LaunchDarkly, Statsig, Flagsmith, PostHog, Split
- Edge / serverless compute — Cloudflare Workers, Deno Deploy, AWS Lambda

## K. Observability & reliability
- ★ Error monitoring — Sentry, Bugsnag, Rollbar
- APM / tracing / metrics — Datadog, Honeycomb, Grafana, New Relic
- Logging — Better Stack, Axiom, Datadog
- Uptime / synthetic monitoring — Better Stack, Checkly, Pingdom
- Incident management / on-call — PagerDuty, incident.io, Rootly

## L. Testing & QA
- ★ E2E / browser testing — Playwright, Cypress, Selenium
- Unit / integration frameworks — Vitest, Jest
- Visual regression — Chromatic, Percy, Applitools
- API testing / mocking — Postman, Insomnia, MSW, Mockoon
- Load / performance testing — k6, Gatling

## M. Analytics & data
- ★ Product analytics — Amplitude, Mixpanel, PostHog, Heap
- ★ Web analytics — Plausible, Fathom, Google Analytics, Simple Analytics
- Session replay / heatmaps — FullStory, LogRocket, Hotjar
- Customer data platform / event pipeline — Segment, RudderStack, Jitsu
- BI / embedded analytics — Metabase, Cube, Preset, Superset
- Reverse ETL — Hightouch, Census

## N. Developer experience & API tooling (the meta / agent-readiness supply chain)
- ★ Docs platforms — Mintlify, ReadMe, GitBook, Docusaurus, Fern, Scalar
- ★ SDK generators — Speakeasy, Stainless, Fern, liblab
- API design / spec / mocking — Stoplight, Bump.sh, Postman
- ★ AI coding assistants / agents — Cursor, Copilot, Claude Code, Codex, Windsurf, Cline
- Code hosting / review — GitHub, GitLab, Graphite, CodeRabbit
- Internal tools / admin builders — Retool, Appsmith, ToolJet
- Design-to-code / design tools — Figma, Builder.io, v0, Framer
- Scheduling infra — Cal.com, Calendly

---

## Prioritization for rollout
You can't seed all ~90 categories at once. Start where **agent-selection signal
is highest and a discrete SDK gets chosen mid-build** — the ★ categories — and
where you have vertical depth or network:

1. **Seed vertical (your world):** creative/design SDKs, media (image/video/file),
   PDF/docs, rich-text/canvas editors, headless CMS, maps. Deep task batteries,
   warm relationships, differentiated coverage.
2. **High-signal horizontals (universally chosen mid-build):** auth, payments,
   email, search, databases/BaaS, UI components, LLM providers/frameworks.
3. **The meta layer:** docs platforms, SDK generators, AI coding agents — the
   companies that both live the thesis and are natural partners/amplifiers.

Everything else fills in as Phases 1–2 of the plan widen coverage.
