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
NEXT_PUBLIC_SUPABASE_URL=https://xzakeovvkjhfbjbvwdmb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6YWtlb3Z2a2poZmJqYnZ3ZG1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzODUzODksImV4cCI6MjA5Nzk2MTM4OX0.7LyyqoA_UtTPsLyCmd2e4SbeMcnImbTelK6R3-WaxTg
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

https://ajaia-docs-mocha.vercel.app/