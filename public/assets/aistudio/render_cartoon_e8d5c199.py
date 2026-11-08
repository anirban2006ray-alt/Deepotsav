#!/usr/bin/env python3
"""Diwali 'Akelepan' cartoon – every frame drawn in code (Pillow + NumPy), muxed with audio.m4a by ffmpeg.
Usage:  python3 render_cartoon.py [out.mp4] [fps]      (needs: pillow, numpy, ffmpeg)"""
import math, random, subprocess, sys, glob
import numpy as np
from PIL import Image, ImageDraw, ImageFont

OUTFILE = sys.argv[1] if len(sys.argv) > 1 else "diwali_cartoon.mp4"
FPS = int(sys.argv[2]) if len(sys.argv) > 2 else 24
W, H, SS, DUR = 480, 854, 2, 31.85
OUT = (24, 18, 16); SKIN = (246, 201, 164); HAIR = (42, 42, 42)

# ---------- fonts ----------
def font(size):
    for p in glob.glob("/usr/share/fonts/**/DejaVuSerif-Bold.ttf", recursive=True) + glob.glob("/usr/share/fonts/**/*Bold*.ttf", recursive=True):
        return ImageFont.truetype(p, size)
    return ImageFont.load_default()
CAPFONT = font(34 * SS)

# ---------- background art (built once) ----------
def sky_img(w, h):
    y = np.linspace(0, 1, h)[:, None]
    a, b, c = np.array([199, 107, 85]), np.array([240, 129, 74]), np.array([255, 197, 138])
    col = np.where(y < .45, a + (b - a) * (y / .45), b + (c - b) * ((y - .45) / .55))
    img = Image.fromarray(np.repeat(col[:, None, :], w, axis=1).astype("uint8").reshape(h, w, 3))
    d = ImageDraw.Draw(img)
    for cx, cy, rx, ry in [(.2, .05, .55, .05), (.9, .22, .45, .045), (.3, .42, .4, .04)]:
        d.ellipse([(cx - rx) * w, (cy - ry) * h, (cx + rx) * w, (cy + ry) * h], fill=(125, 90, 118))
    return img
SKY = sky_img(W * SS, H * SS)

# ---------- camera + drawing helpers (world coords -> supersampled pixels) ----------
cam = [0, 0, 1]; D = None; IMG = None
def P(x, y): return ((x - cam[0]) * cam[2] + W / 2) * SS, ((y - cam[1]) * cam[2] + H / 2) * SS
def S(v): return v * cam[2] * SS
def lw(w): return max(1, int(S(w)))
def poly(pts, fill, ol=OUT, w=3):
    q = [P(*p) for p in pts]; D.polygon(q, fill=fill)
    if ol: D.line(q + [q[0]], fill=ol, width=lw(w), joint="curve")
def ell(x, y, rx, ry, fill, ol=OUT, w=3):
    D.ellipse([P(x - rx, y - ry), P(x + rx, y + ry)], fill=fill, outline=ol, width=lw(w) if ol else 0)
def rect(x0, y0, x1, y1, fill, ol=OUT, w=3): poly([(x0, y0), (x1, y0), (x1, y1), (x0, y1)], fill, ol, w)
def line(pts, col, w): D.line([P(*p) for p in pts], fill=col, width=lw(w), joint="curve")
def limb(pts, w, col): line(pts, OUT, w + 6); line(pts, col, w); [ell(x, y, w / 2, w / 2, col, None) for x, y in pts]
def rot(p, pv, a):
    c, s = math.cos(a), math.sin(a); dx, dy = p[0] - pv[0], p[1] - pv[1]
    return (pv[0] + dx * c - dy * s, pv[1] + dx * s + dy * c)
def arc_eye(x, y, r, up=False):  # closed / happy eye
    pts = [(x + r * math.cos(math.pi * (.1 + .8 * k / 10)), y + (-1 if up else 1) * r * .6 * math.sin(math.pi * (.1 + .8 * k / 10))) for k in range(11)]
    line(pts, OUT, 3.5)
ease = lambda x: (lambda v: v * v * (3 - 2 * v))(min(max(x, 0), 1))

# ---------- fireworks ----------
def make_events(t0, t1, step_fn, xr, yr, seed):
    r = random.Random(seed); ev, t = [], t0
    while t < t1:
        ev.append((t, r.uniform(*xr), r.uniform(*yr), r.choice([(255, 255, 255), (255, 60, 60), (255, 179, 71), (255, 242, 168)]), r.random())); t += step_fn(t)
    return ev
EV_OFFICE = make_events(0, 16, lambda t: .95, (410, 690), (170, 380), 1)
EV_OUT = make_events(16, DUR, lambda t: 1.5 if t < 18 else (9 if t < 22 else (1.4 if t < 25 else .55)), (60, 420), (60, 420), 2)
def firework(ev, t):
    for (te, x, y, col, rr) in ev:
        a = t - te
        if a < 0 or a > 1.7: continue
        if a < .5:   # rocket streak
            k = ease(a / .5); y0 = y + 220 * (1 - k); line([(x, y0 + 40), (x, y0)], (255, 235, 190), 4)
        else:        # burst
            k = ease((a - .5) / 1.1); R = 95 * k + 10; n = 22
            for i in range(n):
                th = 2 * math.pi * i / n + rr; c = col if i % 2 else (255, 255, 255)
                line([(x + math.cos(th) * R * .55, y + math.sin(th) * R * .55 + 14 * k * k), (x + math.cos(th) * R, y + math.sin(th) * R + 22 * k * k)], c, max(1.2, 4.5 * (1 - k)))

# ---------- characters ----------
def sparkle(x, y, t, s=1):
    r = random.Random(int(t * 30))
    for _ in range(16):
        a = r.uniform(0, 6.28); l = r.uniform(14, 40) * s
        line([(x + math.cos(a) * 6 * s, y + math.sin(a) * 6 * s), (x + math.cos(a) * l, y + math.sin(a) * l)], r.choice([(255, 70, 60), (255, 255, 255), (255, 210, 90)]), 3)
    ell(x, y, 11 * s, 11 * s, (255, 245, 220), None)

def front(x, y, s, kind, t, st):
    """front-facing seated character. (x,y)=ground/seat origin; head ≈ 150*s above."""
    L = lambda px, py: (x + px * s, y + py * s)
    bob = st.get("bob", 0) * s; y -= bob
    tilt = st.get("tilt", 0); hx, hy = L(math.sin(tilt) * 12, -150)
    top = (217, 32, 42) if kind == "girl" else (248, 248, 248); pants = (180, 184, 194) if kind == "girl" else (248, 248, 248)
    if kind == "girl":  # long hair back (sways)
        sw = math.sin(t * 1.7) * 5
        poly([L(-66 + sw, -170), L(66 + sw, -170), L(78 + sw, -40), L(-78 + sw, -40)], HAIR)
    # legs (seated, foreshortened) + shoes
    for sd in (-1, 1):
        rect(x + (sd * 34 - 20) * s, y + 40 * s, x + (sd * 34 + 20) * s, y + 150 * s, pants, OUT, 3)
        ell(x + sd * 34 * s, y + 156 * s, 28 * s, 13 * s, (30, 30, 30) if kind == "girl" else (250, 250, 250))
    # torso
    poly([L(-62, -100), L(62, -100), L(76, 70), L(-76, 70)], top)
    poly([L(-16, -100), L(16, -100), L(10, -50), L(-10, -50)], (240, 180, 40), OUT, 2)
    # arms
    def arm(sd, hand, sleeve=top):
        sh = L(sd * 62, -88); hd = L(*hand); el = ((sh[0] + hd[0]) / 2 + sd * 18 * s, (sh[1] + hd[1]) / 2 + 16 * s)
        limb([sh, el, hd], 34 * s, sleeve); ell(*hd, 17 * s, 17 * s, SKIN); return hd
    aL, aR = st.get("armL", (-70, 20)), st.get("armR", (70, 20))
    hL = arm(-1, aL); hR = arm(1, aR)
    if st.get("spark"):
        for hd in (hL, hR) if st.get("spark") == 2 else (hR,):
            line([hd, (hd[0] + 4 * s, hd[1] - 60 * s)], (60, 60, 60), 3); sparkle(hd[0] + 4 * s, hd[1] - 62 * s, t + hd[0], s)
    # head
    ell(hx, hy, 62 * s, 64 * s, SKIN)
    eye = st.get("eye", "open"); ey = hy + 4 * s
    for sd in (-1, 1):
        ex = hx + sd * 24 * s
        if eye in ("open", "wide"):
            ell(ex, ey, 15 * s * (1.1 if eye == "wide" else 1), 17 * s * (1.1 if eye == "wide" else 1), (255, 255, 255), OUT, 2.5)
            lx = st.get("look", 0); ell(ex + lx * 6 * s, ey + st.get("lookY", 0) * 6 * s, 7 * s, 8 * s, (20, 20, 20), None)
        elif eye == "happy": arc_eye(ex, ey, 14 * s, up=True)
        else: arc_eye(ex, ey - 3 * s, 14 * s)
        if kind == "girl": ell(ex, ey, 24 * s, 22 * s, None, (40, 40, 40), 3)
        if st.get("blush"): ell(hx + sd * 40 * s, hy + 30 * s, 12 * s, 7 * s, (255, 150, 140), None)
    if kind == "girl": line([(hx - 8 * s, ey), (hx + 8 * s, ey)], (40, 40, 40), 3)
    m = st.get("mouth", "flat"); my = hy + 40 * s
    if m == "open":
        o = st.get("open", 1); ell(hx, my, 22 * s, (8 + 14 * o) * s, (130, 28, 40)); ell(hx, my + 8 * o * s, 12 * s, 6 * o * s, (240, 110, 120), None)
    elif m == "smile": line([(hx - 14 * s + k * 28 * s / 8, my - 2 * s + 9 * s * math.sin(math.pi * k / 8)) for k in range(9)], OUT, 3.5)
    else: line([(hx - 8 * s, my), (hx + 8 * s, my)], OUT, 3)
    # hair (front)
    if kind == "girl":
        poly([(hx - 66 * s, hy - 6 * s), (hx - 50 * s, hy - 70 * s), (hx, hy - 82 * s), (hx + 50 * s, hy - 70 * s), (hx + 66 * s, hy - 6 * s), (hx + 8 * s, hy - 36 * s), (hx - 10 * s, hy - 42 * s)], HAIR)
    else:
        poly([(hx - 66 * s, hy + 4 * s), (hx - 56 * s, hy - 62 * s), (hx - 4 * s, hy - 82 * s), (hx + 56 * s, hy - 66 * s), (hx + 68 * s, hy + 4 * s), (hx + 52 * s, hy - 26 * s), (hx + 10 * s, hy - 40 * s), (hx - 36 * s, hy - 30 * s)], HAIR)

def worker(t):
    """office worker in profile, facing left"""
    hip = (350, 545); lean = 0; hdx = 0; eye = "open"; look = (0, 0); headrot = 0
    if t < 6:   hand = lambda i: (205 + 6 * math.sin(t * 16 + i * 3), 540 - 5 * abs(math.sin(t * 16 + i * 3))); headrot = .04
    elif t < 9: hand = lambda i: (300, 525); headrot = .12 + .05 * math.sin((t - 6) * 1.6); look = (0, -1)
    elif t < 13: hand = lambda i: (300, 525); lean = .3 * ease((t - 9) / 1.5); headrot = -.35; eye = "closed"
    else:       hand = lambda i: (290 - 30 * ease(t - 13), 560); headrot = .3; eye = "wide"; lean = 0
    R = lambda p, a=lean: rot(p, hip, a)
    breath = 3 * math.sin(t * 1.8)
    # chair + legs
    rect(300, 548, 410, 575, (22, 28, 40)); poly([(392, 410), (425, 410), (432, 575), (396, 575)], (22, 28, 40)); line([(392, 410), (392, 560)], (160, 100, 50), 5)
    line([(355, 575), (355, 690)], OUT, 8); line([(300, 700), (415, 700)], OUT, 9)
    limb([(350, 555), (268, 560), (276, 670)], 40, (61, 61, 68)); ell(262, 684, 34, 14, (250, 250, 250))
    # torso
    poly([R((322, 425 + breath)), R((380, 430 + breath)), R((395, 548)), R((322, 548))], (246, 246, 246))
    # arms
    sh = R((350, 450)); hd = hand(0); el = (sh[0] - 55, sh[1] + 85)
    limb([sh, el, hd], 28, (246, 246, 246)); ell(*hd, 14, 14, SKIN)
    # head
    hc = R((332 + hdx, 385)); hc = rot(hc, R((340, 440)), headrot)
    ell(hc[0] + 10, hc[1] - 8, 52, 48, HAIR); ell(hc[0] - 6, hc[1] + 8, 45, 45, SKIN)
    poly([(hc[0] - 48, hc[1] + 6), (hc[0] - 62, hc[1] + 22), (hc[0] - 46, hc[1] + 26)], SKIN)
    ex, ey = hc[0] - 24, hc[1] + 2
    if eye == "closed": line([(ex - 9, ey + 3), (ex + 8, ey + 5)], OUT, 3.5)
    else:
        ell(ex, ey, 11 * (1.3 if eye == "wide" else 1), 13 * (1.3 if eye == "wide" else 1), (255, 255, 255), OUT, 2.5)
        if (t % 3.3) < .12: line([(ex - 9, ey), (ex + 9, ey)], OUT, 3.5)
        else: ell(ex - 3 + look[0] * 3, ey + look[1] * 4, 5, 6.5, (20, 20, 20), None)
    line([(hc[0] - 34, hc[1] + 30), (hc[0] - 18, hc[1] + 30)], OUT, 3)
    if eye == "wide": ell(hc[0] - 26, hc[1] + 32, 7, 9, (120, 30, 40), OUT, 2)

# ---------- scenes ----------
def office(t):
    IMG.paste(SKY, (0, 0)); firework(EV_OFFICE, t)
    wall = (67, 100, 97)
    rect(-400, -400, 380, 620, wall, None); rect(720, -400, 1400, 620, wall, None); rect(380, -400, 720, 120, wall, None); rect(380, 480, 720, 620, wall, None)
    rect(380, 120, 720, 480, None, (40, 58, 56), 10); line([(550, 120), (550, 480)], (40, 58, 56), 9); line([(380, 300), (720, 300)], (40, 58, 56), 7)
    rect(-400, 620, 1400, 1300, (47, 69, 67), None)
    rect(60, 105, 180, 245, (201, 150, 46)); rect(72, 117, 168, 233, (81, 99, 95))  # portrait
    ell(120, 170, 30, 36, (243, 210, 184)); poly([(86, 150), (154, 150), (140, 112), (100, 112)], (20, 20, 20), None); line([(104, 192), (136, 192)], (255, 255, 255), 5)
    rect(40, 548, 430, 572, (138, 90, 58)); rect(70, 572, 90, 720, (45, 59, 58)); rect(392, 572, 412, 720, (45, 59, 58))   # desk
    rect(70, 420, 120, 548, (216, 208, 184)); rect(78, 430, 112, 520, (207, 232, 245), (160, 160, 150), 2); rect(60, 535, 180, 548, (216, 208, 184), OUT, 2)
    # floor stuff + glow
    for k, (x0, y0, x1, y1, c) in enumerate([(610, 640, 780, 760, (201, 164, 106)), (620, 590, 770, 650, (217, 181, 125)), (560, 700, 700, 800, (42, 45, 56))]): rect(x0, y0, x1, y1, c)
    poly([(300, 800), (420, 790), (410, 830), (290, 840)], (224, 164, 99))
    if 12 <= t < 16:
        g = .5 + .5 * math.sin(t * 8); sc = 1 + (t - 12) * .1
        poly([(500, 740), (500 + 260 * sc, 740), (480 + 290 * sc, 790), (480, 790)], (255, int(150 + 60 * g), 30), (255, 220, 120), 3)
        for i in range(9):
            k = t - 13 - i * .12
            if k > 0:
                cx, cy, a = 620 + 70 * math.sin(i * 2 + t), 760 - k * 160, t * 2 + i
                poly([rot((cx + dx, cy + dy), (cx, cy), a) for dx, dy in ((-18, -12), (18, -12), (18, 12), (-18, 12))], (244, 238, 220), OUT, 2)
    worker(t)

def outdoors(t):
    IMG.paste(SKY, (0, 0)); firework(EV_OUT, t)
    tc = (220, 174, 130); ground = (90, 58, 56)
    rect(40, 520, 440, 560, tc); rect(80, 440, 400, 522, tc)
    for cx, h in ((120, 120), (360, 120), (240, 190)): poly([(cx - 70, 442), (cx + 70, 442), (cx + 30, 442 - h), (cx - 30, 442 - h)], tc)
    for cx in (120, 240, 360): [rect(cx - 16 + o, 470, cx + 6 + o, 520, (190, 140, 100), (120, 80, 60), 2) for o in (-30, 30)]
    rect(-200, 620, 700, 1300, ground, None)
    boy_t = t - 16
    if t < 19: bs = dict(eye="closed", mouth="flat", armL=(-82, -150 + 6 * math.sin(t * 9)), armR=(62, -10), spark=1, tilt=-.06, blush=True)
    else:
        w = math.sin(t * 5) * 22; lau = abs(math.sin(t * 14))
        bs = dict(eye="open" if t < 22 else "happy", mouth="open", open=.3 + lau * .8, armL=(-80 + w, -40), armR=(80 - w, -40), spark=2, tilt=math.sin(t * 3.5) * .08, bob=abs(math.sin(t * 7)) * 8, blush=True, look=math.sin(t * 3))
    gs = dict(eye="happy" if t >= 22 else "open", mouth="smile", armL=(-50, 40), armR=(50, 40), tilt=.05 + .05 * math.sin(t * 1.3), blush=True, bob=abs(math.sin(t * 6)) * 5 if t >= 25 else 0, look=-.7)
    if t >= 21.6: front(160, 640, .9, "girl", t, gs)
    front(320, 640, .9, "boy", t, bs)

SHOTS = [(0, 0, (550, 300, 1.5)), (3, 0, (300, 480, 1.25)), (6, 0, (335, 410, 2.7)), (9, 0, (400, 560, .62)), (13, 0, (470, 650, .8)),
         (16, 1, (320, 500, 2.2)), (22, 1, (160, 500, 2.2)), (25, 1, (240, 500, 1.0))]
CAPS = [(6, 9, "Kya isbaar bhi Diwali\naise hi kat jayega....."), (9, 16, "Akelepan Mai............?"), (22, 25, "Ya Shayed...............")]

def caption(t, img):
    for (a, b, txt) in CAPS:
        if a <= t < b:
            d = ImageDraw.Draw(img); y = 80 * SS; words = [(ln.split(" "), ln) for ln in txt.split("\n")]; n = 0
            for ws, ln in words:
                tw = d.textlength(ln, font=CAPFONT); x = (W * SS - tw) / 2
                for w in ws:
                    k = ease((t - a - n * .2) / .35); n += 1
                    if k > 0:
                        ww = d.textlength(w + " ", font=CAPFONT)
                        d.text((x + 3, y + 3 + (1 - k) * 18 * SS), w, font=CAPFONT, fill=(0, 0, 0, 120), stroke_width=0)
                        d.text((x, y + (1 - k) * 18 * SS), w, font=CAPFONT, fill=(255, 255, 255), stroke_width=2, stroke_fill=(30, 20, 20))
                    x += d.textlength(w + " ", font=CAPFONT)
                y += 44 * SS

def frame(t):
    global D, IMG, cam
    i = max(k for k, s in enumerate(SHOTS) if s[0] <= t); sh = SHOTS[i]; pr = SHOTS[max(i - 1, 0)]
    k = 1 if pr[1] != sh[1] else ease((t - sh[0]) / 1.1)
    c = [pr[2][j] + (sh[2][j] - pr[2][j]) * k for j in range(3)]
    cam = [c[0] + math.sin(t * .9) * 4, c[1] + math.sin(t * 1.3) * 3, c[2] * (1 + (t - sh[0]) * .012)]
    img = IMG = Image.new("RGB", (W * SS, H * SS)); D = ImageDraw.Draw(img)
    (outdoors if sh[1] else office)(t)
    caption(t, img)
    if 16 <= t < 16.9: img = Image.blend(img, Image.new("RGB", img.size, (255, 255, 255)), 1 - (t - 16) / .9)   # white flash cut
    return img.resize((W, H), Image.LANCZOS)

if __name__ == "__main__":
    total = int(DUR * FPS)
    ff = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
                           "-i", "audio.m4a", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "20", "-c:a", "copy", "-shortest", OUTFILE], stdin=subprocess.PIPE)
    for n in range(total):
        ff.stdin.write(frame(n / FPS).tobytes())
        if n % FPS == 0: print(f"\r{n}/{total}", end="", flush=True)
    ff.stdin.close(); ff.wait(); print(f"\nDone → {OUTFILE}")
