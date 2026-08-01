"""Stretch the cropped theme cards in ``frontend/public/themes/`` to one size.

The cards come off ``build-theme-images.py`` with aspect ratios between 0.511
and 0.576, because each one is cropped to its own black frame. This squashes
and stretches them along x and y independently until they all match
``OUTPUT_SIZE`` — no cropping, so nothing is lost, but the artwork is distorted
a little.

Files already at ``OUTPUT_SIZE`` are skipped, so re-running is free and never
compounds the resampling. Re-run ``build-theme-images.py`` to get the original
crops back.

    cd frontend/scripts
    python3 -m venv .venv && ./.venv/bin/pip install pillow requests
    ./.venv/bin/python resize-theme-images.py
"""

from pathlib import Path

from PIL import Image

# 9:16. Its 0.5625 sits in the middle of the eight cropped ratios, so no card
# stretches more than ~10%, and both axes clear the largest crop (431x762) so
# nothing is scaled down.
OUTPUT_SIZE = (432, 768)

THEMES_DIR = Path(__file__).parent.parent / "public" / "themes"


def main():
    target_width, target_height = OUTPUT_SIZE
    target_ratio = target_width / target_height

    print(f"{'theme':16}{'before':12}{'ratio':9}{'x':>9}{'y':>9}{'':4}{'file':>10}")
    for path in sorted(THEMES_DIR.glob("*.webp")):
        image = Image.open(path)
        width, height = image.size

        if (width, height) == OUTPUT_SIZE:
            print(f"{path.stem:16}{f'{width}x{height}':12}already at target size")
            continue

        image.convert("RGBA").resize(OUTPUT_SIZE, Image.LANCZOS).save(
            path, "WEBP", quality=88, method=6
        )

        kib = path.stat().st_size / 1024
        print(
            f"{path.stem:16}"
            f"{f'{width}x{height}':12}"
            f"{width / height:<9.3f}"
            f"{target_width / width - 1:+9.1%}"
            f"{target_height / height - 1:+9.1%}"
            f"{'':4}"
            f"{kib:6.1f} KiB"
        )

    print(f"\nall cards now {target_width}x{target_height} (ratio {target_ratio:.4f})")


if __name__ == "__main__":
    main()
