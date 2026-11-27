# Sources

## Contents

- Queries
- Candidates
- Board
- What the user gave
- Live capture
- Pond
- marked.dev
- Boards
- Pattern libraries
- Curated galleries

Contents:

- Queries
- Candidates
- Board
- What the user gave
- Live capture
- Pond
- marked.dev
- Boards
- Pattern libraries
- Curated galleries

How to reach each source, the file each search agent writes, and the board settings.

## Queries

Give each search agent the brief, its parts with their synonyms, the platform and the urls already on the board. Per part, run three to five short queries built from the synonyms, plus one image search.

| Brief part | Queries |
| --- | --- |
| Top bar | `"top bar"`, `"app header"`, `"toolbar"`, `"navigation bar"` |
| Empty state | `"empty state"`, `"blank slate"`, `"zero state"`, `"no results"` |
| Row density | `"dense table"`, `"compact list"`, `"data grid"` |

## Candidates

Each agent writes one file, `.gather/[brief]/candidates/[source].json`, that holds an array:

```json
[
  {
    "title": "Linear",
    "source": "Mobbin",
    "url": "https://mobbin.com/screens/4c03063e",
    "media": "https://bytescale.mobbin.com/.../4c03063e.webp",
    "kind": "image",
    "group": "Grouping",
    "note": "Take the grouped list, not the colours.",
    "details": { "Kind": "Shipped" }
  }
]
```

- `url` is the original page. It identifies the item, so each url appears once.
- `media` is a full URL, an absolute local path or a path inside `.gather/[brief]/`. The collector downloads or copies it into `img/`.
- `kind` is `image` or `video`. Without it, the file extension decides.
- `poster` is optional: a still for a video.
- `source` names the library. To name a board inside a library, join the two with the `›` character (U+203A), as in "Pond › Are.na". Items from Pond and marked.dev lead each group, except the Explore catalogue of marked.dev.
- `details` adds rows to the viewer, such as `{ "Creator": "Kevin", "Style": ["Minimal", "Clean"] }`.

## Board

`.gather/[brief]/board.json` sets what the candidates cannot:

```json
{
  "title": "Settings Page",
  "brief": "Desktop settings page, looking for grouping and density.",
  "groups": [{ "title": "Grouping", "description": "How long lists of options are split up." }],
  "cut": ["https://mobbin.com/screens/9f12ab07"]
}
```

The board title takes Title Case. Groups appear in this order, and a group named only by a candidate follows them. A url under `cut` stays off the board.

| Command | Effect |
| --- | --- |
| `node collect.mjs .gather/[brief]` | Builds the board once |
| `node collect.mjs .gather/[brief] --serve` | Serves it on port 4800, rebuilds on every change and keeps the board reloading |
| `node collect.mjs .gather/[brief] --done` | Builds it a last time and stops the reloading |

`--port [n]` changes the port. Downloads run 8 at a time. The collector caches each one under a hash of the media url, so a second run fetches only new files. It names a failed download in its output and leaves that item off the board.

## What the user gave

| Input | Reach it with |
| --- | --- |
| Open browser tabs | List the tabs and read each page |
| Screenshots in the thread | Read the images |
| Design files | The Figma MCP `get_screenshot` on the linked node |
| Live sites | Open the page. For exact values, hand over to `match` |

## Live capture

Open the product page in the browser and screenshot the part the brief names. Use the path of the screenshot as `media`, the live page as `url` and `Live` as `source`. Stop at a login and say so.

## Pond

Pond is the user's own library of saves from Instagram, X, Pinterest, Are.na, Cosmos and the web. It runs as a local MCP server over stdio. The app comes from https://pond.raphaelsalaja.com.

```json
{
  "mcpServers": {
    "pond": {
      "command": "/Applications/Pond.app/Contents/MacOS/Pond",
      "args": ["--mcp"]
    }
  }
}
```

Copy the exact command from Pond, under Settings, Model Context Protocol. The Search Saves switch under Access must be on. To connect an account, the user installs the Pond browser extension from the library menu.

| Tool | Use |
| --- | --- |
| `search_library` | Search by meaning, such as `{ "query": "website design" }` |
| `search_library` with `source` | One platform only: `arena`, `cosmos`, `pinterest` or `savee` |
| `search_library` with `visual: { "kind": "saveId", "id" }` | Saves that look like one the user likes |
| `search_library` with `media: ["video"]` | Motion references only |
| `query_library` | Filter by keywords, source, folder, tag or `savedSince` |
| `list_folders` | The user's own groupings. Read them before searching |
| `read_save` | Caption, text in images, note, link and metadata |
| `grep_library` | Exact words inside captions, notes and image text |
| `open_save`, `apply_filter` | Show a result in the Pond window |

For an image search, find the save closest to what the user gave and pass its id as `visual`. Run it again from the best two or three results.

The files of a save sit in `[Library].pond/items/[id].info/`, so `media` is the absolute path to the original file. The Local API also saves URLs with `POST /enqueue`, and `created: false` means the URL is already saved. Its token stays in the settings of Pond. Never ask the user to paste it into chat.

## marked.dev

marked.dev holds the user's saved interfaces and motion from X, Pinterest and the web, each credited to its maker. It also holds Explore, a public catalogue browsed by what moves: hover, scroll and drag. It runs as a remote MCP server with no API key. Copy the config from https://marked.dev/mcp, then approve the connection in the browser.

| Tool | Use |
| --- | --- |
| `list_collections`, `get_collection` | The user's own collections. Read them before searching |
| `search_refs` | The user's saved refs |
| `get_ref` | The media, source and author of a saved ref |
| `search_explore`, `get_explore_ref` | Public refs, with `category: "motion"` for what moves |
| `save_ref` | Save a pick into a collection, only when the user asks |

When the brief is about motion, search by interaction, such as "hover card lift" or "scroll reveal". The video of a ref is the `media`, with `kind: "video"`.

## Boards

| Source | Reach it with |
| --- | --- |
| Are.na | The user's channels in the logged-in browser, or the v3 API |
| Cosmos | The user's clusters in the logged-in browser. Open an element and use its similar results as an image search |
| Pinterest | The user's boards in the logged-in browser or with computer use. The More Ideas of a pin work as an image search |

Read the user's existing channel and board names before you create one. When the browser is signed out, ask the user to sign in, then read their boards.

## Pattern libraries

| Tool | Use |
| --- | --- |
| Mobbin `search_screens` | Single screens. Set `platform` to `web` for desktop and web work |
| Mobbin `search_flows` | Multi-step flows, such as onboarding or checkout |
| Mobbin `search_sections` | Sections of marketing sites |
| Mobbin `exclude_screen_ids` | Leave out screens already shown when the user asks for more |
| Mobbin `list_collections`, `get_collection_contents` | The user's own saved collections. Search them first |

The `image_url` of a Mobbin result is the `media`, and its `mobbin_url` is the `url`. The image link expires after 30 days. The download makes that harmless.

## Curated galleries

Open them in the browser. Prefer galleries picked by hand to galleries that take paid submissions. Dribbble and Behance hold mostly concepts, so mark what comes from them.

| Gallery | What it holds |
| --- | --- |
| [Recent](https://recent.design) | High-end sites, branding, motion and type, picked daily. The Web filter shows sites only |
| [Refero](https://refero.design) | Real product screens, flows, patterns and elements, mostly web |
| [Savee](https://savee.com) | Graphic, brand, editorial and web work saved by designers. It searches by colour and image. Pond reads it as `savee` |
| [Cosmos](https://www.cosmos.so) | Search by visual similarity, colour and motion, with AI images hidden on request |
| [Siteinspire](https://www.siteinspire.com) | Editorial and typographic sites, filtered by style, type and subject |
| [Minimal Gallery](https://minimal.gallery) | Restrained, functional sites |
| [Land-book](https://land-book.com) | Landing pages, filtered by page type and style |
| [Saaspo](https://saaspo.com) | Software landing, pricing and product pages |
| [Page Flows](https://pageflows.com) | Recorded flows from live web and mobile apps |
