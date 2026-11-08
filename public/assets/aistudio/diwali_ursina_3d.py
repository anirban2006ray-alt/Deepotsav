from ursina import *
import math, random

app = Ursina(title="3D Happy Diwali Lighting Animation", borderless=False)
window.color = color.rgb(10, 2, 24)

# Play your uploaded Diwali song if present in the folder
try:
    song = Audio('diwali_song.mp3', loop=True, autoplay=True)
except Exception:
    song = None

# 3D Lighting Setup
AmbientLight(color=color.rgba(90, 40, 130, 180))
diya_light = PointLight(parent=scene, position=(0, 2, 0), color=color.orange)

# Central 3D Diya Base & Flame
central_diya = Entity(model='sphere', color=color.rgb(181, 69, 27), scale=(2.8, 1.0, 2.8), position=(0, -1, 0))
central_rim  = Entity(model='torus', color=color.gold, scale=(2.9, 0.3, 2.9), position=(0, -0.6, 0))
central_flame = Entity(model='cone', color=color.yellow, scale=(0.7, 1.8, 0.7), position=(0, 0.5, 0), unlit=True)

# Ring of 10 Orbiting 3D Diyas
ring_pivot = Entity()
flames = [central_flame]
for i in range(10):
    angle = i * (2 * math.pi / 10)
    x, z = math.cos(angle) * 5.5, math.sin(angle) * 5.5
    Entity(parent=ring_pivot, model='sphere', color=color.rgb(181, 69, 27), scale=(1.2, 0.5, 1.2), position=(x, -1, z))
    f = Entity(parent=ring_pivot, model='cone', color=color.orange, scale=(0.35, 0.9, 0.35), position=(x, -0.3, z), unlit=True)
    flames.append(f)

# Multilingual Greetings + Synced Audio Lyrics UI
greetings = [
    "Happy Diwali!",
    "Shubh Deepavali! (Hindi)",
    "Shubho Deepaboli! (Bengali)",
    "Iniya Deepavali! (Tamil)",
    "Deepavali Shubhakankshalu! (Telugu)",
    "Diwalichya Hardik Shubhechha! (Marathi)"
]
title_text = Text(text=greetings[0], position=(0, 0.42), origin=(0, 0), scale=2.4, color=color.gold)
lyric_text = Text(text="Mere tumhare sabke liye, Happy Diwali!", position=(0, -0.42), origin=(0, 0), scale=1.5, color=color.yellow)

EditorCamera()
camera.position = (0, 3.5, -14)
camera.rotation_x = 12

t = 0.0
def update():
    global t
    t += time.dt
    beat = abs(math.sin(t * 6.5)) ** 3

    # Rotate 3D Diya ring and pulse flames to the beat
    ring_pivot.rotation_y += 25 * time.dt
    for idx, f in enumerate(flames):
        f.scale_y = (1.5 if idx == 0 else 0.85) + beat * 0.45

    # Sync lyrics to the 19-second audio cycle
    cycle = t % 19.0
    if cycle < 6.5:
        lyric_text.text = "Mere tumhare sabke liye, Happy Diwali!"
    elif cycle < 12.5:
        lyric_text.text = "Saare sitaare uske liye, Happy Diwali!"
    else:
        lyric_text.text = "Mere tumhare sabke liye, Happy Diwali! (Diwali...)"

    # Cycle multilingual greeting every 2.5 seconds
    title_text.text = greetings[int(t / 2.5) % len(greetings)]

if __name__ == '__main__':
    app.run()
