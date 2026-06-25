# Ajaia Docs

A lightweight collaborative document editor built as part of the Ajaia Full Stack Product Engineer assessment.

## Features

- Create documents
- Rename documents
- Rich text editing
  - Bold
  - Italic
  - Underline
  - Headings
  - Bullet lists
  - Numbered lists
- Save documents
- Persistent storage with Supabase
- Upload .txt and .md files
- Export documents as Markdown
- Share documents with other users
- Owned Documents and Shared With Me sections
- Dynamic user switching for testing sharing
- Automated validation tests using Vitest

---

## Tech Stack

- Next.js 15
- React
- TypeScript
- Tailwind CSS
- TipTap
- Supabase
- PostgreSQL
- Vercel

---

## Local Setup

Clone the repository

```bash
git clone https://github.com/saiprakash1004/ajaia-docs.git
```

Install dependencies

```bash
npm install
```

Create

```
.env.local
```

Add

```
NEXT_PUBLIC_SUPABASE_URL=YOUR_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_KEY
```

Run

```bash
npm run dev
```

Open

```
http://localhost:3000
```

---

## Run Tests

```bash
npm run test
```

---

## Live Demo

https://YOUR-VERCEL-LINK.vercel.app