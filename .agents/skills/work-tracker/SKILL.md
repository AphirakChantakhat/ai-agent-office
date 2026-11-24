---
name: work-tracker
description: Track project progress, log task completions per role, and generate seamless context handoffs. Prevents starting over or re-reading the entire codebase when switching AI models or sessions. Trigger with /log-work, /handoff, /resume, "บันทึกสถานะงาน", or "อ่าน log งาน".
---

# 📋 Work Tracker & Context Handoff Skill

This skill maintains a continuous, human-readable, and AI-readable state of the project in `.agents/logs/WORK_LOG.md`. 
It ensures that if the user switches AI models (e.g. Gemini, Claude, OpenAI) or starts a fresh chat conversation, the new AI can instantly resume work without re-reading the entire codebase or losing context.

---

## 🎯 Core Principles
1. **Zero-Start Penalty**: A new AI session reads `.agents/logs/WORK_LOG.md` first and knows the exact project status in under 10 seconds.
2. **Role-Specific Accountability**: Each of the 6 roles records what they built, architectural decisions made, and pending tasks.
3. **Actionable Continuity**: Always records "Where we stopped" and "Immediate next step".

---

## 📂 Log Storage Location
* File path: `.agents/logs/WORK_LOG.md`

---

## 🛠️ Workflows

### 1. Recording / Updating the Log (`/log-work` or `/handoff`)
When a task or Waterfall phase finishes (or when the user asks to save progress), update `.agents/logs/WORK_LOG.md` following this structure:

```markdown
# 🚀 Project Progress & Handoff Log

**Project Name**: <Name>
**Current Sprint**: <Sprint Name / Number>
**Current Waterfall Phase**: <Phase 1-5>
**Last Updated**: <Date & Time>

---

## 📍 Quick Resume (สรุปจุดส่งต่องานใน 30 วินาที)
- **สถานะล่าสุด (Current Status)**: <สรุปสั้นๆ ว่าทำอะไรเสร็จไปแล้ว>
- **จุดที่ทำค้างไว้ (Where We Left Off)**: <รายละเอียดสิ่งที่ทำเสร็จล่าสุด>
- **งานที่จะต้องทำต่อทันที (Next Immediate Step)**: <ขั้นตอนถัดไปที่ต้องทำต่อ>
- **ไฟล์สำคัญที่เพิ่งแก้ไข (Key Modified Files)**:
  - `<file1>`
  - `<file2>`

---

## 👥 บันทึกงานแยกตามตำแหน่ง (Role-Specific Work Logs)

### 👔 @pm-lead (PM / Tech Lead)
- [x] <งานที่เสร็จแล้ว>
- [ ] <งานที่ต้องทำต่อ>
- **หมายเหตุ**: <บันทึกข้อตกลงหรือประเด็นของ Lead>

### 🏛️ @architect (System Architect)
- **Decisions Made**: <สถาปัตยกรรมหรือ Pattern ที่เลือกใช้>
- **Schema & Specs**: <ข้อมูล DB Schema หรือ API Contract ที่สรุปแล้ว>

### 🎨 @frontend-dev (Frontend Specialist)
- **Components Built**: <UI components ที่สร้างแล้ว>
- **State & Theme**: <สถานะ UI State หรือ Theme ปัจจุบัน>

### ⚙️ @backend-dev (Backend Specialist)
- **APIs & Logic**: <Endpoints หรือ Service ที่พัฒนาเสร็จแล้ว>
- **Database**: <ตาราง หรือ Query ที่เชื่อมต่อแล้ว>

### 🔍 @qa-tester (QA Tester)
- **Test Results**: <ผลการรันเทสล่าสุด Pass/Fail>
- **Edge Cases Tested**: <เคสที่ผ่านการทดสอบแล้ว>

### 🛡️ @devops-sec (DevOps & Security)
- **Environment & Build**: <การตั้งค่า Docker, พอร์ต, เซิร์ฟเวอร์>
- **Security Check**: <ผลการตรวจ Audit หรือ Secrets>
```

---

### 2. Resuming Work in a New Chat or New AI Model (`/resume`)
When the user opens a new chat or asks "ต่อจากเดิม" / "อ่าน log งาน":
1. Read `.agents/logs/WORK_LOG.md` immediately.
2. Read `.agents/state/team_status.json` for live UI synchronization.
3. Greet the user with a 3-bullet summary:
   - สรุปงานที่เสร็จสิ้นล่าสุด
   - ตำแหน่งไหนกำลังถือไม้ต่อ
   - สิ่งที่จะทำต่อทันที (รอ User คอนเฟิร์มเพื่อลุยต่อ)
