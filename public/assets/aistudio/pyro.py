"""pyro.py – shared firework engine (NumPy + OpenCV + Pillow). Used by crackers/render_crackers.py and greeting/render_greeting.py"""
import glob, subprocess
import numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont

ease = lambda x: (lambda v: v * v * (3 - 2 * v))(min(max(x, 0), 1))
TRAIL = ((0, 1), (.035, .55), (.085, .25))                       # (time offset, brightness) of each comet-trail layer
LONG = ((0, 1), (.04, .8), (.09, .65), (.16, .5), (.26, .35), (.4, .22))

def font_path(bold=True, italic=False, serif=True):
    name = "DejaVu" + ("Serif" if serif else "Sans") + ("-Bold" if bold else "") + ("Italic" if italic else "")
    return (glob.glob(f"/usr/share/fonts/**/{name}.ttf", recursive=True) or glob.glob("/usr/share/fonts/**/DejaVu*.ttf", recursive=True))[0]

def text_targets(txt, size, step=3, italic=False, serif=True):
    """pixel coordinates (centred on 0,0) that spell txt – particles fly to these points"""
    f = ImageFont.truetype(font_path(True, italic, serif), size); l, t, r, b = f.getbbox(txt)
    im = Image.new("L", (r - l + 20, b - t + 20)); ImageDraw.Draw(im).text((10 - l, 10 - t), txt, font=f, fill=255)
    ys, xs = np.nonzero(np.asarray(im)[::step, ::step] > 128)
    return np.stack([xs * step - im.width / 2, ys * step - im.height / 2], 1).astype(np.float32)

class Pyro:
    def __init__(s, W, H, N=14000, trail=TRAIL, seed=7):
        s.W, s.H, s.N, s.trail, s.head = W, H, N, trail, 0; s.nr = np.random.default_rng(seed)
        s.pos = np.zeros((N, 2), np.float32); s.vel = np.zeros((N, 2), np.float32); s.life = np.zeros(N, np.float32); s.ml = np.ones(N, np.float32)
        s.c0 = np.zeros((N, 3), np.float32); s.c1 = np.zeros((N, 3), np.float32); s.drag = np.full(N, .955, np.float32); s.grav = np.zeros(N, np.float32)

    def emit(s, p, v, l, c0, c1=None, drag=.955, grav=0.):
        n = len(l); i = (s.head + np.arange(n)) % s.N; s.head = (s.head + n) % s.N
        c0 = np.broadcast_to(np.asarray(c0, np.float32), (n, 3)); c1 = c0 if c1 is None else np.broadcast_to(np.asarray(c1, np.float32), (n, 3))
        s.pos[i], s.vel[i], s.life[i], s.ml[i], s.c0[i], s.c1[i], s.drag[i], s.grav[i] = p, v, l, l, c0, c1, drag, grav

    def burst(s, cx, cy, v0, n, pal, pal2=None, life=(1.7, 3.0), drag=.955, grav=0., shell=.8, flat=False):
        """spherical shell of sparks; v0 = speed (px/s); pal -> pal2 = colour change as the sparks cool"""
        a = s.nr.uniform(0, 6.283, n); b = np.arccos(2 * s.nr.uniform(size=n) - 1) if not flat else np.full(n, 1.5708)
        sp = v0 * np.where(s.nr.uniform(size=n) < shell, .92 + .08 * s.nr.uniform(size=n), .3 + .5 * s.nr.uniform(size=n))
        v = np.stack([np.sin(b) * np.cos(a) * sp, -np.sin(b) * np.sin(a) * sp], 1)
        pick = s.nr.integers(0, len(pal), n); c0 = np.array(pal, np.float32)[pick]
        c1 = np.array(pal2, np.float32)[s.nr.integers(0, len(pal2), n)] if pal2 else None
        s.emit(np.tile([cx, cy], (n, 1)), v, s.nr.uniform(*life, n), c0, c1, drag, grav)

    def step(s, dt):
        m = s.life > 0; s.life[m] -= dt
        s.vel[m] *= (s.drag[m] ** (dt * 60))[:, None]; s.vel[m, 1] += s.grav[m] * dt; s.pos[m] += s.vel[m] * dt

    def splat(s, layer, p, v, w, trail=None):
        for off, b in (trail or s.trail):
            q = p - v * off; ix = q[:, 0].astype(int); iy = q[:, 1].astype(int)
            ok = (ix >= 0) & (ix < s.W) & (iy >= 0) & (iy < s.H); np.add.at(layer, (iy[ok], ix[ok]), w[ok] * b)

    def layer(s, t):
        L = np.zeros((s.H, s.W, 3), np.float32); m = s.life > 0
        if m.any():
            f = np.clip(s.life[m] / s.ml[m], 0, 1); k = (1 - f)[:, None]; col = s.c0[m] * (1 - k) + s.c1[m] * k
            a = np.minimum(1, f * 2.2) * np.where(f < .4, .6 + .4 * np.sin(t * 38 + np.arange(m.sum()) * 1.7), 1)
            s.splat(L, s.pos[m], s.vel[m], col * a[:, None])
        return L

def glow(L, core=1.6, g2=4.2, g8=7., g30=9.):
    """tight core + soft halos – the long-exposure pyrotechnic look"""
    return L * core + cv2.GaussianBlur(L, (0, 0), 2.0) * g2 + cv2.GaussianBlur(L, (0, 0), 8) * g8 + cv2.GaussianBlur(L, (0, 0), 30) * g30

def blob(shape, x, y, r, col, k=1.0, blur=None):
    im = np.zeros(shape, np.float32); cv2.circle(im, (int(x), int(y)), max(1, int(r)), tuple(float(c) for c in col), -1)
    return cv2.GaussianBlur(im, (0, 0), blur or max(2, r * .8)) * k

def video_writer(W, H, fps, audio, out):
    ff = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(fps), "-i", "-", "-i", audio,
                           "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "19", "-c:a", "copy", "-shortest", out], stdin=subprocess.PIPE)
    return ff, lambda img: ff.stdin.write((np.clip(img, 0, 1) * 255).astype(np.uint8).tobytes())
