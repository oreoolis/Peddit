# Peddit

Your pet social network and nutrition dashboard.

[Live App](https://peddit-coral.vercel.app/) | Vercel CD | Vue 3 + Vite + Pinia | Supabase

![Vue](https://img.shields.io/badge/Vue-3.x-42b883?logo=vue.js&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?logo=vite&logoColor=white) ![Pinia](https://img.shields.io/badge/Pinia-3.x-f7d336) ![Bootstrap](https://img.shields.io/badge/Bootstrap-5.x-7952B3?logo=bootstrap&logoColor=white) ![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-3FCF8E?logo=supabase&logoColor=white) ![Vercel](https://img.shields.io/badge/Vercel-Edge%20Functions-000000?logo=vercel) ![Node](https://img.shields.io/badge/Node-%E2%89%A520-339933?logo=node.js&logoColor=white)

Peddit is a full-stack web app for pet owners to:
<<<<<<< HEAD
- Create pet profiles, track health, and analyse nutrition
=======
- Create pet profiles, track health, and analyze nutrition of pets
- Build and share recipes and meals
- Post socially and interact with the community
- Find nearby pet shops and clinics with Google Maps
- Get AI assistance via an integrated chatbot

## Contributors
- [Bernard Chua Kim Swee](https://github.com/Bernardcks) - Supabase, Authentication, Profiles and Pet Health
- [Dwayne Arnold Aniban Otero](https://github.com/oreoolis) - Pet, Recipe, Shopping List Business Logic and Live Deployment
- [Jereme Tan Jing Min](https://github.com/jerememetan) - UI Designer, Social features
- [Than Wei Lin](https://github.com/than-wl) - AI Chatbot, AI Wrapper Implementation
- [Nicholas Xie](https://github.com/RayleighCN) - Pet Store Location Recommendation and Landing Page

## Key Features
- Authentication: Email Magic Link + Google OAuth (Supabase)
- Social: Reddit Style social featurs with Votes, Comments, sharing posts and meal plans
- Pet Health: Dashboard, nutrient breakdowns, requirements, targets
- Recipes & Meals: Creation, editing, shopping list helpers
- Maps: Nearby pet shops and vet clinics with sorting/filters
- AI Chatbot: OpenRouter proxy via Vercel Edge function, streaming replies

## Feature Highlights

### Authentication
- Email magic link and Google OAuth via Supabase Auth.
![](src/assets/readmepics/Login.png)

### Profiles
- Personal profile management and viewing public profiles of other users.
![](src/assets/readmepics/Profile.png)
![](src/assets/readmepics/Profile%20others.png)

### Pet Health Dashboard
- At-a-glance health cards and detailed nutrient breakdowns per pet.
![](src/assets/readmepics/pet%20health%20dashboard%20closed.png)
![](src/assets/readmepics/Pet%20health%20dashboard.png)

### Pet Creation
- Create pets with breeds sourced from external APIs.
![](src/assets/readmepics/Pet%20creation.jpg)
![](src/assets/readmepics/pet%20creation%202.jpg)

### Recipe Creation
- Build recipes and view nutrition summaries before saving or sharing.
![](src/assets/readmepics/recipe%20creation.jpg)
![](src/assets/readmepics/recipe%20creation%202.jpg)
![](src/assets/readmepics/recipe%20creation%20nutrition%20summary.jpg)

### Social
- Create posts, search, comment, and share recipes to the feed.
![](src/assets/readmepics/social%20post.jpg)
![](src/assets/readmepics/social%20comments.jpg)
![](src/assets/readmepics/social%20search.jpg)
![](src/assets/readmepics/Share%20recipes.jpg)
![](src/assets/readmepics/recipe%20post%20share.jpg)

### Shopping List
- Auto-generate shopping lists from selected recipes and meals.
![](src/assets/readmepics/shopping%20list.jpg)

### Pet Summary
- Compact summary cards for a pet's key stats and recent activity.
![](src/assets/readmepics/pet%20summary.jpg)

## Architecture
```mermaid
flowchart LR
  A[Peddit]
  P[Pinia]
  B[(Supabase DB)]

  %% Cyclical data flow
  A --> P --> B
  B --> P --> A

  %% External integrations
  A --> C[Vercel Edge /api/chat]
  C --> D[OpenRouter API]
  D --> E[(Model Providers: OpenAI, Llama, Others)]
  A --> F[Google Maps JS API]
  A --> G[External APIs: Dog API, TheCatAPI]
```

## Tech Stack
- Frontend: Vue 3, Pinia, VueUse, Bootstrap 5, UIVerse components, Motion-V (Framer Motion for Vue)
- Backend: Supabase (Auth + Database)
- Edge API: Vercel Edge Function proxy for OpenRouter (`api/chat.js`)
- Build/Tooling: Vite, vite-plugin-vue-devtools, dotenv
- Hosting: Vercel (SPA rewrite to `index.html`)
- External APIs: Google Maps, OpenRouter (OpenAI-compatible), Dog API, TheCatAPI

## Project Structure
- `src/main.js`: App bootstrap
- `src/App.vue`: Root layout, feature toggles (chatbot)
- `src/router/index.js`: Routes + auth guards
- `src/lib/supabaseClient.js`: Supabase client
- `src/lib/chatApi.js`: Chat API (proxy-aware + streaming)
- `src/stores/*`: Pinia stores (auth, posts, pets, profiles, comments, follows, toast, nutrition)
- `src/components/*`: Atomic/atoms/molecules/organisms + social/profile/maps/chatbot
- `src/views/*`: Page views (Home, Health, Profile, Social, Map, Pet, Recipe, etc.)
- `api/chat.js`: Vercel Edge function proxy to OpenRouter
- `vite.config.js`: Dev server proxy (optional), aliases, CSP headers
- `vercel.json`: Build output + SPA rewrites
- `.github/workflows/deploy.yml`: GitHub Pages build (optional)

## Environment Variables
Frontend (`.env.local`):
- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY`: Supabase anon/publishable key
- `VITE_GOOGLE_MAPS_API_KEY`: Google Maps JS API key
- `VITE_CHATBOT_ENABLED`: `true` to show the chatbot UI
- `VITE_CHAT_PROXY_URL`: Chat proxy URL (for example, `/api/chat`)
- `VITE_CHAT_MODEL`: Default model (for example, `openrouter/auto`)
- `VITE_CHAT_SIMPLE_MODEL`: Simple/fast model
- `VITE_CHAT_THINKING_MODEL`: Reasoning-capable model

Edge/Server (Vercel project settings → Environment Variables):
- `OPENROUTER_API_KEY`: OpenRouter API key (used by `api/chat.js`)

Security note: never commit real secrets. Rotate any accidentally committed keys.

## Local Development
- Node: `>=20.19` (see `package.json`)
- Install: `npm i`
- Run: `npm run dev`
- Build: `npm run build`
- Preview: `npm run preview`

## Scripts
- `dev` - Vite dev server
- `build` - Production build to `dist/`
- `preview` - Preview build
- `predeploy`/`deploy` - Static deploy helpers (GitHub Pages fallback)

## Deployment
- Vercel
  - Build command: `npm run build`
  - Output dir: `dist`
  - SPA rewrites: handled via `vercel.json`
  - Add `OPENROUTER_API_KEY` in Project Env for chat proxy
- GitHub Pages (optional)
  - Workflow present: `.github/workflows/deploy.yml`
  - Uploads `dist` as Pages artefact after `npm run build`

## Edge Chat Proxy
- `api/chat.js` exposes a CORS-enabled POST endpoint at `/api/chat`
- Proxies request bodies to `https://openrouter.ai/api/v1/chat/completions`
- Reads `OPENROUTER_API_KEY` (set in Vercel env)
- Frontend calls are defined in `src/lib/chatApi.js` (JSON and streaming modes)

## Routing & Guards
- Public: `/`, `/login` (hidden when authenticated), `/social`, `/meal`, `/chatbot`, `/map`, `/profile/:username`, `/viewpost/:postId`, `/view-recipe-post/:postId`
- Private: `/home`, `/health`, `/profile`, `/pet`, `/create-pet`, `/add-meal-plan`, `/edit-pet`, `/edit-meal`
- Guard: Supabase session validation via `src/stores/authStore.js`

