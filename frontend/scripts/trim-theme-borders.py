"""Even out the black border on the theme cards in ``frontend/public/themes/``.

``build-theme-images.py`` crops each card to its own frame, and those frames are
drawn between 2 and 6 pixels thick. This shaves each side down until its border
is ``TARGET_WIDTH``. A side already thinner than the target is left alone — a
border can be cut down but not painted back on.

Run it after ``build-theme-images.py`` and before ``resize-theme-images.py``.
Sides already at the target are skipped, so re-running is a no-op.

    cd frontend/scripts
    python3 -m venv .venv && ./.venv/bin/pip install pillow requests
    ./.venv/bin/python trim-theme-borders.py
"""

from pathlib import Path

from PIL import Image, ImageDraw

TARGET_WIDTH = 3

# How far in to look for the end of the border, and the corner rounding to
# re-apply afterwards (matches CORNER_RADIUS in build-theme-images.py).
PROFILE_DEPTH = 40
CORNER_RADIUS = 0.01

SIDES = ("top", "bottom", "left", "right")
THEMES_DIR = Path(__file__).parent.parent / "public" / "themes"


def edge_profile(image, side):
    """Mean luminance of each line, walking inward from ``side``."""
    width, height = image.size
    pixels = image.load()

    if side in ("left", "right"):
        span = range(int(height * 0.2), int(height * 0.8))
    else:
        span = range(int(width * 0.2), int(width * 0.8))

    lines = {
        "top": lambda i: [(x, i) for x in span],
        "bottom": lambda i: [(x, height - 1 - i) for x in span],
        "left": lambda i: [(i, y) for y in span],
        "right": lambda i: [(width - 1 - i, y) for y in span],
    }[side]

    return [
        sum(sum(pixels[x, y][:3]) / 3 for x, y in lines(i)) / len(span)
        for i in range(PROFILE_DEPTH)
    ]


def border_width(image, side):
    """How many pixels of black border sit on ``side``.

    Thresholding on darkness alone doesn't work — decisions has a night sky
    just inside its frame that is nearly as dark as the frame itself. So we
    measure against the artwork's own brightness instead: the border ends where
    the profile crosses the midpoint between the darkest edge pixel and the
    plateau further in.
    """
    profile = edge_profile(image, side)

    darkest = min(profile[:8])
    inside = sorted(profile[12:])
    plateau = inside[len(inside) // 2]
    if plateau <= darkest:
        return 0
    threshold = darkest + (plateau - darkest) / 2

    start = next((i for i, value in enumerate(profile) if value < threshold), 0)
    end = next((i for i in range(start, len(profile)) if profile[i] > threshold), start)
    return end - start


def round_corners(image):
    width, height = image.size
    mask = Image.new("L", (width, height), 0)
    ImageDraw.Draw(mask).rounded_rectangle(
        (0, 0, width - 1, height - 1), radius=round(width * CORNER_RADIUS), fill=255
    )
    image.putalpha(mask)
    return image


def main():
    print(f"{'theme':16}{'before':12}{'border T/B/L/R':>16}{'trim':>14}{'after':>12}")
    for path in sorted(THEMES_DIR.glob("*.webp")):
        image = Image.open(path).convert("RGBA")
        width, height = image.size

        borders = {side: border_width(image, side) for side in SIDES}
        trim = {side: max(0, borders[side] - TARGET_WIDTH) for side in SIDES}

        if not any(trim.values()):
            print(
                f"{path.stem:16}{f'{width}x{height}':12}"
                f"{'/'.join(str(borders[s]) for s in SIDES):>16}"
                f"{'nothing to trim':>28}"
            )
            continue

        cropped = image.crop(
            (
                trim["left"],
                trim["top"],
                width - trim["right"],
                height - trim["bottom"],
            )
        )
        round_corners(cropped).save(path, "WEBP", quality=88, method=6)

        print(
            f"{path.stem:16}{f'{width}x{height}':12}"
            f"{'/'.join(str(borders[s]) for s in SIDES):>16}"
            f"{'/'.join(str(trim[s]) for s in SIDES):>14}"
            f"{f'{cropped.width}x{cropped.height}':>12}"
        )


if __name__ == "__main__":
    main()
