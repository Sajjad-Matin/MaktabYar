# TimeTable Generator — Deployment Notes

## 1. Backend environment

Copy `backend/.env.example` to `backend/.env` locally, or add the same variables to your hosting provider:

- `DATABASE_URL`
- `JWT_SECRET` — long random secret; required in production
- `JWT_EXPIRES_IN` — normally `7d`
- `CORS_ORIGIN` — frontend origin, e.g. `https://your-domain.com`
- `WHATSAPP_NUMBER=93764040363`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

The delivered project intentionally does not contain `.env` files.

## 2. Database

Run:

```bash
cd backend
npm install
npx prisma migrate deploy
npm run seed
```

`seed` is safe/non-destructive. It creates/updates the four package definitions and creates the admin account only when `ADMIN_EMAIL` and `ADMIN_PASSWORD` are configured.

## 3. Frontend

Create `frontend/.env`:

```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
```

Then:

```bash
cd frontend
npm install
npm run build
```

The frontend intentionally has no committed lockfile because PDF export adds `html2canvas` and `jspdf`; the deployment environment should install from `package.json`.

## 4. Package credits

New accounts start on the Trial package:

- Trial: 1 generation / 7 days
- A1: 5 generations / 60 days
- A2: 15 generations / 120 days
- A3: unlimited / 180 days

A generation is atomically deducted before the generation starts. If generation fails, the credit is returned.

Administrators bypass generation limits.

## 5. WhatsApp activation

A registered user selecting a package creates a purchase request and opens WhatsApp to:

`+93764040363`

with the exact pre-filled message:

`سلام و علیکم. وقت بخیر. درخواست فعال سازی (نام بسته) را دارم`\n\n`(نام بسته)` is replaced by the selected package name.

The browser/WhatsApp flow cannot silently press the user's Send button; the user must confirm/send the message in WhatsApp.

## 6. Admin dashboard

An account with role `ADMIN` gets `/admin`, where the administrator can:

- see purchase requests
- activate a package for a linked user
- manually activate any package for any user
- cancel purchase requests
- set remaining generations manually
- see package/credit state for all users

Admins also have unlimited timetable generation in the normal timetable UI.

## 7. Exports

The Download action always exports the complete account timetable, not the currently selected class.

- XLSX: one worksheet per class
- PDF: one landscape A4 page per class, rendered from the same timetable presentation used by the frontend so the visual layout matches the UI

## 8. History

Each successful generation creates a version for every class. View opens the stored snapshot rather than the current timetable. Compare checks two versions of the same class and reports added, removed, and modified lessons.


### Teacher timetables
The dashboard now includes `/teacher-timetable`. Each teacher has an individual weekly view showing subject + class, with PDF (UI-identical rendered export) and XLSX exports.
