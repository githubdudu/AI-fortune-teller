"""Download the theme artwork from S3, crop it down to the card's black frame
and write it to ``frontend/public/themes/``.

Each source picture is a tarot card sitting on a cream mat. We locate the dark
rounded-rect border and cut the mat away, then round the output's own corners
with an alpha mask so the card doesn't read as a rectangle.

Cropping only — the aspect ratio of each source image is left alone and nothing
is rescaled. Adjust ``EXTRA_CROP`` and re-run when a picture needs to be framed
tighter.

    cd frontend/scripts
    python3 -m venv .venv && ./.venv/bin/pip install pillow requests
    ./.venv/bin/python build-theme-images.py
"""

from pathlib import Path

import requests
from PIL import Image, ImageDraw

S3_BASE = "https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Theme/"

# Keys must match Theme.Name in backend/Api/Data/DbInitializer.cs and the
# hardcodedThemes fallback in ThemeView.jsx.
SOURCES = {
    "general": "5.%20General.jpg",
    "love": "5.%20Love.jpg",
    "finance": "5.%20Finance.jpg",
    "career": "5.%20Career.jpg",
    "relationships": "5.+Relationship.jpg",
    "health": "5.%20Health.jpg",
    "decisions": "5.+Decision.jpg",
    "travel": "5.%20Travel.jpg",
}

# A pixel counts as frame when its mean channel falls below this, and a
# row/column counts as the frame's edge once this fraction of it is dark.
FRAME_DARKNESS = 110
FRAME_COVERAGE = 0.5

# Which dark band to crop to, counting inward from each edge. 1 is the
# outermost frame; bump a side to 2 when the card is drawn with a double border
# and the inner one is the real edge.
FRAME_CHOICE = {
    "relationships": {"left": 2, "right": 2, "top": 2, "bottom": 2},
    "career": {"bottom": 2},
}

# Corner rounding of the output, as a fraction of the cropped width.
CORNER_RADIUS = 0.01

# Cropped off after the frame is found, as a fraction of the current size:
# (left, right, top, bottom).
EXTRA_CROP = {}

SCRIPT_DIR = Path(__file__).parent
CACHE_DIR = SCRIPT_DIR / ".cache"
OUTPUT_DIR = SCRIPT_DIR.parent / "public" / "themes"


def download(name, remote):
    cached = CACHE_DIR / f"{name}.jpg"
    if not cached.exists():
        response = requests.get(S3_BASE + remote, timeout=60)
        response.raise_for_status()
        cached.write_bytes(response.content)
    return cached


def nth_band_edge(coverages, indices, nth, fallback):
    """Walk ``indices`` inward and return the outer edge of the nth dark band.

    A band is a run of consecutive mostly-dark lines, so a double border shows
    up as two bands and ``nth=2`` lands on the inner one.
    """
    seen = 0
    in_band = False
    for i in indices:
        dark = coverages[i] > FRAME_COVERAGE
        if dark and not in_band:
            seen += 1
            if seen == nth:
                return i
        in_band = dark
    return fallback


def frame_box(image, choice):
    """Bounding box of the card's dark border.

    Artwork inside the card never spans a whole row densely enough to be
    mistaken for the frame, so scanning inward from each edge finds it.
    """
    width, height = image.size
    pixels = image.load()

    def is_dark(pixel):
        return sum(pixel) / 3 < FRAME_DARKNESS

    rows = [
        sum(is_dark(pixels[x, y]) for x in range(width)) / width for y in range(height)
    ]
    cols = [
        sum(is_dark(pixels[x, y]) for y in range(height)) / height for x in range(width)
    ]

    top = nth_band_edge(rows, range(height), choice.get("top", 1), 0)
    bottom = nth_band_edge(
        rows, range(height - 1, -1, -1), choice.get("bottom", 1), height - 1
    )
    left = nth_band_edge(cols, range(width), choice.get("left", 1), 0)
    right = nth_band_edge(
        cols, range(width - 1, -1, -1), choice.get("right", 1), width - 1
    )

    return left, top, right + 1, bottom + 1


def apply_extra_crop(image, name):
    fractions = EXTRA_CROP.get(name)
    if not fractions:
        return image

    left_pct, right_pct, top_pct, bottom_pct = fractions
    width, height = image.size
    return image.crop(
        (
            round(width * left_pct),
            round(height * top_pct),
            width - round(width * right_pct),
            height - round(height * bottom_pct),
        )
    )


def round_corners(image):
    """Punch the corners out with an alpha mask following the frame's radius."""
    width, height = image.size
    radius = round(width * CORNER_RADIUS)

    mask = Image.new("L", (width, height), 0)
    ImageDraw.Draw(mask).rounded_rectangle(
        (0, 0, width - 1, height - 1), radius=radius, fill=255
    )

    rounded = image.convert("RGBA")
    rounded.putalpha(mask)
    return rounded


def main():
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    print(f"{'theme':16}{'source':12}{'framed':12}{'cropped':12}{'ratio':8}size")
    for name, remote in SOURCES.items():
        image = Image.open(download(name, remote)).convert("RGB")
        source_size = image.size

        image = image.crop(frame_box(image, FRAME_CHOICE.get(name, {})))
        framed_size = image.size

        image = apply_extra_crop(image, name)
        width, height = image.size

        destination = OUTPUT_DIR / f"{name}.webp"
        round_corners(image).save(destination, "WEBP", quality=88, method=6)

        kib = destination.stat().st_size / 1024
        print(
            f"{name:16}"
            f"{'x'.join(map(str, source_size)):12}"
            f"{'x'.join(map(str, framed_size)):12}"
            f"{f'{width}x{height}':12}"
            f"{width / height:<8.3f}"
            f"{kib:.1f} KiB"
        )


if __name__ == "__main__":
    main()
