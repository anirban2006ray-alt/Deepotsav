#!/usr/bin/env python3
"""Close-up fireworks through coloured smoke (29s) with a 'Happy Diwali' message in script lettering.
Usage: python3 render_smoke.py [out.mp4]   (needs audio.m4a beside it, and ../pyro.py)"""
import os, sys, math
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from pyro import *

W, H, FPS, DUR = 478, 850, 30, 29.08
OUT = sys.argv[1] if len(sys.argv) > 1 else "fireworks_smoke.mp4"
rng = np.random.default_rng(9)
P = Pyro(W, H, N=18000, trail=LONG, seed=9)
G = lambda *a: np.array(a, np.float32)

# ---------- smoke: three octaves of drifting noise, tinted by a colour timeline ----------
OCT = [rng.random((int(H / s), int(W / s))).astype(np.float32) for s in (110, 55, 28)]
KEYS = [(0, G(.75, .95, .95), G(.2, .35, .3), 1.0), (2.5, G(.3, .4, .4), G(.15, .22, .2), .55), (4.5, G(.12, .1, .08), G(.12, .14, .1), .3),
        (8, G(.2, .12, .05), G(.25, .15, .08), .4), (12, G(.5, .1, .08), G(.12, .2, .55), .55), (16, G(.3, .2, .08), G(.15, .1, .05), .35),
        (19.5, G(.15, .12, .2), G(.1, .2, .8), .5), (23, G(.1, .08, .06), G(.2, .12, .06), .3), (26, G(.12, .35, .12), G(.2, .6, .3), .6), (29.1, G(.12, .35, .12), G(.2, .6, .3), .5)]
def keyed(t):
    for (a, ta, ba, la), (b, tb, bb, lb) in zip(KEYS, KEYS[1:]):
        if a <= t <= b: k = ease((t - a) / (b - a)); return ta + (tb - ta) * k, ba + (bb - ba) * k, la + (lb - la) * k
    return KEYS[-1][1], KEYS[-1][2], KEYS[-1][3]
def smoke(t, lit):
    top, bot, lv = keyed(t); n = 0
    for i, o in enumerate(OCT):
        o = cv2.resize(np.roll(o, int(t * (1 + i)), axis=1), (W // 4, H // 4), interpolation=cv2.INTER_CUBIC); n = n + o * (.55 ** i)
    n = cv2.resize(cv2.GaussianBlur(n, (0, 0), 2), (W, H), interpolation=cv2.INTER_CUBIC); n = np.clip((n - n.min()) / (n.max() - n.min()), 0, 1) ** 1.15
    y = np.linspace(0, 1, H, dtype=np.float32)[:, None, None]
    return n[..., None] * (top * (1 - y) + bot * y) * lv * (1.3 + 3.2 * lit[..., None])

# ---------- show: (time, x, y, speed, count, palette, palette-after-cooling, life, gravity) ----------
GOLD, ORG, RED = [(1, .85, .5), (1, .7, .3), (1, .95, .75)], [(1, .45, .12), (.9, .3, .1)], [(1, .3, .15), (1, .55, .3)]
BURSTS = [(.2, .18, .12, .75, 900, [(1, 1, 1), (.7, 1, .95)], [(.3, .9, .8)], (1.6, 2.6), 20), (7.4, .3, .05, .45, 500, GOLD, ORG, (2.5, 3.5), 90),
          (9.0, .7, .08, .4, 400, GOLD, ORG, (2.5, 3.5), 90), (10.9, .5, .15, .62, 1000, [(1, .55, .25), (1, .35, .15)], RED, (2.4, 3.4), 40),
          (11.3, .2, .14, .12, 60, [(.3, .5, 1)], None, (1.5, 2), 20), (11.5, .85, .12, .12, 60, [(.3, .5, 1)], None, (1.5, 2), 20),
          (14.6, .5, .4, .95, 1500, GOLD, ORG, (3, 4.2), 45), (16.3, .35, .55, .6, 800, GOLD, ORG, (2.5, 3.5), 45), (18.2, .45, .3, .8, 1300, GOLD, ORG, (3, 4.2), 45),
          (19.8, .6, .2, .55, 700, [(1, .8, .5), (1, .6, .3)], ORG, (2.5, 3.5), 45), (21.9, .5, .22, .5, 800, [(1, .5, .2), (1, .35, .15)], RED, (2.4, 3.2), 25)]
for k in range(12):
    BURSTS.append((25.4 + k * .28, rng.uniform(.1, .9), rng.uniform(.05, .45), rng.uniform(.14, .25), 120, [(.4, 1, .5), (1, .3, .3)][k % 2:k % 2 + 1] * 2, None, (1.8, 2.6), 30))
STREAKS = [(3.7, 0, .75, .45, .1), (4.4, .1, .95, .55, .15), (5.2, .9, .8, .5, .25), (6.0, .2, .6, .85, .2), (6.6, .95, .9, .6, .3)]
done, FLASH = set(), []

def frame(t):
    dt = 1 / FPS
    for i, (te, x, y, v, n, pal, pal2, life, gr) in enumerate(BURSTS):
        if t >= te and i not in done:
            done.add(i); P.burst(x * W, y * H, v * W, n, pal, pal2, life=life, drag=.972, grav=gr, shell=.93); FLASH.append((te, x, y, pal[0], v))
    for te, x0, y0, x1, y1 in STREAKS:
        k = (t - te) / .55
        if 0 <= k < 1:
            x, y = (x0 + (x1 - x0) * k) * W, (y0 + (y1 - y0) * k) * H
            P.emit(np.tile([x, y], (6, 1)), np.stack([P.nr.uniform(-40, 40, 6), P.nr.uniform(-20, 60, 6)], 1), np.full(6, 1.1), (1, .85, .6), (1, .4, .1), .95, 60)
    P.step(dt); L = P.layer(t); g = glow(L * .8, 1.4, 3.0, 4.0, 3.0)
    for te, x, y, c, v in FLASH:
        a = t - te
        if 0 <= a < .7: g += blob((H, W, 3), x * W, y * H, 80 + 120 * v, c, (1 - a / .7) ** 2 * (.5 + v), 60)
    lit = cv2.GaussianBlur(g.sum(2) / 3, (0, 0), 25)
    img = np.clip(smoke(t, lit) + g, 0, 1.3)
    M = np.float32([[1, 0, math.sin(t * 2.1) * 2.5], [0, 1, math.sin(t * 1.7 + 1) * 2.5]]); img = cv2.warpAffine(img, M, (W, H), borderMode=cv2.BORDER_REFLECT)
    return message(img, t)

def message(img, t):
    a = ease((t - .6) / .8) * (.95 if t > 1.5 else 1)
    pil = Image.fromarray((np.clip(img, 0, 1) * 255).astype(np.uint8)); d = ImageDraw.Draw(pil, "RGBA")
    f1, f2 = ImageFont.truetype(font_path(False, True, True), 27), ImageFont.truetype(font_path(False, False, False), 11)
    d.text((W / 2 - 18, H * .49), "Happy Diwali", font=f1, fill=(255, 255, 255, int(235 * a)), anchor="mm")
    for k, ln in enumerate(["May your days shine as bright", "as the diyas"]): d.text((W / 2, H * .525 + k * 14), ln, font=f2, fill=(255, 255, 255, int(235 * a)), anchor="mm")
    out = np.asarray(pil, np.float32) / 255; L = np.zeros_like(out)
    cx, cy = int(W / 2 + 78), int(H * .49)
    cv2.ellipse(L, (cx, cy + 4), (9, 5), 0, 0, 180, (1, .55, .15), -1); cv2.fillConvexPoly(L, np.array([[cx, cy - 10], [cx - 3, cy + 2], [cx + 3, cy + 2]], np.int32), (1, .9, .5))
    return out + L * a + cv2.GaussianBlur(L, (0, 0), 4) * a

if __name__ == "__main__":
    ff, put = video_writer(W, H, FPS, "audio.m4a", OUT); total = int(DUR * FPS)
    for n in range(total):
        put(frame(n / FPS))
        if n % FPS == 0: print(f"\r{n}/{total}", end="", flush=True)
    ff.stdin.close(); ff.wait(); print(f"\nDone → {OUT}")
