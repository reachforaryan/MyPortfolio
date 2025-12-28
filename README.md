# 🖥️ Retro OS Portfolio

A highly interactive, retro-styled portfolio website inspired by Windows 95 and modern vaporwave aesthetics. Built with React, TypeScript, and Tailwind CSS.

![Portfolio Preview](public/preview.png)

## ✨ Features

- **Retro Desktop Environment**: Draggable, minimizable, and maximizable windows with a tiled layout system.
- ** interactive Terminal**: CLI experience with commands like `ls`, `open`, `config`, and `theme`.
- **Desktop Pet**: An animated pixel-art sheep that wanders, jumps, and interacts with the environment.
- **Customization**:
  - **Themes**: Switch between **Retro**, **Cyberpunk**, and **Vaporwave**.
  - **Effects**: Toggle CRT scanlines, screen glow, and adjust window gaps.
- **Contact Form**: Fully functional email form powered by a dedicated Node.js/Express backend and the Resend API.
- **Animations**: Smooth transitions using `framer-motion`.

## 🛠️ Tech Stack

- **Frontend**:
  - React 18
  - TypeScript
  - Vite
  - Tailwind CSS
  - Framer Motion
  - Lucide React
  - React Draggable

- **Backend**:
  - Node.js
  - Express
  - Resend (Email API)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/portfolio-v4.git
cd portfolio-v4
```

### 2. Frontend Setup

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`.

### 3. Backend Setup (For Contact Form)

The contact form requires a lightweight backend to securely handle API keys.

1.  Navigate to the server directory:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `server` directory:
    ```env
    RESEND_API_KEY=your_resend_api_key_here
    ```
4.  Start the server:
    ```bash
    node index.js
    ```

The backend runs on `http://localhost:3001`.

## 🎮 Terminal Commands

Open the **Terminal** app to interact with the system via CLI:

| Command | Description |
| :--- | :--- |
| `help` | Show available commands. |
| `ls` / `dir` | List installed applications and their status. |
| `open [app]` | Open an application (e.g., `open projects`). |
| `close [app]` | Close an application (e.g., `close about`). |
| `config` | View current system configuration. |
| `set [key] [val]` | Change settings (e.g., `set theme cyberpunk`, `set crt false`). |
| `clear` | Clear the terminal screen. |

## 🎨 Themes

You can change themes via the **Start Menu** or the **Terminal**:

- **Retro**: Classic beige and teal aesthetics.
- **Cyberpunk**: High-contrast yellow and black with neon glows.
- **Vaporwave**: Pink, purple, and cyan pastel tones.

---

*Built with ❤️ (and pixels) by Batak*
