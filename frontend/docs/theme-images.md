# Theme card images issue

## What is the problem?
The original artwork for the eight theme cards is badly designed (gen by AI). 
The way of cropping them by CSS is effortless. Because all the images have black frames and the colored background around frames, and then some of the white edges. 
Neither the size nor the ratio of the original images are the same. 

## Solution: image processing by Python.
The three steps:

```bash
cd frontend/scripts
python3 -m venv .venv && ./.venv/bin/pip install pillow requests
./.venv/bin/python build-theme-images.py   # download, crop to the card's frame
./.venv/bin/python trim-theme-borders.py   # even every border out to 3px
./.venv/bin/python resize-theme-images.py  # stretch every card to 432x768
```

## Results 

The eight theme cards in `public/themes/` , which are generated from the original
artwork. 

# Process explained

## Step 1 — crop to the card's frame

Each source image is a tarot card sitting on a cream mat. `build-theme-images.py`
finds the card's black border and cuts the mat away, then applies a rounded
alpha mask so the output doesn't read as a rectangle. 

Some cards have a double border. Some cards have white border and some frames are not visible. All of these have to be taken account of.

### Technical details (CAN SKIP :-)

The border is detected by scanning inward from each edge for the first line that
is _mostly_ dark: a pixel counts as frame below `FRAME_DARKNESS` (110), and a
row or column counts as the frame once `FRAME_COVERAGE` (0.5) of it is dark.
Artwork inside the card never spans a whole line densely enough to be mistaken
for the frame.

| Constant         | Value     | Effect                                                       |
| ---------------- | --------- | ------------------------------------------------------------ |
| `FRAME_DARKNESS` | 110       | Mean channel below this counts as frame                      |
| `FRAME_COVERAGE` | 0.5       | Fraction of a line that must be dark                         |
| `FRAME_CHOICE`   | see below | Which dark band to crop to, per side                         |
| `CORNER_RADIUS`  | 0.01      | Corner rounding, as a fraction of width                      |
| `EXTRA_CROP`     | `{}`      | Manual per-card trim, `(left, right, top, bottom)` fractions |

`FRAME_CHOICE` counts bands inward from an edge, defaulting to 1 (the
outermost). Two cards need an override:

- **relationships** — all four sides use band 2. This card is drawn with a
  double border and the outer one sits flush against the image edge, so band 1
  would leave the outer frame in.
- **career** — the bottom uses band 2. The card's bottom edge is cut off in the
  source, so the first "band" from below is the image edge itself; band 2 is the
  real frame line.

One thing that looks like a bug but isn't: `nth_band_edge` returns the _outer
edge_ of a band, so how long the band runs never affects where the crop lands.
decisions has a night sky immediately inside its frame, which makes its top band
348px long — the crop is still correct.

## Step 2 — even out the borders

The frames are drawn between 2 and 6 pixels thick depending on the card.
`trim-theme-borders.py` shaves each side down until its border is
`TARGET_WIDTH` (3). 

The width of the border is not consistent across the cards. And it is even inconsistent within one line (we ignore this). Some borders are smaller than 3px, we ignore this too.

The rounded corner mask is re-applied after cropping.

### Technical details (CAN SKIP :-)

**Border width cannot be measured by a darkness threshold.** decisions has that
same night sky just inside its frame, at a luminance of roughly 25 against the
frame's 13 — a threshold scan walks straight past the border into the artwork
and reports 109px. So `border_width` measures against the artwork's own
brightness instead: it takes the darkest of the outer 8 lines and the median of
the lines from 12 inward (the artwork plateau), and calls the border finished
where the profile crosses the midpoint between them.

Five sides never reach 3px — the bottom of career, relationships and travel, and
the top and bottom of decisions, are only 2px. A border can be cut down but not
painted back on, so those are skipped. That is expected, not a failure.


## Step 3 — stretch to one size

Cropping each card to its own frame leaves the aspect ratios between 0.505 and
0.577. `resize-theme-images.py` stretches and squashes along x and y
independently until they all match `OUTPUT_SIZE`, which is `(432, 768)`.

That size was picked because:

- 432, 768 = 9:16 is a good ratio. 
- both axes clear the largest crop (430x761), so nothing is scaled down;

### Technical details (CAN SKIP :-)

Measured stretch, where x and y are absolute scale factors — the distortion you
actually see is the difference between them:

| Theme         | Before  | Ratio | x      | y      |
| ------------- | ------- | ----- | ------ | ------ |
| career        | 430x761 | 0.565 | +0.5%  | +0.9%  |
| decisions     | 422x732 | 0.577 | +2.4%  | +4.9%  |
| finance       | 417x750 | 0.556 | +3.6%  | +2.4%  |
| general       | 369x688 | 0.536 | +17.1% | +11.6% |
| health        | 376x745 | 0.505 | +14.9% | +3.1%  |
| love          | 411x756 | 0.544 | +5.1%  | +1.6%  |
| relationships | 420x757 | 0.555 | +2.9%  | +1.5%  |
| travel        | 404x760 | 0.532 | +6.9%  | +1.1%  |

health distorts the most, widening by about 11.8%; general is next at about
5.5%; everything else stays under 3%.

## Notes
Steps 2 and 3 are idempotent — they skip anything already at the target — so
re-running them is free. Step 1 always overwrites, which makes it the reset
point: run it again to get back to the raw crops. Source images are cached in
`scripts/.cache/`, so only the first run hits S3.

## Output

Eight files, `public/themes/<name>.webp`, all 432x768 RGBA, about 377 KiB total.

`ThemeCard.jsx` renders them in a `w-[135px] h-60` box: 240 × 0.5625 = 135, so
the box ratio matches the images exactly and `object-cover` crops nothing.
