# 1) Title & One-Liner

**Product name:** Faculty Insight Assistant  
**One-liner:** A frontend-only prototype that lets faculty ask natural-language questions about Canvas activity, review at-risk students, and simulate follow-up actions like nudging students or flagging problematic modules.

---

# 2) Problem Statement

Faculty often need quick, actionable insight into student engagement and performance inside Canvas, but the data is fragmented and time-consuming to interpret manually. They need to identify students who have not logged in, are below grade thresholds, or are impacted by problematic course modules without digging through multiple dashboards and reports.

This affects instructors, advisors, and support staff who are responsible for monitoring student progress and intervening early. It matters now because student success workflows increasingly depend on timely outreach and proactive intervention, and faculty are overloaded with administrative tasks.

---

# 3) Assumptions

- This is a **frontend-only prototype**; no backend, no database, and no real Canvas integration yet.
- The experience will use **mocked Canvas-like data** in static JSON and/or browser `localStorage`.
- The prototype is intended to demonstrate **workflow, UI, and interaction patterns**, not production-grade analytics.
- Users are faculty members authenticated only conceptually; the prototype may include a simple “enter as demo user” flow without real auth.
- The assistant will simulate responses to natural-language queries using canned scenarios and rule-based UI interactions.
- Actions like “nudge student” and “flag module” will be **simulated** with toast confirmations and local state changes.
- Deployment target is **GitHub Pages**.
- Routing should support GitHub Pages constraints using **hash-based routing** or equivalent static-host-safe configuration.
- UI will use **React + Ant Design** and must conform to ASU-themed styling constraints.

---

# 4) Goals & Non-Goals

## Goals
1. Let faculty ask natural-language questions about student activity and receive a structured, understandable response.
2. Surface at-risk students based on mock criteria like login inactivity and grades below threshold.
3. Allow faculty to review recommended next actions per student or module.
4. Simulate one-click actions such as sending a nudge or flagging a course module.
5. Provide a clear, polished prototype that demonstrates the future agentic workflow.
6. Keep the interaction fully usable as a static frontend on GitHub Pages.
7. Ensure the UI is accessible and follows the required ASU theme and AntD styling rules.

## Non-Goals
- No real Canvas API integration.
- No real AI/LLM backend.
- No real notifications, email delivery, or student messaging.
- No persistence beyond local browser state for prototype behavior.
- No admin, role management, or enterprise authentication.
- No analytics data warehouse or server-side reporting.

---

# 5) Target Users & Primary Use Cases

## Personas
1. **Faculty Instructor**
   - Wants to identify struggling students quickly and take action.
2. **Department Advisor**
   - Wants a high-level view of risk across several courses.
3. **Academic Support Staff**
   - Wants to help faculty prioritize outreach and module fixes.

## Top Workflows / Use Cases
1. Faculty asks: “Which students haven’t logged in in the last 7 days?”
2. Faculty asks: “Who is below a 70% grade threshold in my course?”
3. Faculty reviews a list of at-risk students and chooses to send a nudge.
4. Faculty identifies a problematic Canvas module with unusually high drop-off.
5. Faculty marks an action as completed and sees the status update in the dashboard.
6. Faculty explores trends across class engagement, assignment completion, and module performance.
7. Faculty opens a student detail drawer to inspect the reason for risk.
8. Faculty simulates a follow-up action and sees an activity log entry.

---

# 6) User Stories (with Acceptance Criteria)

## 1. Ask a question in natural language
**Story:** As a faculty member, I want to ask a question in plain language so I can quickly find at-risk students.

**Acceptance Criteria**
- Given I am on the main dashboard, when I enter a question like “Who hasn’t logged in this week?”, then I see a relevant answer summary.
- Given the question matches a supported scenario, when I submit it, then the UI returns a structured response with student counts and examples.
- Given the question is unsupported, when I submit it, then I see a helpful fallback message with suggested example prompts.

## 2. View students who have not logged in
**Story:** As a faculty member, I want to see students who haven’t logged in recently so I can intervene early.

**Acceptance Criteria**
- Given mock course activity data exists, when I ask for inactive students, then I see a list filtered by the inactivity threshold.
- Given a student has no recent login event, when results are displayed, then that student is shown as high risk.
- Given there are no inactive students, when I view results, then I see a “No risks found” state.

## 3. View students below a grade threshold
**Story:** As a faculty member, I want to identify students below a grade threshold so I can prioritize outreach.

**Acceptance Criteria**
- Given a grade threshold is available in the UI, when I ask for below-threshold students, then the results respect that threshold.
- Given the threshold changes, when I rerun the query, then the results update immediately in the prototype.
- Given a student is exactly on the threshold, when results render, then the boundary rule is displayed clearly.

## 4. Review recommended actions
**Story:** As a faculty member, I want to see recommended next steps so I can act without extra analysis.

**Acceptance Criteria**
- Given a student is flagged as at risk, when I open their card, then I see suggested actions like “Send nudge” or “Review assignment.”
- Given a module is flagged, when I open the module detail panel, then I see a recommendation like “Check broken link” or “Clarify instructions.”
- Given a recommendation is shown, when I read it, then I can understand the reason it was suggested.

## 5. Nudge a student
**Story:** As a faculty member, I want to simulate sending a nudge so I can test intervention workflows.

**Acceptance Criteria**
- Given a student detail panel is open, when I click “Send nudge,” then the UI shows a confirmation state.
- Given the nudge action completes, when I return to the list, then the student’s status reflects “Nudged.”
- Given the action is canceled, when I close the modal, then no status changes occur.

## 6. Flag a problematic module
**Story:** As a faculty member, I want to flag a module that seems confusing or broken so I can prioritize fixes.

**Acceptance Criteria**
- Given a module is identified as problematic, when I click “Flag module,” then the prototype stores the flag in local state.
- Given I revisit the dashboard in the same browser session, when the page reloads, then the flagged status remains if localStorage is used.
- Given the module is already flagged, when I open it again, then I see the existing flagged state.

## 7. Inspect student context
**Story:** As a faculty member, I want to open a student’s details so I can understand why they were flagged.

**Acceptance Criteria**
- Given a student is listed in results, when I click the row, then a drawer or side panel opens with context.
- Given the panel is open, when I switch tabs, then I can see engagement, grades, and action history.
- Given the student has multiple risk factors, when I view the panel, then all relevant factors are shown.

## 8. Track action status
**Story:** As a faculty member, I want to see what actions have already been taken so I don’t repeat work.

**Acceptance Criteria**
- Given an action has been performed, when I revisit the student or module card, then I see a status badge.
- Given multiple actions are taken, when I open the activity log, then I see a chronological list.
- Given no action has been taken, when I view the item, then it displays “No action yet.”

## 9. Use suggested prompts
**Story:** As a faculty member, I want example prompts so I can understand how to query the assistant.

**Acceptance Criteria**
- Given the page loads, when I view the prompt area, then I see example questions.
- Given I click an example prompt, when it is selected, then the text populates the input field.
- Given I submit an example prompt, when results return, then they match the intent of that prompt.

## 10. Recover from invalid queries
**Story:** As a faculty member, I want graceful handling for unsupported questions so I am not blocked.

**Acceptance Criteria**
- Given a query cannot be mapped to the mock scenarios, when I submit it, then I see an explanation.
- Given the system cannot infer the intent, when it responds, then it suggests supported prompt categories.
- Given I clear the input, when I start over, then the error state disappears.

---

# 7) Functional Requirements

## A. Conversation / Query Interface
### Prototype (now)
- Single query input with submit button.
- Example prompt chips for common questions.
- Basic intent recognition against a finite set of supported scenarios.
- Response panel showing:
  - natural-language summary
  - counts
  - top affected students/modules
  - suggested next actions

### Future (post-prototype)
- Multi-turn follow-up questions.
- Context retention across queries.
- LLM-based intent parsing and response synthesis.
- Course-specific filters, date ranges, and threshold controls in the query language.

## B. Risk Detection Views
### Prototype (now)
- Support mock scenarios:
  - no login in X days
  - grade below threshold
  - assignment missing
  - module drop-off spike
- Show severity labels: low, medium, high.
- Allow filtering by course and risk type.

### Future (post-prototype)
- Real Canvas data ingestion.
- Custom risk rules per faculty or department.
- Explainability for why a student is flagged with evidence snippets.

## C. Student Detail Experience
### Prototype (now)
- Drawer or modal for student details.
- Display:
  - current grade
  - login recency
  - assignment completion
  - risk reasons
  - suggested next action
- Local action state for “nudged.”

### Future (post-prototype)
- Timeline of engagement events.
- Instructor notes.
- Student communication templates.

## D. Module Issue Experience
### Prototype (now)
- Module cards with engagement indicators.
- “Flag module” action.
- Simulated reasons such as:
  - high exit rate
  - broken content sequence
  - low click-through
- Local status update and activity log entry.

### Future (post-prototype)
- Module analytics by item, week, and assignment type.
- Correlation with student outcomes.
- Faculty collaboration workflow for fixing content.

## E. Activity Log
### Prototype (now)
- Show a chronological feed of simulated actions.
- Store in browser state/localStorage.

### Future (post-prototype)
- Real audit trail.
- Exportable intervention logs.

## F. Edge Cases and Failure States
- No matching students returned.
- Empty course with no data.
- Invalid threshold input.
- Duplicate action on already nudged student.
- Missing module analytics for a given course.
- Query input longer than expected or malformed.
- Prototype data reset due to cleared browser storage.

---

# 8) UX / UI Requirements (AntD + ASU Theme)

## Key Screens / Pages
1. **Landing / Course Selection**
   - Purpose: Choose a demo course or enter the dashboard.
2. **Main Faculty Insights Dashboard**
   - Purpose: Ask questions, view summary results, and inspect at-risk items.
3. **Student Detail Drawer**
   - Purpose: Review student-level context and actions.
4. **Module Detail Drawer**
   - Purpose: Review module-level issues and flag status.
5. **Activity Log Panel**
   - Purpose: Show simulated interventions and flags.

## Component-Level Guidance
Use **Ant Design** components:
- `Layout`, `Header`, `Sider`, `Content`
- `Input.Search` or `Input` + `Button` for query submission
- `Card` for summary and result blocks
- `Table` or `List` for students/modules
- `Drawer` for student/module detail views
- `Tag` for severity and status
- `Alert` for unsupported query and empty states
- `Tabs` for switching between students, modules, and activity log
- `Tooltip` for definitions like “risk threshold”
- `Modal` for confirming actions like nudging or flagging
- `Steps` or `Timeline` for action history
- `Empty` for no-results states

## Theme / Token Guidance
Use these colors explicitly:
- Primary: **ASU Maroon #8C1D40**
- Secondary: **ASU Gold #FFC627**
- Gray variants: **#E8E8E8, #D0D0D0, #747474**

Styling rules:
- **Buttons must be fully rounded (pill style).**
- **Cards and other containers must have square corners.**
- **No drop shadows anywhere.** Avoid elevated surfaces, shadowed cards, and floating shadows.
- Use maroon for primary actions and gold for highlights or emphasis.
- Use gray tokens for dividers, borders, disabled text, and secondary metadata.

## Layout Guidance
- Use a clean, dashboard-style layout with a top header and left-side navigation or tabbed main content.
- Keep the main query input highly visible near the top of the dashboard.
- Present results in two levels:
  1. concise AI-style summary
  2. structured list/table for actionability
- Action controls should be placed near each row/card for easy follow-up.

## Accessibility Requirements
- Full keyboard navigation across query input, chips, tables, drawers, and modals.
- Sufficient contrast for all text and status labels against the background.
- All validation and error messages must be text-based, not color-only.
- Focus states must be visible without relying on shadows.
- Form fields must have labels or aria-labels.
- Use descriptive empty states and button labels like “Send nudge to student.”
- Ensure modal and drawer focus trapping works correctly.

---

# 9) System Architecture

## Prototype Mode: GitHub Pages Static SPA

```text
[User Browser]
      |
      v
[React SPA on GitHub Pages]
      |
      +--> [Static JSON Mock Data]
      |
      +--> [localStorage for session actions/status]
```

### Notes
- No backend services.
- No real API calls.
- Data is loaded from static JSON files bundled with the app or from local modules.
- Action state like nudges/flags can be stored in `localStorage` for demo continuity.
- Use hash-based routing or static-host-safe navigation so pages work on GitHub Pages.

---

# 10) Data Model

Because this is a frontend-only prototype, data should be temporary and local.

## Temporary Data Shapes

### Course
- `courseId`
- `courseName`
- `term`
- `instructorName`

### Student
- `studentId`
- `name`
- `email`
- `currentGrade`
- `lastLoginDate`
- `assignmentsMissing`
- `riskReasons[]`
- `status` (`normal`, `watch`, `nudged`)
- `recommendedActions[]`

### Module
- `moduleId`
- `moduleName`
- `engagementRate`
- `dropOffRate`
- `riskReasons[]`
- `status` (`normal`, `flagged`)

### Activity Log Item
- `id`
- `timestamp`
- `type` (`nudged_student`, `flagged_module`, `query_run`)
- `targetId`
- `summary`

These can be represented in static JSON and mirrored into `localStorage` as needed.

---

# 11) API Design

## Future API Contracts
These are **mocked/not implemented** in the prototype, but should be designed now to guide future buildout.

### 1. Query assistant
**POST** `/api/insights/query`
```json
{
  "courseId": "CSE101",
  "query": "Who hasn't logged in this week?",
  "thresholds": {
    "daysInactive": 7,
    "gradeBelow": 70
  }
}
```

**Response**
```json
{
  "intent": "inactive_students",
  "summary": "4 students have not logged in in the last 7 days.",
  "results": [
    {
      "studentId": "s1",
      "name": "Jordan Lee",
      "riskScore": 92,
      "reasons": ["No login in 10 days", "Missing 2 assignments"]
    }
  ],
  "suggestedActions": ["Send nudge", "Review module 3"]
}
```

### 2. Student detail
**GET** `/api/students/{studentId}`

### 3. Module detail
**GET** `/api/modules/{moduleId}`

### 4. Record action
**POST** `/api/actions`
```json
{
  "type": "nudged_student",
  "targetId": "s1",
  "note": "Checked in about missing assignments"
}
```

## Error Conventions
- `400` invalid input
- `404` not found
- `500` unexpected error
- Prototype should simulate these with in-UI error states only

---

# 12) Non-Functional Requirements

- **Performance:** Prototype should load in under 2 seconds on a typical broadband connection from GitHub Pages.
- **Reliability:** Actions should remain stable within a session; `localStorage` should not corrupt the prototype if absent.
- **Security:** No sensitive real student data should be used in the prototype. Use synthetic or anonymized sample data only.
- **Accessibility:** Meet basic WCAG-aligned standards for keyboard use, contrast, and error messaging.
- **Build/Deploy Simplicity:** Must be deployable as static assets with no server dependencies.
- **Maintainability:** Data scenarios should be easy to extend by editing JSON fixtures.
- **Observability:** Lightweight client-side event tracking only, if enabled.
- **Rate limiting:** Not applicable in prototype mode.
- **Pagination:** If lists become long in mock data, use table pagination for realism and UX testing.

---

# 13) Deployment

## Prototype Deployment (GitHub Pages)

### Target
- React SPA deployed as static files on **GitHub Pages**.

### Constraints
- Use a **relative asset base path** suitable for GitHub Pages.
- Prefer **hash-based routing** so refreshes do not break on static hosting.
- Avoid server-side redirects or runtime API dependencies.
- Use mock fixtures bundled with the app.
- Store optional demo state in `localStorage`.

### Release Process
1. Build the React app.
2. Publish the static build output to GitHub Pages.
3. Verify:
   - routing works on refresh
   - query examples load correctly
   - modals/drawers render properly
   - localStorage persistence behaves as expected
4. Reset demo state via a “Reset prototype” action if needed.

---

# 14) Analytics / Metrics

## Prototype Metrics
Track lightweight client-side events such as:
- Query submitted
- Example prompt clicked
- Student detail opened
- Nudge action simulated
- Module flag action simulated
- Unsupported query encountered

## Success Metrics
- Percentage of users who successfully get from a question to a recommended action.
- Time to first meaningful result.
- Number of simulated interventions performed during a session.
- User comprehension of the risk indicators and suggested actions.

---

# 15) Milestones & Phasing

## Phase 1: Prototype
- Static React UI
- Mock query scenarios
- Student/module detail drawers
- Simulated action buttons
- Activity log
- GitHub Pages deployment

## Phase 2: V1 Design Validation
- Broader set of query types
- Improved stateful interactions
- More realistic risk scoring visuals
- Better course selection and filtering

## Phase 3: AWS Buildout
- Real Canvas data integration
- Backend intelligence layer
- Auth and role-based access
- Persistent action tracking
- Notifications and audit trail

---

# 16) Risks & Mitigations

## Risk: Users expect real AI behavior
**Mitigation:** Label prototype responses clearly as simulated and use realistic canned outputs.

## Risk: Prototype feels too limited
**Mitigation:** Include multiple scenarios, good empty states, and clear next-step actions.

## Risk: GitHub Pages routing issues
**Mitigation:** Use hash routing and test refresh behavior thoroughly.

## Risk: Mock data feels unrealistic
**Mitigation:** Use faculty-like scenarios, believable thresholds, and plausible student/module names.

## Risk: ASU styling is implemented inconsistently
**Mitigation:** Provide explicit theme tokens and UI rules in the PRD and enforce them in component review.

## Risk: LocalStorage persistence breaks
**Mitigation:** Add graceful fallback to in-memory state and a reset action.

---

# 17) Open Questions

1. Should the prototype support one course or multiple courses?
2. Do you want the assistant framed as an “AI agent” or more as a “guided insights tool” in the UI copy?
3. Which query types are most important for the first demo:
   - inactivity
   - low grades
   - missing assignments
   - problematic modules
4. Should nudges be shown as email, Canvas message, or generic “notify student” in the prototype?
5. Do you want a simulated faculty homepage, or should the prototype jump directly into the analytics dashboard?

If you want, I can also turn this into a **screen-by-screen prototype spec** next, with:
- page layout wireframe descriptions
- exact AntD components per screen
- sample mock data objects
- recommended copy for prompts, empty states, and action confirmations