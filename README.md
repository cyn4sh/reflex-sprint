# Reflex

A delivery-coordination platform for small Kenyan retailers, replacing informal WhatsApp/phone-call coordination with a structured, auditable system of record.

**Team:** Group 77 — Sentinel
**Sprint:** PLP 1MILL Devs — Week 3, The Readiness Sprint

---

## Overview

Reflex replaces ad-hoc phone/WhatsApp coordination between retailers, dispatchers, and riders with a shared system that tracks every delivery from creation to confirmed drop-off. Three personas interact through a defined workflow, with explicit handling for concurrency (double assignment), idempotency (duplicate scans), and state integrity (invalid transitions).

Full product and technical design documentation: [`docs/reflex-design.md`](docs/reflex-design.md)

## Personas

| Persona | Can do |
|---|---|
| **Retailer Staff** | Create delivery requests, edit/cancel pre-assignment, track status |
| **Dispatcher** | View all open requests, assign/reassign a rider, override status as fallback |
| **Rider** | View assigned deliveries, mark picked up, confirm delivery via QR scan |

## Tech Stack

- **Backend:** Django, Django REST Framework, PostgreSQL, JWT authentication (`djangorestframework-simplejwt`)
- **Frontend:** React (functional components + Hooks), Vite, Tailwind CSS
- **API Docs:** drf-spectacular (Swagger UI at `/api/docs/`)

## Project Structure

```
reflex-sprint/
├── config/            # Django project settings & root URL config
├── accounts/          # Custom User model, role field, auth
├── deliveries/        # Delivery model, business logic, API endpoints
├── frontend/          # React (Vite) frontend
├── diagrams/          # ERD, state machine, design-flow diagrams (Mermaid)
├── evidence/          # Screenshots proving technical experiments
├── docs/              # Full design documentation
└── manage.py
```

## Getting Started

### Backend Setup

```bash
# Clone and enter the project
git clone https://github.com/cyn4sh/reflex-sprint.git
cd reflex-sprint

# Set up virtual environment
python -m venv .venv
source .venv/Scripts/activate   # Windows Git Bash
# or: .venv\Scripts\activate    # Windows CMD/PowerShell

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env            # then fill in your own values

# Run migrations
python manage.py migrate

# Create a superuser (for admin access)
python manage.py createsuperuser

# Start the server
python manage.py runserver
```

API will be available at `http://127.0.0.1:8000/api/`, with live Swagger docs at `http://127.0.0.1:8000/api/docs/`.

### Frontend Setup

```bash
# From the project root, move into the frontend folder
cd frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env            # then fill in your own values

# Start the dev server
npm run dev
```

The frontend will be available at `http://localhost:5173`. Make sure the backend server (above) is running at the same time — the frontend calls it directly for all data.

**Note:** the backend must have CORS configured to allow requests from `http://localhost:5173` (already set up in `config/settings.py` via `django-cors-headers`). If you change the frontend's port or run it from a different host, update `CORS_ALLOWED_ORIGINS` in `config/settings.py` to match.

## API Overview

All endpoints require JWT authentication (`Authorization: Bearer <token>`) and are restricted to their intended persona.

| Persona | Base path |
|---|---|
| Retailer | `/api/deliveries/` |
| Dispatcher | `/api/dispatcher/deliveries/` |
| Rider | `/api/rider/deliveries/` |
| Rider lookup (Dispatcher-only) | `/api/users/?role=rider` |
| Current user | `/api/users/me/` |

Get a token:
```
POST /api/token/
{ "username": "...", "password": "..." }
```

Full endpoint reference: [`docs/reflex-design.md` — Act III, §12](docs/reflex-design.md)

## Technical Experiments

Two required experiments, verified against the live system with reproducible evidence in [`evidence/`](evidence/):

- **Double Assignment** — row-level locking (`select_for_update`) prevents two simultaneous assign requests from corrupting the same delivery
- **Duplicate Scan** — confirmation is idempotent and validates the scanned code, rejecting mismatches and repeat confirmations

Details: [`docs/reflex-design.md` — Act IV](docs/reflex-design.md)

## Diagrams

- [Entity Relationship Diagram](diagrams/erd/erd.md)
- [State Machine](diagrams/state-machine/state-machine.md)
- [Design Flow / Sequence](diagrams/workflows/design-flow.md)

## Known Limitations

- QR delivery confirmation currently uses a text-input prompt for the confirmation code rather than a live camera scanner. The backend validation (correct code, one-time use) is fully functional; only the scanning mechanism itself is a placeholder pending a real barcode/QR scanning library.
- The Dispatcher's delivery list currently displays the assigned rider by ID (e.g. "Rider #3") rather than by name, since the delivery endpoint does not yet return the rider's username.

## Team

| Name | Role |
|---|---|
| Ashfall | Backend architecture, API implementation, technical experiments |
| Khalid | React frontend |
| Melody | Documentation, trade-off log, roadmap |

## License

Educational project — PLP 1MILL Devs Software Engineering Programme, 2026.

