---
name: prose
description: Writes and reviews long-form text about design and engineering work, such as blog posts, breakdowns, case studies and design notes. The text opens on where the author stands, names the options each decision beat, gives exact numbers, says how each fact is known and marks every guess. Use when drafting, editing or reviewing a post, a write-up or an article, or when editing an author's draft without changing their voice.
license: MIT
metadata:
  upstream-author: "Raphael Salaja"
  upstream-source: "raphaelsalaja/skills"
---

# Prose

These rules cover long-form text: posts, breakdowns, case studies and design notes. The text explains each decision through the problem it solved and the options it beat. The person who did the work tells it, in plain sentences.

Facts are exact, and the voice belongs to the author. A guess stated as fact, an uncited claim and an invented experience are findings every time. Style rules bend to the draft of the author: keep their tense, their register and their choice of I or we.

Interface labels, em dashes and ellipses belong to `copy`.

Each rule ends with its rule id. Cite that id in a finding. Read [checks.md](checks.md) when you review a draft or need an example of a rule. It pairs each id with a broken line, its replacement and a severity.

## Structure

- Open on where the author stands. The first paragraph says what the piece is about and how the author relates to it: they built it, rebuilt it, use it or noticed it. The problem arrives by the end of that paragraph. A line on what the piece is not is welcome. Do not open with a contents list, "In this post I'll cover" or a feature tour (`prose-open-with-context`).
- Put a sequence of steps, a comparison or a set of values in a list, a table or a figure (`prose-show-the-shape`).
- A caption under a demo or a figure says what happens in it, in order. It does not state the lesson (`prose-caption-the-action`).
- End plainly: what the work does for now, what is next, or how the author feels about it. Do not end on a punchline, an aphorism or a summary of the headings (`prose-modest-ending`).

## Voice

- Write in the first person. "I" covers the work of the author and "we" the work of a team: what they built, tried, saw and dropped (`prose-first-person`).
- Tell process as what the author did, in the past tense. Present-tense advice with no account of the work fails (`prose-tell-what-happened`).
- Describe the work, not the reader. Address the reader as "you" only when they are about to act, such as trying a demo (`prose-fewer-you`).
- Say in passing where the work of the author falls short, without apology (`prose-admit-the-limits`).
- When you edit a draft, fix spelling, grammar and order. Do not rewrite the register of the author into your own (`prose-keep-the-voice`).
- Add no anecdote, feeling or attempt that the author did not describe. That covers asides, footnote stories, accounts of what happened and admitted limits. Ask for the real moment, or leave the line out (`prose-no-invented-experience`).

## Decisions and evidence

- State each choice, then at least one option that was considered and why it lost (`prose-show-the-alternatives`).
- Give the reason as what the choice does for the person who uses the thing (`prose-reason-for-the-person`).
- Where a value exists, write the value, not an adjective (`prose-specifics`).
- Cut hype words such as seamless, robust, powerful, blazing and delightful (`prose-no-hype`).
- Say where each fact came from: inspected, measured, read in the source or quoted (`prose-say-how-you-know`).
- A claim from someone else carries a footnote that links the original (`prose-cite-claims`).
- An inference reads as one: "I think", "my guess is", "the way I read it". Do not state a motive as fact (`prose-mark-the-guess`).
- Do not wrap a measured fact in "I believe" (`prose-no-hedged-facts`).

## Sentences

- A fact travels with its consequence in one sentence, joined by so, but or because (`prose-link-the-reason`).
- There is no word limit. Judge length by ear, and split a sentence that needs a second read. Do not run short sentences or fragments together for emphasis (`prose-no-fragment-runs`).
- A list of two to four items goes inside one sentence, after a colon (`prose-list-in-the-sentence`).
- When list items need an explanation, each item carries its gloss in brackets (`prose-gloss-in-brackets`).
- Delete throat-clearing such as "It's worth noting", "Let's dive in" and "Not just X, but Y" (`prose-no-filler`).
- Running text uses British spelling: colour, behaviour, centre, grey, favourite, customise, recognise, organise, judgement. Code, CSS and API names, interface labels and quoted titles keep their own spelling (`prose-british-spelling`).

## Asides and footnotes

- An aside steps out of the argument for a moment: an admission, a credit or a joke. It sits in brackets, runs under 15 words and appears at most once a section. It does not carry the argument. A gloss on a list item is not an aside (`prose-asides`).
- A caveat that breaks the main line moves to a footnote. A footnote can also hold a personal aside: the attempt that failed, or the story behind a number (`prose-footnote-the-caveat`).

## Reporting

Write one finding per root cause:

```
file:line - [rule-id] what is wrong
```

Then add a `Rule | Count | Severity` summary. Take the severity from [checks.md](checks.md). The verdict is `Block` while any `HIGH` finding remains, and `Approve` otherwise.

Approve only files you read. Mark each check you could not run as `Not verified`.
