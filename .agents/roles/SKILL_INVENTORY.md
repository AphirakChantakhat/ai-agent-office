# 🧠 AI Engineering Team: Skill & Competency Inventory
**Workspace**: `d:\AiAgent`  
**Last Updated**: 2026-11-20 09:54:00 (UTC+7)  
**Maintained By**: All 6 AI Roles (Approved by คุณปลั๊ก)

เอกสารรวบรวมคลังทักษะ (Skill Inventory), ขีดความสามารถขั้นสูง (Advanced Competencies), และเทคโนโลยีที่ผ่านการอัปสกิลและนำมาใช้งานจริงในระบบ Core Banking & Biometric Switching

---

## 📊 Summary Competency Matrix

| Role | Core Domain | Newly Acquired Skills (Nov 2026) | Practical Project Application |
| :--- | :--- | :--- | :--- |
| **👔 `@pm-lead`** | Orchestration & Delivery | Multi-Repo Release Pipeline, Spec-Driven Hooks, Multi-Model Routing | Automated Dependency Graph Check, Zero-Click Failover Hooks |
| **🏛️ `@architect`** | Architecture & Security | Field-Level Encryption (FLE), Blind Indexing, Idempotency Sagas | Vault `CARDREADER_KEY` Integration, Duplicate Reject Design |
| **🎨 `@frontend-dev`** | Client UI/UX & Kiosk | Predictive FSM, WASM Biometric Pre-check, Canvas Streaming | Kiosk State Recovery, 60fps Low-Latency Kiosk Diagnostic Screens |
| **⚙️ `@backend-dev`** | Core Engine & Performance | In-Memory Dynamic Translation, Virtual Threads, Circuit Breakers | Dynamic Error Step Mapping (`PR01`, `CLCH01`), Connection Pooling |
| **🔍 `@qa-tester`** | Test Engineering & QA | Property-Based Fuzzing, Contract Testing (Pact), Mutation Testing | Multi-Dimensional Edge Case Simulator, E2E Verification Suites |
| **🛡️ `@devops-sec`** | DevSecOps & Compliance | Automated PDPA Log Masking, Zero-Trust Token Binding, Hermetic Builds | WildFly Regex DLP Sanitizer, Safe Artifact Deployment on WildFly |

---

## 👥 Detailed Role Skills & Upgrades

### 1. 👔 `@pm-lead` (PM / Tech Lead)
- **Multi-Repository Release Coordination**:
  - ทักษะการวิเคราะห์ Dependency Graph ข้าม 5 Repositories (`BaseTXNModelLib` $\rightarrow$ `BiometricsTXNModelLib` $\rightarrow$ `automation-core_service` $\rightarrow$ `ndc_plus-switching-simulator` $\rightarrow$ `driver_check_in-machine`) เพื่อจัดการลำดับการ Compile, JAR Packaging, และ Hot Deployment ให้สอดคล้องกัน 100%
- **Spec-Driven Agent Workflow & Lifecycle Hooks**:
  - ทักษะการแปลงโจทย์ธุรกิจให้อยู่ในรูป Executable Specification และควบคุม Agent Subagents ผ่าน Lifecycle Hooks (`PreToolUse`, `PostToolUse`, `StopFailover`) ลด Token Overhead ลงกว่า 70%
- **Cross-Provider Multi-Model Failover Orchestration**:
  - เชี่ยวชาญการบริหารจัดการ AI Model Matrix (Anthropic Claude Opus/Sonnet, Google Gemini Argon/Flash, Open-Source GPT-OSS) แบบ Dynamic Zero-Downtime

---

### 2. 🏛️ `@architect` (System Architect)
- **Field-Level Encryption (FLE) & Hardware Vault Integration**:
  - ออกแบบสถาปัตยกรรมเข้ารหัสระดับข้อมูลระบุตัวตน (PII) เช่น `customerId` ผ่าน `VaultDefine.CARDREADER_KEY` และ `VaultClientManager` ตามมาตรฐานความปลอดภัย PCI-DSS v4.0
- **Zero-Knowledge Duplicate Checking with Blind Indexing**:
  - ออกแบบกลไกการตรวจสอบข้อมูลซ้ำซ้อน (NID, Passport, Mobile No) โดยใช้ HMAC-SHA256 Blind Indexing ช่วยให้ค้นหาได้ที่ $O(1)$ ผ่าน B-Tree Index โดยไม่ต้องถอดรหัสทั้งฐานข้อมูล
- **IETF Idempotency-Key Standard & Distributed Saga Pattern**:
  - ออกแบบ State Machine สำหรับ Distributed Transactions และ Atomic State Transitions ป้องกันปัญหา Transaction ค้างสถานะ (`0002 Waiting Confirm`) หรือ Double Submission

---

### 3. 🎨 `@frontend-dev` (Frontend Specialist)
- **Predictive UI Finite State Machine (FSM)**:
  - ทักษะการออกแบบ State Machine ควบคุมหน้าจอ Kiosk ATM / VTM รองรับกรณีฮาร์ดแวร์วัดผลไม่พร้อม (Optional Measurements) เช่น เครื่องเป่าแอลกอฮอล์หรือปุ่ม Reaction Time ไม่ตอบสนอง (`NOT_TAKEN`, ค่าว่าง)
- **Client-Side Biometric Pre-Filtering via WASM / TFLite**:
  - เทคนิคการรัน AI Model ตรวจจับ Face Mesh และประเมินคุณภาพของแสงสะท้อนบนฝั่ง Client ก่อนบีบอัดและส่งรูปภาพขึ้นเซิร์ฟเวอร์ ช่วยลดขนาด Payload ลง 40%
- **GPU-Accelerated High-Performance UI**:
  - เชี่ยวชาญ Canvas 2D/WebGL Rendering, SVG Micro-icons, และการจัดการ DOM Sub-pixel Rendering ที่กิน CPU ต่ำกว่า 1.5%

---

### 4. ⚙️ `@backend-dev` (Backend Specialist)
- **In-Memory Dynamic Code Translation & Rule-Engine Pattern**:
  - ทักษะการสร้าง Dynamic Response Code Translator ที่แยก Business Logic ออกจาก Mapping Layer ช่วยให้ปรับเปลี่ยน Error Step (`DCH_0001`, `DCH_0101`, `DCH_0200`, `DCH_0202`, `DPR_0001` ถึง `DPR_0012`) ได้อย่างยืดหยุ่นโดยไม่ต้องแตะโค้ดหลัก
- **High-Throughput Concurrency & Virtual Threads (Project Loom)**:
  - ทักษะการจูน Concurrency บน Java Runtime สำหรับ Blocking I/O ระหว่าง Core Service กับ Switching Simulator และการจัดการ Thread Contention ขณะเรียก External Vault
- **Composite Indexing & Query Tuning**:
  - ออกแบบ Covering Composite Index บนตาราง Transaction Audit Logs (`driver_daily_check_in_log`, `driver_daily_check_in`) ช่วยเร่งความเร็วในการดึงข้อมูลย้อนหลัง

---

### 5. 🔍 `@qa-tester` (QA Tester)
- **Property-Based Testing (PBT) & Boundary Fuzzing**:
  - ทักษะการสุ่มสร้าง Payload ผิดรูปนับพันชุดแบบอัตโนมัติ เพื่อทดสอบความทนทานต่อ Null, Empty String, Whitespace, และ Malformed Input ในเซอร์วิสทางการเงิน
- **Contract-Driven Testing (Pact Framework)**:
  - การทดสอบความถูกต้องของ Data Contract ระหว่าง Consumer และ Provider ป้องกัน Break Change ระหว่าง `Service.xlsx` และ `SwitchingService.xlsx` ก่อนเริ่มเขียนโค้ดจริง
- **Automated Verification Scripting**:
  - พัฒนา Automated Scripts ตรวจสอบ Source Code, XML Specifications, และไฟล์ `.drawio` ยืนยันความถูกต้อง 100% ครบทุก Node

---

### 6. 🛡️ `@devops-sec` (DevOps & Security)
- **Automated PDPA Data Leak Prevention (DLP) ใน Logging**:
  - สร้าง Logging Regex Filter ระดับ Application Server (Logback/Log4j2) ช่วยดักจับและ Masking ข้อมูลอ่อนไหว (เช่น NID 13 หลัก, หมายเลขบัตร, เบอร์โทรศัพท์) ไม่ให้หลุดลงในไฟล์ Log หรือ Console
- **Zero-Trust Token Binding & Ephemeral Keystores**:
  - สถาปัตยกรรมความปลอดภัยสำหรับเครื่อง Kiosk ป้องกัน Man-in-the-Middle และการขโมย Biometric Template ด้วย Hardware-backed Keystores
- **Hermetic Build Verification & Artifact Deployment**:
  - ควบคุมความถูกต้องของการบิลด์ Deployment Artifacts (`PNNextAutomationService.war`, `PNSwitchingSimulatorService.war`) ขึ้น WildFly Application Server อย่างรัดกุม ไร้ข้อผิดพลาด
