# Reflex — Dry Run Timing Log

Two full rehearsals of the panel defense (slides + live demo, per `docs/demo-script.md`), run end-to-end against the live application.

**Target:** ~10 minutes total (slides bookending a ~7–8 minute live demo)

---

## Run 1

**Total time:** 9 minutes 56 seconds

Within target, but close to the ceiling — leaves little room for unexpected delays (slow login, a mistyped confirmation code, a question mid-demo) during the actual defense.

## Run 2

**Total time:** 7 minutes 28 seconds

A meaningful improvement over Run 1 — roughly 2.5 minutes faster, most likely from smoother navigation between screens and less hesitation on what to click next, now that the flow was familiar.

---

## Observations

- **Improvement between runs confirms the value of rehearsal** — the same script, run twice, got noticeably faster simply from familiarity, not from cutting content.
- **Run 2's time leaves comfortable buffer** under the 10-minute cap, even accounting for small real-world friction on the day (slower typing, a brief pause for a question).
- Segment-level timing (how long slides vs. live demo vs. each demo segment took individually) was not captured in either run — worth timing at that granularity in a future rehearsal if there's time, to identify exactly where the 2.5-minute improvement came from and confirm no single segment is running long.

## Notes for the Actual Defense

- Aim to pace closer to Run 2's time than Run 1's — Run 1 is closer to the edge of the 10-minute limit than is comfortable.
- Keep the token-expiry risk in mind (JWT access tokens last 5 minutes) — if any segment stalls for questions or discussion, a fresh login may be needed before continuing the live demo.
- The double-assignment segment (Segment 3 in the demo script) is flagged in the script itself as the trickiest to time live — confirm during any further rehearsal whether it's being demoed live or shown via the saved evidence screenshots instead.

