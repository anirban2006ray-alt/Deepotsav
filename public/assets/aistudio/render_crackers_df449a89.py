#!/usr/bin/env python3
"""Beach crackers: a rocket climbs from a lamp on the horizon and breaks into one giant pink→red willow shell.
Usage: python3 render_crackers.py [out.mp4]   (needs audio.m4a beside it, and ../pyro.py)"""
import os, sys, math
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from pyro import *

W, H, FPS, DUR = 540, 960, 30, 11.35
OUT = sys.argv[1] if len(sys.argv) > 1 else "crackers_beach.mp4"
HZ = int(.64 * H); LAMP = (W * .5, H * .53); T_BURST = 3.35
rng = np.random.default_rng(3)

# ---------- night sky with soft clouds (static) ----------
def make_sky():
    n = cv2.GaussianBlur(cv2.resize(rng.random((9, 6)).astype(np.float32), (W, HZ), interpolation=cv2.INTER_CUBIC), (0, 0), 25)
    y = np.linspace(0, 1, HZ, dtype=np.float32)[:, None, None]
    top, bot = np.array([6, 10, 28], np.float32) / 255, np.array([22, 32, 58], np.float32) / 255
    return np.clip(top + (bot - top) * y + (n[..., None] - .5) * np.array([.10, .11, .15], np.float32), 0, 1)
SKY = make_sky()

# ---------- animated surf: foam crests sliding up a lamp-lit beach ----------
def beach(t):
    h = H - HZ; y = np.linspace(0, 1, h, dtype=np.float32)[:, None]; x = np.linspace(0, 1, W, dtype=np.float32)[None, :]
    ph = y * 14 - t * 1.3 + np.sin(x * 7 + t * .8) * .9 + np.sin(x * 17 - t * 1.7) * .35
    foam = np.clip(np.sin(ph * math.pi), 0, 1) ** 4
    surf = np.clip((y - .08) / .2, 0, 1) * (1 - np.clip((y - .75) / .25, 0, 1) * .5)
    gold = np.array([255, 205, 110], np.float32) / 255
    img = (np.array([8, 12, 22], np.float32) / 255 + y[..., None] * np.array([.10, .07, .04], np.float32)) * np.ones((h, W, 1), np.float32)
    img = img + (foam * surf)[..., None] * gold * .9 + (np.clip(1 - abs(y - .35) / .3, 0, 1) * .16)[..., None] * gold
    sea = np.array([4, 10, 22], np.float32) / 255; img[:int(.07 * H)] = sea * .8        # dark water strip under the horizon
    return img

P = Pyro(W, H, N=9000, trail=LONG, seed=5)
REFL = np.clip(2 * HZ - np.arange(HZ, H), 0, H - 1); FADE = np.clip(1 - (np.arange(HZ, H) - HZ) / (H - HZ) * 1.3, 0, 1)[:, None, None]
burst_done = False

def frame(t, dt):
    global burst_done
    extra = np.zeros((H, W, 3), np.float32)
    # rocket: slow accelerating climb with a spark tail, head swells into a glowing orange ball
    if 1.0 <= t < T_BURST:
        k = ((t - 1.0) / (T_BURST - 1.0)) ** 1.5; x = LAMP[0] + (W * .44 - LAMP[0]) * k + math.sin(t * 9) * 2; y = LAMP[1] + (H * .27 - LAMP[1]) * k
        P.emit(np.tile([x, y], (4, 1)), np.stack([P.nr.uniform(-25, 25, 4), P.nr.uniform(10, 70, 4)], 1), np.full(4, .7), (1, .85, .6), None, .95, 60)
        extra += blob(extra.shape, x, y, 3 + k ** 3 * 34, (1, .6, .2), .6 + 2.2 * k ** 3)
    if t >= T_BURST and not burst_done:                                # the giant shell: pink-white sparks that cool to red and droop
        burst_done = True
        P.burst(W * .5, H * .30, .74 * W, 2800, [(1, .88, .95), (1, .72, .82), (1, .78, .55)], [(1, .22, .12), (.9, .12, .1), (1, .4, .15)], life=(6.5, 8.2), drag=.975, grav=45)
    if t >= T_BURST:
        a = t - T_BURST; extra += blob(extra.shape, W * .5, H * .30, 60 + 20 * a, (1, .5, .3), max(0, 1 - a / .5) * 2.2, 30)
        extra += blob(extra.shape, W * .5, H * .30, 70, (1, .12, .08), max(0, 1 - a / 4.5) * .9, 50)   # red core glow
    P.step(dt)
    g = glow(P.layer(t), 1.8, 5.0, 8.0, 6.0) + extra
    lamp = blob(extra.shape, LAMP[0], LAMP[1], 5, (1, .7, .25), 1.6 + .3 * math.sin(t * 13), 6) + blob(extra.shape, LAMP[0], LAMP[1], 14, (1, .6, .2), .5, 18)
    img = np.concatenate([SKY * (1 + g[:HZ].mean() * 2.5), beach(t) * (1 + g[HZ:].mean() * 1.5)], 0)
    img[HZ:] += g[REFL] * .10 * FADE * (1 + .15 * np.sin(np.arange(HZ, H) * .35 + t * 3))[:, None, None]   # glittering reflection on the water
    img += g + lamp
    return img * min(1, t / .35)

if __name__ == "__main__":
    ff, put = video_writer(W, H, FPS, "audio.m4a", OUT); total = int(DUR * FPS)
    for n in range(total):
        put(frame(n / FPS, 1 / FPS))
        if n % FPS == 0: print(f"\r{n}/{total}", end="", flush=True)
    ff.stdin.close(); ff.wait(); print(f"\nDone → {OUT}")
