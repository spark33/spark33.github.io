---
title: My AI chief-of-staff gets one reminder a day
dek: sola reads my mail, my calendar and the expenses I share with my partner. Wiring that up was the easy part. The product is deciding when it gets to interrupt me.
lens: Building
order: 8
stage: essay
updated: 2026-11-26
keywords: ["AI chief of staff", "personal AI agent in Slack", "one message a day", "designing when an AI agent interrupts you"]
specimen: agent
tldr: "Giving an agent my inbox was a config problem. The product was when it may speak: one reminder a day, a receipt for any real work, and every mistake turned into a rule, then a code fix, then a test."
---

An assistant that reads your mail and calendar always has something to tell you, and most of it is true. The question for anyone building one is when it gets to speak, because a stream of correct pings is one more inbox to clear.

I've been testing that on myself with sola, a Slack bot I built for my own life on Claude Code. It reads my calendar and Gmail, writes email drafts but never sends them, keeps the expense sheet I share with my partner, and remembers things in a git repo of markdown files. I started it on July 4, 2026, and it has about 490 commits. Giving it my inbox was a config problem. The work came after: when it speaks, what it says, and what it may do without asking.

## Reminders merge. Work doesn't.

On October 13 I asked sola to stop messaging me in the morning. It was the second time I'd asked. Every ping was true: a bill coming up, a birthday in two weeks, a to-do going stale. There were a lot of them, all around 9am, and each one was a small decision I hadn't asked to make. So I gave sola one rule: one reminder a day.

At 9:17 every morning sola posts one message: the weather if it matters, tonight's one task, what's overdue, and at most one question. A line only shows up if there's something to put in it. A new kind of reminder becomes a line in this message, never a message of its own.

The first version of that rule broke my mail sorting. When I folded everything into the morning message, the inbox routine went with it, but that routine wasn't a reminder: it archived and labelled my mail. For three days nothing got sorted, and nothing told me, because the thing that would have told me was the thing I'd just silenced.

So the rule got a second half: a routine that does real work keeps its own slot, and its message is a receipt for what it did. The 7:43 inbox message says "archived 44 promos, newsletters and notices" and lists the two or three emails that need me.

Now each message has to answer one question: is it asking me to do something, or telling me what it did? Asks get rationed, and receipts stay short. The morning message costs about 40 cents in model time, and the evening nudge to call my parents costs 29.

## Every mistake becomes a rule, then code, then a test

I don't prompt sola much. I give it notes, the way I'd give notes to someone on my team, and it writes each one down as a rule with the reason attached. A few of them, in my words at the time:

- "make sure your responses to me are a lot shorter and easier to review. I really care what you did, why, and what you recommend I do with it." Now every report has three parts: did, why, you should.
- "did you check where kyoho was and everything?" Now any plan at a named place gets looked up: address, hours, travel time, plus a "Leave for X" event on my calendar.
- "If I don't tell you it's been done, we should probably keep pushing it." Now overdue stays overdue until I say otherwise.
- "Why don't you be the judge of these types of things before you bring them to me?" Now it makes the call itself and brings me the reasoning.

There are about fifteen of these now, in one file. It reads like an onboarding doc for a new hire, and it's most of the product.

Rules ran out on November 16, when sola got my mail wrong three times. It flagged a bounced email that I'd fixed two minutes later, called three unsent drafts "sent", and trusted an old note over my actual inbox. All I wrote back was "You keep getting things wrong. Why??"

Another rule wouldn't have helped, because it had read the rules. Its tools let it guess: email search came back without saying whether a message was sent, a draft or received. So the fix went into code. The Gmail tool now labels each message's state and notices when a later email already fixed a bounce, and the inbox digest checks each item against Gmail before it posts.

Then every mistake I'd caught became a replay: the same situation, run again on a fresh agent, with a second agent grading it. There are nine so far. In the last run seven passed and two were partial. Both partials failed the same way, with a confident sentence and nothing behind it, and one made up a quote from an email that doesn't say that. That's the bug I'm still chasing.

## What's still open

sola can't make me do the thing. A few appointments I keep meaning to book have been on the list since October 5, and they've been moved four times. Every morning they're in the message, correct and on time, and every morning I scroll past. Better nagging won't fix that, but a smaller task might. Next, when a booking comes up, sola will write a brief for a browser agent that fills in the forms and stops at the pay button.

An agent that can see someone's day will be right far more often than it's welcome. Sort what it knows before it speaks: asks come rarely and together, finished work comes back as a receipt, and an ask that keeps getting ignored is a task to shrink until the agent can carry it.

*Drafted by sola from its own logs and my notes to it; edited by me.*
