#!/usr/bin/env python3
"""Diwali lyric montage (15.8s): wishes → date card → paper lanterns → marigold diyas → orange shell → lit river → floating candles.
Usage: python3 render_lyrics.py [out.mp4]   (needs audio.m4a beside it, and ../pyro.py)"""
import os, sys, math
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from pyro import *

W, H, FPS, DUR = 478, 850, 30, 15.84
OUT = sys.argv[1] if len(sys.argv) > 1 else "diwali_lyrics.mp4"
R = np.random.default_rng(21); S = lambda *a: np.array(a, np.float32) / 255
T = lambda c: tuple(float(v) for v in c)
BOUNDS = [0, 1.95, 3.9, 7.9, 9.9, 11.9, 13.9, DUR]
LINES = [(0, 1.95, "Wishing You And Your Family"), (4.0, 7.0, "Sunte Hai Jab Pyar Ho To"), (8.0, 9.8, "Diye Jal Utthte Hain"), (10.0, 11.8, "Tann Mein Man"),
         (12.0, 13.8, "Aur Nayan Mein"), (14.0, DUR, "Diye Jal Utthte Hain")]

def flame(L, x, y, s, t, k=0):
    f = 1 + .15 * math.sin(t * 17 + k * 2) + .08 * math.sin(t * 29 + k)
    cv2.fillConvexPoly(L, np.array([[x, y - 18 * s * f], [x - 5 * s, y + 2 * s], [x + 5 * s, y + 2 * s]], np.int32), (1, .92, .65))
    L += blob(L.shape, x, y - 4 * s, 16 * s, (1, .55, .2), .5 * f, 12 * s)

def lantern(L, cx, cy, w, t, k=0, a=1.):
    for yy in range(int(-w * .6), int(w * .55)):
        f = (yy + w * .6) / (w * 1.15); wd = w * (.5 - .07 * f); c = S(210, 85, 25) * (1 - f) + S(255, 190, 110) * f
        cv2.line(L, (int(cx - wd), int(cy + yy)), (int(cx + wd), int(cy + yy)), T(c * a), 1)
    cv2.ellipse(L, (int(cx), int(cy - w * .6)), (int(w * .5), int(w * .08)), 0, 0, 360, T(S(150, 60, 20) * a), -1)
    flame(L, int(cx), int(cy + w * .5), w / 18, t, k)

def caption(img, t):
    pil = Image.fromarray((np.clip(img, 0, 1) * 255).astype(np.uint8)); d = ImageDraw.Draw(pil, "RGBA")
    for a, b, c in LINES:
        if a <= t < b:
            al = int(255 * ease((t - a) / .25) * ease((b - t) / .25)); f = ImageFont.truetype(font_path(True, False, False), 14)
            d.text((W / 2 + 1, H * .5 + 1), c, font=f, fill=(0, 0, 0, int(al * .7)), anchor="mm"); d.text((W / 2, H * .5), c, font=f, fill=(255, 255, 255, al), anchor="mm")
    if 1.95 <= t < 3.9:
        al = int(255 * ease((t - 1.95) / .3)); d.text((W / 2, H * .473), "8 November 2026", font=ImageFont.truetype(font_path(False, False, False), 9), fill=(255, 255, 255, al), anchor="mm")
        d.text((W / 2, H * .5), "Happy Diwali", font=ImageFont.truetype(font_path(True, False, False), 15), fill=(255, 255, 255, al), anchor="mm")
    return np.asarray(pil, np.float32) / 255

def s_wish(t):
    g = np.linspace(0, 1, 26, dtype=np.float32)[:, None, None]; blocks = (S(120, 15, 10) * (1 - g) + S(255, 150, 40) * g) * np.ones((26, 18, 1), np.float32)
    n = cv2.resize(R.random((7, 5)).astype(np.float32), (18, 26), interpolation=cv2.INTER_CUBIC); blocks *= (.6 + .7 * np.roll(n, int(t * 4), axis=0))[..., None]
    img = np.zeros((H, W, 3), np.float32); img[int(H * .51):] = cv2.resize(blocks, (W, H - int(H * .51)), interpolation=cv2.INTER_NEAREST)
    L = np.zeros_like(img); a = t * 5
    pts = np.array([[W * .45 + math.cos(k / 6 + a) * (6 + k * .5), H * .9 + math.sin(k / 6 + a) * 8] for k in range(40)], np.int32)
    cv2.polylines(L, [pts], False, (1, .6, .9), 2); return img + glow(L, 1, 1.5, 1.5, .3)

def s_date(t): return np.zeros((H, W, 3), np.float32) + blob((H, W, 3), W * .5, H * .9, 14, (.7, .5, .9), .4, 10) * (.5 + .5 * math.sin(t * 6))

NS = 60; SX_, SY_, SD = R.uniform(0, W, NS), R.uniform(0, H, NS), R.uniform(.3, 1, NS)
BIG = [(.62, .28, .28, 30), (.12, .58, .26, 24), (.85, .18, .1, 18), (.66, .62, .08, 12), (.45, .8, .07, 10)]
def s_lantern(t):
    lt = t - BOUNDS[2]; L = np.zeros((H, W, 3), np.float32)
    for i in range(NS):
        y = (SY_[i] - 18 * SD[i] * lt) % H; s = 1.5 + 2.5 * SD[i]; cv2.rectangle(L, (int(SX_[i] - s), int(y - s * 1.3)), (int(SX_[i] + s), int(y + s * 1.3)), T(S(255, 150, 60) * SD[i]), -1)
    for k, (x, y, w, sp) in enumerate(BIG): lantern(L, x * W + math.sin(t + k) * 5, (y * H - sp * lt) % (H * 1.1), w * W, t, k)
    return (L + glow(L, 0, 1.6, 1.6, .6)) * (1 - .88 * ease((t - 6.3) / 1.5))

MX, MY, MR = R.uniform(0, W, 900), R.uniform(H * .08, H, 900), R.uniform(5, 14, 900); MC = np.array([S(255, 150, 20), S(255, 190, 40), S(230, 90, 10)])[R.integers(0, 3, 900)]
_MB = []
def marigold_base():
    img = np.zeros((H, W, 3), np.float32); img[:int(H * .1)] = S(60, 60, 64)
    for i in range(900): cv2.circle(img, (int(MX[i]), int(MY[i])), int(MR[i]), T(MC[i] * (.35 + .65 * (MY[i] / H))), -1)
    return img
def s_marigold(t):
    if not _MB: _MB.append(marigold_base())
    img = _MB[0].copy()
    for k, (x, y) in enumerate([(.14, .25), (.1, .42), (.2, .62), (.33, .78)]): cv2.ellipse(img, (int(x * W), int(y * H)), (44, 22), 0, 0, 360, T(S(120, 105, 55)), -1); cv2.ellipse(img, (int(x * W), int(y * H)), (34, 14), 0, 0, 360, T(S(40, 35, 10)), -1)
    cv2.ellipse(img, (int(.7 * W), int(.42 * H)), (130, 95), -10, 0, 360, T(S(150, 150, 155)), -1); cv2.ellipse(img, (int(.7 * W), int(.42 * H)), (110, 78), -10, 0, 360, T(S(70, 25, 90)), -1)
    cv2.ellipse(img, (int(.68 * W), int(.44 * H)), (24, 14), 0, 0, 360, T(S(245, 240, 225)), -1)
    L = np.zeros_like(img)
    for k, (x, y) in enumerate([(.14, .25), (.1, .42), (.2, .62), (.33, .78)]): flame(L, int(x * W + 28), int(y * H - 6), 1.4, t, k)
    flame(L, int(.68 * W), int(.43 * H), 1.6, t, 9); return img * .85 + glow(L, 1.2, 1.4, 1.5, .5)

P5 = Pyro(W, H, N=5000, trail=LONG, seed=3); d5 = set()
def s_shell(t):
    for i, (te, x, y, v, n) in enumerate([(10.05, .46, .43, .36, 900), (11.0, .6, .3, .2, 300)]):
        if t >= te and i not in d5: d5.add(i); P5.burst(x * W, y * H, v * W, n, [(1, .55, .15), (1, .8, .4), (1, .4, .1)], [(.6, .15, .05)], life=(2.2, 3.2), drag=.965, grav=22, shell=.95)
    P5.step(1 / FPS); y = np.linspace(0, 1, H, dtype=np.float32)[:, None, None]; sky = (S(40, 46, 46) * (1 - y) + S(110, 118, 130) * y) * np.ones((H, W, 3), np.float32)
    return sky * (.55 + .0) + glow(P5.layer(t), 1.6, 3, 4, 3)

P6 = Pyro(W, H, N=6000, trail=LONG, seed=8); d6 = set()
def s_river(t):
    for i, (te, x, y, v, n, pal) in enumerate([(11.95, .1, .17, .2, 400, [(1, .2, .3), (1, .5, .5)]), (12.2, .64, .12, .24, 500, [(1, 1, 1), (1, .85, .6)]), (12.6, .8, .2, .16, 300, [(1, .2, .3), (1, .9, .8)]),
                                                 (13.0, .4, .1, .22, 400, [(1, .7, .3), (1, 1, 1)]), (13.4, .2, .22, .15, 250, [(1, .3, .5)])]):
        if t >= te and i not in d6: d6.add(i); P6.burst(x * W, y * H, v * W, n, pal, None, life=(1.4, 2.2), drag=.96, grav=20)
    P6.step(1 / FPS); img = np.zeros((H, W, 3), np.float32); img[:int(H * .3)] = S(5, 8, 20); img[int(H * .3):] = S(4, 6, 12); L = np.zeros_like(img)
    for x in range(0, W, 5): cv2.circle(L, (x, int(H * .3) + int(math.sin(x * .3) * 1)), 1, (1, .7, .4), -1)
    for k in range(12):
        r = 90 + k * 34
        for a in np.linspace(math.pi * 1.04, math.pi * 1.96, int(r * .45)):
            cv2.circle(L, (int(W * .62 + math.cos(a) * r * 1.9), int(H * 1.18 + math.sin(a) * r * 1.0)), 1, T(S(255, 120, 190) * (.7 + .3 * math.sin(t * 5 + a * 20))), -1)
    return img + glow(L, 1.3, 1.6, 1.4, .4) + glow(P6.layer(t), 1.6, 3, 4, 3)

PX, PY, PA, PC = R.uniform(0, W, 500), R.uniform(H * .3, H, 500), R.uniform(0, 180, 500), R.uniform(.25, .85, 500)
CAN = [(.25, .45, .07), (.6, .43, .065), (.08, .55, .075), (.54, .53, .09), (.4, .68, .115)]
_PB = []
def s_candle(t):
    if not _PB:
        b = np.zeros((H, W, 3), np.float32)
        for i in range(500): cv2.ellipse(b, (int(PX[i]), int(PY[i])), (22, 11), PA[i], 0, 360, T(S(150, 10, 25) * PC[i] * (.5 + .6 * PY[i] / H)), -1)
        _PB.append(b)
    img = _PB[0].copy()
    L = np.zeros_like(img)
    for k, (x, y, r) in enumerate(CAN):
        cx, cy, rr = int(x * W), int(y * H), int(r * W)
        cv2.ellipse(img, (cx, cy + rr // 2), (rr, int(rr * .75)), 0, 0, 360, T(S(215, 205, 180)), -1); cv2.ellipse(img, (cx, cy), (rr, int(rr * .5)), 0, 0, 360, T(S(250, 245, 230)), -1)
        flame(L, cx, cy, rr / 14, t, k)
    return img * (.8 + .06 * math.sin(t * 8)) + glow(L, 1.2, 1.4, 1.4, .4)

SC = [s_wish, s_date, s_lantern, s_marigold, s_shell, s_river, s_candle]
def frame(t):
    seg = max(i for i in range(7) if BOUNDS[i] <= t); img = np.clip(SC[seg](t), 0, 1)
    d = min(abs(t - b) for b in BOUNDS[1:7]); 
    if d < .1: img = img * (d / .1)
    return caption(img, t)

if __name__ == "__main__":
    ff, put = video_writer(W, H, FPS, "audio.m4a", OUT); total = int(DUR * FPS)
    for n in range(total):
        put(frame(n / FPS))
        if n % FPS == 0: print(f"\r{n}/{total}", end="", flush=True)
    ff.stdin.close(); ff.wait(); print(f"\nDone → {OUT}")
