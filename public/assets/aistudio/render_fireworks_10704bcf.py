#!/usr/bin/env python3
"""Happy Diwali fireworks show – every frame simulated and drawn in code (NumPy + OpenCV + Pillow), audio muxed by ffmpeg.
Usage: python3 render_fireworks.py [out.mp4]        needs: numpy opencv-python pillow ffmpeg, and audio.m4a next to this file"""
import math, random, subprocess, sys, glob
import numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont

OUTFILE = sys.argv[1] if len(sys.argv) > 1 else "fireworks_show.mp4"
W, H, FPS, DUR = 720, 1280, 24, 8.05
HH = H / 2
rng = random.Random(7); nr = np.random.default_rng(7)
PAL = {"purple": [(.7, .5, 1), (1, .7, 1)], "orange": [(1, .55, .2), (1, .8, .4)], "red": [(1, .25, .2), (1, .6, .4)], "blue": [(.3, .6, 1), (.7, .9, 1)],
       "teal": [(.2, .9, .9), (.6, 1, .9)], "pink": [(1, .5, .6), (1, .8, .7)], "gold": [(1, .72, .28), (1, .9, .6), (1, .55, .15)], "white": [(1, 1, 1), (.9, .9, 1)]}
ease = lambda x: (lambda v: v * v * (3 - 2 * v))(min(max(x, 0), 1))
px = lambda nx, ny: (W / 2 + nx * W / 2, H / 2 - ny * HH)          # normalised -> pixels

# ============ 1. static background: golden city + crowd (drawn once, taller than the frame so the camera can tilt) ============
BH = int(H * 1.3)
def build_bg():
    img = Image.new("RGB", (W, BH)); d = ImageDraw.Draw(img)
    for y in range(BH):
        k = y / BH; d.line([(0, y), (W, y)], fill=(int(3 + 6 * k), int(5 + 8 * k), int(15 + 22 * k)))
    base = BH - int(.17 * H)                                           # street level of the skyline
    # (x, width, height, dome?)  – palace left, glass tower right, domes in between
    for x, w, h, dome in [(-30, 250, 430, 1), (190, 120, 260, 1), (300, 170, 210, 1), (440, 130, 300, 1), (560, 190, 440, 0), (80, 110, 170, 1), (380, 90, 160, 1)]:
        for y in range(base - h, base):
            k = (y - (base - h)) / h; c = (int(255 - 40 * k), int(207 - 77 * k), int(110 - 67 * k)) if dome or w < 180 else (int(120 - 30 * k), int(150 - 40 * k), int(185 - 30 * k))
            d.line([(x, y), (x + w, y)], fill=c)
        for wy in range(base - h + 30, base - 30, 46):
            for wx in range(x + 14, x + w - 24, 34):
                d.rounded_rectangle([wx, wy, wx + 16, wy + 26], 8, fill=(255, 233, 168) if dome or w < 180 else (255, 245, 200))
        for lx in range(x + 3, x + w, 9): d.ellipse([lx, base - h + 8, lx + 4, base - h + 12], fill=(255, 243, 176))
        if dome:
            cx = x + w // 2; r = int(w * .3)
            d.pieslice([cx - r, base - h - r, cx + r, base - h + r], 180, 360, fill=(233, 162, 59), outline=(120, 70, 20))
            d.polygon([(cx - 5, base - h - r), (cx + 5, base - h - r), (cx, base - h - r - int(w * .22))], fill=(233, 162, 59))
    d.rectangle([0, base, W, BH], fill=(42, 20, 8))
    cols = [(232, 51, 47), (243, 162, 29), (31, 163, 160), (59, 123, 216), (230, 90, 155), (246, 210, 58), (122, 63, 181)]
    for x in range(-10, W + 20, 19):                                  # coloured crowd
        y = BH - int(.105 * H) + rng.randint(-10, 10); c = rng.choice(cols); s = rng.uniform(.9, 1.15)
        d.rectangle([x - 8 * s, y, x + 8 * s, y + 90], fill=c); d.ellipse([x - 7 * s, y - 16 * s, x + 7 * s, y - 2], fill=(201, 138, 94))
        for sd in (-1, 1): d.line([(x + sd * 8, y + 10), (x + sd * (14 + rng.randint(0, 8)), y - rng.randint(0, 22))], fill=c, width=4)
    for x in range(-20, W + 40, 34):                                  # black foreground silhouettes with raised arms
        y = BH - int(.045 * H) + rng.randint(-12, 14); s = rng.uniform(1.0, 1.3)
        d.ellipse([x - 14 * s, y - 28 * s, x + 14 * s, y], fill=(4, 4, 4)); d.rectangle([x - 18 * s, y, x + 18 * s, BH], fill=(4, 4, 4))
        for sd in (-1, 1): d.line([(x + sd * 16, y + 12), (x + sd * 30, y - rng.randint(10, 60))], fill=(4, 4, 4), width=9)
    bg = np.asarray(img, np.float32) / 255
    gl = np.zeros_like(bg)                                            # warm diya glow + street haze
    for x in range(20, W, 52): cv2.circle(gl, (x, BH - int(.125 * H)), 7, (1.0, .55, .15), -1)
    gl[base - 10: base + 30, :, :] += np.array([.5, .22, .05], np.float32)
    bg += cv2.GaussianBlur(gl, (0, 0), 14) * 1.4 + gl * .6
    return np.clip(bg, 0, 1)
BG = build_bg()

# ============ 2. particle pool ============
N = 14000
pos = np.zeros((N, 2), np.float32); vel = np.zeros((N, 2), np.float32); life = np.zeros(N, np.float32); ml = np.ones(N, np.float32)
col = np.zeros((N, 3), np.float32); drag = np.full(N, .955, np.float32); grav = np.full(N, 6, np.float32); head = 0
def emit_many(p, v, l, c, dr, gr):
    global head
    n = len(l); i = (head + np.arange(n)) % N; head = (head + n) % N
    pos[i], vel[i], life[i], ml[i], col[i], drag[i], grav[i] = p, v, l, l, c, dr, gr

def burst(nx, ny, r, pal, n, flashes):
    cx, cy = px(nx, ny); a = nr.uniform(0, 6.283, n); b = np.arccos(2 * nr.uniform(size=n) - 1)
    s = HH * r * 3.2 * np.where(nr.uniform(size=n) < .8, .92 + .08 * nr.uniform(size=n), .3 + .5 * nr.uniform(size=n))
    v = np.stack([np.sin(b) * np.cos(a) * s, -np.sin(b) * np.sin(a) * s], 1)
    c = np.array([pal[i % len(pal)] for i in range(n)], np.float32)
    emit_many(np.tile([cx, cy], (n, 1)), v, 1.7 + nr.uniform(size=n) * 1.3, c, .955, HH * .33)
    flashes.append([cx, cy, HH * r * 3, 0.0, pal[0]])

def sim(dt):
    m = life > 0; life[m] -= dt
    vel[m] *= (drag[m] ** (dt * 60))[:, None]; vel[m, 1] += grav[m] * dt; pos[m] += vel[m] * dt

def splat(layer, p, v, w, scales=((0, 1), (.035, .55), (.085, .25))):
    for s, b in scales:
        q = p - v * s; ix = q[:, 0].astype(int); iy = q[:, 1].astype(int); ok = (ix >= 0) & (ix < W) & (iy >= 0) & (iy < H)
        np.add.at(layer, (iy[ok], ix[ok]), w[ok] * b)

# ============ 3. choreography (same timeline as the video) ============
SHOW = []
def B(t, nx, ny, r, p, n): SHOW.extend([(t - .7, "rocket", (nx * .7, nx, ny)), (t, "burst", (nx, ny, r, PAL[p], n))])
def F(t0, t1, nx): SHOW.append((t0, "fount", (t0, t1, nx)))
B(.8, -.55, .5, .12, "purple", 60); B(1.0, -.4, .55, .28, "orange", 260); B(1.15, 0, .62, .3, "purple", 280); B(1.25, .38, .5, .28, "orange", 260)
B(1.35, -.2, .8, .12, "white", 50); B(1.45, .22, .82, .12, "white", 50)
B(2.2, -.35, .65, .34, "red", 320); B(2.35, .3, .7, .38, "blue", 340); B(2.5, 0, .45, .22, "red", 200); B(2.65, .5, .4, .2, "blue", 180)
B(3.2, -.45, .65, .38, "red", 340); B(3.35, .4, .65, .36, "teal", 320); B(3.55, .05, .4, .25, "pink", 220)
B(4.3, -.25, .35, .5, "gold", 520); B(4.5, .2, .75, .4, "teal", 300); B(5.1, 0, .38, .75, "gold", 800); B(6.1, 0, .3, .85, "gold", 800)
F(1.0, 2.5, 0); F(2.2, 3.7, .05); F(3.1, 4.6, -.1)
SHOW.sort(key=lambda e: e[0]); RAIN = (6.9, 8.2); T0 = 5.2

# "Happy Diwali" target points sampled from a font mask
def text_targets():
    fp = (glob.glob("/usr/share/fonts/**/DejaVuSerif-BoldItalic.ttf", recursive=True) or glob.glob("/usr/share/fonts/**/DejaVuSerif-Bold.ttf", recursive=True))[0]
    im = Image.new("L", (900, 420)); d = ImageDraw.Draw(im)
    d.text((450, 100), "Happy", font=ImageFont.truetype(fp, 130), fill=255, anchor="mm"); d.text((450, 290), "Diwali", font=ImageFont.truetype(fp, 190), fill=255, anchor="mm")
    ys, xs = np.nonzero(np.asarray(im)[::3, ::3] > 128); return np.stack([xs * 3 - 450, ys * 3 - 210], 1).astype(np.float32)
TG = text_targets(); TDELAY = nr.uniform(0, .4, len(TG)).astype(np.float32); TS = (W * .92) / 900

# ============ 4. render ============
def frame(t, flashes):
    layer = np.zeros((H, W, 3), np.float32)
    m = life > 0
    if m.any():
        f = np.clip(life[m] / ml[m], 0, 1); a = np.minimum(1, f * 2.2) * np.where(f < .4, .6 + .4 * np.sin(t * 38 + np.arange(m.sum()) * 1.7), 1)
        splat(layer, pos[m], vel[m], col[m] * a[:, None])
    if t >= T0:                                                       # text particles fly from the burst centre into letters
        c0 = np.array(px(0, .38), np.float32); c1 = np.array(px(0, .05), np.float32)
        e = np.clip((t - T0 - TDELAY) / 1.1, 0, 1); e = e * e * (3 - 2 * e)
        tgt = c1 + TG * TS; p = c0 + (tgt - c0) * e[:, None]; br = e * (.8 + .2 * np.sin(t * 7 + np.arange(len(TG))))
        splat(layer, p, np.zeros_like(p), np.outer(br, [1, .78, .38]).astype(np.float32), scales=((0, 1.4),))
    # glow: tight core + soft halo, like long-exposure pyrotechnics
    glow = layer * 1.6 + cv2.GaussianBlur(layer, (0, 0), 2.0) * 4.2 + cv2.GaussianBlur(layer, (0, 0), 8) * 7 + cv2.GaussianBlur(layer, (0, 0), 30) * 9
    fl = np.zeros_like(layer)
    for f in flashes: cv2.circle(fl, (int(f[0]), int(f[1])), int(f[2] * .25), tuple(float(x) for x in f[4]), -1)
    if flashes: glow += cv2.GaussianBlur(fl, (0, 0), 50) * 1.1 * max(0, 1 - flashes[-1][3] / .45)
    tilt = ease((t - 3.9) / .9) * .22 * HH; y0 = int(BH - H - tilt)   # camera tilt up: city drops out of frame
    bg = BG[y0:y0 + H] * (.36 + .6 * min(1, glow.mean() * 5))           # city lit by the show
    return (np.clip(bg + glow, 0, 1) * 255).astype(np.uint8)

if __name__ == "__main__":
    ff = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-", "-i", "audio.m4a",
                           "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "19", "-c:a", "copy", "-shortest", OUTFILE], stdin=subprocess.PIPE)
    total, idx, rockets, fountains, flashes = int(DUR * FPS), 0, [], [], []
    for n in range(total):
        t = n / FPS; dt = 1 / FPS
        while idx < len(SHOW) and SHOW[idx][0] <= t:
            _, kind, a = SHOW[idx]; idx += 1
            if kind == "burst": burst(*a, flashes)
            elif kind == "rocket": rockets.append([t, *a])
            else: fountains.append(a)
        for r in rockets[:]:                                          # rising comets with spark trails
            k = (t - r[0]) / .7
            if k >= 1: rockets.remove(r); continue
            x, y = px(r[1] + (r[2] - r[1]) * k, -.55 + (r[3] + .55) * math.sin(k * 1.5708))
            emit_many(np.tile([x, y], (3, 1)), np.stack([nr.uniform(-30, 30, 3), nr.uniform(20, 120, 3)], 1), np.full(3, .5), np.tile([1, .85, .55], (3, 1)), .95, 120)
        for f0, f1, nx in fountains:
            if f0 < t < f1:
                k = 9; ang = nr.uniform(-.28, .28, k); x, y = px(nx, -.52)
                emit_many(np.tile([x, y], (k, 1)), np.stack([np.sin(ang) * HH * 1.1, -HH * (1.1 + nr.uniform(size=k) * .9)], 1), 1.3 + nr.uniform(size=k) * .5, np.tile([1, .92, .78], (k, 1)), .99, HH * 1.5)
        if RAIN[0] < t < RAIN[1]:
            k = 18; emit_many(np.stack([nr.uniform(0, W, k), nr.uniform(0, H * .3, k)], 1), np.stack([np.zeros(k), np.full(k, HH * .25)], 1), np.full(k, 2.4), np.tile([1, .75, .3], (k, 1)), .99, HH * .25)
        sim(dt); [f.__setitem__(3, f[3] + dt) for f in flashes]; flashes[:] = [f for f in flashes if f[3] < .45]
        ff.stdin.write(frame(t, flashes).tobytes())
        if n % FPS == 0: print(f"\r{n}/{total}", end="", flush=True)
    ff.stdin.close(); ff.wait(); print(f"\nDone → {OUTFILE}")
