# Architecture Note

## Overview

The application is built using a simple client-server architecture.

Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- TipTap editor

Backend

- Supabase
- PostgreSQL

Deployment

- GitHub
- Vercel

---

## Database

Two tables are used.

documents

- id
- owner_email
- title
- content

document_shares

- document_id
- shared_with_email

---

## Priorities

Due to the assessment time constraints, I prioritized:

- End-to-end document workflow
- Persistence
- Rich text editing
- Sharing
- Clean UI
- Deployment
- Maintainable code structure

instead of implementing advanced collaborative editing features.

---

## Deprioritized

The following features were intentionally left out:

- Real-time collaboration
- Operational Transform / CRDT
- Comments
- Version history
- PDF export
- User authentication
- Permission levels

These can be added without major architectural changes because the application is already separated into frontend components and Supabase persistence.