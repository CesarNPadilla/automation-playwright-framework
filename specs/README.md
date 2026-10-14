# specs/

This directory contains test plans produced by `playwright-test-planner` and
reviewed native drafts produced by `playwright-test-generator`.

## Conventions

- One markdown file per feature or user flow: `feature-name.md`
- Plans are created by the agent but **reviewed by a human** before generation
- Native draft `.spec.ts` files live under `tests/agents/` (not here)
- After BDD adaptation, keep the plan as documentation; remove the draft

## What a good plan includes

- Feature / user flow name
- Prerequisites and test data requirements
- Step-by-step instructions for each scenario
- Expected outcomes (persisted, observable — not just "click succeeds")
- Unanswered questions and assumptions
- Allowed and disallowed actions for the exploration session
