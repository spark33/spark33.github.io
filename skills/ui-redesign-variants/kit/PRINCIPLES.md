# Principles (every variant follows these; the red team checks them)

- One primary module per page, marked `data-primary`. Chrome above it (header + toolbar) is at most 104px.
- The primary module fills the viewport and scrolls inside itself; the page never scrolls.
- One filled button per page. Everything else is secondary or ghost.
- No explanatory sentences under titles. Counts go in toolbar chips.
- Colour only carries meaning (status), never decoration.
- Spacing, type and sizes come from tokens.css only.
- Every control works or calls `toast()`; no dead buttons, no lorem ipsum.
- Key interactions render on load with `?state=<name>` so they can be screenshotted.
- Large type only on presenting screens (QR, kiosk: 32–40px), and say so in the header comment.

## This redesign
- IA in one line: …
- The problem, measured: … (e.g. "the grid starts at 287px (32vh); 8 cards above the fold")
- Target numbers: …
