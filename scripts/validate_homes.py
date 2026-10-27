from pathlib import Path
import json
import sys

DATA_FILE = (
    Path(__file__).resolve().parents[1]
    / "src"
    / "assets"
    / "homes.json"
)


def validate_homes():
    homes = json.loads(DATA_FILE.read_text())

    if not isinstance(homes, list):
        raise ValueError("Homes data must be a list")

    seen_ids = set()

    for home in homes:
        required_fields = [
            "id",
            "title",
            "type",
            "location",
            "monthlyRent",
            "bedrooms",
        ]

        for field in required_fields:
            if field not in home:
                raise ValueError(
                    f"Home is missing required field: {field}"
                )

        if home["id"] in seen_ids:
            raise ValueError(
                f"Duplicate home ID: {home['id']}"
            )

        seen_ids.add(home["id"])

        if not isinstance(home["monthlyRent"], (int, float)) \
                or isinstance(home["monthlyRent"], bool) \
                or home["monthlyRent"] <= 0:
            raise ValueError(
                f"Invalid rent for home {home['id']}"
            )

    print(f"PASS: Validated {len(homes)} rental properties")


if __name__ == "__main__":
    try:
        validate_homes()
    except (ValueError, OSError, json.JSONDecodeError) as error:
        print(f"FAIL: {error}", file=sys.stderr)
        sys.exit(1)