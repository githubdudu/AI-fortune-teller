"""Repaint the cloud backdrop into the Sugar Crystal palette.

``Background_Cloud.png`` was drawn for the old ``--color-figma-*`` board: mint
(~H 180deg) through lemon (~H 90deg) to peach (~H 40deg). Sugar Crystal lives
at H 310deg, whose complement is exactly that yellow-green, so the old artwork
fights every surface on the page.

Rather than rotate the hue — which would only move the three source hues
somewhere else, keeping their spread — this throws the source hues away
entirely: the picture is reduced to luminance and that luminance is remapped
onto the palette's own ladder. The cloud *shape* survives, the colour is
palette-correct by construction.

Idempotent: it always reads the PNG and overwrites the WebP, so tune the
constants below and re-run as often as you like.

    cd frontend/scripts
    python3 -m venv .venv && ./.venv/bin/pip install pillow
    ./.venv/bin/python recolor-background.py
"""

from pathlib import Path

from PIL import Image

# The gradient map, dark end first. These four hex values are the sRGB
# references for --color-spark / bloom / veil / bg in src/index.css; when the
# palette is retuned, both places have to move together.
#
# The stops are bunched toward the light end because that is where the cloud
# detail lives: highlights land on `bg` (the page's own ground, so the cloud
# dissolves into it) and the deep sky lands on `spark`.
STOPS = (
    (0.00, "#9E75BB"),  # spark  — deepest sky
    (0.45, "#DCC8ED"),  # bloom  — cloud shadow
    (0.75, "#EFE2F9"),  # veil   — cloud body
    (1.00, "#F9F5FD"),  # bg     — highlight, = page ground
)

# Percentiles the source luminance is stretched from. The source histogram is
# heavily bright-skewed (it is a pastel sky); mapping it raw would push almost
# every pixel into the veil-bg pair and the cloud form would vanish. Widen the
# gap to flatten the result, narrow it for more contrast.
STRETCH = (2.0, 99.5)

# Output width. The image is a full-bleed `cover` background, so it only ever
# needs to beat the widest common viewport, not the 6400px of the source.
OUTPUT_WIDTH = 2560
WEBP_QUALITY = 82

# The source lives outside public/ on purpose: everything under public/ is
# copied verbatim into the build, and shipping a 3.4 MiB PNG nobody requests
# would undo the point of the WebP.
SOURCE = Path(__file__).parent / "source" / "Background_Cloud.png"
OUTPUT = Path(__file__).parent.parent / "public" / "assets" / "background-cloud.webp"


def build_lut():
    """256 entries per channel, linearly interpolated between STOPS."""
    stops = [(pos, tuple(int(hex_[i : i + 2], 16) for i in (1, 3, 5))) for pos, hex_ in STOPS]

    channels = ([], [], [])
    for value in range(256):
        position = value / 255
        lower, upper = stops[0], stops[-1]
        for left, right in zip(stops, stops[1:]):
            if left[0] <= position <= right[0]:
                lower, upper = left, right
                break

        span = upper[0] - lower[0]
        t = 0.0 if span == 0 else (position - lower[0]) / span
        for channel in range(3):
            channels[channel].append(round(lower[1][channel] + t * (upper[1][channel] - lower[1][channel])))

    return channels[0] + channels[1] + channels[2]


def stretch_levels(gray):
    """Rescale so STRETCH[0]% of pixels sit at black and STRETCH[1]% at white."""
    histogram = gray.histogram()
    total = sum(histogram)

    def percentile(fraction):
        target = total * fraction / 100
        running = 0
        for value, count in enumerate(histogram):
            running += count
            if running >= target:
                return value
        return 255

    low, high = percentile(STRETCH[0]), percentile(STRETCH[1])
    if high <= low:
        return gray, (low, high)

    scale = 255 / (high - low)
    return gray.point(lambda v: min(255, max(0, round((v - low) * scale)))), (low, high)


def main():
    source = Image.open(SOURCE)
    print(f"source  {SOURCE.name}  {source.size[0]}x{source.size[1]}  "
          f"{SOURCE.stat().st_size / 1024 / 1024:.1f} MiB")

    gray = source.convert("L")
    gray, (low, high) = stretch_levels(gray)
    print(f"levels  stretched from {low}-{high} to 0-255")

    height = round(source.size[1] * OUTPUT_WIDTH / source.size[0])
    gray = gray.resize((OUTPUT_WIDTH, height), Image.LANCZOS)

    recoloured = gray.convert("RGB").point(build_lut())
    recoloured.save(OUTPUT, "WEBP", quality=WEBP_QUALITY, method=6)

    kib = OUTPUT.stat().st_size / 1024
    print(f"output  {OUTPUT.name}  {OUTPUT_WIDTH}x{height}  {kib:.1f} KiB")


if __name__ == "__main__":
    main()
