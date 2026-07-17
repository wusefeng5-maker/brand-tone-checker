# Product Strategy V2

# Brand Tone Checker / Duiwei AI

## 1. Product Positioning

Brand Tone Checker is being repositioned as an **AI Brand QA Platform**.

It is not an AI writing tool.

It is not an AI rewriting tool.

It is not a prompt wrapper for scoring copy.

It is a pre-publish QA workspace for brand content, helping teams decide whether each piece of content is ready to publish, needs revision, or is off brand.

## 2. Mission

Help brand teams, content teams, and agencies turn brand voice from subjective experience into an executable, collaborative, traceable, and continuously improving quality standard.

## 3. Core Value

The core value is not whether AI can write.

The core value is whether a team can reliably ensure that every published piece of content matches the brand.

The product should answer:

- Does this content sound like this brand?
- Which sentence is off brand?
- Which rule did it violate?
- Where did the rule come from?
- How should it be revised?
- Has this problem happened before?
- Can this result become new brand knowledge?

## 4. Target Workflow

The platform should own the workflow between content creation and publishing:

1. Content is created elsewhere.
2. Content is submitted to Brand QA.
3. The QA engine checks brand fit, channel fit, risk, and rule compliance.
4. Evidence is shown sentence by sentence.
5. The content is revised.
6. The content is checked again.
7. The content is approved or rejected.
8. The final result is saved into brand knowledge.

## 5. Strategic Shift

### Current MVP

- Brand Profile
- Tone Check
- Score
- Problems
- Suggestions
- Rewrite
- History
- Admin

### V2 Product

- Brand Workspace
- Brand Brain
- Brand Standards
- Rule Engine
- Evidence Engine
- QA Engine
- Workflow
- Approval
- Knowledge Base
- History
- Analytics

## 6. Product Moat

The product moat must not be prompt quality.

Prompt quality will be copied by general AI products.

The moat should be built around durable user and team assets.

### Brand Brain

The long-term memory of a brand:

- Website content
- Brand manuals
- Social content
- Historical copy
- High score examples
- Low score examples
- Customer feedback
- Approved phrases
- Forbidden expressions
- Channel-specific standards
- Versioned rules

### Evidence Engine

The system that turns AI opinion into explainable QA:

- Sentence-level issue detection
- Rule references
- Source references
- Historical examples
- Suggested edits
- Confidence and severity

### Workflow

The repeatable process:

- Draft
- Checked
- Needs revision
- Approved
- Rejected
- Published

### Knowledge

Every check should make the brand smarter:

- Save as high score example
- Save as low score example
- Convert feedback into a rule
- Add phrase to preferred or forbidden list
- Update channel rules

### Team Collaboration

The product should become a shared workspace:

- Multiple members
- Multiple brands
- Reviewers
- Comments
- Approval ownership
- Team-level visibility

### Rule Engine

Not everything should depend on AI.

Rules can be deterministic:

- Forbidden words
- Required claims
- Length limits
- Channel constraints
- Legal risk terms
- Tone dimensions

### History

History is not just storage.

History should become:

- Audit trail
- Learning data
- Brand evolution
- Quality benchmark
- Repeat issue detection

## 7. ICP

The strongest initial ICP is **content and brand agencies managing multiple client brands**.

They have:

- High content volume
- Repeated client revision loops
- Multiple brand standards
- Junior writers
- Real delivery pressure
- Willingness to pay for less rework

Secondary ICP:

- Small and mid-sized consumer brands
- Cross-border DTC brands
- Brand-led ecommerce teams
- Social content teams

Weak ICP:

- Individual casual writers
- Low-brand-awareness sellers
- Teams that only want generic AI writing
- Large enterprises that already use heavy governance platforms

## 8. Product Promise

The product promise should be:

Before content reaches customers or clients, Duiwei shows whether it is on brand, why, how to fix it, and how that decision improves the brand standard for next time.

## 9. Strategic Principles

1. QA over generation.
2. Evidence over opinion.
3. Brand memory over prompt memory.
4. Workflow over single action.
5. Team standards over personal taste.
6. Rules plus AI, not AI alone.
7. History as an asset, not a log.

## 10. Final Review

### Biggest MVP Risk

The current MVP can still be perceived as a branded AI scoring wrapper.

If users feel they can copy the brand profile and copy into ChatGPT and get the same result, retention and willingness to pay will be weak.

### Real Competitive Moat

- Brand Brain
- Evidence-based QA
- Team workflow
- Reusable standards
- Historical learning
- Multi-brand agency workflow

### Features To Avoid

- Generic AI writing
- Generic chat
- Complex prompt management as a user-facing feature
- Overbuilt dashboards before usage exists
- Enterprise RBAC too early
- Auto-publishing before QA is valuable
- Model-switching as a headline feature

### Must Build Soon

- Brand Brain
- Evidence Engine
- Pass / Needs Revision / Off Brand
- Rule Engine
- High Score Library
- Feedback Learning
- Context: platform, audience, goal

### Easiest To Replace By ChatGPT

- One-off scoring
- One-off rewriting
- Generic suggestions
- Prompt-based brand analysis
- Simple forbidden word checks

### Hardest To Replace By ChatGPT

- Shared brand standards
- Team approval flow
- Long-term brand memory
- Historical examples
- Rule provenance
- Multi-brand operations
- Quality analytics

### RC2 Should Build

RC2 should build the smallest version of Brand QA:

- Context-aware check
- Pass / Needs Revision / Off Brand
- Evidence-based result
- Rule hits
- Save high score example
- Feedback buttons
- Brand Brain draft from existing brand data

