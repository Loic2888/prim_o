# STAGE 2: HIGH LEVEL PLAN, PRIM’O


**Project Description:**

PRIM'O is an innovative management solution for VSEs and SMEs designed to transform workplace recognition. By addressing the disconnect between effort and reward, the application enables employers to reward their team in real-time using a token-based system. Employees can exchange these tokens for exclusive perks and vouchers through a dedicated partner catalog. This approach restores the direct link between performance and gratitude while avoiding the heavy regulatory constraints of traditional financial transactions.

---


 ## Phase A: Design & Foundations (May)

**Intensity**: 2 days per week (Focus on strategy and architecture)

### Week 1: Scoping & Backlog (Stage 2)
**Objective**: Define the MVP boundaries and prioritize features.
**Tasks**:
Draft User Stories (e.g., "As an employer, I want to allocate tokens instantly...").
Define the MoSCoW priority list (Must-haves vs. Nice-to-haves).
Set up project tracking tools (Notion/Trello) with granular tasks.
Deliverable: A fully prioritized product backlog.

### Week 2: Design & UX (Stage 3.1)
**Objective**: Visualize the user journey and interface.
**Tasks**:
Map out User Flows (from login to voucher redemption).
Create Low-fidelity wireframes for key screens (Dashboards, Catalog).
Define the visual identity (Colors, Typography, PRIM'O branding).
Deliverable: Basic Figma mockups.

### Week 3: Technical Architecture (Stage 3.2)
**Objective**: Solidify the technical "brain" of the app.
**Tasks**:
Detailed Database Schema (Mongoose models: Users, Wallets, Transactions, Offers).
API Specification: Documenting endpoints (e.g., POST /api/tokens/allocate).
Define the logic for the "Budget to Token" conversion engine.
Deliverable: Technical specification document.

### Week 4: Environment Setup (Stage 3.3)
**Objective**: Remove technical friction before the June sprint.
**Tasks**:
Initialize the GitHub repository.
Setup React/TypeScript and Node/Express boilerplate.
Configure MongoDB Atlas (Cloud) connection.
Implement basic Authentication (JWT/Bcrypt).
Deliverable: A functional "Hello World" full-stack structure.


## Phase B: The MVP Sprint (June)

**Intensity**: 5 days per week (High-velocity production)

### Week 5 (June 1–7): Core Backend & Auth
**Focus**: Internal mechanics.
Build complete Login/Register system (Admin vs. User roles).
Develop the "Bank" logic: Converting Euro budget into Token balances.
Create the Token Allocation API (Business logic and security checks).

### Week 6 (June 8–14): Frontend – Employer Space
**Focus**: Management tools.
Build the Employer Dashboard with the employee directory.
Develop the Real-time allocation form (The "Magic Button").
Integrate budget tracking visualizations.

### Week 7 (June 15–21): Frontend – Employee Space & Catalog
**Focus**: User experience and reward.
Build the Employee Dashboard (Balance and transaction history).
Develop the Partner Catalog interface.
Implement the "Claim" system: Trading tokens for unique promotional codes.

### Week 8 (June 22–30): Polishing, Testing & Closure (Stage 5)
**Focus**: Quality assurance and delivery.
End-to-end testing (Ensure security and data integrity).
UI/UX polishing and Mobile Responsiveness.
Deployment (Vercel/Render) and final presentation preparation.
Deliverable: Live PRIM'O MVP.
