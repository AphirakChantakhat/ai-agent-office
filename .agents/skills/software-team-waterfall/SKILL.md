---
name: software-team-waterfall
description: Execute software tasks using a disciplined 6-role Waterfall process with Milestone Sign-offs. Use when a software development, feature implementation, or bugfix request has been finalized after a standup or user prompt.
---

# 6-Role Waterfall Execution Protocol

Execute engineering tasks phase-by-phase through the team's pipeline with strict milestone gates and **Mandatory Subagent Model Delegation** (enforced by `.agents/hooks.json`):
- **Never do multi-role work in a single main process**: Delegate department work via `invoke_subagent` so `.agents/hooks.json` (`PreToolUse`) automatically rewrites the `Model` parameter to each department's dedicated model quota (`inherit` = Claude Opus/Sonnet, `pro` = Gemini 4 Argon, `flash` = Gemini 3.8 Flash, `flash_lite` = Gpt-oss/Emergency) and auto-switches on rate limits.

---

## Phase Breakdown

### Phase 1: Requirements & Daily Standup
* Refer to [daily-standup](../daily-standup/SKILL.md) to gather cross-functional ideas and clarify user expectations.
* Outcome: User confirms feature goals.

---

### Phase 2: Architecture & System Design
* **Role**: `System Architect`
* **Deliverables**:
  - Architecture diagram or sequence flow.
  - Data models / DB schema.
  - API endpoint contracts (request/response schemas).
* **🛑 MILESTONE GATE 1 (Human Sign-off)**:
  - Present design specification to the user.
  - **STOP & WAIT** for user approval before writing code.

---

### Phase 3: Implementation & Continuous Validation (Automated Pipeline)
* **Backend Dev**: Implements API endpoints, business logic, DB models, and migrations.
* **Frontend Dev**: Implements UI components, hooks/state management, and API calls.
* **QA Tester**:
  - Reviews code changes.
  - Writes unit/integration test suites.
  - Validates edge cases and reports regressions back to Devs.
* **Handshake**: Devs and QA iterate automatically until all tests pass and acceptance criteria are met.

---

### Phase 4: DevOps & Security Review
* **Role**: `DevOps & Security Engineer`
* **Deliverables**:
  - Dockerfile / Docker Compose verification.
  - Environment variable sanity check (no committed secrets).
  - Dependency security audit.
  - Production build verification (e.g. `npm run build` or `pytest`).
* **🛑 MILESTONE GATE 2 (Human Sign-off)**:
  - Present test results, security audit, and build status to the user.
  - **STOP & WAIT** for final deployment sign-off.

---

### Phase 5: Release & Post-Mortem
* Deploy or package the release.
* `PM / Tech Lead` logs the changelog and prepares status for the next 10:00 AM standup.
