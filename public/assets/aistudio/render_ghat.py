#!/usr/bin/env python3
"""Diwali night montage (15.9s): aerial ghat → golden shell over the city → sea of sky lanterns → glowing diyas.
Usage: python3 render_ghat.py [out.mp4]   (needs audio.m4a beside it, and ../pyro.py)"""
import os, sys, math
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from pyro import *

W, H, FPS, DUR = 478, 850, 30, 15.89
OUT = sys.argv[1] if len(sys.argv) > 1 else "diwali_ghat.mp4"
Y0, CH = int(.105 * H), int(.79 * H)                              # letter-boxed picture area, like the original
R = np.random.default_rng(11)
C = lambda *a: np.array(a, np.float32) / 255
T = lambda c: tuple(float(v) for v in c)                           # OpenCV wants plain Python floats for colours
SEG = [0, 3.5, 5.8, 13.2, DUR]                                    # ghat | golden shell | lanterns | diyas

def dots(img, n, x, y, cols, k=1.0):
    xs = R.integers(x[0], x[1], n); ys = R.integers(y[0], y[1], n); img[ys, xs] = cols[R.integers(0, len(cols), n)] * R.uniform(.25, 1, (n, 1)).astype(np.float32) * k

def text(img, txt, xy, size, fill, serif=False, bold=True, alpha=1., anchor="mm"):
    im = Image.fromarray((np.clip(img, 0, 1) * 255).astype(np.uint8)); d = ImageDraw.Draw(im, "RGBA"); f = ImageFont.truetype(font_path(bold, False, serif), size)
    d.text((xy[0] + 1, xy[1] + 1), txt, font=f, fill=(0, 0, 0, int(170 * alpha)), anchor=anchor); d.text(xy, txt, font=f, fill=(*fill, int(255 * alpha)), anchor=anchor)
    return np.asarray(im, np.float32) / 255

# ================= 1. aerial ghat (static art, slowly zoomed) =================
def build_ghat():
    h = int(CH * 1.3); img = np.zeros((h, W, 3), np.float32) + C(6, 5, 6)
    for _ in range(46):                                            # lit palaces along the bank
        x = int(R.integers(70, W - 20)); y = int(R.integers(int(.03 * h), int(.42 * h))); w = int(R.integers(20, 55)); b = int(R.integers(14, 44))
        cv2.rectangle(img, (x, y), (x + w, y + b), T(C(110, 70, 30) * R.uniform(.1, .3)), -1)
    dots(img, 5200, (60, W), (int(.03 * h), int(.45 * h)), np.array([C(255, 210, 120), C(255, 170, 70)]), 1.0)      # window lights
    dots(img, 34000, (80, W), (int(.38 * h), h), np.array([C(255, 220, 160), C(255, 190, 110), C(255, 235, 200)]), .8)  # the huge crowd
    cv2.fillConvexPoly(img, np.array([[int(.46 * W), int(.30 * h)], [int(.40 * W), int(.40 * h)], [int(.52 * W), int(.40 * h)]], np.int32), T(C(210, 60, 150)))  # pink spire
    for cx, cy, r in ((int(.2 * W), int(.78 * h), 38), (int(.35 * W), int(.9 * h), 30)):                                  # round water tanks
        cv2.ellipse(img, (cx, cy), (r, int(r * .6)), 0, 0, 360, T(C(170, 165, 150)), -1); cv2.ellipse(img, (cx, cy - 10), (int(r * .8), int(r * .45)), 0, 0, 360, T(C(25, 25, 28)), -1)
    img += cv2.GaussianBlur(img, (0, 0), 5) * 1.3
    return np.clip(img, 0, 1)
GHAT = build_ghat()
def s_ghat(t):
    z = 1 + .1 * t / 3.5; ch, cw = int(CH / z), int(W / z); oy = int((GHAT.shape[0] - ch) * (.08 + .22 * t / 3.5)); ox = int((W - cw) * .5)
    return cv2.resize(GHAT[oy:oy + ch, ox:ox + cw], (W, CH), interpolation=cv2.INTER_LINEAR) * (1 + .04 * math.sin(t * 9))

# ================= 2. golden chrysanthemum over an orange cloud, city lights below =================
def build_city():
    img = np.zeros((CH, W, 3), np.float32); y = np.linspace(0, 1, CH, dtype=np.float32)[:, None, None]
    img += C(22, 12, 10) * (1 - y) + C(10, 8, 12) * y
    cl = np.zeros_like(img)
    for cx, cy, rx, ry, c in [(.5, .5, .75, .06, C(230, 120, 40)), (.3, .47, .5, .045, C(200, 90, 30)), (.8, .52, .5, .05, C(210, 100, 35))]:
        cv2.ellipse(cl, (int(cx * W), int(cy * CH)), (int(rx * W), int(ry * CH)), 0, 0, 360, T(c), -1)
    img += cv2.GaussianBlur(cl, (0, 0), 34) * .5
    dots(img, 2600, (0, W), (int(.68 * CH), CH), np.array([C(255, 200, 120), C(110, 190, 255), C(255, 255, 255), C(255, 120, 60), C(60, 240, 230)]), 1.0)
    img += cv2.GaussianBlur(img, (0, 0), 2.2) * 2.4
    return np.clip(img, 0, 1)
CITY = build_city(); P2 = Pyro(W, CH, N=7000, trail=LONG, seed=4); done2 = set()
GOLD = [(1, .85, .45), (1, .7, .3), (1, .95, .7)]; GOLD2 = [(1, .45, .12), (.9, .35, .1)]
def s_shell(t):
    lt = t - SEG[1]
    for k, (te, x, y, v, n, pal, pal2) in enumerate([(.25, .5, .2, .62, 1500, GOLD, GOLD2), (.9, .27, .8, .16, 160, [(1, .4, .5), (1, .8, .6)], None), (1.15, .72, .85, .14, 140, [(.4, .8, 1), (1, 1, 1)], None),
                                                     (1.5, .45, .88, .13, 130, [(1, .6, .3), (1, .9, .5)], None), (1.9, .8, .78, .15, 150, [(.5, 1, .7), (1, 1, 1)], None)]):
        if lt >= te and k not in done2: done2.add(k); P2.burst(x * W, y * CH, v * W, n, pal, pal2, life=(2.2, 3.4) if k else (3.2, 4.4), drag=.972 if k == 0 else .955, grav=12 if k == 0 else 20, shell=.96 if k == 0 else .8)
    P2.step(1 / FPS); g = glow(P2.layer(t) * (.7), 1.6, 3.5, 5., 5.) + blob((CH, W, 3), W * .5, CH * .2, 70, (1, .6, .2), max(0, 1 - (lt - .25) / .6) * (lt > .25) * 1.2, 40)
    return CITY * (.8 + g.mean() * 1.5) + g

# ================= 3. lantern sky (+ big lanterns, white shell, temple at the start) =================
NL = 360; LX = R.uniform(0, W, NL); LY = R.uniform(-.2 * CH, 1.3 * CH, NL); LD = R.uniform(.12, 1, NL); LS = 9 + LD * 26
LC = np.array([C(255, 190, 90), C(255, 150, 60), C(255, 225, 160), C(255, 130, 190), C(170, 150, 255)])[R.choice(5, NL, p=[.4, .25, .2, .1, .05])]
FX = R.uniform(0, W, 170); FY = CH * (.8 + R.uniform(0, .25, 170)); FD = R.uniform(8, 16, 170)
STARS = np.zeros((CH, W, 3), np.float32); dots(STARS, 900, (0, W), (0, CH), np.array([C(255, 255, 255), C(180, 190, 255)]), .9)
P3 = Pyro(W, CH, N=6000, trail=LONG, seed=6); done3 = set()
def big_lantern(L, cx, cy, w, alpha=1.):
    for yy in range(int(-w * .55), int(w * .5)):
        f = (yy + w * .55) / (w * 1.05); wd = w * (.5 - .08 * f); c = C(235, 120, 40) * (1 - f) + C(255, 205, 130) * f
        cv2.line(L, (int(cx - wd), int(cy + yy)), (int(cx + wd), int(cy + yy)), T(float(v) * alpha for v in c), 1)
    cv2.ellipse(L, (int(cx), int(cy - w * .55)), (int(w * .5), int(w * .09)), 0, 0, 360, T(float(v) * alpha for v in C(240, 150, 70)), -1)
def s_lantern(t):
    lt = t - SEG[2]; sh = ease((lt - .6) / 1.6) * CH * .55
    img = np.zeros((CH, W, 3), np.float32) + C(8, 10, 34) * (1 - np.linspace(0, 1, CH, dtype=np.float32)[:, None, None]) + C(34, 20, 70) * np.linspace(0, 1, CH, dtype=np.float32)[:, None, None]
    img += STARS * .8; L = np.zeros_like(img)
    y = (LY - LS * lt * .35) % (1.5 * CH) - .2 * CH
    for i in range(NL):
        s = 1.2 + LD[i] * 3.2; cv2.rectangle(L, (int(LX[i] - s * .7), int(y[i] - s)), (int(LX[i] + s * .7), int(y[i] + s)), T(float(v) for v in LC[i] * (.5 + .5 * LD[i])), -1)
    if sh < CH * .54:
        cv2.fillConvexPoly(L, np.array([[int(.5 * W), int(.62 * CH + sh)], [int(.43 * W), int(.74 * CH + sh)], [int(.57 * W), int(.74 * CH + sh)]], np.int32), T(C(220, 70, 160) * .4))
        L[int(.74 * CH + sh):int(.76 * CH + sh)] += C(120, 40, 200) * .15
        for i in range(170):
            s = FD[i] * .6; cv2.rectangle(L, (int(FX[i] - s * .6), int(FY[i] + sh - s)), (int(FX[i] + s * .6), int(FY[i] + sh + s)), T(float(v) for v in C(255, 215, 160) * .85), -1)
    for te, x, y0, v, n, pal, pal2 in [(3.7, .38, .35, .26, 520, [(1, 1, 1), (.85, .95, 1)], [(.5, .6, 1)]), (4.4, .7, .25, .13, 140, [(1, .5, .7)], None), (4.9, .25, .55, .12, 120, [(1, .8, .4)], None)]:
        if lt >= te and te not in done3: done3.add(te); P3.burst(x * W, y0 * CH, v * W, n, pal, pal2, life=(1.8, 2.8), drag=.96, grav=14)
    P3.step(1 / FPS); g = glow(L, 1.0, 2.2, 1.6, .5) + glow(P3.layer(t) * .8, 1.4, 3.2, 4., 2.5)
    bl = np.zeros_like(img)
    if lt >= 3.6:
        a = lt - 3.6; big_lantern(bl, W * .46, CH * (.82 - .04 * a), W * (.2 + .03 * a)); big_lantern(bl, W * (.98 - .0 * a), CH * (1.0 - .02 * a), W * .5)
        g += blob(img.shape, W * .46, CH * (.82 - .04 * a) + W * .1, 30, (1, .8, .4), 1.3, 20)
    out = img + g + bl * (.8 + .2 * math.sin(t * 6))
    dim = 1 - .85 * ease((t - 11.4) / .8)
    return out * dim

# ================= 4. diyas, marigold rangoli, a hand lighting a lamp =================
def build_diya():
    img = np.zeros((CH, W, 3), np.float32) + C(20, 11, 8)
    for ring, (r, n) in enumerate([(.1, 18), (.16, 26), (.22, 34), (.28, 42)]):
        for k in range(n):
            a = 2 * math.pi * k / n + ring; c = [C(255, 150, 20), C(215, 40, 30), C(255, 225, 150), C(255, 120, 10)][(k + ring) % 4]
            cv2.circle(img, (int(W * .56 + math.cos(a) * r * W * 1.3), int(CH * .2 + math.sin(a) * r * W * .95)), int(5 + ring), T(c * .8), -1)
    for i in range(5): cv2.line(img, (int(W * (.7 + i * .05)), int(CH * .64)), (int(W * (.78 + i * .05)), int(CH * .5)), T(C(255, 240, 220) * .8), 4)
    return img
DIYA = build_diya(); FL = [(.62, .58, 1.0), (.12, .55, .7), (.93, .42, .6), (.22, .9, .65), (.78, .9, .8)]
def s_diya(t):
    img = DIYA.copy(); L = np.zeros_like(img); lt = t - SEG[3]
    for k, (fx, fy, s) in enumerate(FL):
        x, y, r = int(fx * W), int(fy * CH), int(.1 * W * s)
        cv2.ellipse(img, (x, y + r // 3), (r, int(r * .55)), 0, 0, 180, T(C(180, 70, 35)), -1); cv2.ellipse(img, (x, y + r // 3), (r, int(r * .2)), 0, 0, 360, T(C(120, 45, 20)), -1)
        fl = 1 + .18 * math.sin(t * 17 + k * 2) + .1 * math.sin(t * 31 + k)
        cv2.fillConvexPoly(L, np.array([[x, y - int(r * 1.5 * fl)], [x - r // 3, y + r // 6], [x + r // 3, y + r // 6]], np.int32), (1.0, .9, .6))
        L += blob(img.shape, x, y - r * .3, r * 1.3, (1, .55, .15), .55 * fl, r * .9)
    hand = np.zeros_like(img); cv2.ellipse(hand, (int(W * .93), int(CH * 1.02)), (int(W * .16), int(CH * .1)), 25, 0, 360, T(C(170, 110, 85)), -1)
    img = np.where(hand.sum(2, keepdims=True) > 0, hand, img); x, y = int(W * .82), int(CH * .83)
    cv2.ellipse(img, (x, y + 12), (34, 18), 0, 0, 180, T(C(200, 40, 50)), -1); cv2.fillConvexPoly(L, np.array([[x, y - 36], [x - 11, y + 8], [x + 11, y + 8]], np.int32), (1.0, .95, .75))
    L += blob(img.shape, x, y, 50, (1, .5, .2), .9 + .2 * math.sin(t * 20), 40)
    return (img + glow(L, 1.2, 1.2, 1.4, .4)) * (1 + .03 * math.sin(t * 9)) * min(1, lt / .4)

# ================= compose =================
CAP = [(5.9, 7.1, None), (7.2, 9.3, "Diye Jal Uthte Hai..."), (9.4, 12.0, "Tan Man"), (3.9, 5.7, "Sunte Hai Jab Pyaa.."), (13.6, DUR, "Diye Jal Uthte Hai...")]
def frame(t):
    seg = max(i for i in range(4) if SEG[i] <= t)
    pic = [s_ghat, s_shell, s_lantern, s_diya][seg](t); can = np.zeros((H, W, 3), np.float32); can[Y0:Y0 + CH] = np.clip(pic, 0, 1)
    if seg == 0:
        a = ease(t / .6); can = text(can, "8 November 2026", (W // 2, int(H * .485)), 19, (255, 245, 90), serif=True, bold=False, alpha=a)
        can = text(can, "Happy Diwali :", (W // 2 - 8, int(H * .515)), 17, (255, 255, 255), alpha=a)
    else: can = text(can, "HAPPY DIWALI", (10, Y0 + 12), 11, (255, 255, 255), alpha=.6, anchor="lm")
    for a, b, c in CAP:
        if c and a <= t < b: can = text(can, c, (W // 2, int(H * .50)), 14, (255, 255, 255), alpha=ease((t - a) / .3) * ease((b - t) / .3))
    d = min(abs(t - b) for b in SEG[1:4]); return can * min(1, d / .12 + .0) if d < .12 else can

if __name__ == "__main__":
    ff, put = video_writer(W, H, FPS, "audio.m4a", OUT); total = int(DUR * FPS)
    for n in range(total):
        put(frame(n / FPS))
        if n % FPS == 0: print(f"\r{n}/{total}", end="", flush=True)
    ff.stdin.close(); ff.wait(); print(f"\nDone → {OUT}")
