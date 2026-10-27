---
title: No customer used our theming system. Our rebrand did.
dek: Two years of FactChat's design system, from a mint console to Baze's ink and coral. The colors changed in one place. The hierarchy is still being fixed, one screen at a time.
lens: Design
order: 2
project: baze
keywords: ["design system rebrand", "per-tenant theming", "semantic color tokens", "color as hierarchy"]
tldr: "Hardening FactChat for dark mode and per-customer colors looked like overkill once we decided customers wouldn't get the colors. That work is what let us swap the whole brand for Baze in one place. What didn't swap was hierarchy, because color had been doing its job."
---

In June we built a way for each university on FactChat to recolor the product in its own school color. When I shipped it in September, we decided customers wouldn't get custom colors after all. The product would have two looks, the brand and dark mode. No customer has ever used it.

By then it had already done its real job. The week before, it's how we swapped the entire product's brand.

## From mint to blue to a library

The codebase that became Baze didn't start as a chat app. It started as a console for building chatbots, and it inherited the colors of the console Mindlogic had run since 2023: a mint, `#45EC88`, on a dark slate. Mindlogic's own site used the same mint.

<figure>
<img src="/writing/palette/mindlogic-2023.jpg" alt="mindlogic.ai in November 2023: white and mint type on a dark navy page that reads 'Tell us your chatbot needs!'" loading="lazy" width="1440" height="900">
<figcaption>mindlogic.ai, November 2023, from the Wayback Machine.</figcaption>
</figure>

The mint didn't last. In mid-2024 I proposed organizing the console's components the way MongoDB's LeafyGreen is organized, since I'd worked on that system before. A teammate then laid the base that stuck: a 15-step gray, a blue ramp anchored on `#1751D0`, four corner radii and Pretendard. That blue became FactChat's color when the chat product arrived in January 2025.

In August 2025 we pulled FactChat's components out into their own library, logician-ui, so other Mindlogic products could use them. Moving FactChat onto it took its component folders from 78 to 18 and deleted 12,892 lines. In December I made a new palette with Claude, the Golden Ratio palette: five hues, including a violet secondary, and a 16-step cool slate, with every pair passing WCAG AA. The same teammate built it into the library along with a Chakra UI v3 migration. The migration guide they wrote was good enough that another engineer moved a second product onto it in four days. At our April retro, the team said FactChat finally felt consistent.

<div class="sws">
<span class="sw" style="--c:#45EC88">#45EC88 · 2023 mint</span>
<span class="sw" style="--c:#343543">#343543 · console dark</span>
<span class="sw" style="--c:#1751D0">#1751D0 · FactChat blue</span>
<span class="sw" style="--c:#9117D0">#9117D0 · violet secondary</span>
</div>

<figure>
<img src="/writing/palette/factchat-2026.jpg" alt="The FactChat homepage in April 2026: a large black FactChat wordmark on white, a blue Contact button, and model logos floating around it" loading="lazy" width="1440" height="900">
<figcaption>factchat.bot, April 2026, from the Wayback Machine. Blue does almost all the work.</figcaption>
</figure>

## Dark mode and customer colors

Dark mode came in June 2026. It went in as a semantic layer: every color in the library became a role, like a background, a foreground or a border, with a light value and a dark value. We checked it by pixel-diffing all 353 Storybook stories in both modes before FactChat shipped it.

Per-customer colors came straight after. The pitch, at our June retro, was that a university should be able to look like itself. The first version overrode three CSS variables. The version that shipped retints the whole blue scale on the server before the page renders, so every component that uses the primary color changes together and nothing flashes blue first. A resolver at runtime catches hardcoded hex values in d3 maps and canvas drawings. A lint rule bans the raw brand blue, and an allowlist keeps customers to tokens that exist.

That's a lot of machinery for a feature nobody ended up using. The usual objection is YAGNI, "you aren't gonna need it." Martin Fowler, who wrote the standard explanation of it, draws the line where I'd draw it: "Yagni only applies to capabilities built into the software to support a presumptive feature, it does not apply to effort to make the software easier to modify." Customer colors were the capability. Being able to recolor everything from one place without breaking anything was the second kind of effort. Michael Feathers calls that a seam: "a place where you can alter behavior in your program without editing in that place." We needed the seam within two months.

## The colors changed in one place. The hierarchy didn't.

In July Mindlogic decided on a new consumer brand for FactChat, Baze. In August our designer delivered its logo, four rounded diamonds. On August 29 I tried Baze as a tenant skin, using the machinery no customer would get. Two days later I made it the default for the whole app. The palette changed in one place, the way the seam promised: primary to an azure teal, secondary to mint, a coral accent, neutrals to tan.

Then the screens fell apart. Pages built on the old blue-to-violet ramp lost their structure, because color had been doing the work of hierarchy. Blue had been how a screen said "look here first," and some of that was mine: the violet secondary came from my Golden Ratio palette. The seam made the swap instant, which meant the real cost showed up within days and not months later.

We tried coral as the primary color on September 1 and dropped it the same day. It was too close to our error red. My note in the team channel that day was "돌고 돌아 다시 파란색을 primary로," roughly, "after all that, back to blue for primary." A mock with no primary color at all looked like grayscale.

The brand guide in October settled it, and it went further than September had. Warm cream and black only. No teal or mint on app screens and no gradients. Coral comes in two steps: `#FF8680` means "do it," and `#DA483E` is for large text and the logo. Links are a muted blue, `#48607A`. Even then, coral has a contrast problem. A white send arrow on coral is 2.34:1, below the 3:1 that WCAG asks of icons. An ink one, `#252525`, is 6.55:1. The guide says white, and that's still an open question.

<div class="sws">
<span class="sw" style="--c:#F5EDE0">#F5EDE0 · cream</span>
<span class="sw" style="--c:#252525">#252525 · ink</span>
<span class="sw" style="--c:#FF8680">#FF8680 · coral</span>
<span class="sw" style="--c:#DA483E">#DA483E · coral, strong</span>
<span class="sw" style="--c:#48607A">#48607A · link</span>
</div>

<figure>
<img src="/writing/palette/baze-co.jpg" alt="baze.co in October 2026: a cream page with the headline '80개의 AI, 하나의 베이스캠프', a chat input, and black diamond shapes" loading="lazy" width="1440" height="900">
<figcaption>baze.co, October 2026. Cream, ink, and coral used once, behind a single word.</figcaption>
</figure>

Since late September the app has been moving screen by screen. We flattened pills, empty states and gradient cards. Thirty-three collage illustrations now fill the places gradients and colored cards used to: the login banner, the plan cards, the credit-purchase coin. Emphasis has to come from size, weight and spacing instead.

<figure class="two">
<img src="/writing/palette/modal-before.jpg" alt="The top of the credit-purchase dialog before: a pile of colorful AI model logos on tiles" loading="lazy" width="368" height="264">
<img src="/writing/palette/modal-after.jpg" alt="The same dialog after: a light bulb, a coral diamond and a sage circle collaged on a cream grid" loading="lazy" width="368" height="264">
<figcaption>The credit-purchase dialog, October 2026: logo tiles out, one collage in.</figcaption>
</figure>

<figure>
<img src="/writing/palette/baze-login.jpg" alt="The Baze login page: a plain form on the left and, on the right, a collage of a woman working on a laptop between mountains, with a blue diamond and a pointing hand" loading="lazy" width="1440" height="760">
<figcaption>app.baze.co, October 2026. The collage carries the mood, so the form can stay plain. The teal link and checkbox are September's tokens, still in production.</figcaption>
</figure>

## What I'd do earlier

Take the color out and look. Set the primary to gray and open your ten most-used screens. If one loses its hierarchy, color is doing a job that size, weight and spacing should do. I found that out in September, after the rebrand had started. A grayscale pass in 2025 would have shown it to us for free, before I gave the system a violet that screens came to depend on.

And build the seam even when the feature is doubtful. Dark mode and customer colors both forced every color through one layer. The rebrand ran through that layer the week before customer colors were cancelled, and it's why the color swap cost a few pull requests and not a rewrite.

## Where it's going

The next major version of logician-ui, in alpha now, makes Baze's palette the foundation of the whole system: warm black, a sandy brown, coral for actions and twelve system hues. A CI test checks contrast on 72 color pairs in four modes. The first preview was too stark, almost black and white, with no way to make one button read as the main action. So the library got a coral accent button, and blue got a single job: links and data.

Mint came back too, a darker one, as September's secondary. The October guide takes it out again, and production hasn't caught up yet. The theming system has still had exactly one customer. It was us.

[Sean: thank-yous. Credit the teammate who laid the 2024 base and did the logician-ui adoption and the Chakra v3 migration, the engineers on the build and release pipeline, and the brand team, by name if they're happy to be named. Optional fact: Claude Code wrote about 250 of logician-ui's commits, mostly in my sessions.]
