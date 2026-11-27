#!/usr/bin/env python3
"""Check every skill against the rules in README.md ("Adding a skill").

Exit 1 when a rule fails. Run it from any directory:  python3 scripts/check-skills.py
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
NAME_RE = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*$")
RESERVED = ("claude", "anthropic")
MAX_NAME = 64
MAX_DESCRIPTION = 1024
MAX_LINES = 200
TOC_LINES = 100

errors: list[str] = []


def fail(path: Path, message: str) -> None:
    errors.append(f"{path.relative_to(ROOT)}: {message}")


def frontmatter(text: str) -> dict[str, str] | None:
    match = re.match(r"^---\n(.*?)\n---\n", text, re.S)
    if not match:
        return None
    fields: dict[str, str] = {}
    key = ""
    for line in match.group(1).splitlines():
        if re.match(r"^[A-Za-z][\w-]*:", line):
            key, _, value = line.partition(":")
            key = key.strip()
            fields[key] = "" if value.strip() in (">", "|", ">-", "|-") else value.strip()
        elif key and line.startswith(" "):
            fields[key] = (fields[key] + " " + line.strip()).strip()
    return fields


skills = sorted((ROOT / "skills").glob("*/*/SKILL.md"))
names: dict[str, Path] = {}
for skill in skills:
    folder = skill.parent
    text = skill.read_text()
    fields = frontmatter(text)
    if fields is None:
        fail(skill, "missing YAML frontmatter")
        continue
    name = fields.get("name", "").strip("\"'")
    if name != folder.name:
        fail(skill, f"name '{name}' must equal the folder '{folder.name}'")
    if not NAME_RE.match(name) or len(name) > MAX_NAME:
        fail(skill, "name must be lowercase letters, digits and single hyphens, up to 64 characters")
    if any(word in name for word in RESERVED):
        fail(skill, "name must not contain a reserved word")
    if name in names:
        fail(skill, f"duplicate name, also at {names[name].relative_to(ROOT)}")
    names[name] = skill
    description = fields.get("description", "")
    if not description:
        fail(skill, "missing description")
    if len(description) > MAX_DESCRIPTION:
        fail(skill, f"description has {len(description)} characters, the limit is {MAX_DESCRIPTION}")
    if "<" in description or ">" in description:
        fail(skill, "description must not contain angle brackets")
    lines = len(text.splitlines())
    if lines > MAX_LINES:
        fail(skill, f"SKILL.md has {lines} lines, the limit is {MAX_LINES}; move detail to a sibling file")
    for reference in folder.glob("*.md"):
        if reference.name == "SKILL.md":
            continue
        body = reference.read_text()
        if len(body.splitlines()) > TOC_LINES and not re.search(r"^#+ .*contents", body, re.I | re.M):
            fail(reference, f"over {TOC_LINES} lines and no contents list")
    prose = re.sub(r"```.*?```", "", text, flags=re.S)
    prose = re.sub(r"`[^`\n]+`", "", prose)
    for target in re.findall(r"\]\((?!https?:|#|mailto:)([^)#\s]+)", prose):
        if not (folder / target).resolve().exists():
            fail(skill, f"broken link: {target}")

plugin = json.loads((ROOT / ".claude-plugin" / "plugin.json").read_text())
listed = {entry.removeprefix("./") for entry in plugin["skills"]}
actual = {str(s.parent.relative_to(ROOT)) for s in skills}
for missing in sorted(actual - listed):
    errors.append(f".claude-plugin/plugin.json: {missing} is not listed")
for stale in sorted(listed - actual):
    errors.append(f".claude-plugin/plugin.json: {stale} has no SKILL.md")
if plugin["skills"] != sorted(plugin["skills"]):
    errors.append(".claude-plugin/plugin.json: skills must be sorted")

readme = (ROOT / "README.md").read_text()
for name, skill in names.items():
    if f"skills/{skill.parent.parent.name}/{name}/SKILL.md" not in readme:
        errors.append(f"README.md: no row for {name}")

if errors:
    print("\n".join(errors))
    print(f"\n{len(errors)} problem(s) in {len(skills)} skills")
    sys.exit(1)
print(f"{len(skills)} skills pass")
