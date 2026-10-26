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
