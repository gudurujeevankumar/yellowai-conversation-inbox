# Yellow.ai Conversation Inbox

![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![MSW](https://img.shields.io/badge/MSW-FF6A33?logo=mockserviceworker&logoColor=white)

A modern enterprise-style conversation inbox built with React, TypeScript, Tailwind CSS and MSW.

---

## Overview

This application is a frontend implementation of a conversation inbox designed for support agents. It simulates real-world enterprise customer support workflows, enabling users to manage, triage, and resolve incoming messages. The project focuses on responsive design, local state management, and real-time interface synchronization.

---

## Project Highlights

- Responsive master-detail layout
- Strict TypeScript
- Dynamic queue statistics
- Search and filtering
- Local React state
- Keyboard accessibility
- MSW-backed mock API
- Responsive mobile navigation

---

## Features

### Inbox Management
- Scrollable list of customer conversations.
- Detailed view containing the customer's chat thread.
- Message composer with disabled empty states and shortcut submission support.

### Conversation Workflow
- Actionable buttons to assign or resolve conversations.
- Live queue statistics tracking status distributions.

### Search & Filtering
- Search by customer name, conversation ID, or message contents.
- Filter the inbox strictly by open, assigned, or resolved status.

### Responsive Experience
- Adaptive interface scaling across desktop and tablet.
- Dedicated mobile view prioritizing focused conversation lists and deep-linked chat panels.

### Accessibility
- Keyboard navigation support (`/` to search, `Escape` to close, `Ctrl+Enter` to send).
- Semantic focus rings highlighting interactable elements safely.
- Screen-reader friendly ARIA labels across complex UI nodes.

---

## Tech Stack

| Technology | Purpose |
| --- | --- |
| React | Component-based UI library |
| TypeScript | Static typing |
| Tailwind CSS | Utility-first styling |
| Vite | Frontend build tool |
| MSW | Mock Service Worker for client-side API simulation |

---

## Architecture

**Component architecture:** The application uses modular, single-responsibility components separated into logical directories (`detail`, `inbox`) to enforce a clean separation of concerns and maximize reusability.

**Local state:** State dependencies such as routing, status overrides, and toast notifications are driven purely by native React hooks, maintaining synchronized UI trees without external state libraries.

**MSW:** A local Mock Service Worker intercepts network requests at the browser level, delivering realistic simulated responses and payload shapes without relying on actual backend infrastructure.

**Responsive layout:** The application uses CSS flexbox and Tailwind mobile-first breakpoints to seamlessly transition from a side-by-side desktop layout to a stacked mobile view.

**Type safety:** The codebase enforces strict-mode TypeScript compilation, leveraging models for conversations and messages to eliminate runtime errors and validate prop propagation.

---

## Folder Structure

```
conversation-inbox/
├── public/
├── src/
│   ├── components/
│   │   ├── detail/
│   │   │   ├── DetailPanel.tsx
│   │   │   └── MessageComposer.tsx
│   │   ├── inbox/
│   │   │   ├── ConversationItem.tsx
│   │   │   ├── ConversationList.tsx
│   │   │   ├── ListPanel.tsx
│   │   │   └── QueueStatistics.tsx
│   │   └── TopBar.tsx
│   ├── mocks/
│   │   ├── browser.ts
│   │   ├── data.ts
│   │   └── handlers.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── .gitignore
├── .oxlintrc.json
├── index.html
├── package-lock.json
├── package.json
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## Installation

```bash
git clone https://github.com/gudurujeevankumar/yellowai-conversation-inbox.git
cd conversation-inbox
npm install
```

---

## Running the Project

```bash
npm run dev
```

---

## Build

```bash
npm run build
```
This command compiles the TypeScript code and uses Vite to bundle the application into optimized static files located in the `dist/` directory.

---

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the local Vite development server with Hot Module Replacement (HMR). |
| `npm run build` | Compiles TypeScript and generates a production-ready optimized build bundle. |
| `npm run lint` | Evaluates the codebase using oxlint for syntax and semantic violations. |
| `npm run preview` | Boots a local static server to preview the compiled `dist/` production assets. |

---

## Screenshots

Screenshots will be added after deployment.

---

## Design Decisions

**Two-panel layout:** Chosen to provide maximum context to the agent, allowing rapid switching between conversations without losing orientation.

**React local state:** Utilized standard React hooks (`useState`, `useCallback`) to manage complex UI states, keeping the architecture lightweight without Redux or MobX.

**Tailwind CSS:** Provided speed when constructing responsive inline styles while adhering to a single source of truth for color and spacing variables.

**Dark theme:** A high-contrast dark theme was adopted to reduce visual fatigue for support personnel staring at screens for extended shifts.

**Responsive design:** Implemented a mobile-first approach using Tailwind's `md:` prefixes, allowing the sidebar to gracefully scale across viewports.

**Reusable components:** Segmented elements like `ConversationItem` and `QueueStatistics` for maintainability and easy future extensions.

---

## Future Improvements

### Backend
- Integrate authentic WebSocket support for true real-time, multi-agent queue syncing.
- Deprecate MSW layers in favor of live REST APIs.

### Performance
- Introduce virtualized lists to render thousands of concurrent conversation nodes without browser lag.

### User Experience
- Upgrade the message composer to support rich-text formatting (Markdown) and file attachments.
- Integrate Yellow.ai's AI triage context directly into the inbox to surface AI-generated reply suggestions.

### Scalability
- Implement token-based authentication and Role-Based Access Control (RBAC).
- Support advanced agent routing algorithms to filter inboxes by an active agent's ID.

---

## License

This project was created as part of the Yellow.ai Frontend Assignment.

---

## Quality Checklist

- [x] Responsive Design
- [x] Mobile Navigation
- [x] Search
- [x] Filters
- [x] Queue Statistics
- [x] Assign Workflow
- [x] Resolve Workflow
- [x] Message Composer
- [x] Accessibility
- [x] TypeScript Strict Mode
- [x] Production Build

---

## Acknowledgements

This project was developed as part of the Yellow.ai Frontend Assignment to demonstrate modern frontend engineering practices using React, TypeScript, Tailwind CSS, and MSW.
