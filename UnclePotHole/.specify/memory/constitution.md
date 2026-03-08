<!--
  Sync Impact Report
  ==================================================
  Version change: N/A → 1.0.0 (initial adoption)
  Modified principles: N/A (first version)
  Added sections:
    - Core Principles (5): Modularity, Clean Code,
      UX Consistency, Maintainability, Rapid Development
    - Development Philosophy
    - Code Standards
    - Governance
  Removed sections: N/A
  Templates requiring updates:
    - .specify/templates/plan-template.md ✅ no changes needed
    - .specify/templates/spec-template.md ✅ no changes needed
    - .specify/templates/tasks-template.md ✅ no changes needed
  Follow-up TODOs: None
  ==================================================
-->

# UnclePotHole Constitution

## Core Principles

### I. Modularity

- Every component MUST be self-contained with clear boundaries
  and a single, well-defined responsibility.
- Features MUST be built as composable, independent modules that
  can be developed, understood, and replaced in isolation.
- Shared functionality MUST be extracted into reusable utilities
  rather than duplicated across modules.
- Inter-module communication MUST occur through explicit, minimal
  interfaces — no hidden coupling or implicit dependencies.

**Rationale**: Modular architecture enables parallel development,
reduces cognitive load per unit, and makes the codebase
navigable for any contributor.

### II. Clean Code

- Code MUST be readable and self-documenting; prefer descriptive
  naming over comments explaining *what* the code does.
- Functions and methods MUST be short and do one thing.
- Nesting depth MUST NOT exceed 3 levels; extract helpers or
  early-return to flatten logic.
- Dead code, unused imports, and TODO-without-tickets MUST be
  removed on sight.
- Consistent formatting MUST be enforced via automated tooling
  (linter/formatter configured per language).

**Rationale**: Clean code is fast code — fast to read, fast to
change, fast to debug. It directly accelerates development
velocity.

### III. UX Consistency

- All user-facing interfaces MUST follow a single, unified
  design language (spacing, typography, color, component style).
- Interaction patterns MUST be predictable: identical actions
  MUST produce identical feedback across the entire application.
- Error states, loading states, and empty states MUST be handled
  explicitly and uniformly — never leave the user guessing.
- Naming, labeling, and terminology MUST be consistent
  throughout the product surface.

**Rationale**: Consistent UX reduces user confusion, eliminates
re-learning costs, and makes the product feel polished even
during rapid iteration.

### IV. Maintainability

- Every module MUST be understandable by a new contributor
  within minutes, not hours.
- Dependencies MUST be kept minimal and intentional; each
  dependency MUST justify its inclusion.
- Configuration MUST be centralized and environment-aware —
  no magic strings or hard-coded values scattered in source.
- File and folder structure MUST be conventional and predictable
  so that locating code requires zero tribal knowledge.

**Rationale**: Maintainability is the long-term multiplier for
development speed. Unmaintainable code is the primary killer
of rapid iteration.

### V. Rapid Development

- Speed of delivery MUST take priority over theoretical
  perfection; ship working increments early and often.
- YAGNI (You Aren't Gonna Need It) is law — do NOT build
  abstractions, features, or infrastructure ahead of a concrete,
  immediate need.
- Security hardening and deployment automation are explicitly
  OUT OF SCOPE and MUST NOT slow down development.
- Prefer convention over configuration; use framework defaults
  and community-standard project structures to eliminate
  boilerplate decisions.
- When choosing between two approaches, pick the one that gets
  to a working state faster, provided it does not violate
  Principles I–IV.

**Rationale**: This is a hackathon-paced project. Every hour
spent on premature optimization or unused infrastructure is an
hour not spent on delivering user value.

## Development Philosophy

- **No security theater**: Authentication, authorization, input
  sanitization, and hardening are deferred until explicitly
  required by a feature spec. Do not add security layers
  preemptively.
- **No deployment friction**: Run locally, deploy simply.
  Complex CI/CD pipelines, container orchestration, and
  multi-environment setups are out of scope unless a feature
  demands them.
- **Bias toward action**: When unsure between two valid
  approaches, choose the simpler one and iterate.
  Reversibility beats correctness-by-committee.
- **Minimal process**: No mandatory code review gates, no
  required approvals. Trust contributors to uphold the
  principles and fix forward.

## Code Standards

- Automated formatting MUST be applied on save or pre-commit;
  style debates are resolved by the formatter, not by humans.
- File length SHOULD stay under 300 lines; if a file exceeds
  this, evaluate whether it violates Principle I (Modularity).
- Public APIs (functions, components, endpoints) MUST have a
  one-line docstring or JSDoc describing purpose and return
  value.
- Magic numbers and string literals MUST be extracted into
  named constants.
- Naming conventions MUST follow the dominant community
  standard for the chosen language/framework.

## Governance

- This constitution supersedes ad-hoc preferences. When a
  code decision conflicts with a principle above, the
  principle wins.
- Amendments MUST be documented with a version bump, a
  rationale, and the date of change.
- Versioning follows semantic versioning:
  - **MAJOR**: Principle removed or fundamentally redefined.
  - **MINOR**: New principle or section added, or material
    expansion of existing guidance.
  - **PATCH**: Clarifications, wording fixes, non-semantic
    refinements.
- Complexity MUST be justified: any deviation from these
  principles requires an inline comment explaining why the
  deviation is necessary and what simpler alternative was
  rejected.

**Version**: 1.0.0 | **Ratified**: 2026-03-07 | **Last Amended**: 2026-03-07
