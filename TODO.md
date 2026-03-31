# Fixed API Connection TODO

## Current Status
API code complete per previous TODO ✅, but runtime errors persist (likely DB/server setup).

## Step-by-Step Fix Plan
- [ ] 1. Fix Login.tsx image path (Windows backslashes)
- [x] 2. Backend setup (npm install ✅, migrate ✅)
  ```
  cd server
  npm install
  npx prisma generate
  npx prisma migrate dev --name init
  node prisma/seed.js
  ```
- [ ] 3. Start backend: `npm run dev` (or `node server.js`) in server/
- [ ] 4. Start frontend: `npm run dev` in root
- [ ] 5. Test: Open http://localhost:5173, check console/network tab:
  - Products/Services/Members load data
  - Login with email: rofifhizi183@gmail.com, pass: 123456789
  - Contact form submits
- [ ] 6. Check Prisma DB: server/dev.db should have data after seed

## Progress
Updated after each step. Current: Waiting for DB setup.

**Expected**: Data loads from API, no fetch errors.

