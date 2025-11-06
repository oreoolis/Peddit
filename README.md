# Peddit (G6T2)

Peddit is a full-stack web application developed for IS216 Web Application Development II AY25/26.

This project aims to provide a centralized solution for pet owners to track the health of their pets via personalized feeds and dashboards of their pet health. Users are also able to share recommended recipes with other users, as well as find nearby pet stores and veterinary clinics.

View the live application on: [Peddit](https://peddit-coral.vercel.app/) (Hosted on Vercel)

## Key Features
| Feature | Description |
|:--|:--|
| Register & Login | Seamless email login and Google Authentication | 
| Social Features | Pet and meal creation, with the ability to share it with other users |
| AI Chatbot & Wrapper | Built-in AI helper, specialized in assisting Pet-related information and meal recommendation |
| Pet Health Dashboard | View detailed nutritional information of each individual pet |
| Pet Store Locations (Google Maps Integration) | Find nearby pet amenities |


## Project Members & Contributions
- [Bernard Chua Kim Swee:](https://github.com/Bernardcks) Supabase, Authentication and Pet Health
- [Dwayne Arnold Aniban Otero:](https://github.com/oreoolis) Pet, Recipe, Shopping List Business Logic and Live Deployment.
- [Jereme Tan Jing Min:](https://github.com/jerememetan) UI Designer, Social Media Business Logic
- [Than Wei Lin:](https://github.com/than-wl) AI Chatbot, AI Wrapper Implementation
- [Nicholas Xie:](https://github.com/RayleighCN) Pet Store Location Recommendation and Landing Page

## Technology Stack
- Vue.JS
- Bootstrap (Additional UI components are adapted from [UIVerse.](https://uiverse.io/))
- Pinia
- Supabase

## Pre-requisites

Ensure that you have the following installed before cloning and running the application locally:

- Node.JS

```bash
npm -v
```

## Predeploy to Live Commands

```bash
npm run predeploy

npm run deploy

npm run build

```

## Running the Project (localhost)

```bash
git clone "this project's repository"

cd peddit

npm i

npm run dev
```
