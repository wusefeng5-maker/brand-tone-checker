# Roadmap V2

## RC2

### Goal

Move the MVP from an AI tone scoring tool to the first version of a brand QA workflow.

### Features

1. Context-aware QA
   - Platform
   - Audience
   - Goal

2. QA decision
   - Pass
   - Needs Revision
   - Off Brand

3. Evidence Engine V0
   - Sentence-level findings
   - Problem type
   - Suggested rewrite
   - Rule reference when available

4. Rule Engine V0
   - Forbidden expressions
   - Preferred phrases
   - Required messages
   - Simple deterministic checks

5. High Score Library V0
   - Save approved copy as an example
   - Reuse examples in future checks

6. Feedback Learning V0
   - Mark useful
   - Mark inaccurate
   - Save as rule
   - Save as example

7. Brand Brain V0
   - Combine current profile fields, examples, and rules into one internal brand memory concept

### Why

RC2 must prove that users are not buying a generic AI rewrite. They are buying a QA decision with evidence and reusable brand memory.

### Estimated Workload

2 to 3 weeks.

### Risks

- Evidence may feel generic if rules are too weak.
- Users may not understand rule creation.
- Check output may become too complex.

### Dependencies

- Current Brand Profile
- Current Check flow
- Current History
- Existing AI Provider abstraction

## v1.0

### Goal

Make the product valuable enough for the first paying agency or brand team.

### Features

1. Brand Workspace
   - Multiple brands
   - Clear brand switcher
   - Workspace-level history

2. Brand Brain V1
   - Brand summary
   - Tone dimensions
   - Rules
   - Examples
   - Forbidden and preferred phrases

3. Batch QA
   - Multiple pieces of content in one run
   - Summary of pass/fail status
   - Common issues

4. Channel Profiles
   - Xiaohongshu
   - WeChat Official Account
   - Douyin script
   - Ecommerce detail page
   - Email

5. Shareable QA Report
   - Copy report
   - Client-friendly explanation
   - Before/after comparison

6. Basic Billing
   - Free plan
   - Pro plan
   - Agency plan
   - Usage limits

### Why

v1.0 should monetize the strongest workflow: agency teams checking client content before delivery.

### Estimated Workload

6 to 8 weeks.

### Risks

- Batch QA can increase AI cost.
- Pricing may be unclear before real usage data.
- Agency workflow may require report customization.

### Dependencies

- RC2 evidence structure
- Rule Engine V0
- Brand Brain V0
- High Score Library
- Usage tracking

## v1.5

### Goal

Turn the product from a useful tool into a shared team workflow.

### Features

1. Team Collaboration
   - Invite members
   - Workspace members
   - Basic roles

2. Review Workflow
   - Draft
   - Checked
   - Needs revision
   - Approved
   - Rejected

3. Approval
   - Reviewer assignment
   - Comments
   - Decision history

4. Brand Standard Versioning
   - Rule changes
   - Example changes
   - Version notes

5. Analytics V0
   - Average score
   - Common issues
   - Most violated rules
   - Brand quality trend

6. Feedback Loop
   - Convert approval comments into rule suggestions
   - Track recurring problems

### Why

Team workflow creates switching costs and makes the product harder to replace with a general chatbot.

### Estimated Workload

2 to 3 months.

### Risks

- Workflow may become too heavy for small teams.
- Role design can overcomplicate the product.
- Analytics may be weak without enough data.

### Dependencies

- v1.0 Brand Workspace
- QA result structure
- History
- Member model

## v2.0

### Goal

Become the brand content QA platform for teams that manage brand standards across channels, markets, and collaborators.

### Features

1. Automated Brand Brain
   - Website ingestion
   - Social content ingestion
   - Brand manual ingestion
   - Historical copy ingestion

2. Knowledge Base
   - Source documents
   - Extracted standards
   - Example library
   - Customer feedback

3. Advanced Rule Engine
   - Legal risk rules
   - Channel-specific constraints
   - Tone dimensions
   - Custom scoring rubrics

4. Integrations
   - Google Docs
   - Notion
   - CMS
   - Browser extension
   - Slack or Teams

5. Enterprise Workflow
   - Advanced roles
   - Audit logs
   - Review queues
   - Client portals

6. Advanced Analytics
   - Brand consistency trend
   - Team quality
   - Rule drift
   - Channel performance correlation

### Why

v2.0 moves the platform from QA tool to brand governance infrastructure.

### Estimated Workload

6 to 12 months.

### Risks

- Enterprise scope can dilute the agency-focused wedge.
- Integrations can consume large engineering effort.
- Automated ingestion must be reliable and explainable.

### Dependencies

- Brand Brain V1
- Versioned rules
- Team workflow
- Analytics foundation
- Stable billing and usage model

