## VoltPark — Automated Parking System

VoltPark is a Next.js prototype for an automated parking platform with both Admin and Driver experiences. It uses Tailwind (v4) and a simple client-side store backed by `localStorage` so you can click around without a backend.

### Features

- Admin Dashboard: KPIs, recent tickets, quick links.
- System Configuration: Manage parking zone rules and default fine amounts.
- User/Role Management: CRUD for Admins, Officers, and Drivers.
- Analytics: Revenue, violation frequency, and occupancy mock charts.
- Driver App: Active session tracker with countdown, ticket list with Pay/Appeal, mock payment gateway, and notifications.

### Branding

- Primary colors: `#306844` and `#4779c4`.
- Place your brand mark at `app/logo.png` (already referenced in the UI). If you prefer the public path, copy it to `public/logo.png` and adjust imports accordingly.

### Run locally

```bash
npm install
npm run dev
# open http://localhost:3000
```

### App routes

- Landing: `/`
- Admin: `/admin`
  - System Configuration: `/admin/config`
  - Users: `/admin/users`
  - Analytics: `/admin/analytics`
- Driver: `/driver`
  - Session Tracker: `/driver/session`
  - Tickets: `/driver/tickets`
  - Payment: `/driver/payment?ticketId=...`
  - Notifications: `/driver/notifications`

### Notes

- Data is stored in the browser only. Clear site data to reset.
- The payment screen simulates a payment and marks the ticket as paid.
