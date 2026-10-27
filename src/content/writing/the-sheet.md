---
title: The spreadsheet was the spec
dek: I replaced our Jira with a tool shaped like the Google Sheet the team really planned in. Nobody needed onboarding, and four weeks in, most of the edits aren't typed by a person.
lens: Building
order: 1
project: baze
keywords: ["replacing Jira with an internal tool", "internal tool adoption without onboarding", "AI agent project management", "pave the cowpaths"]
tldr: "Copy the shape the team already trusts and name things the way they already talk. Then integrations stop needing rules. Of 4,307 changes in four weeks, 78% weren't typed by a person."
---

Three weeks after the first commit, we closed Jira. There was no kickoff and no training session, and there's still no "how we use the tool" page.

The tool is a copy of a Google Sheet.

## Where the plan really lived

Until September, the team that builds Baze planned in one Google Sheet. It's about ten people, and a release goes out almost every week. Every month got a new tab. Each person had a color band, each task was a merged cell across the weeks it took, and two rows at the top held the week's key dates and release stage (something like "R24 QA + deploy; R25 dev"). You could see who was doing what, and when, at a glance.

What the sheet couldn't hold was state. Whether a task was in progress or on staging lived in Jira, and the only link between the two was a ticket key someone pasted into a cell. The frontend and backend halves of one feature sat in two different people's rows, so when one slipped, the other didn't know. Moving a task by a day meant unmerging cells and merging them again. By September the file had 26 tabs.

We did have Jira, but in practice it was a backlog archive. In September we lined the two up. 52 of the 135 tasks planned on the sheet had no ticket, and 44 open tickets weren't anywhere on the sheet. 83 of the 100 open tickets were still in the state they were created in. Of the 318 pull requests people merged between September 1 and 18, 21 carried a ticket key. That's seven percent. Neither system knew what had shipped.

That isn't a discipline problem, and Jira wasn't missing features. The team planned in a person-by-week grid and tracked status somewhere else, so keeping the two in sync was always one more job on top of the real one, and it rarely got done. Moving to Linear or Monday wouldn't have changed that, since we'd still be fitting the team to someone else's board. So I built the grid.

The W3C's 2007 [HTML design principles](https://www.w3.org/TR/html-design-principles/#pave-the-cowpaths) include one called "pave the cowpaths": "When a practice is already widespread among authors, consider adopting it rather than forbidding it or inventing something new." Our team's widespread practice was a spreadsheet.

The famous objection is older than the W3C's line. In 1990 Michael Hammer wrote in the Harvard Business Review, "It is time to stop paving the cow paths." His point was that software laid over an old process just runs the old process faster. He's right, and it's worth asking what was broken here. The grid wasn't. People planned in it every day. What was broken was the second system next to it, and that's the part we got rid of. Pave the path people walk, and obliterate the detour.

So the tool has the same rows, the same week columns and the same release row on top. You can drag a task, stretch it, or paste cells copied straight out of the old sheet. The difference is that every block is now a task with an owner, a status and a release. I only added what the sheet couldn't do:

- One spec for both halves of a feature. Requirements and decisions live in one place, and the FE and BE parts each keep their own owner, dates and status. When one slips, it's right next to the other.
- Status names from our deploy pipeline, in the words we already used, half Korean and half English. A generic tool would have called most of them "In Progress."
- A release view that lists every feature's BE and FE side by side and warns when the plan doesn't add up. That means backend finishing after frontend, a task that isn't on the timeline yet, a date past the release, or work scheduled on someone's day off.

<figure class="flow">
<ol>
<li>기획 중<small>planning</small></li>
<li>개발 준비 완료<small>ready</small></li>
<li class="gh">진행 중<small>PR opened</small></li>
<li class="gh">dev 머지<small>merged to dev</small></li>
<li>staging 머지<small>on staging</small></li>
<li class="gh">완료<small>on main</small></li>
</ol>
<p class="loop">Plus “dev QA fix 중” and “staging QA fix 중” for work that bounced back from QA.</p>
<figcaption>The statuses are the deploy pipeline. GitHub moves a task through the outlined ones by itself.</figcaption>
</figure>

## Why nobody needed onboarding

The first commit was September 27. Six people were using the tool in the first week of October, ten were editing in it by the third week, and on October 16 we closed Jira.

There wasn't much to teach. The rows and columns were the sheet everyone had looked at every day. The status names and release names (R26, R27) were the words we already said in meetings. The one new idea, the shared spec, was something FE and BE owners already did by hand in Slack threads, moved onto the screen.

One feature request came as code. A backend engineer wanted a status filter on "My tasks," so they opened a pull request and added it. Most other requests were one line in Slack and shipped the same day.

Onboarding is the tax you pay for the distance between a tool's words and your team's words. Get the distance to zero and there's nothing to pay.

## Automation without a rulebook

The bigger change is who's typing. In its first four weeks the tool logged 4,307 changes across 358 tasks and six releases. Eleven people made 947 of them, GitHub 185, and our AI agent 3,175.

<figure class="split">
<div class="bar" role="img" aria-label="Of 4,307 changes: AI agent 3,175, people 947, GitHub 185">
<i style="--w:73.7%"></i><i style="--w:22%"></i><i style="--w:4.3%"></i>
</div>
<p class="key num"><span>AI agent · 3,175</span><span>11 people · 947</span><span>GitHub · 185</span></p>
<figcaption>Who changed a task, September 27 to October 26. 78% of the changes weren't typed by a person.</figcaption>
</figure>

- GitHub: put the task key in the branch name (`feat/bz-12`), and the PR moves the task to 진행 중 when it opens, to dev 머지 when it merges to dev, and to 완료 when it reaches main. The PR link sticks to the task as its source.
- The calendar: leave and public holidays come in every morning and show up on the timeline. A task scheduled over someone's day off gets a warning.
- The agent: in a Slack thread, someone can ask it to make tasks from the thread, and it creates them with their FE and BE parts. Every weekday evening it reads that day's team channels and meeting notes. It applies the changes that are clearly settled, like a decision, a release that moved or a merged PR, and asks the owner about anything that needs judgment.

None of this started from a rulebook about what to write where. The status names are the deploy steps and the task key is the branch name, so doing the work leaves the record behind. The agent works from the same screen, in the same words, as everyone else, so there was very little to explain to it either.

I think that's the part that carries over. An agent is one more user, and it needs the same zero-distance vocabulary people do. If your data model needs a long prompt to explain it to the agent, it'll need a training doc for the humans too.

Once the plan was accurate, other work started reading from it. When a customer question comes in, the agent checks whether the person it's about to tag is on leave today. Release test docs are generated from the release view's feature list. The weekly product meeting stopped opening the sheet and opens the release view instead.

This is a story about a team of ten that planned in a spreadsheet. A big org with compliance requirements has a different problem.

## How I built it in three weeks

[Sean: how you built it so fast. Claude Code, prototype first, the spec from the kickoff interview on 9/27. Which choices you'd make again, and one thing that didn't work and what it cost. If you have them: how many agent changes did a person later edit or undo, and how long is the agent's description of the tool?]

The tool knows more than the sheet ever did, and the team types less. I still haven't written the "how we use the tool" page.
