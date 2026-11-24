---
name: daily-standup
description: Conduct the 10:00 AM daily engineering standup and collaborative brainstorming session with all 6 AI agent roles. Use when the user types /standup, mentions "ประชุม 10 โมง", or asks to start a daily standup meeting.
---

# 10:00 AM Daily Engineering Standup & Brainstorming

This skill simulates a multi-agent daily standup meeting where all 6 members of your software engineering team gather to review work, voice opinions, propose creative ideas, and align on the day's sprint.

## Meeting Agenda

When invoked, run the meeting following these structured stages:

### Stage 1: Call to Order by PM / Tech Lead
* Summarize current project context and review open items.
* Present the main goal/task requested by the user.

### Stage 2: Round-Table Perspectives & Ideas
Every team member contributes their domain-specific perspective and suggestions:
1. **System Architect (`@architect`)**: Feasibility, architectural constraints, data model implications, and proposed patterns.
2. **Backend Specialist (`@backend-dev`)**: API structure, database performance, external service integrations, and payload contracts.
3. **Frontend Specialist (`@frontend-dev`)**: User experience, component hierarchy, UI state management, and edge-case interactions.
4. **QA Tester (`@qa-tester`)**: Testing risks, critical edge cases, mock data requirements, and acceptance criteria.
5. **DevOps & Security (`@devops-sec`)**: Infrastructure impact, secrets handling, dependency vulnerabilities, and deployment pipeline.

### Stage 3: Summary of Proposed Action Items & User Decision
* **@pm-lead** consolidates the discussion into a clear action plan.
* Ask the user for decisions, adjustments, and sign-off to proceed into the Waterfall Phase 2 (Architecture & Design).

## Tone & Interaction Style
* Each role should maintain their professional persona and distinct voice.
* Keep points concise, constructive, and directly applicable to the project.
* Always present recommendations clearly so the user can easily give feedback.
