---
title: The use cases are in the data model
dek: Before I write a single user story, I draw the nouns of a product and the lines between them, then ask five questions of every noun and every line. Most of the features people love turn up on the lines.
lens: Design
order: 6
stage: essay
updated: 2026-11-22
keywords: ["designing with an engineering mindset", "use cases from an entity relationship diagram", "product design from the data model", "CRUD for product design", "object-oriented UX"]
tldr: "Draw the product's entities and the relationships between them, then ask Create, Read list, Read details, Update and Delete of each one. Almost every feature lands in a cell. The loved ones are mostly on relationships, and the empty cells are where the next ones are."
---

In early December, millions of people will post a screenshot of a database query. Spotify Wrapped is a year of your plays, grouped by song and artist and sorted by count. It's one read on one entity, and it's the best marketing Spotify does all year.

Most of my use cases come from the same place. Before I write a user story or draw a journey map, I draw the product's nouns and the lines between them. Then I go through the drawing one box and one line at a time and ask what someone could do with it.

## Entities, not tables

The drawing has no columns, types or foreign keys. An entity is a thing the product is about, in the words people use for it: a song, a playlist, a person. A relationship is a line between two things, and I write on the line what it is: likes, follows, edits.

Engineers will recognize an ER diagram with the engineering taken out, on purpose. Once it's columns and keys it describes storage, and I want it to describe the product.

## Five questions

For every entity and every relationship, I ask CRRUD:

- Create: can someone make one?
- Read list: can they see many of them?
- Read details: can they look closely at one?
- Update: can they change it?
- Delete: can they get rid of it?

CRRUD is CRUD with the read split in two. I came up with the split myself. (Some people call a version of it CRUDL.) A list answers "which ones?" and a detail page answers "tell me about this one." On screen they're different pages, and they're often different features. Engineers already split it this way: in Rails routes it's `index` and `show`. The design side mostly doesn't.

Every cell in that grid is a possible use case. Most will be boring or impossible, and some will already exist. A few will be things nobody has built.

## Modeling Spotify

Take an app everyone knows. Spotify's schema isn't public, so this is my model of the product, not their database.

I start with two lenses. The business lens asks what pays. That's Premium plans (Individual, Duo, Family, Student), ads on the free tier, and artists and labels on the other side of the market. The user lens asks what people come to do: listen, find something new, share it.

Then the nouns. User, Artist, Album, Track, Playlist, Device, Plan. And one that's easy to miss, the Play. A play is a user, a track and a moment. Every press of the play button makes one, and it ends up the most valuable thing in the model.

Then the lines. A user *likes* a track. A user *follows* an artist, and another user. A user *edits* a playlist they don't own. A device *has downloaded* a track. A user *is in* a listening session. A plan *covers* several users.

Then the grid.

<figure class="crrud">
<table>
<thead><tr><th></th><th>Create</th><th>Read list</th><th>Read details</th><th>Update</th><th>Delete</th></tr></thead>
<tbody>
<tr class="grp"><th colspan="6">Entities</th></tr>
<tr><th>Playlist</th><td>New playlist</td><td>Your Library</td><td>Playlist page</td><td>Rename, reorder</td><td>Delete</td></tr>
<tr><th>Track</th><td>·</td><td>Search, album page</td><td>Lyrics, credits</td><td>·</td><td>·</td></tr>
<tr><th>Play</th><td>Press play</td><td>Recently played, daylist, <b>Wrapped</b></td><td>·</td><td>·</td><td>·</td></tr>
<tr class="grp"><th colspan="6">Relationships</th></tr>
<tr><th>User likes Track</th><td>The heart</td><td>Liked Songs</td><td class="gap">?</td><td>·</td><td>Unlike</td></tr>
<tr><th>User follows Artist</th><td>Follow</td><td>Following, new releases</td><td>·</td><td>·</td><td>Unfollow</td></tr>
<tr><th>User follows User</th><td>Follow</td><td>Friend Activity</td><td>·</td><td>·</td><td>Unfollow</td></tr>
<tr><th>User edits Playlist</th><td>Invite</td><td>Collaborators</td><td>·</td><td>·</td><td>Remove</td></tr>
<tr><th>Device has Track</th><td>Download</td><td>Downloaded</td><td>·</td><td>·</td><td>Remove</td></tr>
<tr><th>User is in Session</th><td>Start a Jam</td><td>Who's in</td><td>·</td><td>·</td><td>Leave</td></tr>
<tr><th>Plan covers User</th><td>Add member</td><td>Members, Family Mix</td><td>·</td><td>·</td><td>Remove</td></tr>
<tr><th>User + User, via Plays</th><td>Make a Blend</td><td>The Blend</td><td>·</td><td>·</td><td>Leave</td></tr>
</tbody>
</table>
<figcaption>My model of Spotify, run through CRRUD. A dot is a cell with nothing in it. The question mark is the one I'd build next.</figcaption>
</figure>

Three things jump out.

First, almost every feature you can name is in a cell. Search is a read list on tracks. Lyrics is read details. Downloads are a relationship between a device and a track, and Jam is a relationship between a person and a session. Wrapped is a read list on plays, cut by year. daylist cuts the same plays by time of day and fills in with tracks like them. Blend mixes a few people's listening into one shared playlist.

Second, look at where the features people talk about live. Liked Songs, Friend Activity, collaborative playlists, Jam, Blend, Family Mix: all on the relationship rows. Wrapped and daylist sit on plays, and a play is a relationship too, a person and a song at a moment in time. The entity rows are mostly the furniture: make a playlist, open a playlist, delete a playlist.

The features people love are verbs on a relationship, and that's the main reason I draw lines and not just boxes. A list of objects gives you the screens. The lines give you the reasons to open them.

Third, the Update column is empty on every relationship row. Relationships are born and they end, but they rarely change. You like a song or you don't. When I see an Update cell filled on a relationship, it's usually a sign the line should have been an entity with its own page.

## The empty cells

The grid is most useful where it's blank. Every dot is a question: is this empty because it makes no sense, or because nobody's built it?

Take *User likes Track*, Read details. Spotify knows when I first played a song, how many times I've played it, and which year it was my most-played. Wrapped and the weekly listening stats only show rankings: my top songs for the year or the week. I haven't found a screen that shows it for any one song, any day: when this song came into my life and what it was doing there. That's a feature, and I found it by looking at an empty box on a line.

Interviews come after that. The grid hands you candidates, and the user lens decides which are worth building.

## Both ways

Using the data model to find use cases is an engineering habit applied to design. It works better when it runs the other way too, with the user's real problem changing the data.

My example is a feature I'm working on, an AI app builder. It isn't out yet, so I've changed the details.

You describe an app, and the agent writes it. Before you see a preview, there's a wait of a minute or two while it works. The first version filled that wait with a spinner and a scrolling log: `write_file`, `install`, `run`, `write_file`. It was accurate, and it meant nothing to anyone who doesn't write code. People got frustrated, and some of them refreshed and lost the run.

We started from the data, the engineering-to-design direction. We pulled the tool calls from a set of real runs and sorted them into entities: pages, files, packages, commands, errors, and the preview itself. Then we drew the relationships. A page is made of files. A file needs packages. A command builds files, and an error belongs to a file. With CRRUD on those, the log turned into something you could look at: pages appearing one by one with their files filling in under them, and an error shown on the page it broke, not as a red line in a stream.

That made the wait legible, but it didn't make it shorter or calmer. So we went the other way, from design back to data, and asked what people want to know while they wait. It came down to two questions: "is it building what I asked for?" and "is it almost done?" The tool calls didn't carry that information, so we added it. Each tool call now says which part of the person's request it serves ("the sign-up page," "the booking form"), and the agent sends its plan at the start.

The wait screen now shows your own request as a checklist, ticking off in your words, with the files underneath for anyone who wants them.

## Who else thinks this

While I was writing this post I found [Object-Oriented UX](https://alistapart.com/article/ooux-a-foundation-for-interaction-design/), Sophia Prater's method from 2015. Its ORCA process goes objects, relationships, calls-to-action, attributes. It's close to what I do, and I wish I'd known it sooner. Where I'd differ: OOUX hangs the actions on objects and uses relationships mostly to decide what appears inside what. I put the verbs on the relationships themselves, because that's where the grid above found the interesting features. OOUX also starts from the nouns in users' heads, found through research. I start from what the system records, including data nobody looks at, like the tool-call logs, and check it against users afterwards.

Older still is the [CRUD matrix](https://condor.depaul.edu/jbernste/is315_CRUDmatrix.htm) from information engineering, which crosses entities with business processes. It's used as a completeness check: every entity should be created, read, updated and deleted somewhere. I use the same grid to find the gaps on purpose.

## Where it breaks

It doesn't cover qualities. Speed, sound quality, how a screen feels, and whether it works on a train don't live in any cell. You need other tools for those.

Some relationships aren't stored anywhere. Discover Weekly, radio and DJ run on "this track is like that one," a line Spotify infers from millions of plays and playlists. If I only drew what's saved, I'd miss the recommendations Spotify is best known for. So I draw inferred lines too, dashed.

And the grid doesn't have taste. It hands you fifty candidates and can't tell you which three matter. A cell earns a build when one look at it makes someone want it. The grid only makes sure you looked at all of them.

The rule I'd keep: if a feature someone asks for won't fit in any cell, don't force it. Look for the entity you haven't drawn yet. In the app builder, that was the person's request, split into parts.

What's the empty cell in your product?

*Drafted with my agent from an interview; edited by me.*
