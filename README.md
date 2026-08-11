# Affiliate Dashboard

A role-based admin and affiliate dashboard built with React, TypeScript, and Tailwind CSS.

## Tech Stack

- React 19
- TypeScript
- Tailwind CSS v4
- React Router v7
- Axios
- Vite

## Features

### Admin
- View and manage affiliates (approve / reject / delete)
- Full CRUD for affiliate programs
- View all links, clicks, conversions, and payouts
- Mark payouts as paid

### Affiliate
- View and join / leave active programs
- Create and manage tracking links
- View own clicks, conversions, and payouts
- Request payouts

## Getting Started

### Prerequisites

- Node.js >= 18
- Affiliate API running locally or deployed

### Installation

1. Clone the repo
   git clone https://github.com/your-username/affiliate-dashboard.git
   cd affiliate-dashboard

2. Install dependencies
   npm install

3. Set up environment variables
   cp .env.example .env

4. Start the development server
   npm run dev

## Environment Variables

| Variable | Description |
|----------|-------------|
| VITE_API_URL | Base URL of the Affiliate API (e.g. http://localhost:3000/api) |

## Project Structure

```
src/
├── api/              # Axios API calls
├── assets/           # Icons and colors
├── components/       # Reusable components
│   ├── layout/       # Sidebar, Navbar, Layout
│   ├── links/        # Link-specific components
│   ├── programs/     # Program-specific components
│   └── shared/       # Modal, Pagination, etc.
├── context/          # Auth context
├── pages/            # Page components
└── types/            # TypeScript interfaces
```

## Role-Based Access

| Feature | Admin | Affiliate |
|---------|-------|-----------|
| View all affiliates | ✅ | ❌ |
| Approve / reject affiliates | ✅ | ❌ |
| Manage programs | ✅ | ❌ |
| Join / leave programs | ❌ | ✅ |
| View all links | ✅ | ❌ |
| Create / manage own links | ❌ | ✅ |
| View all clicks | ✅ | ❌ |
| View own clicks | ❌ | ✅ |
| View all conversions | ✅ | ❌ |
| View own conversions | ❌ | ✅ |
| View all payouts | ✅ | ❌ |
| Request payout | ❌ | ✅ |
| Mark payout as paid | ✅ | ❌ |

## Related

- [Affiliate API](https://github.com/Cilkotron/affiliate-api) — Backend REST API