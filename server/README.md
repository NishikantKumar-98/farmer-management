# AgriConnect Server

Lightweight Express + LowDB backend for the AgriConnect UI.

Available scripts:

- `npm run dev` - start dev server with ts-node-dev
- `npm run build` - compile TypeScript to `dist/`
- `npm start` - run compiled `dist/` build

Endpoints (examples):
- GET /api/farms
- GET /api/farms/:id
- POST /api/orders
- GET /api/orders
- POST /api/auth/login (stub)

The server uses a simple JSON database at `server/data/db.json` for persistence.
