---
title: Nobody updates the board anymore
dek: I replaced our Jira with a tool shaped like the spreadsheet the team really planned in, then wired it to Slack, GitHub and our agent. The record comes out of the work now, and our meetings are only for the calls a person has to make.
lens: Building
order: 1
stage: essay
updated: 2026-11-22
project: baze
keywords: ["what comes after agile", "AI agent project management", "double diamond for engineering teams", "replacing Jira with an internal tool", "pave the cowpaths"]
tldr: "Under agile, keeping the board true was a ritual people performed. Build the tool in the team's own shape and words, wire it to where the work already happens, and the board keeps itself. Then meetings can skip the status and the why, and go straight to the decisions."
---

Nobody on our team updates the board anymore. It updates itself from the work, and that changed what our meetings are for.

Waterfall kept the plan in a document someone wrote up front. Agile moved the plan onto a board and made keeping that board true a team ritual: the standup, the grooming session, the ticket you're supposed to drag to the next column. Most of that ritual exists because the board can't see the work, so somebody has to tell it.

I don't have a name for what comes after, and I'm wary of anyone who does. But I've watched one small version of it happen on the team that builds Baze, and it started with a spreadsheet.

## The plan lived in a spreadsheet

Until this September we planned in one Google Sheet. We're about ten people and we ship almost every week. Each person had a row and each week a column, and a task was a merged cell stretched across the weeks it took. Two rows at the top held the week's key dates and the release stage. You could see who was doing what, and when, at a glance.

What the sheet couldn't hold was state. Whether a task was in progress or on staging lived in Jira, and the only link between the two was a ticket key somebody pasted into a cell. The frontend and backend halves of one feature sat in two people's rows, and Jira's timeline had no subtasks, so when one half slipped the other didn't know. Moving a feature to the next release meant fixing it in both places. In the end neither one knew what had shipped.

Nobody was being lazy. The team planned in one tool and reported in another, and keeping them in sync was a second job on top of the real one. Moving to Linear or Monday would have kept that second job and added a new board to learn. So I built the grid.

## Pave the path, obliterate the detour

The W3C's [HTML design principles](https://www.w3.org/TR/html-design-principles/#pave-the-cowpaths) include one called "pave the cowpaths": "When a practice is already widespread among authors, consider adopting it rather than forbidding it or inventing something new." Our team's widespread practice was a spreadsheet.

The famous objection is older. In 1990 Michael Hammer wrote "Reengineering Work: Don't Automate, Obliterate" for the Harvard Business Review, with the line "It is time to stop paving the cow paths." Put software over an old process and you get the old process, faster. He's right, but the grid wasn't what was broken. People planned in it every day. The broken part was the second system next to it.

I started by moving over the parts of the sheet and Jira that already worked: the timeline, and the side drawer where you read a task's details. Then I fixed the parts that hurt: dragging work from one release to the next, going back and forth between Jira and the timeline to update a release date, and editing the FE and BE halves of a feature as two separate things. The first version took me a week and a half, and a teammate helped me move it from a standalone app to behind Cloudflare Access.

Underneath, every block on the grid became a task with an owner, a status and a release. On top of the grid I only added what the sheet couldn't do:

- One spec for both halves of a feature. Requirements and decisions live in one place, and the FE and BE parts keep their own owner, dates and status, side by side.
- Status names taken from our deploy pipeline, in the words we already used, half Korean and half English.
- A release view that lists every feature's BE and FE together and warns when the plan doesn't add up: backend finishing after frontend, a date past the release, work scheduled on someone's day off.

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

Nobody needed onboarding. The rows and columns were the sheet everyone had looked at every day, and the status and release names were the words we already said in meetings. There was no training session, and there's still no "how we use the tool" page.

## The record falls out of the work

None of the integrations needed a rulebook about what to write where, because the tool uses the words the work already produces.

- GitHub. The task key goes in the branch name (`feat/<task-key>`). Opening the PR moves the task to 진행 중, merging to dev moves it to dev 머지, reaching main moves it to 완료, and the PR link sticks to the task.
- The calendar. Leave and public holidays come in every morning and show up on the timeline, so work scheduled on someone's day off gets a warning.
- Slack, through our company agent. Anyone can ask it in a thread to turn the thread into tasks, and it makes them with their FE and BE parts. Every weekday evening it reads the day's team channels and meeting notes, applies what's clearly settled (a decision, a release that moved, a merged PR) and asks the owner about anything that needs judgment.

The agent reads the same screen, in the same words, as everyone else, so there was very little to explain to it. I think this carries over to any team: an agent is one more user, and it needs the same short distance between the tool's words and the team's words that people do. If your data model needs a long prompt to explain it to the agent, it'll need a training doc for the humans too.

The same wiring is how the tool kept growing. Once I agreed a feature was needed, anyone on the team could add it or change it, with the agent's help. One backend engineer wanted a status filter on "My tasks," so they opened a pull request and added it.

## What the meetings are for now

Once the board kept itself, the way we build features changed with it. We run each feature as a [double diamond](https://www.designcouncil.org.uk/our-resources/the-double-diamond/), the Design Council's model of opening up to explore and closing down to decide, done twice: once on the problem, once on the solution. Between people, the work moves the way Dan Mall and Brad Frost describe in [the hot potato process](https://danmall.com/posts/hot-potato-process): small, frequent passes back and forth instead of one big handoff.

In the opening halves, each engineer works on their own with the AI. By the time a feature reaches its first meeting, the Slack discussion and the business reasons behind it are already in the task, because the agent put them there. The engineer has had a day with the problem to think about how it should be solved.

So we only meet where the diamonds close. I proposed these meetings and I run them:

- Full-stack coordination, where the frontend and backend pieces have to meet.
- Whether the architecture scales from a business standpoint.
- Internal user testing, before anything goes out.

Our feature meetings used to open with the business context and why we needed the feature at all. Now everyone walks in on the same page, so we go straight to the ERD and the wireframes or prototype and ask whether what we've architected solves the business problem.

<figure class="dd">
<svg viewBox="-6 0 412 120" role="img" aria-label="A double diamond. The two opening halves are shaded for AI work with each engineer; a dot marks a meeting at each point where a diamond closes.">
<polygon class="op" points="0,60 100,4 100,116"/><polygon class="cl" points="100,4 200,60 100,116"/>
<polygon class="op" points="200,60 300,4 300,116"/><polygon class="cl" points="300,4 400,60 300,116"/>
<circle cx="200" cy="60" r="6"/><circle cx="400" cy="60" r="6"/>
</svg>
<ol>
<li>Discover<small>engineer + AI</small></li>
<li>Define<small>meeting: ERD + prototype</small></li>
<li>Develop<small>engineer + AI</small></li>
<li>Deliver<small>meeting: user testing</small></li>
</ol>
<figcaption>AI works with each engineer where the diamonds open. People meet where they close.</figcaption>
</figure>

## Everyone can see what ships

The plan used to be readable only by the people who kept it. Someone in sales who wanted to know when a feature was going out had to check a spreadsheet and a Jira they'd never learned. Now anyone in the company can open the releases page or ask the agent, and the answer is current, because nobody had to type it in.

## What's still open

The first version was rough. It needed a lot more to feel truly intuitive, starting with hotkeys and notifications.

And this is a team of about ten that planned in a spreadsheet. A big org with compliance requirements has a different problem.

The project itself was never that important. What I'd bring anywhere is the habit behind it: find where the team's process chokes and build the fix together with the team, agent included. I still haven't written the "how we use the tool" page.

*Drafted with my agent from my own draft and an interview; edited by me.*
