---
name: outcome-tracking
description: Summarize daily engineering accomplishments into structured, copy-paste ready formats for Outcome Tracking, Daily Timesheets, Jira, or Management Reports. Aggregates completed tasks, technical deliverables, and business impact from WORK_LOG.md and team status. Trigger with /outcome, /daily-outcome, /tracking, "สรุป outcome", "สรุปงานวันนี้", "outcome tracking", or "กรอก outcome tracking".
---

# 🎯 Daily Outcome Tracking Skill

This skill extracts and transforms daily engineering activities across all 6 AI roles into high-impact, professional **Outcome Tracking** reports ready to copy-paste into corporate tracking systems (e.g. Timesheets, Jira Worklogs, Google Sheets, Confluence, or Daily Standup chats).

Unlike raw activity logs (which say "what was worked on"), this skill emphasizes **concrete outcomes, deliverables, technical impact, and business value** (what was *achieved*).

---

## 🚀 Trigger Commands

Activate this skill on-demand using any of these triggers:
- `/outcome`
- `/daily-outcome`
- `/tracking`
- `"สรุป outcome วันนี้"`
- `"สรุปงานวันนี้สำหรับกรอก outcome tracking"`
- `"ทำ outcome tracking ให้หน่อย"`

---

## 📥 Information Sources (Auto-Aggregated)

When triggered, the agent automatically synthesizes context from:
1. **`.agents/logs/WORK_LOG.md`**: Completed tasks, architectural decisions, and role logs.
2. **`.agents/state/team_status.json`**: Current sprint, prompt tracker summary, and recent audit logs.
3. **`.agents/evidence/`**: Session evidence files generated today.
4. **Recent Git diffs / modified files**: Specific scripts, SQL DDLs, XML/Draw.io diagrams, or source code files modified during the day.

---

## 📋 The 3 Standard Outcome Tracking Formats

Provide the summary structured in 3 ready-to-copy formats to suit different organizational requirements:

### รูปแบบที่ 1: มาตรฐานสำหรับกรอกระบบ Outcome Tracking / Timesheet (Ready to Copy-Paste)
> รูปแบบกระชับ มีโครงสร้างครบถ้วน เหมาะสำหรับนำไปวางใน Google Forms, Jira Worklog, หรือระบบบันทึกงานประจำวันของบริษัท

```text
================================================================================
📌 DAILY OUTCOME TRACKING REPORT
================================================================================
📅 วันที่ (Date): YYYY-MM-DD
🏢 โปรเจกต์ / ระบบ (Project/System): <ชื่อโปรเจกต์ เช่น AI Agent Office / LDB Driver Check-in>
🎯 Sprint / หัวข้องานหลัก (Main Sprint/Task): <Sprint Name หรือ Ticket ID>
--------------------------------------------------------------------------------
✅ ผลงานที่สำเร็จตามเป้าหมาย (Key Outcomes & Deliverables):
• [Feature / Module 1]: <ผลลัพธ์ที่เสร็จสมบูรณ์ เช่น ออกแบบ ERD และสร้าง SQL DDL 2 ตาราง>
• [Feature / Module 2]: <เช่น ปรับปรุง Sequence Diagram แท็บ CLCH - Face 24.x และ 25.x>
• [Architecture / Logic]: <เช่น แยก transNo อิสระ แก้ปัญหา race condition และ replay attack>
• [Optimization / Tooling]: <เช่น ติดตั้ง Auto-Model Switching & Failover Hooks>

📦 สิ่งที่ส่งมอบ / ไฟล์ที่สร้างหรือแก้ไข (Artifacts & Modified Files):
- <ไฟล์ที่สำคัญ 1 เช่น ldb_product_showcase.sql>
- <ไฟล์ที่สำคัญ 2 เช่น Switching Simulator Design.drawio>

💡 ผลลัพธ์เชิงคุณค่า & ผลกระทบ (Business & Technical Value):
- <ปลดล็อกอะไร หรือลดความเสี่ยงอะไร เช่น ปลดล็อกให้ทีม Core Service และ Kiosk เริ่มเขียนโค้ดได้ทันทีตาม Spec>

⚠️ ปัญหา / อุปสรรค (Blockers & Risks):
- ไม่มี (None) หรือ <ระบุสิ่งที่รอคอนเฟิร์ม / ติดปัญหา>

⏭️ แผนงานในวันทำการถัดไป (Next Steps):
- <งานชิ้นถัดไปที่วางแผนจะทำ>
================================================================================
```

---

### รูปแบบที่ 2: สรุปสั้น 3 ข้อ (Executive / Line Group / Daily Standup)
> รูปแบบกระชับพิเศษ 3 บรรทัด สำหรับรายงานผู้บริหาร หรือพิมพ์ส่งในกลุ่มไลน์/สแล็กทีม

```text
📢 [Daily Outcome Summary] - DD/MM/YYYY
1. สำเร็จ (Done): <สรุปผลงานสำคัญที่ส่งมอบ 1-2 ข้อ>
2. กำลังทำ / รอผล (In-Progress / Pending): <สถานะงานที่ส่งต่อหรือรอฟีดแบ็ก>
3. ก้าวต่อไป (Next): <สิ่งที่จะลุยต่อพรุ่งนี้>
```

---

### รูปแบบที่ 3: Professional English Format (Global / Enterprise Jira)
> เหมาะสำหรับองค์กรสากล หรือส่งบันทึกลงระบบ Jira / Confluence / Timesheet ภาษาอังกฤษ

```text
================================================================================
DAILY OUTCOME LOG
================================================================================
Date: YYYY-MM-DD
Sprint / Task: <Sprint / Module Name>
Status: Completed / In Progress

Key Achievements & Outcomes:
- Completed <Feature / Deliverable 1>: Designed architecture and DB schemas.
- Implemented <Deliverable 2>: Added automated test verification and validation scripts.
- Delivered <Artifacts>: Documented specifications in <Spec Files>.

Technical Impact:
- Unblocked downstream development for Core Service and Mobile Client.
- Mitigated transaction correlation conflicts by generating independent session IDs.

Blockers: None
Next Immediate Actions: <Tomorrow's tasks>
================================================================================
```

---

## 🛠️ Step-by-Step Workflow for the Agent

1. **Read Today's State**:
   - Inspect `.agents/logs/WORK_LOG.md` and check `Last Updated`.
   - Inspect `.agents/state/team_status.json` to get `prompt_tracker.summary` and active sprint.
2. **Filter by Date**:
   - Filter accomplishments and modified files that occurred today (`current local date`).
3. **Draft Outcomes**:
   - Focus on tangible outputs (e.g. "สร้าง SQL Script ตาราง X", "ปรับ Diagram แท็บ Y ผ่าน XML validation 100%") rather than activity descriptions (e.g. avoid "นั่งดูโค้ด", "กำลังคิด").
4. **Present Clean Markdown**:
   - Present the 3 formats clearly inside code blocks or clean Markdown for one-click copy.
   - Prompt the user if they need any adjustments or specific Jira ticket IDs filled in.
