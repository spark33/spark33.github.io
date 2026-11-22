# Design rules

Rules for the parts of the site that could otherwise fill up with anything.
Check a change against these before adding to them.

## The rail

The rail is orientation. It says whose site this is, where you are, and how to reach Sean.
It never carries content of its own.

1. **Every item answers one of three questions:** Whose site is this? Where am I? How do I reach Sean?
   If it answers none of them, it belongs in the page.
2. **It's taken from the page, never written for it.** The section line comes from the headings
   (`data-where` / `data-desc`), and the contents come from the post's h2s. If something needs copy
   written only for the rail, it's page content.
3. **Nothing you'd miss.** Every page works without the rail, because on phones it shrinks to the
   title. So: no unique information, no calls to action, no suggestions, no decoration.
4. **It changes only when the reader moves.** Scrolling and changing pages update it. Timers and
   autoplay never do.
5. **It persists.** It's the one part that stays put across page changes, so it holds what's true
   site-wide (name, theme, email) or true right now (section, progress).

What's in it today, and which question each item answers:

| Item | Answers |
| --- | --- |
| Moon + "Sean Park" (the moon also switches the theme) | Whose site is this? |
| Section title + one-liner | Where am I? |
| Contents (posts), % read | Where am I, in more detail |
| Email | How do I reach Sean? |
| 한 / EN | Whose site is this? (a site-wide setting, like the theme; it lands you on the same page and spot) |

Things that were tried and cut, and the rule each one broke:

- A side nav: it repeated the headings (rule 2).
- "Based in Seoul": content, not orientation (rule 1).
- A "start there" suggestion after 40 seconds: a suggestion that appeared on a timer (rules 3 and 4).

**The test:** if it says something new, it goes in the page. If it says where the reader is, it can go in the rail.

## Nothing unfinished shows (2026-11-22)

The site goes live only when everything on it is real (Sean: "I want all the real content to be completed before the site is live").

- A piece is listed only once it has a body: `stage: essay` (a full piece) or `stage: note` (150–300 words). An `idea` keeps its page for the preview but stays off the home list, Keep reading, the hover cards and the case study.
- Copy that isn't written yet isn't shown: the case study's TL;DR / bet / call sections and About's "how I work" line appear once they're no longer placeholders, and About has no photo frame until there's a photo.
- Inside a draft, a paragraph that starts with `[Sean:` is a note about what's still to write. The preview shows it as a dashed "To write" box (`src/lib/todo.mjs`).
- `src/lib/launch.ts` fails the build if `UNDER_CONSTRUCTION` is false while any of the above is left.
- Every listed piece shows its month: "Draft · Oct 2026" until it's published, then the publish date.

## The home grid (2026-11-22)

Sean: the home page "feels very text dense, and there doesn't seem to be a clean grid system." So everything on it sits on one grid.

- 12 columns, 24px gutters, over main's width (952px at full size). Phones (≤900px) are one column.
- **Text** runs in columns 1–8: the intro, the writing titles, About, the footer line.
- **Meta** starts at column 10: a piece's lens and date, a job's years, "Case study", the footer clocks. It's left-aligned, so all of it starts on the same line. Under 1272px it starts at column 9.
- The rail is 272px wide, so its longest line (the email) clears the page by ~55px, more than two gutters. The section line keeps its old 168px measure (right:68px). It was 232px and the email sat ~14px from the text.
- **Names and what's said about them:** a company or project name takes 1–3, its text 4 up to the meta column.
- Sections are 120px apart. Each heading sits 14px above a hairline, and the list starts under it.
- New things on the home page go on these lines. If something doesn't fit them, change the grid here first.
