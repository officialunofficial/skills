# Finding references and assets

Contents:

- Roles
- Order of work
- The fence
- Search order
- are.na
- Pinterest and primary sites
- 3D models
- Vetting
- Building the brief from the references

`scripts/find_refs.py` does the fetching. Run it with no arguments for the command list. It prints one JSON object per line, and a query with no hits prints one `"empty": true` line.

## Roles

Every reference gets exactly one role, a take (what it supplies) and a fidelity word. A file that serves two roles is listed twice with two scoped takes.

| Role | Handle | Supplies | Never supplies | Media | Default fidelity |
|---|---|---|---|---|---|
| motion | m | mechanic, beat order, timing, easing, camera, transitions | subject, palette, texture | gif, mp4 | mechanic and timing closely, look not at all |
| art direction | a | palette, texture, material, lighting, era, background | shape, layout, motion | still | the named quality only |
| copy | c | the specific thing to rebuild: artwork, character, product, lettering | how it moves | still, model, footage | closely, one-to-one for a named artwork or product |
| ui | u | layout, components, density, type hierarchy, states | brand, logo, real product copy | still, or gif for interaction | structure closely, brand not at all |
| detail | d | one feature inside a larger frame | anything outside the scoped region | still | the scoped part only |
| family | f | the space a batch is drawn from | a copy of any single item | a channel or board | loosely across the set |
| technique | t | how to build it | look or motion | repo, article | optional |
| timing | none | beat grid, cut points | anything visual | audio | the stated range |

Assets are not references. Models, fonts, footage, logos, placeholder photos and audio go under `assets:` with `use as-is` or `one-to-one`.

## Order of work

References come before any beat: five images from one aesthetic and three moving references. Then state, for all eight, the beat each feeds and what is taken.

- Five tiles from one channel is normal. Two channels of one aesthetic is fine. Two aesthetics is not.
- The motion test is "is this move worth collecting on its own?", not "does it show the right object?". A dull move on the right object loses to a striking move on another subject.
- Before you fall back on a camera move written in words, try `channels "camera move"`, `"zoom"` and `"transitions"`.

Then add roles as the beats need them:

- **copy and assets**: the subject is a specific recognisable thing (the user's app, a named painting, a product, a mascot, a logo). Search the source and the assets together. For 3D, use Sketchfab whenever the object is hard to model convincingly in code. If the thing is the user's own and nothing is attached, say so above the prompt and name the stand-in.
- **ui**: a beat shows an interface and no screenshot or earlier mock exists.
- **detail**: one beat needs a feature that none of the five images show.

If a required slot is still empty after are.na, Pinterest and primary sites, write `[? motion ref]` or `[? visual ref]` in the prompt beside a description in words, and name the queries tried in the fill-ins. An unvetted hit never fills a slot.

Skip the search in delta, image feedback and housekeeping modes unless the change brings in a new look or move. Skip any role the user already attached.

## The fence

A fence is a style, brand or medium the user named, or a reference they attached. Users name mainstream looks in plain words: `clean and minimal, lots of white`, `like stripe's style`, `like claymation`. Treat the fence as a query, not as a place to copy from.

1. **Decode the word in one line**: what the user pictures when they say it.
   - `minimal, lots of white`: big type, one accent, generous margins.
   - `claymation`: stop-motion clay, fingerprints, boil, animated on twos.
   - `like stripe, dark mode`: navy, blurple, fine gradient lines, mono code.
   That line limits palette, material, type and components. It does not limit layout, scale, camera or the mechanic.
2. **Run two kinds of query.**
   - The name itself: `search "[style word]"` or `search "[brand domain]"`. This is the combined endpoint. `channels` matches titles only, and `stripe` titles are fashion stripes. A style word returns the channels named for it plus its canon. A brand domain returns the brand's own artefacts, which supply the a1 look tile and the facts.
   - The decoded visual words: `channels "[word]"`, two or three things a curator would collect. Stripe gives `gradient`, `glow`, `iridescent`. Minimal white gives `big type`, `white space`, `swiss`. Claymation gives `clay`, `stop motion`. These channels supply a2 to a5.
   - A product-UI channel (`fintech`, `dashboard`) is a ui source only, never a1 to a5. Its tiles are screenshots, and the build will become one too.
   - Use `connections` for style words. Skip it for brands, where it leads to dump channels.
3. **Sheet two or three channels per kind** and drop the homonyms by eye. Pick the tile that stops you. A tile outside the fence loses however striking it is. A channel named for the subject (`menu design` for a menu clip) is not a way round the fence.
4. **The primary site supplies facts, not frames.** For `like [brand]`, read the hex, the typeface and one real component from the product surface, and write them into the takes of a1 and a2. A docs page, a settings screen or a pricing table is never a composition reference. The composition reference is a designed frame: a hero, a poster, a product-film still, or campaign work in the product palette.
5. **Motion is never fenced.** m1 to m3 still come from the motion channels. UI micro-interaction channels are a ui source, not a motion source. Apply the look to the move, not the move to the look.
6. **An attached reference fixes the look.** It takes the role its phrasing implies (an attached still is a1 unless the draft says otherwise). The other four images come from the same look: `connections [block_id]` for an are.na block, else the channel or site it came from, else `channels "[its aesthetic]"`. Do not switch aesthetic because another sheet is stronger.

With no fence, the open rule applies: pick the remarkable aesthetic.

## Search order

Images and motion: are.na channels, then Pinterest, then primary sites. 3D: Sketchfab first.

Go to Pinterest only for a role that are.na left without a passing candidate. When both pass, keep the are.na one. Use primary sites when both are empty, and always for the final file of a copy reference.

| Role | are.na channel query | Pinterest or web query |
|---|---|---|
| motion | `[mechanic] animation`, `motion design`, `kinetic type` | `[mechanic] animation gif` |
| art direction | the aesthetic's name | `[aesthetic] [medium]` |
| ui | `[ui type] ui`, `interface`, `ui animation` | `[ui type] ui design` |
| copy | rarely on are.na, go to the source | the exact name plus `high resolution` |
| detail | the motif | the feature plus context |
| assets | none | the thing, the format, `free download` or `cc0` |

## are.na

Search by channel, not by block keyword. Block search matches the text of the channels a block sits in, not what the block shows: `peel gif` returned a blob, a leaf and a banana. The one exception is a fence word.

The loop, per role:

1. **Seed** from the channels below. Most are umbrellas. Open one with `umbrella` and work in the nested channel that fits, never in the umbrella's own mixed blocks.
2. **Widen.** `channels "[query]"` lists channels whose title matches, ranked by followers, with 20 or more blocks. `connections [block_id] [n]` lists the other channels that hold a good block. Those curators share its eye and are usually the best next stop.
3. **Rank.** Prefer a title that names the exact mechanic, aesthetic or ui type, with 50 to 2,000 blocks. Followers signal quality. Skip catch-all dumps however large.
4. **Sheet.** `channel [slug] .context/refs/[topic]/arena 48 [moving|still] [regex]` writes numbered contact sheets of 24 tiles. Read them. Drop a channel when under a third of its tiles fit. Most blocks are untitled, so the sheet is the real filter.
5. **Pick tiles by number** and vet them. Note the channel beside the block in `refs:` so the user can browse its neighbours.

Stop after three channels per role, then go to Pinterest.

**Motion seeds**, always sheeted with `moving`:

- `mo-graph-1uxjlkjqqhc` (pass the bare slug).
- Its nested channels: `type-animation-references`, `design-moving-l9-xt3sxtne`, `motion-inspo-tfrw-gidqfw`, `ad-device-tech`, `product-video-mf4kzs1zbo0`. Type beats go to the type channel. Device and product beats go to the last two.
- Widen with `channels "[mechanic] animation"`, `"motion design"`, `"kinetic type"`, `"transitions"`, and `connections` from the best block.

**Art direction: the visual reference is the aesthetic.** Do not pick a look in words and then search for a picture of it. Browse the menu, sheet the two or three aesthetics that could carry the subject, and let the tile that stops you decide.

- Umbrellas of nested aesthetics: `vis-4hvdpzvvua4` (graphic and visual culture: Neo-gothic, Digital Embroidery, ASCII art, Baroque User Interface, Printed Matter), `flat-ovcn8k0nwa0` (poster, type, 2D), `form-glcjdzmigiq` (objects and industrial design), `mercenary` (visual and design systems).
- The CARI index of about 240 named aesthetics: `user-channels evan-collins-1522646491` (Y2K, Frutiger Aero, Vectorheart, Cassette Futurism, Whimsigothic).
- On a bare draft, avoid the safe default (flat vector on white, dark "linear style", brushed metal) unless a sheet makes it striking. When the user asked for that default by name, it is the fence, and the job is its best version.
- Put the chosen aesthetic in the first line of the prompt. Give the one-line reason and the runner-up in the fill-ins.

Then sheet the channel that is that aesthetic with `still`: the nested channel from an umbrella, then the CARI channel of the same name, then `channels "[aesthetic]"`. Pick five tiles with five jobs. If the channel cannot supply five, sheet a second channel of the same aesthetic before you switch aesthetic.

**UI seeds**, ui channels only, with a brand-neutral take:

- Layout: `channels "ui design"`, `"interface"`, `"dashboard"`, `"[ui type] ui"`. Strong ones: `fictional-interface`, `user-interface-superchannel`.
- Interaction timing, sheeted with `moving`: `channels "ui animation"`, `"micro interactions"`.

**Family**: sheet one whole channel in full. The batch one-liners cite tile numbers.

## Pinterest and primary sites

Pinterest has no usable search endpoint. Run a web search restricted to pinterest.com. With a search tool that takes a domain list, that is `WebSearch(query="[role query]", allowed_domains=["pinterest.com"])`. Otherwise use `site:pinterest.com`.

Resolve pins with `pin [url] ...`. It returns the original media, `moving`, the outbound `source`, `embed` (only a thumbnail of a hosted video) and `dead`.

For primary sites, follow `source` from the block or pin first. Otherwise restrict the web search to the right home: the studio's site, Behance, Vimeo, a museum's open-access collection or Wikimedia Commons for artworks, the brand's press kit for logos. Dribbble and Behance block scripted fetches, so cite the original page and take the file through the block or pin.

Assets outside Sketchfab: Poly Haven (CC0 props and textures), the type foundry or Google Fonts, the brand's own SVG, Wikimedia Commons, Unsplash for placeholders, and GitHub code search (`filename:[thing] extension:glb`, check the licence).

## 3D models

Use a real model for anything that looks fake when invented in code: anatomy, animals, characters, vehicles, products with recognisable detail, mechanical assemblies, sculptures, interiors. A hand-coded brain looked very bad, and a real GLB fixed it. Keep procedural geometry for orbs, blobs, primitives, extruded logos, lathe objects and noise fields.

```
find_refs.py sketchfab "[object] [style word]" .context/refs/[topic]/3d [n] [max_faces]
find_refs.py sketchfab-get [uid] .context/refs/[topic]/3d/[name].glb
npx -y @gltf-transform/cli inspect [file]    # meshes, animations, bounds
```

- **Search broad.** Sketchfab matches every word: `R46 subway car` returned 0 and `nyc subway car` returned 24. Use the object plus one style or era word, then narrow by eye on `sketchfab-sheet.png`.
- **Licence.** The script returns downloadable models only. Prefer CC0 and CC-BY and record the author. Flag NC licences in the fill-ins.
- **Face count fits the use.** A brain of 93k triangles was grey mush at 620 px until it was simplified to about 6k. Check `glb_mb` and `tex_max` when the model is embedded.
- **Parts match the motion.** A lid, arm or door that moves must be its own mesh. Name the moving parts in the take and confirm with `inspect` after download.
- **Whole object.** Not a scan fragment or a fan variant.
- **Download.** `sketchfab-get` tries the Objaverse mirror first (no login, marked `free_download: true`), then the Sketchfab API with `SKETCHFAB_TOKEN`. Otherwise it prints the page, which goes in `assets:` with `[? download]`.
- **Role.** A model is normally an asset, used as-is with styling on top. It is a copy reference only when the comp redraws it in another medium. Say which.

## Vetting

A matching title is not a reference. The top Pinterest pins for `sticker peel animation` were tutorial thumbnails.

1. Download each candidate to `.context/refs/[topic]/` with `get`, named by role letter and number (`m1.mp4`, `a1.jpg`). `get` corrects the extension to the real type, so cite the `saved` path.
2. Look at it. Read a still. For moving media, `sheet [file] [out.png]` makes a 3x3 contact sheet with timestamps and duration. Use 16 or 25 frames when a time range must be read to about 0.3 s.
3. Keep it only if the quality of its role is visible:
   - motion: the mechanic happens on screen as more than a cut or fade, and the clip is not a tutorial.
   - art direction: the palette or texture fills most of a frame of 600 px or more.
   - copy: the real thing, not a remake or recolour.
   - ui: a credible interface at a readable size.
4. When two candidates pass, keep the one you would want to see regardless of the draft. Passing includes the fence.
5. A composition reference that is a screenshot at browser scale is a fact for the take of a1, not a4.
6. Put runners-up in `.context/refs/[topic]/notes.md`, not in the prompt.
7. When nothing passes, follow the empty-slot rule under "Order of work".

## Building the brief from the references

1. **Beats from the motion references.** Read each contact sheet: what enters, the main action, each transition, the exit, with times from `frames_at_s`. Assign each clip its beat and number m1 to m3 in beat order. Swap the subject, scale to the target duration and state the ratio (`m1 is 3.4s, ours ~5s, so 1.5x slower`). Name the time range taken (`m1 0.0-1.6s`).
2. **First line and surfaces from the five images.** Name the aesthetic in the first line. Place each image on a beat with the exact quality taken: `a3's wet stone is the canvas surface from beat 1`, `a2's palette for the ink only`. Never write "like a1".
3. **Subject from the copy reference and assets**, on the beat where it first appears, with its fidelity word.
4. **The turn.** If no motion reference has a turn beat, add one and find its clip or detail reference.
5. **Detail references inline**, on the one beat they affect, scoped.
