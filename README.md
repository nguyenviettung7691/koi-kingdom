# Koi Kingdom: Guardians of the Mythical Waters

A feature-rich, interactive virtual aquarium built with Vue.js and TailwindCSS.

![Preview screenshot](/public/preview.png)

---

## 🐟 Game Overview

Koi Kingdom lets you create, manage, and enjoy a lively aquarium filled with unique fish. Add, feed, evolve, and care for your fish as they swim around a customizable tank. Manage resources, respond to events, and keep your aquatic friends happy!

---

## ✨ Features

- **Add Fish:**  
  - Choose a fish type and name it.
  - Add it to your aquarium, where it will swim around dynamically.
- **Fish Movement:**  
  - Fish move around the aquarium with animated positions.
- **Feeding System:**  
  - Feed your fish using a limited feed bag.
  - Each fish has a hunger/lifetime meter that decreases over time and resets when fed.
  - If the feed bag is empty, you must wait for a refill.
- **Fish Lifecycle:**  
  - Fish can die if not fed in time.
  - Remove dead fish from the aquarium.
  - Evolve fish under certain conditions.
- **Aquarium Management:**  
  - Change aquarium backgrounds.
  - Toggle aquarium size.
  - Reset the aquarium (with confirmation modal).
- **Toasts & Notifications:**  
  - Get real-time feedback for important events (feeding, deaths, removals, etc.).
- **Responsive UI:**  
  - Styled with TailwindCSS for a modern, mobile-friendly look.
  - Custom scrollbars and dark mode support.
- **Accessibility:**  
  - Keyboard and screen reader friendly modals and controls.

---

## 🛠️ Technology Stack

- [Vue 3](https://vuejs.org/) (Composition API, Single File Components)
- [TailwindCSS](https://tailwindcss.com/) (utility-first styling)
- [@vueuse/core](https://vueuse.org/) (composables like `useTimeAgo`)
- [Heroicons](https://heroicons.com/) (SVG icons)
- [Vite](https://vitejs.dev/) (development/build tooling)

---

## 🚀 Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Run the development server:**
   ```sh
   npm run dev
   ```
3. **Open your browser:**  
   Visit [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal).

---

## 📁 Project Structure

- `src/App.vue` — Main application logic, event handling, and state management.
- `src/Aquarium.vue` — Aquarium display, fish rendering, feed bag, and controls.
- `src/Fish.vue` — Individual fish logic, movement, feeding, and lifecycle.
- `public/` — Fish images and aquarium backgrounds.
- `style.css` — TailwindCSS and custom scrollbar styles.
- `index.html` — App entry point, favicon, and meta tags.

---

## 📝 Notes

- All fish images and backgrounds are located in the `public` directory.
- The feed bag is limited; plan your feedings!
- No fish were harmed during the production of this app 🤪

---

## 📦 Build

To build for production:
```sh
npm run build
```

---

## 🌐 Deploy To GitHub Pages

This repository includes a workflow at `.github/workflows/deploy.yml` that builds and deploys the app to GitHub Pages on pushes to the `main` branch.

- Deployment target: `https://<your-username>.github.io/koi-kingdom/`
- Vite base path is configured as `/koi-kingdom/` in `vite.config.js`

To enable deployment:

1. Push this repository to GitHub.
2. In repository settings, open **Pages**.
3. Set **Source** to **GitHub Actions**.
4. Push to `main` (or run the workflow manually from the Actions tab).

---

## 📜 License

MIT License

---