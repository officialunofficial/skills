# Prose checks

Each row pairs a rule id with a broken line, the line that replaces it and the severity of a finding. The examples come from one breakdown of a rebuilt command menu.

`HIGH` is a false or unsupported statement. `MEDIUM` weakens the argument or the voice. `LOW` is a sentence-level or layout slip.

## Structure

| Rule | Broken | Replacement | Severity |
| --- | --- | --- | --- |
| `prose-open-with-context` | `In this post I'll cover anatomy, motion and keys.` | `I rebuilt a command menu I open a hundred times a day. This isn't a tutorial. It's what I found taking it apart.` | `MEDIUM` |
| `prose-show-the-shape` | Five shortcuts in one paragraph | A keymap table | `LOW` |
| `prose-caption-the-action` | `The second version has fewer things in it.` | `The card loses its gradient, its sparkle and its entrance, and the button answers a press.` | `LOW` |
| `prose-modest-ending` | `The best compliment a tool can get is that someone forgets it's there.` | `That's why I keep coming back to quiet software, and it's the kind I try to build.` | `LOW` |

## Voice

| Rule | Broken | Replacement | Severity |
| --- | --- | --- | --- |
| `prose-first-person` | `The menu was rebuilt from inspect element and the source.` | `I rebuilt the menu from inspect element and the source.` | `MEDIUM` |
| `prose-tell-what-happened` | `Record it, then rebuild it beside the recording.` | `I'd record it, then rebuild it beside the recording until I couldn't tell them apart.` | `MEDIUM` |
| `prose-fewer-you` | `You open the menu. You watch it grow. You notice the corner.` | `The menu grows from the corner of the button that opened it.` | `LOW` |
| `prose-admit-the-limits` | A breakdown of your own rebuild that claims it matches the original | `My version only covers part of it, but it was enough to understand how it works.` | `MEDIUM` |
| `prose-keep-the-voice` | `I thought I might try my hand` rewritten as `This project explores` | `I thought I'd try my hand` | `MEDIUM` |
| `prose-no-invented-experience` | `At first I wondered why there's no bounce.` | `Why no bounce at all?` | `HIGH` |

## Decisions and evidence

| Rule | Broken | Replacement | Severity |
| --- | --- | --- | --- |
| `prose-show-the-alternatives` | `The highlight is an inset pill.` | `A full-width stripe reads like a table. An inset pill reads like something you hold.` | `MEDIUM` |
| `prose-reason-for-the-person` | `This makes it feel snappy.` | `The height moves on the same keystroke that changed the list.` | `MEDIUM` |
| `prose-specifics` | `A really fast spring` | `A stiffness of 20000, settled in about a tenth of a second` | `MEDIUM` |
| `prose-no-hype` | `A seamless, powerful menu` | `A menu that never makes you wait` | `MEDIUM` |
| `prose-say-how-you-know` | `The spring has a stiffness of 20000.` | `The spring has a stiffness of 20000, the number in their code.` | `MEDIUM` |
| `prose-cite-claims` | `Navigation got 30% faster.` | `Navigation got 30% faster.[^1]` with the source linked | `HIGH` |
| `prose-mark-the-guess` | `They did this to stop the highlight flickering.` | `I think they did this to stop the highlight flickering.` | `HIGH` |
| `prose-no-hedged-facts` | `I believe rows are 46 tall.` | `Rows are 46 tall.` | `LOW` |

## Sentences

| Rule | Broken | Replacement | Severity |
| --- | --- | --- | --- |
| `prose-link-the-reason` | `Rows have fixed heights. The frame never measures itself.` | `Rows have fixed heights, so the frame never has to measure itself.` | `LOW` |
| `prose-no-fragment-runs` | `The page works. You don't want to stay.` | `The page works, but nobody wants to stay on it.` | `LOW` |
| `prose-list-in-the-sentence` | `Spacing that's off. A hover that scales. Copy that says nothing.` | `What it misses is small: spacing that's off, a hover that scales and copy that says nothing.` | `LOW` |
| `prose-gloss-in-brackets` | `Under the surface there's a spacing scale. Someone chose it and stuck to it.` | `Under the surface sit spacing (a scale someone chose and stuck to) and type (a size and line height tuned together).` | `LOW` |
| `prose-no-filler` | `It's worth noting that rows are 46 tall.` | `Rows are 46 tall.` | `MEDIUM` |
| `prose-british-spelling` | `The color fades from the center.` | `The colour fades from the centre.` | `LOW` |

## Asides and footnotes

| Rule | Broken | Replacement | Severity |
| --- | --- | --- | --- |
| `prose-asides` | `Note that this is not a criticism of the team that built it.` | `(Not a knock on the team, who do careful work.)` | `LOW` |
| `prose-footnote-the-caveat` | `The list is pinned to the top, though at first it was centred and that moved every card.` | `The list is pinned to the top.[^1]` with the centred version in the footnote | `LOW` |
