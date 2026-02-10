
# Adaptive Teaching Implementation Skill

## Overview

This skill defines the technical implementation for the Adaptive Diagnostic-First flow.

## 1. Schema Updates

### SubConcept (New Fields)

- `question_pools`: JSONB containing `connection` and `application` questions at `basic`, `intermediate`, `advanced` levels.
- `diagnostic_prompt`: String ("What's the most important thing...").
- `estimated_difficulty`: String ('basic'|'intermediate'|'advanced').

### TeachingCycle (New Fields)

- `current_difficulty`: String ('basic'|'intermediate'|'advanced').
- `adaptive_decisions`: Array of decision logs.
- `remediation_attempts`: Integer.

## 2. AI Logic Integration

### Diagnostic Analysis

- **Input**: User's initial explanation.
- **Output**: Difficulty Level (Basic/Intermediate/Advanced), Coverage Score, Misconception Flags.
- **Model**: `gemini-1.5-flash` + embeddings.

### Response Analysis (Shadow Auditor)

- **Input**: User response + Target Statements.
- **Output**: Quality Score (1-3), Coverage Map.
- **Rule**: If `quality_score == 1`, trigger Remediation. If `quality_score == 3`, consider Upgrade.

## 3. UI Component Requirements

- **Difficulty Indicator**: Green (Basic), Amber (Intermediate), Red (Advanced).
- **Adaptation Announcement**: Toast/Banner explaining level changes.
- **Progress Bar**: Segmented bar showing current position in cycle.
- **Remediation Panel**: Slide-up panel with Hint, Simplify, Example options.
- **Confidence Reveal**: Animated bar filling up at end of cycle.

## 4. State Machine (Teaching Cycle)

1. **Diagnostic**: Ask -> Analyze -> Set Level.
2. **Connection**: Ask (at Level) -> Assess -> Adapt Level (or Remediate).
3. **Application**: Ask (at New Level) -> Assess.
4. **Summary**: Holistic Analysis -> Show Confidence.
