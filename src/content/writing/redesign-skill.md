---
title: I taught our AI agent to do a UI redesign the way I would, in two days
dek: One Slack message got twenty clickable prototypes in twenty minutes. Making that repeatable took two days, two failures and three rules the agent now can't skip.
lens: Building
order: 3
stage: essay
updated: 2026-11-21
keywords: ["AI agent UI redesign", "Claude agent skills", "design process as a skill", "red-teaming design variants", "research by information architecture"]
tldr: "Ask for variants, not an answer. Measure the problem in pixels. Research by information architecture, not by industry. And make the agent say what it didn't do: the most useful line it ever wrote me was \"Only partly.\""
---

At work we run an internal Slack agent. It's Claude-based, and it can read our repos, run a headless browser, query data and publish internal pages. Most people use it for ops work. I wanted to see if it could do design work.

The test case was an internal admin tool with seven pages. Nothing was broken. It just felt messy. On the calendar, the title, month controls and legend took up so much room that the grid didn't start until a third of the way down the screen.

So I wrote one message:

> The training internal tools pages feel a bit messy from a UI/UX perspective. I want to do a full redesign. Show multiple variants of each of the pages, based on references from other similar services. It also is missing some design system details like spacing, and UX principle priorities like whether the prioritized module or UI really feels like the primary element on the page.

It asks for three things: variants instead of one answer, references instead of taste, and priority. Is the main thing on the page actually the main thing?

## Twenty variants in twenty minutes

About twenty minutes and $15 of API usage later, I had one index page with 20 clickable prototypes across the seven pages, each next to a screenshot of the page as it is.

The agent captured the real app first and measured the problem. The calendar grid started 287px from the top. The lesson builder's content started at about 640px.

<figure class="pxs">
<div class="pxrow">
<div class="px"><i style="--h:287px"><span>287px of header</span></i><b>Before</b></div>
<div class="px"><i style="--h:104px"><span>104px</span></i><b>Every variant</b></div>
</div>
<figcaption>Where the calendar starts on a 900px screen. A rule from the agent's principles file: everything above the main module fits in 104px.</figcaption>
</figure>

Then it wrote a foundation before any variant: our palette with a fixed spacing and type scale, a shared sidebar, mock data shaped like the real types, and a short principles file. One primary module per page. Everything above it fits in 104px. One filled button. No explanatory sentences under titles. Colour only carries meaning.

Only then did it fan out three sub-agents, one per group of related pages. Each variant had to name a real product, a concrete layout and the interactions that had to work. The calendar came back as Google Calendar, Notion Calendar with a side rail, and a timeline like Float.

The foundation is why 20 prototypes from three parallel agents looked like one design system and not 20 opinions. And the 287 → 104 is why nobody had to argue about whether it "felt cleaner."

## Red-teaming its own work

Looking good is the easy part. I asked for a second pass:

> Do a red team pass with use cases and user stories in consideration and create new variants if needed based on those critiques. Indicate your final recommendation on the prototype.

It pulled the five personas and the end-to-end flow from the product's own planning docs, walked each variant through them, and reran everything at 1280×800, the laptop someone actually carries to an on-site training.

That found what polish never would have:

- No calendar showed which trainings still needed a lesson plan or an instructor. The "what's next" signal was missing.
- The QR codes were behind a hover-only icon. That fails on a touch screen at the venue.
- Billing happens per training and per month, but the tables were per organisation, so you had to open each one to find the work.
- The flow starts with "copy a past lesson plan." No variant had it.
- External instructors could see other instructors' leave reasons.
- The shared sidebar had quietly dropped logout, theme and font size. Nobody notices those until they're gone.

It built four new variants, mostly by combining the best parts of the old ones, then gave one recommendation per page and a build order. Sixteen minutes, $8. The teammate who owns the tool liked it more than they expected to.

## Turning it into a skill

That evening I asked it to remember the approach. Our agent has skills: markdown files with a name, a trigger and a procedure, which load into any session that matches. It wrote `ui-redesign-variants`, a two-turn recipe: variants, then red team.

## Day two: it fails twice

I used it right away on three other screens.

The first failure: I asked for a redesign of a list page with too many status colours, and three minutes later I had a pull request against the real frontend repo. A tidy one. Every status was now grey. Nobody had looked at alternatives yet.

> I didn't want a PR yet. Close that. Show me your usual redesigned prototype designs.

The second failure was quieter. The new variants were fine, but the references felt familiar. So I asked:

> Did you really run my redesign skill?

It answered "only partly." It had used two agents instead of three, picked references from memory, and skipped the red team.

Then it did the research properly. It wrote the page's information architecture as one line, "a list of things you made, plus a visibility setting, a review status, and favorite and ⋯ menus," and searched for products with *that* IA, not products in the AI space. GitHub's repository list, where visibility is a grey "Public" badge and the only colour is the language dot. Hugging Face Spaces. App Store Connect, where yellow means a process is running and red means you need to act. YouTube Studio. And Shopify Polaris as the counter-example, because it does use coloured badges.

Reading how other products handle the same states turned up a real bug in ours: one state the owner needed to see wasn't shown to them at all. Every comparable product shows it. Copying layouts would never have found that.

## Three rules it can't skip

I asked it to update the skill. Version two opens with three rules, each written because it was missed once:

1. A redesign request means prototypes, not a PR. No repo edits until someone picks a variant.
2. Every step runs, even for one component. Scale the counts down, never the steps, and if a step is skipped, the first line of the reply says so.
3. References come from research, not memory: describe the IA in one line, find six to eight products with the same IA, including ones outside your domain, and include one counter-example.

Each rule carries its date and the reason, so nobody "simplifies" it away later.

The next time I ran it, the hardened version did the thing I care most about. It checked the premise, not the pixels. Every variant of that list page was still a gallery of cards, so it looked at real usage. Most people had only a handful of items. The useful redesign wasn't a better gallery, it was a page for a few things at once, with a "needs attention" strip as the one place colour was earned.

And when one direction I liked turned out to depend on fields that had been invented for the mock data, it said so, and proposed a version that works with the API we have.

## What I took from it

Ask for variants, not an answer. One redesign invites a yes or no. Three named variants invite a conversation about trade-offs, and you can mix parts.

Write the foundation before the variants. Tokens, a shell and a principles file are what let parallel agents agree.

Research by information architecture, not by industry. A chatbot list has more to learn from GitHub and YouTube Studio than from other AI products.

A skill gets better from its failures. The first version wrote down what went right. The second wrote down what went wrong.

And make the agent say what it didn't do. The most valuable line in any of these replies was "Only partly." I'll take that over a confident summary of a shortcut.
