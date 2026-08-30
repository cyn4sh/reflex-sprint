# Reflex — Technical Design Document

**Team:** Group 77 — Sentinel
**Sprint:** PLP Week 3 — Reflex, The Readiness Sprint
**Status:** In progress

---

## Team & Contributions

| Name | Role |
|---|---|
| **Ashfall** | Backend architecture, data model, API implementation, technical experiments, frontend-backend integration (Acts II–IV) |
| **Khalid** | React frontend — Retailer, Dispatcher, and Rider screens, built against the frozen Delivery data contract |
| **Melody** | Documentation, trade-off log, roadmap, panel defense (Acts I, IV §17, V) |

*Demeke exited the sprint mid-way due to scheduling conflicts; his responsibilities were absorbed by Melody.*

---

## ACT I — PRODUCT & PROBLEM
*Owner: Melody*

### 1. Executive Summary
Reflex is a delivery-coordination platform for small Kenyan retailers, replacing informal WhatsApp/phone-call coordination with a shared system of record. Three roles — Retailer Staff, Dispatcher, and Rider — interact through a defined workflow: request creation, assignment, status tracking, and QR-based delivery confirmation. The system prioritizes consistency and auditability over feature breadth, with explicit handling for concurrency (double assignment), idempotency (duplicate scans), and state integrity (invalid transitions) — validated through targeted technical experiments rather than a full production build.

### 2. Problem Definition
Small Kenyan retailers — electronics shops, pharmacies, hardware stores — rely on informal coordination (WhatsApp messages, phone calls) to get goods to customers. This works at small scale, but breaks down as delivery volume grows: there's no single record of who a delivery is assigned to, no way for a retailer to check status without calling someone, and no proof that a delivery actually happened. When something goes wrong — a missed delivery, a dispute over whether an item arrived — there's no evidence trail to resolve it. Reflex replaces this ad-hoc coordination with a shared system of record: every delivery request, assignment, and status change is tracked, visible, and confirmable.

### 3. User Personas

**Retailer Staff**
Works at a small shop (electronics, pharmacy, hardware). Needs to get items to customers without babysitting the process by phone. Frustrated by not knowing whether a delivery even got assigned, let alone completed, until a customer complains.

**Dispatcher**
Coordinates between retailers and riders — the person who decides who delivers what. Needs a clear queue of open requests and the ability to act fast when a rider becomes unavailable. Frustrated by juggling this over scattered WhatsApp threads with no single view of what's outstanding.

**Rider**
Out in the field, often with unreliable connectivity. Needs a simple way to see what's assigned to them and confirm they've done it. Frustrated by proving a delivery happened when there's no record beyond "I told them."

*Note: personas were derived directly from the case study's description of retailer coordination problems, not primary user interviews.*

### 4. Goals & Non-Goals

**Goals**
- Give retailers a way to log delivery requests and track their status without phone calls
- Give dispatchers a clear queue of open requests and the ability to assign/reassign riders
- Give riders a simple way to see assigned deliveries and confirm completion via scan
- Preserve a full audit trail of every delivery — no deletions, full history
- Handle the core failure cases (double assignment, duplicate scan, invalid transitions) correctly

**Non-Goals**
- Payment processing or billing between retailer and customer
- Route optimization / GPS navigation for riders
- Customer-facing app or portal (customers interact only indirectly, via the retailer)
- Multi-retailer marketplace features
- Full offline-first sync (multi-day queueing, conflict resolution across devices) — basic retry-on-reconnect for a single failed update is in scope instead

### 5. Functional & Non-Functional Requirements
*Functional = what the system does. Non-functional = how well it does it (qualities/constraints).*

**Functional Requirements**
- Retailer can create a delivery request (customer name, phone, address, item description)
- Retailer can edit a request before it's assigned; edit is locked after assignment
- Dispatcher can view all open (unassigned) delivery requests
- Dispatcher can assign a delivery to a rider
- Dispatcher can reassign a delivery to a different rider
- Dispatcher can update status directly as a fallback (e.g. rider unreachable)
- Rider can view their assigned deliveries
- Rider can advance delivery status: Assigned → Picked Up → Delivered
- Rider confirms delivery via QR scan
- System rejects invalid state transitions (e.g. skipping Picked Up)
- System rejects duplicate scans (idempotent confirmation)
- System prevents double assignment of the same delivery
- All parties can view current delivery status
- No delivery record is ever deleted — full history preserved

**Non-Functional Requirements**
- **Consistency:** delivery state must never show conflicting results to two users
- **Reliability:** a single failed network call (e.g. rider's status update) should retry automatically rather than silently fail
- **Usability:** rider-facing actions must be completable in as few steps as possible, given riders operate one-handed, often outdoors
- **Auditability:** every state change is timestamped and attributable to a persona/action
- **Security:** each persona can only perform actions permitted by the permission matrix — enforced at the API level, not just hidden in the UI

### 6. Permission Matrix

| Persona | Business Permission |
|---|---|
| **Retailer Staff** | Create Delivery Request; Edit Request (pre-assignment only); Track Delivery Status |
| **Dispatcher** | View Open Requests; Assign Delivery to Rider; Reassign Delivery; Update Status (fallback only) |
| **Rider** | View Assigned Deliveries; Advance Delivery Status (Assigned → Picked Up); Confirm Delivery (via QR scan) |

*No persona can delete a delivery record — full history is preserved for audit purposes.*

### 7. Proposed Solution
Reflex is a shared coordination platform built around three roles working off one system of record. A retailer logs a delivery request with customer and item details. A dispatcher sees it appear in a queue of open requests and assigns it to an available rider — and can reassign if that rider becomes unavailable. The rider sees the assignment, updates status as they progress (Picked Up), and confirms delivery by scanning a QR code at drop-off, which closes the request.

Every step — creation, assignment, status change, confirmation — is recorded and visible to the relevant parties, replacing the current reliance on phone calls and WhatsApp messages. The result is a single source of truth for "where is this delivery right now," with a durable record for resolving disputes later.

---

## ACT II — ARCHITECTURE & DATA MODEL
*Owner: Ashfall*

### 8. System Architecture Overview

Reflex is a Django REST Framework backend paired with a React (Vite) frontend, communicating over a JSON API. The backend is split into two apps by concern, not by persona:

- **`accounts`** — identity and authentication. Owns the custom `User` model and the `role` field that distinguishes Retailer, Dispatcher, and Rider.
- **`deliveries`** — domain logic. Owns the `Delivery` model and all persona-specific business rules for creating, assigning, and progressing a delivery.

This split follows a general architectural rule used across the team's projects: authentication/identity is always kept separate from domain logic, even when a project is small enough that combining them would "work." It keeps the permission and business-rule code in `deliveries` free of anything related to how a user logs in, and keeps `accounts` reusable if the domain ever changes.

Authentication uses **JWT (JSON Web Tokens)** via `djangorestframework-simplejwt`, rather than DRF's built-in Token authentication. A client logs in once (`POST /api/token/`) to receive a short-lived access token and a longer-lived refresh token, then attaches the access token to every subsequent request as an `Authorization: Bearer <token>` header. This was chosen over static DRF tokens because JWTs expire automatically (reducing the risk of a leaked token being valid indefinitely) and carry the user's identity inside the token itself, meaning the server doesn't need a database lookup on every request just to authenticate — it decodes the token and knows immediately who's making the call.

The frontend and backend run as two independent applications during development (Vite dev server on `localhost:5173`, Django on `127.0.0.1:8000`), communicating purely over HTTP. This required explicit **CORS (Cross-Origin Resource Sharing)** configuration on the backend (`django-cors-headers`), since browsers block cross-origin requests by default. Without this, the frontend could reach the backend's preflight check but never receive an actual response — a real integration issue caught and resolved during testing (see §14).

### 9. Data Model

**User** (`accounts.models.User`, extends Django's `AbstractUser`)

| Field | Type | Notes |
|---|---|---|
| `role` | CharField, choices | `retailer`, `dispatcher`, or `rider`. No default — every user must explicitly declare a role at creation. |

All other fields (`username`, `password`, `email`, etc.) are inherited from Django's built-in `AbstractUser`, avoiding the need to rebuild standard authentication fields from scratch.

**Delivery** (`deliveries.models.Delivery`)

| Field | Type | Notes |
|---|---|---|
| `customer_name` | CharField | |
| `customer_phone` | CharField | |
| `customer_address` | TextField | |
| `item_description` | TextField | |
| `status` | CharField, choices | `pending`, `assigned`, `picked_up`, `delivered`, `cancelled`. Defaults to `pending`. |
| `retailer` | ForeignKey → User | `on_delete=PROTECT` |
| `rider` | ForeignKey → User, nullable | `on_delete=SET_NULL` |
| `confirmation_code` | CharField, unique | Generated via `uuid.uuid4()` at creation |
| `is_confirmed` | BooleanField | Defaults `False`; flips to `True` only on a valid QR confirmation |
| `created_at` / `updated_at` | DateTimeField | Auto-managed by Django |

Two `on_delete` choices were made deliberately, not left as Django defaults:

- **`retailer` uses `PROTECT`** — a retailer's delivery history is core audit data (Non-Functional Requirement: Auditability, §5). If a retailer account were deleted, `PROTECT` raises an error rather than silently deleting or orphaning their delivery history, forcing a conscious decision about what happens to that data rather than losing it by accident.
- **`rider` uses `SET_NULL`** — a rider leaving the platform is a normal, expected event (turnover is common in gig-style delivery work), and shouldn't destroy the delivery record itself. The delivery's history remains intact; it simply shows no rider currently attached.

The full entity relationship diagram is maintained separately at `diagrams/erd/erd.md`.

### 10. State Machine

A delivery moves through a strictly defined set of states:

```
Pending → Assigned → Picked Up → Delivered
   ↓          ↓           ↓
   └──────────┴───────────┴──→ Cancelled
```

`Cancelled` is a **terminal state reachable from any pre-Delivered stage** — a delivery can be cancelled while still Pending, after Assignment, or even after Pickup, but never after it's already Delivered (at that point the transaction is complete and irreversible). This was a deliberate simplification: the system does not model partial failures or returns after delivery, since that falls outside the project's Non-Goals (§4).

State transitions are currently enforced through guard checks embedded in each relevant API action (e.g. `RiderDeliveryViewSet.pick_up` checks that a delivery is `Assigned` before allowing it to move to `Picked Up`), rather than a single centralized state-machine validator. Each transition rule is tested and verified independently at its point of enforcement — see Act III §14 for how each rule was validated. The full state diagram is maintained separately at `diagrams/state-machine/state-machine.md`.

### 11. API Design Principles

Three principles guided every endpoint decision in this project:

1. **Serializers expose only what a persona is allowed to submit, not the full model.** For example, the endpoint a Retailer uses to create a delivery accepts only four fields (`customer_name`, `customer_phone`, `customer_address`, `item_description`) — not `status`, `retailer`, or `confirmation_code`. Those remaining fields are either system-generated or set from trusted request context (the authenticated user), never accepted as raw input. This turns the serializer itself into a security boundary: a Retailer physically cannot submit a request that sets its own status to `delivered`, because the field isn't exposed at all — the rule is enforced in the API layer, not left to trust or frontend validation (Security requirement, §5).

2. **Business-permission actions are modeled as explicit endpoints, not generic CRUD.** Rather than exposing a single `PATCH /deliveries/{id}/` that accepts any field change, actions like `assign`, `cancel`, `pick_up`, and `confirm` are their own named endpoints (`POST /deliveries/{id}/assign/`, etc.). This mirrors the Permission Matrix (§6) directly — each row of that table maps to a specific, nameable action in the API, rather than a generic update that would need internal branching logic to figure out what's actually being requested.

3. **Each persona sees only the data relevant to their role.** A Retailer's list endpoint returns only their own delivery requests; a Rider's list endpoint returns only deliveries assigned to them. Dispatcher is the exception — since dispatching requires visibility across the whole system, their list endpoint returns all deliveries, filterable by status via a query parameter.

---

## ACT III — IMPLEMENTATION & VERIFICATION
*Owner: Ashfall*

### 12. Endpoint Summary

| Persona | Endpoint | Method | Purpose |
|---|---|---|---|
| Retailer | `/api/deliveries/` | GET | List own requests |
| Retailer | `/api/deliveries/` | POST | Create a request |
| Retailer | `/api/deliveries/{id}/` | GET | View a single request |
| Retailer | `/api/deliveries/{id}/` | PATCH | Edit (pre-assignment only) |
| Retailer | `/api/deliveries/{id}/cancel/` | POST | Cancel (pre-assignment only) |
| Dispatcher | `/api/dispatcher/deliveries/` | GET | List all deliveries (filterable by `?status=`) |
| Dispatcher | `/api/dispatcher/deliveries/{id}/assign/` | POST | Assign a rider |
| Dispatcher | `/api/dispatcher/deliveries/{id}/update_status/` | POST | Manual status override (fallback) |
| Dispatcher | `/api/dispatcher/deliveries/{id}/cancel/` | POST | Cancel (any pre-delivered stage) |
| Rider | `/api/rider/deliveries/` | GET | List deliveries assigned to self |
| Rider | `/api/rider/deliveries/{id}/pick_up/` | POST | Advance Assigned → Picked Up |
| Rider | `/api/rider/deliveries/{id}/confirm/` | POST | Confirm via scanned code, Picked Up → Delivered |
| — | `/api/users/?role=rider` | GET | Rider list for Dispatcher's assignment dropdown (Dispatcher-only) |
| — | `/api/users/me/` | GET | Returns the authenticated user's id, username, and role |

Every endpoint requires a valid JWT (`Authorization: Bearer <token>`) and is restricted to its intended persona via a dedicated permission class (`IsRetailer`, `IsDispatcher`, `IsRider`). A request from the wrong persona — e.g. a Rider calling a Dispatcher-only endpoint — is rejected with `403 Forbidden` before any business logic runs.

`/api/users/me/` was added after initial frontend integration testing revealed a gap: the login endpoint (`/api/token/`) returns only access and refresh tokens, with no information about who the user actually is. The frontend needs to know the logged-in user's role immediately after login in order to route them to the correct persona dashboard. This endpoint closes that gap — see §14 for the specific bug it fixed.

### 13. Key Implementation Decisions

**generics vs. ViewSet.** Endpoints were initially built using DRF's `generics` views (one narrow class per action), matching the Permission Matrix (§6) row by row. This was later consolidated into `ModelViewSet` per persona, using method overrides (`get_queryset`, `get_serializer_class`, `perform_create`, `perform_update`) and custom `@action` methods for non-CRUD operations like `assign` and `confirm`. Both approaches cost a similar amount of logic given the matrix's asymmetric, conditional rules — the deciding factor was reducing file count by consolidating each persona's full rule set into a single class, while keeping every individual rule clearly separated by method name.

**No delivery is ever deletable.** Every ViewSet either omits the `delete` HTTP method entirely (`http_method_names` excludes it) or explicitly overrides `perform_destroy` to reject the action with a clear error. This directly enforces the Auditability requirement (§5) and the Permission Matrix note that "no persona can delete a delivery record" — cancellation, not deletion, is the only way to close out an unwanted delivery, preserving full history.

**UUID4 for confirmation codes.** `confirmation_code` is generated with Python's `uuid.uuid4()` at delivery creation, combined with a `unique=True` database constraint. This gives an unpredictable, effectively-collision-free identifier without needing an extra database lookup to check for clashes — the code embedded in each delivery's QR representation is guaranteed distinct from every other delivery's code by construction.

**Admin panel is a verification tool, not a deliverable.** Django admin was customized minimally — just enough to expose the `role` field on `User` and give visibility into `Delivery` records during development and testing. It does not appear anywhere in the Permission Matrix (§6) or Functional Requirements (§5), because no persona in the system uses it; it exists purely as an internal tool for confirming data state during manual and Postman-based testing.

**CORS configured explicitly, not disabled broadly.** Rather than allowing all origins (a common but insecure shortcut), `CORS_ALLOWED_ORIGINS` explicitly lists only the frontend's known development origins (`localhost:5173`, `127.0.0.1:5173`). This keeps the security posture intentional even during local development, and makes the allowed-origins list a clear, single place to update once the frontend is deployed to a real domain.

### 14. Verification Approach

Every endpoint and business rule in this project was verified against the real running system via Postman, not assumed correct from code review alone. The verification pattern used throughout:

1. Call the endpoint as the **wrong** persona (or anonymous) → confirm it's rejected (`401` or `403`)
2. Call the endpoint as the **correct** persona in a state where the action should be **blocked** → confirm the specific business rule fires with the correct error message
3. Call the endpoint as the **correct** persona in a state where the action should **succeed** → confirm the expected state change

This pattern was applied to every guard in the system, including: Dispatcher's create-block (`405 Method Not Allowed` for both anonymous and authenticated-but-wrong-action attempts), Rider's pick-up guard (rejecting a jump straight to Picked Up from Pending), and the two experiments detailed in Act IV.

**Frontend-backend integration testing.** Once the React frontend was functional, the full system was tested end-to-end through the actual UI rather than Postman alone. This surfaced two real integration issues not visible from backend-only testing:

- **CORS blocking:** the frontend's login request reached the backend's preflight check but the actual `POST` was silently blocked by the browser, since no CORS policy had been configured. Fixed by adding and configuring `django-cors-headers` (§13).
- **Incorrect post-login redirect:** every user, regardless of role, was redirected to the Retailer dashboard after logging in. Root cause: the frontend's redirect logic depended on a `role` field in the login response, but `/api/token/` never returns user information — only tokens. Fixed by adding `/api/users/me/` (§12) and updating the frontend's login flow to fetch the real user immediately after authentication.

Both issues were caught specifically because testing happened against the real UI, not just the API in isolation — reinforcing why full-stack verification, not just backend verification, was necessary before treating any persona flow as "done."

Following these fixes, the complete happy path was verified live through the actual frontend: Retailer creates a delivery → Dispatcher assigns a rider → Rider marks it Picked Up → Rider confirms delivery via the correct code → delivery reaches `Delivered` status, visible correctly across all three persona dashboards.

---

## ACT IV — TECHNICAL EXPERIMENTS & TRADE-OFFS
*Owner: Melody*

### 15. Experiment: Double Assignment

**Risk being tested:** if two Dispatcher requests attempt to assign the same `Pending` delivery at nearly the same moment, a naive read-then-write implementation could let both requests believe the delivery is still available, resulting in the second write silently overwriting the first — corrupting which rider is actually responsible, with no error raised to either dispatcher.

**Fix implemented:** the `assign` action wraps its read and write in a single database transaction, using `select_for_update()` to lock the delivery row for the duration of the operation. A second request attempting to assign the same row is forced to wait until the first transaction completes, then re-reads the row's true current status before proceeding — rather than acting on stale data. The guard condition was also tightened at the same time, from "block only if already `Delivered`" to "only allow if currently `Pending`" — closing a related gap where an already-`Assigned` or `Picked Up` delivery could previously have been silently reassigned via this endpoint with no rejection at all.

**Evidence:** Two assign requests were fired against the same `Pending` delivery in immediate succession via Postman. The first request succeeded (`200 OK`, status transitioned to `assigned`). The second request was cleanly rejected (`"This delivery is no longer available for assignment."`) rather than overwriting the first assignment. Screenshots: `evidence/dispatcher-double-assign-first-success.png`, `evidence/dispatcher-double-assign-second-blocked.png`.

### 16. Experiment: Duplicate Scan

**Risk being tested:** a delivery's QR code could be scanned more than once — by rider error, customer curiosity, or a retried network request resending the same call — and a naive implementation might treat every scan as a fresh, valid confirmation.

**Fix implemented:** the `confirm` action performs two checks before allowing confirmation. First, it validates that the code submitted in the request body matches the delivery's actual `confirmation_code`, rejecting any mismatch outright — meaning a scan is only ever accepted for the specific delivery it belongs to, not any delivery ID reachable via the URL. Second, it checks the `is_confirmed` flag: if a delivery has already been confirmed once, any further confirmation attempt — even with the correct code — is rejected rather than silently re-processed.

**Evidence:** Four scenarios were tested against a single delivery via Postman:
- Scan with an incorrect code → rejected (`403`, `"Scanned code does not match this delivery."`)
- Scan with the correct code, first attempt → succeeded (`200`, status → `delivered`, `is_confirmed → true`)
- Second scan attempt with the correct code, on an already-confirmed delivery → rejected (`403`, `"This delivery has already been confirmed."`)

Screenshots: `evidence/rider-confirm-wrong-code-403.png`, `evidence/rider-confirm-success.png`, `evidence/rider-confirm-duplicate-403.png`.

Both experiments were re-confirmed to hold at the frontend layer as well: since these protections are enforced in the backend regardless of which client calls the API, the same guarantees apply whether a request originates from Postman or from the live React UI.

### 17. Trade-off Log

| # | Decision | Alternative Considered | Weakness Accepted | Why Acceptable | Future Improvement |
|---|---|---|---|---|---|
| 1 | Retailer editing locked after assignment | Allow editing at any pre-delivered stage | Retailer can't fix a typo in the address once a rider is en route | Once a rider is assigned and potentially already moving, an uncoordinated edit could send them to the wrong location with no confirmation the change was seen | Add a "request correction" flow that notifies the Dispatcher/Rider rather than silently editing |
| 2 | Retry-on-reconnect for failed network calls | Full offline-first sync with conflict resolution | Doesn't handle multi-day offline usage or conflicting concurrent edits | Riders' connectivity gaps are typically brief (seconds to minutes), not multi-day; full offline-first sync was explicitly out of scope (§4) | Add local queueing for a broader range of failure durations if real-world usage shows longer gaps |
| 3 | Simple linear state machine, no partial-failure states | Model additional states (e.g. "delivery attempted, customer unavailable") | Doesn't capture real-world edge cases like a failed delivery attempt | Keeps the state machine small enough to fully verify by hand within the sprint timeline; edge cases can route through Cancel + a new request for now | Introduce a "Failed Attempt" state with its own retry path |
| 4 | JWT authentication over DRF Token authentication | DRF's built-in static Token authentication | Slightly more complex client-side handling (access + refresh token pair, expiry) | Tokens expire automatically, limiting the damage of a leaked token; identity is embedded in the token, avoiding a database lookup on every request | Add refresh-token rotation for stronger session security if the project moves past prototype stage |
| 5 | QR confirmation uses a text-input prompt instead of a live camera scanner | Build a real camera-based QR scanning library into the frontend | Rider must manually type or paste the confirmation code rather than scanning a physical code | Backend validation (correct code, one-time use) is the part with genuine technical risk and is fully built and tested; the scanning mechanism itself is a UI-layer concern that doesn't affect the correctness of the underlying system | Integrate a camera-based QR scanning library (e.g. a JavaScript barcode scanner) once core functionality is stable |
| 6 | Dispatcher's delivery list shows rider by ID rather than name | Add rider's username to the delivery serializer response | Less readable list view ("Rider #3" instead of a name) | Avoided a backend response-shape change during active frontend integration testing, reducing risk of breaking already-working screens mid-sprint | Add rider's username to `DeliveryReadSerializer`, or resolve names client-side via the existing `/api/users/?role=rider` endpoint |

---

## ACT V — REFLECTION & ROADMAP
*Owner: Melody*

### 18. What's Complete

By the close of this sprint, Reflex has a fully implemented three-persona system, backend and frontend both functional and verified together. The backend (Retailer, Dispatcher, Rider) uses JWT authentication and a complete, tested API surface matching the Permission Matrix (§6) exactly. The React frontend, built by Khalid against a frozen data contract, covers all three personas' screens and has been fully wired to the live backend — every screen fetches and submits real data rather than placeholder content. Two verified technical experiments prove the system's handling of concurrency (double assignment) and idempotency (duplicate scan) against the real running system. The complete happy path — delivery creation through confirmed drop-off — has been demonstrated live through the actual user interface, not just the API in isolation.

### 19. Known Limitations

State-machine enforcement currently lives as individual guard checks distributed across each persona's relevant actions, rather than a single centralized validator. Each rule has been independently tested and verified correct (Act III, §14), but a centralized transition table would be a more maintainable pattern if the state machine grows more complex in a future iteration. This was a conscious scope decision given the sprint timeline, not an oversight — the priority was verified correctness of every individual transition over architectural elegance.

QR delivery confirmation currently uses a text-input prompt rather than a live camera scanner (Trade-off Log entry 5). The security-critical part — validating the scanned code and preventing duplicate confirmation — is fully implemented and tested at the backend level; only the scanning input mechanism is a placeholder.

The Dispatcher's delivery list displays the assigned rider by numeric ID rather than by name (Trade-off Log entry 6), since the delivery endpoint does not currently return the rider's username.

The retry-on-reconnect behavior for failed network calls, and the broader offline handling described in the Non-Goals (§4), remain a known gap consistent with the project's original scope boundaries.

### 20. Roadmap Beyond the Sprint

If Reflex continued past this evaluation, the natural next steps would be: centralizing state-machine enforcement into a single transition table (addressing §19); integrating a real camera-based QR scanning library; resolving rider names for display in the Dispatcher's delivery list; building out the "request correction" flow flagged in Trade-off Log entry 1; and extending offline handling based on real rider usage patterns rather than assumptions made during initial design.

### 21. Team Reflection

This sprint required a mid-point pivot: initial guidance suggested a design-only deliverable, later clarified to require a real, working system. All architecture and design work completed before that clarification — the ERD, state machine, and design-flow diagrams — remained valid and was carried forward unchanged into the working build, which validated the time invested in getting the design right before writing code. The two required technical experiments (double assignment, duplicate scan) were treated as first-class deliverables throughout, verified against the live system with reproducible evidence rather than argued from code alone. Integrating the independently-built frontend and backend surfaced real issues — CORS configuration and an incomplete login response — that were only visible once both halves were tested together, reinforcing the value of full-stack verification over testing each layer in isolation.

