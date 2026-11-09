"""Repaint the six section illustrations from the retired forest palette to
the FrontDoor navy/sky palette.

The artwork is flat illustration with two colour families that must be treated
differently, so a blanket hue rotation is wrong:

  - greens  (hue ~100..180, the Kenzie forest)  -> navy/blue/sky
  - creams  (hue ~40..55, very low saturation)  -> left exactly alone, they are
    the canvas and already match --canvas #F7F4EE
  - skin, hair, wood, the tan path (hue ~15..50 with real saturation) -> left
    alone, these are not brand colours

Within the greens the output hue is picked from the pixel's own brightness, so
the deep forest lands on navy #112746 and the pale sage lands near sky #52BEEB.
That reproduces the brand's own navy-to-sky ramp instead of flattening every
green onto one blue.

Usage: python3 recolour.py <outdir> [strength]
  strength 1.0 = full repaint. Lower keeps some of the original hue.
"""
import sys, os, colorsys
import numpy as np
from PIL import Image, ImageFilter

SRC = "assets/img"
NAMES = ["mission-path", "how-steps", "features-handoff",
         "faq-conversation", "designs-wall", "start-door"]

# The green band to repaint, in degrees. A hue histogram over all six images
# shows 51% of the saturated pixels sitting at 40..50 (the cream canvas and the
# tan path, which must not move) and then a continuous green ramp from 60 to
# 160 with nothing above it. There is no empty gap between the two families, so
# the low edge is a judgement call: 58 keeps the warm mass out and takes the
# olive-sage the garments are drawn in, which samples at hue 87.
G_LO, G_HI = 58.0, 185.0
# The feather has to be NARROW. Every in-band pixel is being moved to ~200, so
# a pixel left half way lands at ~160, which is teal and is not in the palette.
# A wide ramp put the coat on teal. Keep it tight so pixels are in or out.
RAMP = 7.0
# Same reasoning for the saturation floor: the cream is already excluded by hue,
# so this only needs to drop out true greys, and it should do that quickly.
S_LO, S_RAMP_HI = 0.05, 0.09

# Per-image overrides. One global rule cannot serve every image here.
#
# how-steps: the palest of the four steps is a two-tone surface, warm cream at
# value 0.82 plus sage at hue 63, and a boundary at 58 splits it down the
# middle, so half the step turned blue and half stayed yellow and it came out
# speckled. Taking the whole step means reaching down to hue 40, which would
# also catch the cream canvas, so the canvas is excluded by brightness instead:
# it sits at value 0.97 and the step at 0.84. This only works because this
# image has no tan path to protect. mission-path's path is hue 40..50 at value
# 0.6..0.85 and would be destroyed by the same rule, which is why it is not
# global.
OVERRIDES = {
    "how-steps": {"G_LO": 40.0, "V_MAX": 0.90, "RAMP": 4.0},
}
# Hue to land on, by brightness: dark -> navy, light -> sky.
H_DARK, H_LIGHT = 212.0, 197.0
# Saturation gain. The brand navy (0.76) is more saturated than the forest it
# replaces (0.56), so a straight hue swap reads washed out and grey.
S_GAIN = 1.22
S_CAP = 0.86


def _hsv(a):
    """h in degrees, s and v in 0..1, from an HxWx3 float array."""
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    mx = a.max(axis=2)
    mn = a.min(axis=2)
    v = mx
    d = mx - mn
    s = np.where(mx > 0, d / np.maximum(mx, 1e-6), 0.0)
    h = np.zeros_like(mx)
    nz = d > 1e-6
    rm = nz & (mx == r)
    gm = nz & (mx == g) & ~rm
    bm = nz & (mx == b) & ~rm & ~gm
    h[rm] = (60.0 * ((g[rm] - b[rm]) / d[rm]) + 360.0) % 360.0
    h[gm] = 60.0 * ((b[gm] - r[gm]) / d[gm]) + 120.0
    h[bm] = 60.0 * ((r[bm] - g[bm]) / d[bm]) + 240.0
    return h, s, v


def recolour(path, strength, over=None):
    over = over or {}
    g_lo = over.get("G_LO", G_LO)
    g_hi = over.get("G_HI", G_HI)
    ramp = over.get("RAMP", RAMP)
    v_max = over.get("V_MAX")
    im = Image.open(path).convert("RGB")
    a = np.asarray(im).astype(np.float32) / 255.0

    # Decide WHAT to repaint from a blurred copy, not from the raw pixels.
    # The sources are JPEGs, so the big flat pastel areas carry chroma noise,
    # and on the pale step in how-steps that noise straddles the hue boundary:
    # neighbouring pixels land on opposite sides of it and the step comes out
    # speckled blue and mint. Judging the colour over a small neighbourhood
    # matches what the flat artwork actually means. The new hue is still
    # applied to each original pixel using its own brightness, so nothing in
    # the luminance detail is blurred.
    blur = np.asarray(im.filter(ImageFilter.GaussianBlur(3))).astype(np.float32) / 255.0
    h_d, s_d, _ = _hsv(blur)
    h, s, v = _hsv(a)

    # Which pixels are the forest palette. The saturation floor keeps the near
    # neutral creams and paper greys out: they read as faintly green but
    # repainting them tints the whole canvas blue.
    # h_d / s_d (the blurred copy) decide membership, so the decision is made
    # on the local average colour rather than on per-pixel JPEG chroma noise.
    mask = (h_d >= g_lo) & (h_d <= g_hi) & (s_d > S_LO)
    if v_max is not None:
        # Brightness ceiling, used where the hue band has to reach down into
        # the warm range to take a whole surface: it keeps the bright cream
        # canvas out. Judged on the blurred copy for the same reason the hue is.
        _, _, v_d = _hsv(blur)
        mask &= v_d < v_max

    # Feather the edges of the band so there is no hard seam where a blended
    # pixel sits just outside it.
    w = np.ones_like(h_d)
    lo_edge = (h_d >= g_lo) & (h_d < g_lo + ramp)
    hi_edge = (h_d <= g_hi) & (h_d > g_hi - ramp)
    w[lo_edge] = (h_d[lo_edge] - g_lo) / ramp
    w[hi_edge] = (g_hi - h_d[hi_edge]) / ramp
    # and feather on saturation too
    sat_ramp = (s_d > S_LO) & (s_d < S_RAMP_HI)
    w[sat_ramp] *= (s_d[sat_ramp] - S_LO) / (S_RAMP_HI - S_LO)
    w = np.clip(w, 0.0, 1.0) * strength
    w = np.where(mask, w, 0.0)

    # Target hue from brightness. v is already 0..1.
    vt = np.clip((v - 0.12) / 0.78, 0.0, 1.0)
    h_target = H_DARK + (H_LIGHT - H_DARK) * vt

    # Interpolate the hue the short way round the wheel.
    diff = ((h_target - h + 540.0) % 360.0) - 180.0
    h_out = (h + diff * w) % 360.0
    s_out = np.clip(s * (1.0 + (S_GAIN - 1.0) * w), 0.0, 1.0)
    s_out = np.where(w > 0, np.minimum(s_out, S_CAP), s_out)

    # HSV -> RGB, vectorised.
    i = np.floor(h_out / 60.0)
    f = h_out / 60.0 - i
    p = v * (1.0 - s_out)
    q = v * (1.0 - s_out * f)
    t = v * (1.0 - s_out * (1.0 - f))
    i = (i % 6).astype(np.int32)
    out = np.empty_like(a)
    for idx, (rr, gg, bb) in enumerate([(v, t, p), (q, v, p), (p, v, t),
                                        (p, q, v), (t, p, v), (v, p, q)]):
        m = i == idx
        out[..., 0][m] = rr[m]
        out[..., 1][m] = gg[m]
        out[..., 2][m] = bb[m]

    touched = float((w > 0.02).mean())
    return Image.fromarray((np.clip(out, 0, 1) * 255).round().astype(np.uint8)), touched


def main():
    outdir = sys.argv[1]
    strength = float(sys.argv[2]) if len(sys.argv) > 2 else 1.0
    os.makedirs(outdir, exist_ok=True)
    for n in NAMES:
        src = os.path.join(SRC, n + ".jpg")
        im, touched = recolour(src, strength, OVERRIDES.get(n))
        dst = os.path.join(outdir, n + ".jpg")
        # subsampling=0 is 4:4:4, no chroma subsampling. The default 4:2:0
        # halves the colour resolution, and on these big flat pastel areas a
        # small chroma error swings the hue a long way because the saturation
        # is low: it put a teal mottle across the pale steps, measured at hue
        # 183 where the pixel was exactly 198 in memory. The extra bytes are
        # worth it on six images.
        im.save(dst, "JPEG", quality=88, optimize=True, progressive=True,
                subsampling=0)
        before = os.path.getsize(src) // 1024
        after = os.path.getsize(dst) // 1024
        print(f"{n:19s} repainted {touched*100:5.1f}% of pixels   "
              f"{before}KB -> {after}KB")


if __name__ == "__main__":
    main()
