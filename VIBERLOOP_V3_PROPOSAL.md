# Viberloop v3 — Functional Improvement Proposal

**Date:** 2026-06-12
**Based on:** Viberloop v2 (Firebase Realtime DB + Storage, plain HTML/JS, Tailwind, mock Solana hashing)
**Sources:** v2 codebase, SECURITY_AUDIT_REPORT.md, DATA_SYNC_TROUBLESHOOTING.md, SOLANA_IMPLEMENTATION_PLAN.md, AUTHENTICATION_IMPLEMENTATION_GUIDE.md

---

## 1. Headline feature: Transaction correction with versioning & audit trail

**Problem today:** Transactions in v2 are write-once. Firestore rules forbid updates (`allow update: if false`) and there is no edit UI. A wrong weight, date, or photo can only be fixed by manual database surgery, which destroys traceability.

**Proposed design — supersede, never overwrite:**

- A correction creates a **new transaction record** rather than editing the old one. The new record carries:
  - `version: n+1`
  - `supersedes: <hash of previous version>`
  - `correctionReason: string` (required free text, e.g. "weight entered as 200 kg, actual 2000 kg")
  - `correctedBy` / `correctedByEmail` / `correctedAt`
- The superseded record is flagged `status: "superseded"` (its data is never modified or deleted) and gains a forward pointer `supersededBy: <new hash>`.
- All versions share a stable `entryGroupId` so the full chain is queryable in one read.

**Display rules:**

| Surface | Behavior |
|---|---|
| **Digital Product Passport (passport.html)** | Shows **only the latest active version** of each entry. Optionally a small "amended" badge (no details) for transparency. |
| **Admin console** | Shows the **full version chain** per entry: every superseded version, who corrected it, when, and why — a complete audit trail. Diff view highlights which fields changed. |
| **Role dashboards** | An "Amend entry" action on a user's own recent entries (configurable window, e.g. 48 h); older corrections require an admin. |

**Integrity guarantees:**
- Security rules permit only `status` and `supersededBy` to change on an existing record — all other fields immutable.
- When Solana anchoring goes live (see §5), each version gets its own on-chain proof, so the audit trail is independently verifiable: the old hash stays on chain, proving the original entry existed.

---

## 2. Authentication, roles & admin console (critical)

v2 has **no real authentication** — users pick a role from a button list stored in `localStorage`, and Firebase rules are wide open (`.read: true, .write: true`). The security audit rates v2 **HIGH RISK / not production ready**. v3 should make this the first milestone, because the audit trail in §1 is meaningless without verified identities.

- **Firebase Auth** (email/password + optional SSO) with the RBAC pattern already drafted in `v1/auth.js` and `AUTHENTICATION_IMPLEMENTATION_GUIDE.md` — promote it from template to enforced.
- **Custom claims per role** (WASTE_SOURCE … DISTRIBUTION_CENTER, plus new `ADMIN`), enforced in security rules: each role may create only its own stage's transactions.
- **Admin console** (new page): user invitation & role assignment, version-chain/audit-trail viewer (§1), and the existing photo-manager folded in behind admin auth.
- **Locked-down rules:** authenticated reads; writes validated against role claims and schema; Storage uploads restricted by user, content type, and size (replacing today's `allow write: if true`).

## 3. Security hardening

Fix the audit's remaining critical findings:

- Remove `eval()`-based config loading; load `firebase-config.js` as a normal module.
- Eliminate DOM-based XSS: replace `.innerHTML` rendering of user-supplied data (photo names, customer fields) with safe DOM APIs or sanitization.
- **Never store Solana private keys in `localStorage`.** Move signing server-side (Cloud Function with a custodial wallet) or use Phantom wallet — drop the unaudited custom Buffer polyfill.
- Add a Content-Security-Policy header via `firebase.json`, and App Check to block non-app clients.

## 4. Data quality & entry UX (reduces the need for corrections)

- **Per-role schema validation** at entry time: required fields per stage, numeric weight with unit selector (the current free-text `"200 kg"` string prevents mass-balance checks), date pickers, PO/batch format checks.
- **Pre-submit confirmation screen** summarizing the entry — cheapest way to cut error rates.
- **Chain continuity checks:** warn if a Spinner logs a batch with no upstream Recycling Hub entry, or if output weight exceeds input weight for the batch (mass-balance guard).
- **QR-driven handoff:** scan the previous stage's QR (QR generator already exists) to pre-fill `batchId`/`id`, eliminating retyping errors.

## 5. Real blockchain anchoring (finish what v2 mocked)

v2 simulates Solana hashes client-side. Implement the hybrid model already specced in `SOLANA_IMPLEMENTATION_PLAN.md`:

- Full data in Firebase; SHA-256 hash of the canonical transaction JSON written to Solana via a **Cloud Function** (server-side wallet, ~$0.00001/tx on mainnet).
- Passport gains a **"Verify on chain"** action that recomputes the hash and checks it against the on-chain memo.
- Per §1, every version (original and corrections) is anchored, making the audit trail tamper-evident.

## 6. Performance

- **Stop storing base64 photos in the Realtime DB** (`photoUrl` currently holds base64 blobs — this bloats every query and slows the passport page). Store only Storage URLs; generate **thumbnails** (Cloud Function or client-side) so lists load small images and full resolution loads on demand.
- **Indexed, paginated queries:** add `.indexOn` for `batchId`, `id`, `entryGroupId`, `status`; paginate dashboard history instead of downloading all transactions.
- **Build pipeline (Vite):** bundle and tree-shake instead of loading full SDKs from CDNs;content-hashed filenames for cache-busting (replacing the manual cache-busting workarounds in recent commits).

## 7. Stability & offline resilience

- **One codebase.** The v1/, v2/, root-level standalone files and version-check pages are the documented root cause of the sync confusion in `DATA_SYNC_TROUBLESHOOTING.md`. v3 ships a single app at the site root; legacy paths redirect.
- **Offline-first entry queue:** factory/warehouse sites have bad connectivity. Queue writes locally (Firebase offline persistence + an explicit "pending sync" indicator) and reconcile on reconnect — corrections via §1 versioning rather than silent conflict overwrites.
- **Error monitoring** (e.g. Sentry) and a visible app version stamp in the footer, replacing the ad-hoc VERIFY_VERSION.html / version-check.html diagnostics.

## 8. Reporting & compliance

- **Passport export to PDF** and dashboard **CSV export** for customer/auditor handover.
- **EU DPP / ESPR readiness:** add structured fields the regulation expects (material composition %, recycled content %, country of origin, care/end-of-life info) so the passport is compliance-grade, not just a tracking log.
- Aggregate admin metrics: entries per stage, correction rate per role (a direct quality KPI enabled by §1), average stage-to-stage lead time.

## 9. Testing & delivery

- Minimal automated test suite (Playwright smoke tests for each role's entry flow + passport render; rules unit tests with the Firebase emulator) wired into CI before `firebase deploy`.
- Staging Firebase project so demos stop running against production data.

---

## Suggested phasing

| Phase | Scope | Rationale |
|---|---|---|
| **3.0** | Auth + RBAC + locked rules (§2), security fixes (§3), single codebase (§7) | Everything else depends on verified identity; removes HIGH-RISK rating |
| **3.1** | Versioned corrections + admin audit trail (§1), entry validation & confirmation (§4) | The requested headline feature, on a trustworthy foundation |
| **3.2** | Photo/storage performance (§6), offline queue (§7), exports (§8) | Stability & speed at real-world sites |
| **3.3** | Real Solana anchoring + on-chain verification (§5), compliance fields (§8) | Differentiator; anchors the now-mature data model |
