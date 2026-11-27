#!/usr/bin/env python3
"""Reference finder for /blank-page. Stdlib only; ffmpeg for sheets.

are.na is searched by channel, never by block keyword:
  find_refs.py channels <query> [n]       channel search ranked by followers (length >= 20): slug, title, length, owner
  find_refs.py search <query> [dir] [pages] [all|moving|still]
                                          the combined endpoint: channels named for the query plus the media blocks
                                          whose title / source carry it (a brand's domain finds the brand's own
                                          artefacts: `search stripe.com`); with dir, sheets <dir>/search-<query>-NN.png.
                                          For a fence word (a named style or company) this comes before `channels`
  find_refs.py user-channels <user>       every channel a user owns (v3, no auth): blake-shao for his own seeds,
                                          evan-collins-1522646491 for CARI's ~240 named-aesthetic channels
  find_refs.py channel <slug> [dir] [n] [all|moving|still] [grep]
                                          up to n blocks (default 48, newest first) of one channel, filtered by media
                                          kind and an optional regex over title/description/source; nested channels are
                                          listed as `subchannel`; with dir, numbered contact sheets <dir>/<slug>-NN.png
                                          (24 tiles each, tile number = "n" in the output)
  find_refs.py connections <block_id> [n] the other channels a good block sits in (default 12, biggest first), to
                                          branch out to adjacent curators
  find_refs.py umbrella <slug> [regex]    only the channels nested in an umbrella channel (blake-shao's vis / flat /
                                          form / mo-graph / mercenary are indexes of aesthetics, not aesthetics),
                                          biggest first, optionally filtered by a regex on the title
  find_refs.py pin <pin_url> [...]        resolve Pinterest pins to the original image / gif / 720w mp4 + outbound link
  find_refs.py get <url> <out>            download with a browser UA; the extension is corrected to the real file type
  find_refs.py sheet <video|gif> <out> [frames]
                                          contact sheet (default 9 frames, 3x3) + duration, so motion can be read and
                                          timed; 16 or 25 frames to time a long clip finely
  find_refs.py sketchfab <query> <dir> [n] [max_faces]
                                          downloadable Sketchfab models: licence, faces, parts-relevant counts,
                                          glb size, page; thumbnails tiled into <dir>/sketchfab-sheet.png (row-major = order)
  find_refs.py sketchfab-get <uid> <out.glb>
                                          download the glb: from the Objaverse mirror when the uid is in it (no login),
                                          else with SKETCHFAB_TOKEN (sketchfab.com/settings/password), else prints the page

Search order is are.na (channels only) first, Pinterest only for roles still empty. Pinterest has no usable search
endpoint: find pins with a web search restricted to pinterest.com, then resolve them here. Output is one JSON object per line;
a query with no hits prints one {"empty": true} line instead of nothing."""
import base64, concurrent.futures, gzip, html, json, math, os, re, shutil, subprocess, sys, time, urllib.parse

UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36"

def fetch(url, timeout=25):
    # curl, not urllib: the python.org build ships without a CA bundle
    # browser UA for Pinterest (api.are.na goes through arena(), whose Cloudflare 403s that UA)
    ua = ["-A", UA]
    return subprocess.run(["curl", "-sfL", "-m", str(timeout), *ua, url],
                          capture_output=True, check=True).stdout

def arena(path):
    # api.are.na drops or 429s bursts: back off and retry instead of failing the search
    for wait in (0, 2, 5, 10):
        time.sleep(wait)
        r = subprocess.run(["curl", "-s", "-m", "30", "-w", "\n%{http_code}", "https://api.are.na/" + path],
                           capture_output=True, text=True).stdout
        body, _, code = r.rpartition("\n")
        if code == "200":
            return json.loads(body)
    sys.exit(f"are.na {path}: HTTP {code}")

def arena_block(b, n=None):
    att = b.get("attachment") or {}
    media = att.get("url") or ((b.get("image") or {}).get("original") or {}).get("url")
    moving = bool(media) and (".gif" in media.split("?")[0] or att.get("extension") in ("mp4", "mov", "webm", "gif"))
    return {"site": "are.na", "n": n, "id": b["id"], "kind": b.get("class"), "title": (b.get("title") or "")[:120],
            "media": media, "moving": moving, "source": (b.get("source") or {}).get("url"),
            "page": f"https://www.are.na/block/{b['id']}"}

def chan_row(c):
    return {"site": "are.na", "kind": "Channel", "slug": c["slug"], "title": c["title"], "length": c.get("length"),
            "followers": c.get("follower_count"), "owner": c["user"]["slug"],
            "page": f"https://www.are.na/{c['user']['slug']}/{c['slug']}"}

def empty(site, **query):
    # one line instead of silence, so "no hits" can't be mistaken for a crash or a filtered pipe
    print(json.dumps({"site": site, **query, "empty": True}))

def channels(query, n=12):
    cs = arena(f"v2/search/channels?q={urllib.parse.quote(query)}&per=60").get("channels", [])
    cs = [c for c in cs if (c.get("length") or 0) >= 20]
    for c in sorted(cs, key=lambda c: -(c.get("follower_count") or 0))[:n]:
        print(json.dumps(chan_row(c)))
    if not cs:
        empty("are.na", channels=query)

def user_channels(user):
    page = 1
    while True:
        d = arena(f"v3/users/{user}/contents?type=Channel&per=100&page={page}")
        for c in d.get("data", []):
            print(json.dumps({"site": "are.na", "kind": "Channel", "slug": c["slug"], "title": c["title"].strip(),
                              "length": (c.get("counts") or {}).get("contents"), "owner": user,
                              "page": f"https://www.are.na/{user}/{c['slug']}"}))
        if not d.get("meta", {}).get("has_more_pages"):
            break
        page += 1

def search(query, out_dir=None, pages=2, kind="all"):
    # the combined endpoint matches channel titles AND block titles / sources, so a brand's domain or a
    # style word finds the brand's own artefacts and the channels named for the word in one call;
    # v2/search/blocks is Cloudflare-blocked for every UA, this one is not. Channels first, then
    # media blocks numbered for a sheet, so a fence word can be sheeted directly.
    chans, rows, seen = {}, [], set()
    for page in range(1, pages + 1):
        d = arena(f"v2/search?q={urllib.parse.quote(query)}&per=50&page={page}")
        for c in d.get("channels", []):
            chans.setdefault(c["slug"], c)
        for b in d.get("blocks", []):
            r = arena_block(b)
            if not r["media"] or r["id"] in seen or (kind == "moving" and not r["moving"]) \
               or (kind == "still" and r["moving"]):
                continue
            seen.add(r["id"]); rows.append(r)
        if page >= (d.get("total_pages") or 1):
            break
    for c in sorted(chans.values(), key=lambda c: -(c.get("follower_count") or 0)):
        print(json.dumps(chan_row(c)))
    for i, r in enumerate(rows, 1):
        r["n"] = i
        print(json.dumps(r))
    if not (chans or rows):
        empty("are.na", search=query, kind=kind)
    if out_dir and rows:
        tile_sheets(rows, out_dir, "search-" + re.sub(r"[^a-z0-9]+", "-", query.lower()).strip("-"))

def connections(block_id, n=12):
    cs = arena(f"v2/blocks/{block_id}/channels?per=50").get("channels", [])
    for c in sorted(cs, key=lambda c: -(c.get("length") or 0))[:n]:
        print(json.dumps(chan_row(c)))
    if not cs:
        empty("are.na", connections=block_id)

def umbrella(slug, grep=None):
    subs, page = [], 1
    while True:
        got = arena(f"v2/channels/{slug}/contents?per=100&page={page}").get("contents", [])
        if not got:
            break
        subs += [b for b in got if b.get("class") == "Channel" and (not grep or re.search(grep, b["title"], re.I))]
        page += 1
    for c in sorted(subs, key=lambda c: -(c.get("length") or 0)):
        print(json.dumps({**chan_row(c), "kind": "subchannel", "umbrella": slug}))
    if not subs:
        empty("are.na", umbrella=slug, grep=grep)

def channel(slug, out_dir=None, n=48, kind="all", grep=None):
    rows, page = [], 1
    while len(rows) < n:
        got = arena(f"v2/channels/{slug}/contents?per=100&page={page}&direction=desc").get("contents", [])
        if not got:
            break
        for b in got:
            if b.get("class") == "Channel":
                print(json.dumps({**chan_row(b), "kind": "subchannel"}))
                continue
            r = arena_block(b)
            text = " ".join(filter(None, [r["title"], b.get("description"), r["source"]]))
            if not r["media"] or (kind == "moving" and not r["moving"]) or (kind == "still" and r["moving"]) \
               or (grep and not re.search(grep, text, re.I)):
                continue
            rows.append(r)
        page += 1
    rows = rows[:n]
    for i, r in enumerate(rows, 1):
        r["n"] = i
        print(json.dumps(r))
    if not rows:
        empty("are.na", channel=slug, kind=kind, grep=grep)
    if out_dir and rows:
        tile_sheets(rows, out_dir, slug)

FONT = "/System/Library/Fonts/Supplemental/Arial.ttf"

def tile_sheets(rows, out_dir, slug, per=24):
    # one frame per block,
    # numbered top-left, 6x4 per sheet
    tmp = os.path.join(out_dir, f".{slug}-tiles")
    os.makedirs(tmp, exist_ok=True)
    # every tile rgb24: a pixel-format change mid-sequence re-inits ffmpeg's tile filter and drops tiles
    label = (f"drawtext=fontfile={FONT}:text=%s:x=6:y=6:fontsize=22:fontcolor=white:box=1:boxcolor=black@0.65"
             ":boxborderw=4,format=rgb24")
    def one(r):
        out, src = os.path.join(tmp, f"{r['n']:04d}.png"), os.path.join(tmp, f"{r['n']:04d}.src")
        vf = "scale=240:240:force_original_aspect_ratio=decrease,pad=240:240:-1:-1:white," + label % r["n"]
        url = r["media"].split("?")[0]
        # the CDNs hand an empty 202 to non-browser clients (ffmpeg's own UA included), so curl fetches;
        # never pull whole gifs (often 5-20 MB): stills go through are.na's resize server, gifs are read
        # from a 1.5 MB byte range keeping frame ~12 (many open on a blank frame), video seeks 1 s in
        if url.endswith(".gif"):
            subprocess.run(["curl", "-sf", "-m", "30", "-A", UA, "-r", "0-1500000", "-o", src, r["media"]])
            ff, vf = ["-i", src, "-update", "1"], "select=lte(n\\,12)," + vf
        elif "cloudfront.net/" in url:
            req = {"bucket": "arena_images", "key": url.split("cloudfront.net/", 1)[1],
                   "edits": {"resize": {"width": 240, "height": 240, "fit": "inside"}}}
            subprocess.run(["curl", "-sf", "-m", "30", "-o", src, "https://images.are.na/" +
                            base64.b64encode(json.dumps(req, separators=(",", ":")).encode()).decode()])
            ff = ["-i", src, "-frames:v", "1"]
        else:
            ff = ["-user_agent", UA, "-ss", "1", "-i", r["media"], "-frames:v", "1"]
        ok = subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-y", *ff, "-vf", vf, out], capture_output=True).returncode == 0
        if not (ok and os.path.exists(out)):
            subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-y", "-f", "lavfi", "-i", "color=c=#dddddd:s=240x240",
                            "-frames:v", "1", "-vf", label % r["n"], out], capture_output=True)   # keep numbering intact
    with concurrent.futures.ThreadPoolExecutor(8) as pool:
        list(pool.map(one, rows))
    for k, start in enumerate(range(1, len(rows) + 1, per), 1):
        count = min(per, len(rows) - start + 1)
        # image2's -start_number is unreliable here, so each sheet gets its own dir numbered from 1
        part = os.path.join(tmp, f"sheet{k:02d}")
        shutil.rmtree(part, ignore_errors=True)
        os.makedirs(part)
        for j in range(count):
            shutil.copy(os.path.join(tmp, f"{start + j:04d}.png"), os.path.join(part, f"{j + 1:04d}.png"))
        out = os.path.join(out_dir, f"{slug}-{k:02d}.png")
        subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-y", "-i", os.path.join(part, "%04d.png"), "-frames:v", "1",
                        "-vf", f"tile=6x{-(-count // 6)}:padding=4:color=white", out], check=True)
        print(json.dumps({"sheet": out, "tiles": f"{start}-{start + count - 1}"}))

def pin(url):
    h = fetch(url).decode("utf-8", "replace")
    # two layouts seen: videos/iht/expMp4/../<md5>_720w.mp4 and videos/mc/720p/../<md5>.mp4
    vids = sorted(set(re.findall(r"https://v1\.pinimg\.com/videos/[^\"\\ ]+?\.mp4", h)),
                  key=lambda u: ("720" not in u, u))
    imgs = [u for u in dict.fromkeys(re.findall(r"https://i\.pinimg\.com/originals/[0-9a-f/]+\.(?:gif|jpg|png|webp)", h))
            if "d53b014d86a6b6761bf649a0ed813c2b" not in u]          # site chrome, not the pin
    og = re.search(r'<meta[^>]*og:image"[^>]*>', h)
    og = og and re.search(r'content="([^"]+)"', og.group(0))
    link = [l for l in re.findall(r'"link":"(https?:[^"]+)"', h) if "pinterest." not in l]
    title = re.search(r'<meta[^>]*og:title"[^>]*>', h)
    title = title and re.search(r'content="([^"]*)"', title.group(0))
    gifs = [u for u in imgs if u.endswith(".gif")]
    media = (vids or gifs or imgs or [og and og.group(1)])[0]
    source = json.loads(f'"{link[0]}"') if link else None
    # a still pin that links to youtube / instagram / vimeo is a video embed: the motion is at `source`
    embed = not (vids or gifs) and bool(source and re.search(r"youtu|vimeo|tiktok|instagram\.com/reels?/", source))
    if not (media or title):
        return print(json.dumps({"site": "pinterest", "page": url, "dead": True}))   # removed or private pin
    print(json.dumps({"site": "pinterest", "page": url, "title": title and html.unescape(title.group(1)),
                      "media": media, "moving": bool(vids or gifs), "embed": embed, "source": source}))

MAGIC = [(b"\x89PNG", "png"), (b"\xff\xd8\xff", "jpg"), (b"GIF8", "gif"), (b"glTF", "glb"),
         (b"\x1a\x45\xdf\xa3", "webm"), (b"%PDF", "pdf")]
SAME = {"jpeg": "jpg", "mov": "mp4", "m4v": "mp4"}

def real_ext(data):
    if data[:4] == b"RIFF" and data[8:12] == b"WEBP":
        return "webp"
    if data[4:8] == b"ftyp":
        return "mp4"
    return next((ext for magic, ext in MAGIC if data.startswith(magic)), None)

def get(url, out):
    data = fetch(url, 60)
    # CDNs serve pngs under .jpg urls and webp under .png: name the file for what it is
    base, ext = os.path.splitext(out)
    real = real_ext(data)
    if real and SAME.get(ext[1:].lower(), ext[1:].lower()) != real:
        out = f"{base}.{real}"
    os.makedirs(os.path.dirname(out) or ".", exist_ok=True)
    open(out, "wb").write(data)
    print(json.dumps({"saved": out, "from": url, **({"type": real} if real else {})}))

OBJAVERSE = "https://huggingface.co/datasets/allenai/objaverse/resolve/main/"

def objaverse_paths():
    # allenai/objaverse mirrors ~800k CC-licensed Sketchfab models (2022 snapshot) under the same uid;
    # the uid -> glb path map is 20 MB, cached once
    cache = os.path.expanduser("~/.cache/find_refs/objaverse-paths.json.gz")
    if not os.path.exists(cache):
        os.makedirs(os.path.dirname(cache), exist_ok=True)
        subprocess.run(["curl", "-sfL", "-m", "300", "-o", cache, OBJAVERSE + "object-paths.json.gz"], check=True)
    return json.load(gzip.open(cache))

def sketchfab(query, out_dir, n=9, max_faces=300000):
    q = urllib.parse.urlencode({"type": "models", "q": query, "downloadable": "true", "count": 24,
                                "max_face_count": max_faces, "sort_by": "-likeCount"})
    rows = json.loads(fetch(f"https://api.sketchfab.com/v3/search?{q}"))["results"][:n]
    os.makedirs(out_dir, exist_ok=True)
    mirror = objaverse_paths()
    for i, r in enumerate(rows, 1):
        glb = (r.get("archives") or {}).get("glb") or {}
        thumb = max(r["thumbnails"]["images"], key=lambda t: t["width"] if t["width"] <= 1024 else 0)["url"]
        open(os.path.join(out_dir, f"sf{i:02d}.jpg"), "wb").write(fetch(thumb))
        print(json.dumps({"site": "sketchfab", "n": i, "uid": r["uid"], "name": r["name"],
                          "author": r["user"]["username"], "license": (r.get("license") or {}).get("label"),
                          "faces": r.get("faceCount"), "animations": r.get("animationCount"),
                          "glb_mb": round(glb.get("size", 0) / 2**20, 1), "textures": glb.get("textureCount"),
                          "tex_max": glb.get("textureMaxResolution"), "free_download": r["uid"] in mirror,
                          "page": f"https://sketchfab.com/3d-models/{r['uid']}"}))
    if rows:   # one tile per result, 3 across, numbered row-major to match "n"
        subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-y", "-i", os.path.join(out_dir, "sf%02d.jpg"), "-vf",
                        "scale=480:270:force_original_aspect_ratio=decrease,pad=480:270:-1:-1:white,"
                        f"tile=3x{-(-len(rows) // 3)}:padding=4:color=white", "-frames:v", "1",
                        os.path.join(out_dir, "sketchfab-sheet.png")], check=True)

def sketchfab_get(uid, out):
    page = f"https://sketchfab.com/3d-models/{uid}"
    path = objaverse_paths().get(uid)
    if path:
        subprocess.run(["curl", "-sfL", "-m", "300", "-o", out, OBJAVERSE + path], check=True)
        return print(json.dumps({"saved": out, "uid": uid, "page": page, "via": "objaverse"}))
    token = os.environ.get("SKETCHFAB_TOKEN")
    if not token:
        return print(json.dumps({"needs": "SKETCHFAB_TOKEN", "download_by_hand": page, "save_to": out}))
    d = json.loads(subprocess.run(["curl", "-sf", "-m", "30", "-H", f"Authorization: Token {token}",
                                   f"https://api.sketchfab.com/v3/models/{uid}/download"],
                                  capture_output=True, check=True).stdout)
    url = (d.get("glb") or d.get("gltf"))["url"]          # signed, expires in minutes
    subprocess.run(["curl", "-sfL", "-m", "300", "-o", out, url], check=True)
    print(json.dumps({"saved": out, "uid": uid, "page": page, "via": "sketchfab",
                      "format": "glb" if d.get("glb") else "gltf zip"}))

def sheet(src, out, frames=9):
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", src],
                               capture_output=True, text=True, stdin=subprocess.DEVNULL).stdout.strip() or 0)
    fps = frames / dur if dur > 0 else 1
    cols = math.ceil(math.sqrt(frames))
    os.makedirs(os.path.dirname(out) or ".", exist_ok=True)
    subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-y", "-i", src, "-vf",
                    f"fps={fps:.4f},scale=480:-2,tile={cols}x{-(-frames // cols)}:padding=4:color=white",
                    "-frames:v", "1", out], check=True)
    print(json.dumps({"sheet": out, "duration_s": round(dur, 2),
                      "frames_at_s": [round(i * dur / frames, 2) for i in range(frames)]}))

if __name__ == "__main__":
    cmd, args = (sys.argv[1:2] or ["help"])[0], sys.argv[2:]
    if cmd == "channels": channels(args[0], int(args[1]) if len(args) > 1 else 12)
    elif cmd == "search": search(args[0], args[1] if len(args) > 1 else None, int(args[2]) if len(args) > 2 else 2,
                                 args[3] if len(args) > 3 else "all")
    elif cmd == "user-channels": user_channels(args[0])
    elif cmd == "connections": connections(args[0], int(args[1]) if len(args) > 1 else 12)
    elif cmd == "umbrella": umbrella(args[0], args[1] if len(args) > 1 else None)
    elif cmd == "channel": channel(args[0], args[1] if len(args) > 1 else None, int(args[2]) if len(args) > 2 else 48,
                                   args[3] if len(args) > 3 else "all", args[4] if len(args) > 4 else None)
    elif cmd == "pin": [pin(u) for u in args]
    elif cmd == "get": get(args[0], args[1])
    elif cmd == "sheet": sheet(args[0], args[1], int(args[2]) if len(args) > 2 else 9)
    elif cmd == "sketchfab": sketchfab(args[0], args[1], *map(int, args[2:4]))
    elif cmd == "sketchfab-get": sketchfab_get(args[0], args[1])
    else: sys.exit(__doc__)
