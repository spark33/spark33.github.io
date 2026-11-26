---
title: Left alone, our AI agent reinvented the wheel. So I made it look first.
dek: Twenty prototypes in twenty minutes were the easy part. Making it study what already works, and why, took two days and three rules.
lens: Building
order: 3
stage: essay
updated: 2026-11-26
keywords: ["AI agent UI redesign", "Jakob's Law", "don't reinvent the wheel UX", "Claude agent skills", "research by information architecture", "red-teaming design variants"]
tldr: "An agent asked for a redesign will happily reshuffle the same parts. People find familiar patterns easier, so I made mine research what already works, and why, before drawing anything. Pair that with a design system that has hard rules and it goes from an issue to merged code in an afternoon. Real users still decide how much of it you need."
---

Ask an AI agent for a better layout and you'll have one in minutes, with the same parts moved around until something looks fresh. Fresh isn't what you want from a tool people work in. Jakob Nielsen wrote it down in 2000: users spend most of their time on other sites, so they expect yours to work the way those do. So once an agent can draw twenty layouts in twenty minutes, the work is getting it to find out what already works, and why, first.

Our training admin was a fair test: nothing was broken, it just felt messy, and an agent answers that with taste. At 10:52 on a Tuesday in October, I posted in our frontend channel that its screens wasted space. The calendar spent 287 pixels on a title, a month picker and a legend before it showed a single day. Our team runs an internal Claude-based Slack agent that can read our repos, run a headless browser and publish pages. Getting it to look first took two days and three rules.

## Every variant names what it copies

My message asked for three things: variants instead of one answer, references from comparable products instead of taste, and priority. Is the main thing on the page actually the main thing?

The agent captured the real app first and measured it: the calendar grid at 287px, the lesson builder's content at about 640px.

<figure class="pxs">
<div class="pxrow">
<div class="px"><i style="--h:287px"><span>287px of header</span></i><b>Before</b></div>
<div class="px"><i style="--h:104px"><span>104px</span></i><b>Every variant</b></div>
</div>
<figcaption>Where the calendar starts on a 900px screen. The rule from the agent's principles file: everything above the main module fits in 104px.</figcaption>
</figure>

Then it wrote a foundation before any variant: our existing tokens, a shell copying the real sidebar, mock data shaped like the real types, and a short principles file. One primary module per page. A 56px header and at most one 48px toolbar above it, so 104px in total. Fixed sizes only. One filled button. Colour only carries meaning.

Only then did it fan out parallel sub-agents. Each variant had to name a real product, a concrete layout and the interactions that had to work. The calendar came back as Google Calendar, Notion Calendar with a side rail, and a timeline like Float. Twenty clickable variants across seven pages, each next to a screenshot of the page as it is.

The foundation is why twenty prototypes from parallel agents looked like one design system and not twenty opinions. And 287 → 104 meant nobody had to argue about whether it "felt cleaner."

## Red-teaming against the user stories

Looking good is the easy part, so I asked for a second pass against the user stories.

It pulled five personas from the product's planning docs, walked each variant through the end-to-end flow, and reran everything at 1280×800, the laptop someone carries to an on-site training. It found ten gaps that no amount of visual polish would have fixed, among them:

- No calendar showed which trainings still needed a lesson plan.
- The QR code for the day was behind a hover-only icon. That fails on a touch screen at the venue.
- Billing happens per training and per month, but the tables were per organisation, so you had to open each one to find the work.
- The shared sidebar had dropped logout, theme and font size. Nobody notices those until they're gone.

It built a fourth variant where a page needed one, mostly from the best parts of the others, then gave one recommendation per page. Both passes took about 35 minutes and $22.

That evening I asked it to keep the approach as a skill, `ui-redesign-variants`: a markdown file with a name, a trigger and a procedure, which loads into any session that matches.

## Each rule is a step it skipped once

The next day I used the skill on a list page with too many status colours. Three minutes later I had a pull request against the real frontend repo, with every status turned grey. Nobody had looked at alternatives yet.

> I didn't want a PR yet. Close that. Show me your usual redesigned prototype designs.

The new variants were fine, but the references felt familiar in the wrong way. They were the products an AI model would name first. So I asked:

> Did you really run my redesign skill?

It answered "only partly." It had picked the references from memory and skipped the red team.

Then it did the research properly, and this is the step I care about most. It wrote the page's information architecture as one line, "a list of things you made, plus a visibility setting, a review status, and favorite and ⋯ menus," and searched for products with *that* IA, not products in the AI space. GitHub's repository list, where visibility is a grey "Public" badge and the only colour is the language dot. Hugging Face Spaces. App Store Connect, where yellow means a process is running and red means you need to act. YouTube Studio. And Shopify Polaris as the counter-example, because it does use coloured badges.

That research turned up a real bug in our product. One state the owner needed to see wasn't shown to them at all, and every comparable product shows it. Reshuffling our own layout would never have found that. Reading how other products handle the same states did.

I asked it to harden the skill. It now opens with three rules, each written because it was missed once:

1. A redesign request means prototypes, not a PR. No repo edits until someone picks a variant.
2. Every step runs, even for one component. Scale the counts down, never the steps. If a step is skipped, the first line of the reply says so.
3. References come from research, not memory. Describe the IA in one line, find six to eight products with the same IA, including ones outside your domain, and include one counter-example. Every variant points back at that list.

Each rule carries its date and the reason, so nobody "simplifies" it away later. The third is Jakob's Law, made into a step an agent can't skip. It's also how we've built most of what we ship: a learning platform like Duolingo, a store like the App Store, a studio like ChatGPT, vibe coding like Lovable, and admin screens like other cloud platforms' dashboards.

The skill is public, rewritten without anything specific to our tools. It works with Claude Code, Codex, Cursor and the other agents the `skills` CLI supports:

```sh
npx skills add spark33/spark33.github.io --skill ui-redesign-variants
```

The source and the kit are [on GitHub](https://github.com/spark33/spark33.github.io/tree/main/skills/ui-redesign-variants).

## Built in an afternoon, cut back in two days

The research decides what a page should be. The design system decides what it's made of.

Ours has components, plus rules an agent can check. The theme fixes the sizes: a 56px header, 32px controls, a 220px sidebar, a type scale of 12, 13, 14, 16 and 20, and corner radii of 6 and 8. The admin also has a short skill that says what was asked for and how to check it.

On that first Tuesday, once the redesign was picked, little was left to decide. A teammate built the chosen variants with the agent that afternoon. Seven pull requests, the first opened at 13:43, all merged by 18:25. Plus 11.4k lines, minus 3.0k. The prototypes used the same tokens as the code, so most of the build was translation. One gap: the spacing steps and the 44px row height were deferred in the first pull request and never made it into the theme.

Then people started using it, and about half of it changed within 48 hours.

<figure class="kept">
<div><b>Survived</b>
<ul>
<li>The fixed sizes: header, controls, type</li>
<li>The calendar's structure</li>
</ul></div>
<div><b>Reworked</b>
<ul>
<li>The dashboard, reversed the same day</li>
<li>The organisation drawer, now one table</li>
<li>Accounts, cut back to a single table of people</li>
<li>Organisation detail, cut down again two days later</li>
</ul></div>
<figcaption>The training admin, 48 hours after the redesign merged.</figcaption>
</figure>

Three of the four reworks cut things back. The foundation held; what changed was how much sat on top of it.

The red team had five personas, but personas don't push back. The research told us how each page should work. Only the people using it could tell us how much of it they needed.

[Sean: what you'd do differently next time, now that you know half of it got cut back.]

Once drawing is cheap, taste stops being a good enough reason for a layout. What's left is the looking: the products your users already know (Jakob's Law), how those handle the same states, and what the people on the page need. An agent skips that unless it's a written step, so write it down and make it say when it didn't.

*Drafted with my agent from my own draft and an interview; edited by me.*
