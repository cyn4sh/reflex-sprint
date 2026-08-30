# Reflex — Demo Script

**Target time:** ~7–8 minutes
**Tool:** Live application (React frontend + Django backend, both running locally)
**Presenter:** Ashfall (or split narration across the team)

**Before starting:**
- Start the Django backend: `python manage.py runserver`
- Start the React frontend: `cd frontend && npm run dev`
- Open the frontend at `http://localhost:5173`
- Reset the database to a clean state — no leftover test deliveries cluttering the demo
- Have three browser tabs (or one tab you log in/out of) ready for `test_retailer`, `test_dispatcher`, and `test_rider`
- Know the confirmation code for the delivery you'll use in Segment 4 (check Django admin in advance, or copy it from the screen right after creating the delivery in Segment 2)

---

## Segment 1 — The Problem (30 seconds)

**Say:**
"Small Kenyan retailers currently coordinate deliveries over WhatsApp and phone calls. There's no record of who's assigned to what, no proof a delivery happened, and no way to resolve a dispute. Reflex replaces that with a shared system of record across three roles: Retailer, Dispatcher, and Rider."

---

## Segment 2 — Happy Path Walkthrough (3 minutes)

**Step 1 — Retailer creates a delivery request**

*Say:* "Here's the Retailer's view — a dashboard showing all their delivery requests and current status at a glance."

- Log in as `test_retailer`
- **Show:** the Retailer Dashboard — point out the stats cards (Total, Pending, In Transit, Delivered) and the Recent Deliveries list
- Click **"New Delivery"**
- Fill in the form (customer name, phone, address, item)
- Click **"Create Delivery"**

*Say:* "That request is now live in the system — status Pending, with a unique confirmation code generated automatically behind the scenes for later QR confirmation."

- **Show:** the new delivery appears on the dashboard with status "Pending"

**Step 2 — Dispatcher assigns a rider**

*Say:* "Now the dispatcher sees this request come in, and assigns it to an available rider."

- Log out, log in as `test_dispatcher`
- **Show:** the Dispatcher Dashboard, with the new request visible
- Click **"Assign Rider"** on the request
- Select a rider from the dropdown
- Click **"Assign Rider"** to submit

*Say:* "That's now assigned — visible immediately to that rider, no phone call needed."

- **Show:** delivery now shows status "Assigned" on the dispatcher dashboard

**Step 3 — Rider picks up and confirms**

*Say:* "The rider sees it's assigned to them, and marks it picked up once they've collected the item."

- Log out, log in as `test_rider`
- **Show:** the Rider Dashboard, with the assigned delivery visible
- Click **"Mark as Picked Up"**
- **Show:** status flips to "Picked Up," button changes to "Mark as Delivered"

*Say:* "At drop-off, the rider confirms delivery using the code generated back when the request was created — that's the QR confirmation step."

- Click **"Mark as Delivered"**
- Enter the correct confirmation code when prompted
- **Show:** status flips to "Delivered"

*Say:* "That's the full lifecycle — every step recorded, timestamped, and attributable, replacing what used to be an untracked phone call."

---

## Segment 3 — Failure Case 1: Double Assignment (2 minutes)

*Say:* "One risk we specifically tested for: what happens if two dispatchers try to assign the same delivery at nearly the same moment? Without protection, the second request could silently overwrite the first — the wrong rider ends up recorded as responsible, with no error to either dispatcher."

- Using a fresh Pending delivery, open two browser tabs both logged in as `test_dispatcher`, both on the same delivery's Assign screen
- Submit the assignment in the first tab
- Immediately submit the assignment in the second tab (same delivery)

**Show both outcomes:**
- First tab: assignment succeeds, delivery now shows "Assigned"
- Second tab: rejected with an error — the delivery is no longer available for assignment

*Say:* "The first assignment wins, and the second is cleanly rejected instead of silently overwriting it. We enforce this with database-level row locking, so two near-simultaneous requests can't both act on stale data."

*(If demoing live through the UI proves too fast/hard to time by hand, this can be shown via the saved evidence screenshots instead — `evidence/dispatcher-double-assign-first-success.png` and `evidence/dispatcher-double-assign-second-blocked.png` — while narrating the same explanation.)*

---

## Segment 4 — Failure Case 2: Duplicate Scan (2 minutes)

*Say:* "The second risk: what if a QR code gets scanned twice — by accident, or someone re-submits the same confirmation? The system needs to treat the delivery as already closed, not confirm it a second time."

- Using the delivery already marked "Delivered" from Segment 2
- As `test_rider`, attempt to confirm it again with the same correct code

**Show:** rejected — "This delivery has already been confirmed."

*Say:* "And separately — the code itself is validated, not just accepted blindly."

- Using a different delivery still at "Picked Up," attempt to confirm with an incorrect code

**Show:** rejected — "Scanned code does not match this delivery."

*Say:* "So confirmation is protected two ways: the right code, and only once."

---

## Segment 5 — Wrap-up (30 seconds)

*Say:* "That's Reflex end-to-end: three roles working off one shared record, with the two highest-risk failure modes — double assignment and duplicate scans — specifically tested and proven against the live system, not just assumed correct. Happy to answer questions or go deeper into any part of the design."

---

## Known Limitations to Mention if Asked

- **QR scanning** is currently a manual code entry (a browser prompt), not a live camera scanner. The validation logic behind it — correct code, one-time use — is fully built and tested; only the physical scanning input is a placeholder pending a camera-based scanning library.
- **Rider names** show as "Rider #[id]" in the Dispatcher's delivery list rather than by name, since that endpoint currently returns only the rider's ID.

These are documented as deliberate, acknowledged trade-offs in `docs/reflex-design.md` (Trade-off Log entries 5–6), not oversights — worth stating plainly if a panelist asks about either.

---

## Notes for Dry Runs

- Time each segment separately during rehearsal — flag if any single segment runs long
- Have accounts already logged out/ready to switch between quickly — role-switching between Retailer/Dispatcher/Rider is the main place time can slip
- Keep the confirmation code for Segment 4 handy in advance (copy it right after creating the delivery, or pull it from Django admin) so you're not searching for it live
- Have a backup delivery ready in case one gets left in an unexpected state mid-rehearsal
- Practice the double-assignment segment specifically — firing two near-simultaneous requests live can be fiddly; decide in advance whether to attempt it live or fall back to the saved evidence screenshots

