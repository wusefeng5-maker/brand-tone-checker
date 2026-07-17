# Architecture V2

## 1. Product Architecture

The V2 product should be organized around Brand QA, not around a single tone check.

Core modules:

- Brand Workspace
- Brand Brain
- Brand Standard
- Rule Engine
- Evidence Engine
- QA Engine
- LLM Adapter
- Workflow
- Knowledge Base
- History
- Team
- Analytics

## 2. Module Overview

## Brand Workspace

The top-level workspace for one brand or client.

Contains:

- Brand Brain
- Brand standards
- Rules
- Examples
- Channel profiles
- QA history
- Members
- Reports

AI dependency:

- Does not require AI.

Future model replaceability:

- Not model-dependent.

## Brand Brain

The long-term brand memory.

Inputs:

- Website
- Brand manual
- Historical copy
- Social content
- High score examples
- Low score examples
- Customer feedback
- Rules
- Forbidden expressions
- Preferred phrases
- Channel standards

Outputs:

- Brand summary
- Tone dimensions
- Brand standards
- Example references
- QA context

AI dependency:

- Uses AI for extraction, summarization, clustering, and rule suggestions.
- Stores structured outputs that do not depend on a specific model.

Future model replaceability:

- Extraction model can be replaced.
- Stored Brand Brain remains.

## Brand Standard

The structured standard used to evaluate content.

Includes:

- Voice principles
- Tone dimensions
- Do and don't rules
- Required messages
- Forbidden expressions
- Channel constraints
- Example references

AI dependency:

- Does not require AI for storage or deterministic checks.
- AI may help generate or refine standards.

Future model replaceability:

- Fully model-agnostic.

## Rule Engine

Evaluates content against explicit rules.

Rule types:

- Forbidden word
- Preferred phrase
- Required message
- Length
- Tone dimension
- Channel-specific constraint
- Legal risk
- Custom policy

AI dependency:

- Deterministic rules do not require AI.
- Semantic rules may use AI.

Future model replaceability:

- Semantic evaluator can be replaced through the LLM Adapter.

## Evidence Engine

Produces explainable QA evidence.

Evidence should answer:

- Which sentence has an issue?
- What is wrong?
- Which rule was violated?
- Where did the rule come from?
- Has this issue appeared before?
- What revision is recommended?

AI dependency:

- Uses AI for semantic sentence-level reasoning.
- Uses non-AI rule results for deterministic evidence.

Future model replaceability:

- AI evidence generator can be swapped.
- Evidence schema remains stable.

## QA Engine

Coordinates the full check.

Inputs:

- Content
- Brand Brain
- Brand Standard
- Context
- Rules
- Examples

Outputs:

- QA decision
- Score
- Evidence
- Suggestions
- Rewrite
- Rule hits
- Saveable learning items

AI dependency:

- Partially AI-dependent.
- Should combine deterministic rules and LLM analysis.

Future model replaceability:

- Uses LLM Adapter.
- Business layer should not bind to any model.

## LLM Adapter

The provider abstraction.

Responsibilities:

- Generate structured output
- Support model switching
- Hide provider-specific details

AI dependency:

- This is the AI boundary.

Future model replaceability:

- OpenAI-compatible
- Anthropic
- DeepSeek
- Gemini
- Future local models

## Workflow

Represents the lifecycle of a content review.

States:

- Draft
- Submitted
- Checked
- Needs Revision
- Approved
- Rejected
- Published

AI dependency:

- Does not require AI.

Future model replaceability:

- Not model-dependent.

## Knowledge Base

Stores the evidence and source material that make the Brand Brain durable.

Items:

- Source document
- Extracted insight
- Example
- Customer feedback
- Rule source
- Channel note

AI dependency:

- AI can help extract and classify knowledge.
- Storage and retrieval are model-agnostic.

Future model replaceability:

- Extraction and retrieval models can be replaced.

## History

Stores checks, revisions, decisions, and changes over time.

Should support:

- Audit trail
- Version comparison
- Recurring issue detection
- High score reuse

AI dependency:

- Does not require AI.

Future model replaceability:

- Not model-dependent.

## Team

Manages members and collaboration.

Includes:

- Member
- Role
- Reviewer
- Approver
- Comments

AI dependency:

- Does not require AI.

Future model replaceability:

- Not model-dependent.

## Analytics

Turns history into product value.

Metrics:

- Average QA score
- Pass rate
- Most violated rules
- Common off-brand phrases
- Brand drift
- Reviewer workload
- Team quality trend

AI dependency:

- Basic analytics do not require AI.
- Insight generation may use AI.

Future model replaceability:

- Insight model can be replaced.

## 3. Future Product Objects

Do not center the product around only Brand Profile, Tone Check, and History.

Use these objects:

- Brand Workspace
- Brand Brain
- Brand Standard
- Rule
- Evidence
- Knowledge Item
- Example
- Channel Profile
- QA Review
- Workflow
- Approval
- Feedback
- History
- Analytics Snapshot
- Member
- Role

## 4. Future Data Model Proposal

This is a Markdown-only proposal. Do not modify Prisma until the phase is approved.

## Brand

Represents one brand or client.

Fields:

- id
- workspaceId
- name
- website
- industry
- positioning
- createdAt
- updatedAt

## BrandVersion

Tracks changes to brand standards.

Fields:

- id
- brandId
- versionNumber
- summary
- createdBy
- createdAt

## Rule

An explicit standard.

Fields:

- id
- brandId
- versionId
- type
- title
- description
- severity
- source
- enabled
- createdAt

## Evidence

Sentence-level QA evidence.

Fields:

- id
- reviewId
- ruleId
- sentence
- issue
- explanation
- suggestion
- severity
- confidence
- createdAt

## KnowledgeItem

Source material or extracted insight.

Fields:

- id
- brandId
- type
- sourceUrl
- title
- content
- extractedSummary
- createdAt

## Example

High score or low score copy sample.

Fields:

- id
- brandId
- type
- channel
- content
- notes
- sourceReviewId
- createdAt

## ChannelProfile

Channel-specific standard.

Fields:

- id
- brandId
- channel
- toneNotes
- constraints
- exampleIds
- createdAt

## Workflow

Defines review states and transitions.

Fields:

- id
- workspaceId
- name
- states
- createdAt

## Review

A content QA review.

Fields:

- id
- brandId
- channel
- audience
- goal
- content
- decision
- score
- status
- createdBy
- createdAt

## Approval

Approval record for a review.

Fields:

- id
- reviewId
- reviewerId
- status
- comment
- createdAt

## Feedback

User feedback on QA quality.

Fields:

- id
- reviewId
- evidenceId
- type
- comment
- actionTaken
- createdAt

## Member

Workspace member.

Fields:

- id
- workspaceId
- userId
- roleId
- createdAt

## Role

Simple workspace role.

Fields:

- id
- workspaceId
- name
- permissions

## AnalyticsSnapshot

Periodic analytics.

Fields:

- id
- brandId
- periodStart
- periodEnd
- averageScore
- passRate
- topIssues
- topRules
- createdAt

## 5. Brand Brain Growth

Brand Brain grows from multiple inputs:

1. Website
   - Positioning
   - Product language
   - Value proposition
   - Audience

2. Historical copy
   - Common phrasing
   - Sentence structure
   - Tone
   - Approved style

3. Social media
   - Channel-specific style
   - Platform-native expressions
   - Audience engagement language

4. Customer feedback
   - Rejected expressions
   - Client preferences
   - Recurring revision reasons

5. High score examples
   - Positive references
   - Training examples for future QA

6. Low score examples
   - Negative references
   - Common mistakes

7. Forbidden words
   - Deterministic risk checks

8. Rules
   - Explicit standards
   - Severity
   - Source

9. Versions
   - Brand evolution over time
   - Auditability

## 6. Evidence Engine Design

The Evidence Engine should avoid generic AI comments.

For each sentence, it should produce:

- Sentence text
- QA decision
- Issue type
- Violated rule
- Rule source
- Historical examples
- Severity
- Explanation
- Suggested revision
- Whether it should become a new rule

Example evidence structure:

- Sentence: "Miss it and it is gone forever."
- Issue: Too promotional
- Rule: Avoid urgency-based hard selling
- Source: Brand rule created from client feedback on 2026-07-18
- Historical match: Similar issue appeared in 3 previous checks
- Suggestion: Replace with a calmer product benefit statement

The goal is to move from:

"AI thinks this is off brand."

to:

"This sentence violates a known brand rule, here is the source, and here is the revision."

## 7. AI Dependency Map

AI-dependent:

- Brand Brain extraction
- Semantic rule suggestions
- Evidence generation
- Rewrite suggestions
- Insight generation

Partially AI-dependent:

- QA Engine
- Rule Engine
- Knowledge classification

Not AI-dependent:

- Workspace
- Team
- Workflow
- Approval
- History
- Deterministic rules
- Analytics calculations
- Billing

## 8. Model Replaceability

All AI-dependent modules should go through the LLM Adapter.

The business layer should never depend on:

- OpenAI-specific response shape
- Claude-specific response shape
- Gemini-specific response shape
- Model-specific prompt behavior

Stable internal schemas should be:

- Brand Brain
- Rule
- Evidence
- Review
- Feedback
- Example

