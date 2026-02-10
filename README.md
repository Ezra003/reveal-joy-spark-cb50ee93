# ✨ Gender Reveal Party - Joy Spark

A magical, interactive, and modern web application for your Gender Reveal Party! This app allows parents to set up an event, guests to vote on the gender, and finally reveals the big surprise with a countdown and confetti.

![Gender Reveal Demo](public/placeholder.svg)

## 🌟 Key Features

- **Modern & Premium UI:** Glassmorphism design with vibrant colors and smooth transitions.
- **Interactive Voting:** Guests can join via a shared link and vote for "Team Boy" or "Team Girl".
- **Dynamic Background:** Floating particle animation that adapts to the reveal result.
- **Real-time Sharing:** Share your event link and watch votes come in live!
- **Dark Mode:** Seamless support for light and dark themes using `next-themes`.
- **Custom Event Data:** Support for baby names and due dates.
- **Guest Personalization:** Collects guest names before they vote for a more personal touch.
- **Final Reveal:** Dramatic countdown followed by a burst of themed confetti.
- **Offline First:** State management using `localStorage` ensures your data persists.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (latest LTS)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 🛠️ Built With

- **Framework:** [React](https://reactjs.org/) with [TypeScript](https://www.typescriptlang.org/)
- **Bundler:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) based on Radix UI
- **Icons:** [Lucide React](https://lucide.dev/)
- **Theme Management:** [next-themes](https://github.com/pacocoursey/next-themes)
- **Animations:** Custom CSS and Tailwind animations

## 📁 Project Structure

```bash
src/
├── components/       # Reusable UI components (shadcn and custom)
├── hooks/            # Custom React hooks (toast, mobile-check, etc.)
├── lib/              # Utility functions and storage logic
├── pages/            # Main page components (Index, NotFound)
└── App.tsx           # Root component with routing and providers
```


- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/70f0e686-e8a0-4cb3-b849-4a50aedc18bb) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
