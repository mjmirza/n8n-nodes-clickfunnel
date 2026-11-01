#!/usr/bin/env python3
# Snapshots ClickFunnels request body schemas to tests/fixtures/clickfunnels-openapi-bodies.json.
# Usage: python3 scripts/snapshot-openapi-bodies.py [openapi.json], downloads the live spec without a path.
import json
import re
import sys
import urllib.request
from datetime import date
from pathlib import Path

SOURCE = "https://accounts.myclickfunnels.com/openapi.json"

if len(sys.argv) > 1:
    spec = json.loads(Path(sys.argv[1]).read_text())
else:
    with urllib.request.urlopen(SOURCE) as resp:  # noqa: S310 - fixed https URL
        spec = json.load(resp)


def resolve(node):
    while isinstance(node, dict) and "$ref" in node:
        target = spec
        for part in node["$ref"].split("/")[1:]:
            target = target[part]
        node = target
    return node


def describe(schema, depth=0):
    schema = resolve(schema)
    out = {"type": schema.get("type")}
    if "enum" in schema:
        out["enum"] = [v for v in schema["enum"] if v is not None]
    if depth < 3 and "properties" in schema:
        out["properties"] = {
            k: describe(v, depth + 1) for k, v in schema["properties"].items()
        }
        out["required"] = schema.get("required", [])
    items = schema.get("items")
    if depth < 3 and isinstance(items, dict):
        out["items"] = describe(items, depth + 1)
    return out


bodies = {}
filters = {}
for route, ops in spec["paths"].items():
    norm = re.sub(r"\{[^}]+\}", "{}", route)
    get = ops.get("get") if isinstance(ops.get("get"), dict) else {}
    for prm in get.get("parameters", []):
        prm = resolve(prm)
        if prm.get("name") == "filter":
            props = resolve(prm.get("schema", {})).get("properties", {})
            filters[f"GET {norm}"] = sorted(props)
    for method, op in ops.items():
        if method not in ("post", "put", "patch") or not isinstance(op, dict):
            continue
        content = (
            (op.get("requestBody") or {}).get("content", {}).get("application/json")
        )
        if content:
            bodies[f"{method.upper()} {norm}"] = describe(content["schema"])

out = {
    "source": SOURCE,
    "fetchedAt": date.today().isoformat(),
    "bodies": dict(sorted(bodies.items())),
    "filters": dict(sorted(filters.items())),
}
dest = (
    Path(__file__).resolve().parent.parent
    / "tests"
    / "fixtures"
    / "clickfunnels-openapi-bodies.json"
)
dest.write_text(json.dumps(out, indent="\t") + "\n")
print(f"{len(bodies)} request bodies written to {dest}")
