---
name: session-evidence
description: Archive each chat session as an isolated, tamper-evident record (Evidence) with timestamps, user instructions, decisions made, role outputs, and modified files. Prevents cross-session contamination and confusion. Trigger with /evidence, /save-evidence, "บันทึก evidence", or "สรุปหลักฐานแชทนี้".
---

# 📦 Session Evidence Archiver Skill

This skill ensures that **every chat session or distinct work assignment is preserved as an individual, immutable Evidence File** under `.agents/evidence/`. 
This prevents different tasks, experiments, and discussions from contaminating each other or creating confusion when multiple chat sessions are opened over time.

---

## 🎯 Core Objectives
1. **Isolated Session History (แยกแชทไม่ปนกัน)**: Each chat gets its own standalone evidence document.
2. **Audit Trail & Proof of Work (มีหลักฐานอ้างอิงชัดเจน)**: Records who did what, which decisions were made, and which files were touched.
3. **Traceability (ย้อนดูที่มาที่ไปได้เสมอ)**: If something breaks or a question arises in a future chat, you can trace back to the exact session evidence file.

---

## 📂 Storage Location & Naming Convention

* **Folder**: `.agents/evidence/`
* **File Naming**: `EVIDENCE_<YYYYMMDD_HHMM>_<TOPIC_SLUG>.md`  
  *(Example: `EVIDENCE_20261103_1430_dark_light_mode.md`, `EVIDENCE_20261103_1520_friday_upskill.md`)*

---

## 📑 Evidence File Standard Template

When recording evidence, use this structured format:

```markdown
# 📑 Session Evidence Record: <Topic Name>

- **Evidence ID**: EV-<YYYYMMDD-HHMM>
- **Timestamp**: <YYYY-MM-DD HH:MM:SS (UTC+7)>
- **Conversation ID**: <Unique Chat Session ID>
- **Sprint / Milestone**: <Sprint Name>
- **Status**: ✅ Completed / ⏳ In-Progress / 🛑 Blocked

---

## 🎯 1. User Instruction & Scope (โจทย์ที่ได้รับ)
> "<บันทึกข้อความหรือโจทย์ที่ User สั่งในแชทนี้แบบตรงไปตรงมา>"

---

## 👥 2. Role Participation & Contributions (ผลงานของแต่ละตำแหน่งในแชทนี้)
- 👔 **@pm-lead**: <การจัดสรรงาน, การแตก Task, การสรุปคิวงาน>
- 🏛️ **@architect**: <แบบพิมพ์เขียว, สถาปัตยกรรม, การตัดสินใจออกแบบ>
- 🎨 **@frontend-dev**: <UI/UX, Styling, Component ที่สร้างหรือแก้>
- ⚙️ **@backend-dev**: <API, Service, Database ที่พัฒนา>
- 🔍 **@qa-tester**: <ผลการทดสอบ, Test cases, Edge cases ที่ตรวจผ่าน>
- 🛡️ **@devops-sec**: <ความปลอดภัย, เซิร์ฟเวอร์, Environment>

---

## 📁 3. Files Created & Modified (ไฟล์ที่สร้างและแก้ไขจริง)
- `[created]` <path/to/file>
- `[modified]` <path/to/file>

---

## 💡 4. Decisions & Key Takeaways (ข้อตกลงและข้อสรุปสำคัญ)
- <บันทึกข้อตกลงทางเทคนิค หรือความต้องการเฉพาะที่ User ระบุไว้ เพื่อไม่ให้สับสนในแชทถัดไป>

---

## 🔗 5. Relation to Central Work Log
- อ้างอิงบันทึกภาพรวมที่: `.agents/logs/WORK_LOG.md`
```

---

## 🚀 Execution Rules

1. **Automatic Archiving on Session Conclusion**: When a major task in a chat completes or when the user says "เสร็จแล้ว", "บันทึก evidence", or `/evidence`:
   - Generate the corresponding Evidence file in `.agents/evidence/`.
   - Update `.agents/logs/WORK_LOG.md` with a link to the new Evidence ID.
2. **Reviewing Past Evidence in New Chats**:
   - When a new chat starts, the agent reviews the index in `.agents/evidence/` to know what was accomplished in prior sessions without mixing up current goals with old ones.
