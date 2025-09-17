# 🧠 Personal Knowledge Hub

A **self-hosted, offline-first personal knowledge hub** for notes, code snippets, and bookmarks.
Built with **React + React Router + Go backend**, designed to **sync across devices without accounts** using **OTP/QR linking** (similar to Brave browser).

---

## ✨ Features

* 📝 **Notes with MDX support** — Rich Markdown editing powered by [MDXEditor](https://mdxeditor.dev/).
* 🔍 **Full-text search** — Quickly find notes, snippets, and bookmarks.
* 🗂 **Tags & organization** — Organize your knowledge base with tags.
* 📱 **Offline-first (PWA)** — Works without internet using service workers + IndexedDB.
* 🔄 **Device sync without accounts** — Link devices using a short-lived OTP/QR code.
* 💾 **Local-first storage** — Data lives on your device; optional sync to backend.
* ⌨️ **Keyboard shortcuts** — Faster navigation and editing.

---

## 🛠 Tech Stack

### Frontend

* ⚛️ [React](https://reactjs.org/) + [React Router](https://reactrouter.com/)
* 🖊 [MDXEditor](https://mdxeditor.dev/) for Markdown/MDX notes
* 🎨 [TailwindCSS](https://tailwindcss.com/) for styling
* 📦 IndexedDB for offline-first storage
* 📱 PWA with service workers

### Backend

* 🐹 [Go](https://go.dev/) + [Echo](https://echo.labstack.com)
* 🗄 Postgres for persistent storage
* 🔑 OTP/QR-based device linking (no traditional auth)
* 🔌 WebSockets for real-time sync

---

## 📐 Architecture

1. **Frontend (React)**

   * Loads offline from PWA cache
   * Stores data in IndexedDB
   * Syncs with backend when available

2. **Backend (Go)**

   * Provides REST API for CRUD & sync
   * Issues OTP/QR codes for device linking
   * Manages real-time updates with WebSockets

3. **Sync Workflow**

   * Device A generates OTP/QR → shares with Device B
   * Device B enters/scans code → backend links both devices
   * Changes are synced bidirectionally, conflicts resolved with **last-write-wins** (MVP)

---

## 🚀 Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) ≥ 20
* [Go](https://go.dev/) ≥ 1.22
* Postgres (optional)

### Frontend Setup

```bash
# Install deps
pnpm install

# Run in dev mode
pnpm run dev

# Build for production
pnpm run build
```

### Backend Setup

```bash
# Run the Go backend
go run ./cmd/server
```

By default, backend runs at `http://localhost:8080` and frontend at `http://localhost:5173`.

---

## 🔮 Roadmap

* [x] Local-first notes with MDX support
* [ ] Offline PWA support
* [ ] Device sync with OTP/QR code
* [ ] Real-time WebSocket sync
* [ ] Bookmarks + code snippets support
* [ ] Advanced search (tags + full-text index)
* [ ] Optional AI-powered search/summarization

---

## 🤝 Contributing

Pull requests and discussions are welcome!
If you have ideas or run into issues, open an [issue](./issues).

---
