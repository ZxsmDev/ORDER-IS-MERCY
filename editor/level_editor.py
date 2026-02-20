import os
import json
import tkinter as tk
from tkinter import ttk, filedialog, messagebox

# ============================================================
# CONFIG
# ============================================================

TILE = 25
MAX_WIDTH_PX = 1700
MAX_HEIGHT_PX = 1000

ROWS = MAX_HEIGHT_PX // TILE
COLS = MAX_WIDTH_PX // TILE

# ============================================================
# OBJECT DEFINITIONS (authoritative)
# ============================================================

OBJECT_DEFS = {
    "ground": {"color": "#1d1103", "type": "ground"},
    "platform": {"color": "#56381a", "type": "platform"},
    "wall": {"color": "#111111", "type": "wall"},
    "ramp_up": {"color": "#444444", "type": "ramp", "slope": 1},
    "ramp_down": {"color": "#666666", "type": "ramp", "slope": -1},
    "door": {
        "color": "#57391a",
        "type": "interactable",
        "interaction": "door",
        "direction": "left",
        "height": 3,
    },
    "player": {
        "color": "#1E90FF",
        "type": "playerSpawn",
        "height": 2,
    },
    "enemy": {
        "color": "#8B0000",
        "type": "enemy",
        "height": 2,
    },
}

TOOLS = ("paint", "rect", "line", "erase")
META_FIELDS = ("id", "name", "notes")

# ============================================================
# LEVEL EDITOR
# ============================================================

class LevelEditor:
    def __init__(self, root):
        self.root = root

        # ---------- State ----------
        self.current_object = "ground"
        self.current_tool = "paint"

        self.objects = []
        self.canvas_items = {}

        self.undo_stack = []
        self.redo_stack = []

        self.drag_start = None
        self.is_dragging = False

        self.show_camera = True

        # self.level_id = "test_level" 
        # self.level_name = "Test Level" 
        # self.level_notes = ""

        self.setup_ui()
        self.draw_grid()
        self.draw_camera_overlay()

    # ========================================================
    # UI
    # ========================================================

    def setup_ui(self):
        main = ttk.Frame(self.root)
        main.pack(fill=tk.BOTH, expand=True)

        left = ttk.Frame(main, padding=30)
        left.pack(side=tk.LEFT, fill=tk.Y)

        ttk.Label(left, text="Level Editor", font=("Segoe UI", 16, "bold")).pack(pady=5)

        # ----- Level Meta ----- 
        meta = ttk.LabelFrame(left, text="Meta")
        meta.pack(fill=tk.X, pady=5)

        for field in META_FIELDS:
            ttk.Label(meta, text=field.capitalize()).pack(anchor=tk.W, padx=10, pady=(10, 0))
            entry = ttk.Entry(meta)
            entry.pack(fill=tk.X, padx=10, pady=5)

        # ----- Object Palette (COLOR VISUALIZATION) -----
        palette = ttk.LabelFrame(left, text="Objects")
        palette.pack(fill=tk.X, pady=5)

        self.object_var = tk.StringVar(value=self.current_object)

        for name, spec in OBJECT_DEFS.items():
            b = tk.Radiobutton(
                palette,
                text=name,
                variable=self.object_var,
                value=name,
                indicatoron=False,
                background=spec["color"],
                fg="white",
                selectcolor=spec["color"],
                command=self.change_object,
                relief=tk.FLAT,
                height=1
            )
            b.pack(fill=tk.X, padx=5, pady=2)

        # ----- Tools -----
        tool_box = ttk.LabelFrame(left, text="Tools")
        tool_box.pack(fill=tk.X, pady=5)

        self.tool_var = tk.StringVar(value=self.current_tool)
        for t in TOOLS:
            ttk.Radiobutton(
                tool_box,
                text=t.capitalize(),
                value=t,
                variable=self.tool_var,
                command=self.change_tool
            ).pack(anchor=tk.W, padx=10)

        # ----- Actions -----
        ttk.Button(left, text="Undo (Ctrl+Z)", command=self.undo).pack(fill=tk.X, pady=2)
        ttk.Button(left, text="Redo (Ctrl+Y)", command=self.redo).pack(fill=tk.X, pady=2)
        ttk.Button(left, text="Save JSON", command=self.save_json).pack(fill=tk.X, pady=5)
        ttk.Button(left, text="Clear", command=self.clear_level).pack(fill=tk.X)

        self.status = tk.StringVar(value="Ready")
        ttk.Label(left, textvariable=self.status, wraplength=220).pack(pady=5)

        # ---------- Canvas ----------
        self.canvas = tk.Canvas(
            main,
            bg="#121212",
            width=MAX_WIDTH_PX,
            height=MAX_HEIGHT_PX
        )
        self.canvas.pack(side=tk.RIGHT, fill=tk.BOTH, expand=True)

        self.canvas.bind("<Button-1>", self.on_mouse_down)
        self.canvas.bind("<B1-Motion>", self.on_mouse_drag)
        self.canvas.bind("<ButtonRelease-1>", self.on_mouse_up)
        self.canvas.bind("<Motion>", self.on_mouse_move)

        self.root.bind("<Control-z>", lambda e: self.undo())
        self.root.bind("<Control-y>", lambda e: self.redo())

    # ========================================================
    # Grid + Camera
    # ========================================================

    def draw_grid(self):
        self.canvas.delete("grid")

        for y in range(0, MAX_HEIGHT_PX + 1, TILE):
            self.canvas.create_line(0, y, MAX_WIDTH_PX, y, fill="#2a2a2a", tags="grid")

        for x in range(0, MAX_WIDTH_PX + 1, TILE):
            self.canvas.create_line(x, 0, x, MAX_HEIGHT_PX, fill="#2a2a2a", tags="grid")

    def draw_camera_overlay(self):
        self.canvas.delete("camera")

        if not self.show_camera:
            return

        # Camera bounds
        self.canvas.create_rectangle(
            0, 0, MAX_WIDTH_PX, MAX_HEIGHT_PX,
            outline="#00ffff",
            width=2,
            tags="camera"
        )

        # Deadzone
        dz_w, dz_h = 300, 200
        cx, cy = MAX_WIDTH_PX // 2, MAX_HEIGHT_PX // 2

        self.canvas.create_rectangle(
            cx - dz_w // 2,
            cy - dz_h // 2,
            cx + dz_w // 2,
            cy + dz_h // 2,
            outline="#ff00ff",
            dash=(4, 2),
            tags="camera"
        )

    # ========================================================
    # Tools
    # ========================================================

    def change_tool(self):
        self.current_tool = self.tool_var.get()
        self.status.set(f"Tool: {self.current_tool}")

    def change_object(self):
        self.current_object = self.object_var.get()
        self.status.set(f"Object: {self.current_object}")

    def snap(self, v):
        return (v // TILE) * TILE

    # ========================================================
    # Mouse
    # ========================================================

    def on_mouse_down(self, e):
        self.drag_start = (self.snap(e.x), self.snap(e.y))
        self.is_dragging = True

        if self.current_tool == "paint":
            self.place_object(*self.drag_start)

        elif self.current_tool == "erase":
            self.erase_at(e.x, e.y)

    def on_mouse_drag(self, e):
        if not self.is_dragging:
            return

        x, y = self.snap(e.x), self.snap(e.y)

        if self.current_tool == "paint":
            self.place_object(x, y)
        elif self.current_tool == "erase":
            self.erase_at(e.x, e.y)

    def on_mouse_up(self, e):
        if not self.drag_start:
            return

        x0, y0 = self.drag_start
        x1, y1 = self.snap(e.x), self.snap(e.y)

        if self.current_tool == "rect":
            self.place_rect(x0, y0, x1, y1)
        elif self.current_tool == "line":
            self.place_line(x0, y0, x1, y1)

        self.drag_start = None
        self.is_dragging = False

    def on_mouse_move(self, e):
        self.canvas.delete("cursor")
        x, y = self.snap(e.x), self.snap(e.y)

        self.canvas.create_line(x, 0, x, MAX_HEIGHT_PX, fill="#444444", tags="cursor")
        self.canvas.create_line(0, y, MAX_WIDTH_PX, y, fill="#444444", tags="cursor")

        self.status.set(f"x: {x}px  y: {y}px")

    # ========================================================
    # Placement
    # ========================================================

    def push_undo(self):
        self.undo_stack.append(json.dumps(self.objects))
        self.redo_stack.clear()

    def place_object(self, x, y):
        spec = OBJECT_DEFS[self.current_object]
        h_tiles = spec.get("height", 1)
        h = TILE * h_tiles

        obj = {
            "type": spec["type"],
            "x": x,
            "y": y - h + TILE,
            "width": TILE,
            "height": h,
        }

        if "slope" in spec:
            obj["slope"] = spec["slope"]

        if spec["type"] == "interactable":
            obj["interaction"] = spec["interaction"]
            obj["direction"] = spec["direction"]

        self.push_undo()
        self.objects.append(obj)
        self.draw_object(obj)

    def place_rect(self, x0, y0, x1, y1):
        spec = OBJECT_DEFS[self.current_object]
        if "slope" in spec:
            return

        self.push_undo()

        x = min(x0, x1)
        y = min(y0, y1)
        w = abs(x1 - x0) + TILE
        h = abs(y1 - y0) + TILE

        obj = {
            "type": spec["type"],
            "x": x,
            "y": y,
            "width": w,
            "height": h,
        }

        self.objects.append(obj)
        self.draw_object(obj)

    def place_line(self, x0, y0, x1, y1):
        if abs(x1 - x0) >= abs(y1 - y0):
            self.place_rect(x0, y0, x1, y0)
        else:
            self.place_rect(x0, y0, x0, y1)

    # ========================================================
    # Erase / Undo / Redo
    # ========================================================

    def erase_at(self, x, y):
        item = self.canvas.find_closest(x, y)
        if not item:
            return

        cid = item[0]
        if cid in self.canvas_items:
            self.push_undo()
            obj = self.canvas_items.pop(cid)
            self.objects.remove(obj)
            self.canvas.delete(cid)

    def undo(self):
        if not self.undo_stack:
            return
        self.redo_stack.append(json.dumps(self.objects))
        self.objects = json.loads(self.undo_stack.pop())
        self.redraw_all()

    def redo(self):
        if not self.redo_stack:
            return
        self.undo_stack.append(json.dumps(self.objects))
        self.objects = json.loads(self.redo_stack.pop())
        self.redraw_all()

    # ========================================================
    # Drawing
    # ========================================================

    def draw_object(self, obj):
        color = next(v["color"] for v in OBJECT_DEFS.values() if v["type"] == obj["type"])

        cid = self.canvas.create_rectangle(
            obj["x"], obj["y"],
            obj["x"] + obj["width"],
            obj["y"] + obj["height"],
            fill=color,
            outline="#ffffff"
        )
        self.canvas_items[cid] = obj

    def redraw_all(self):
        self.canvas.delete("all")
        self.canvas_items.clear()
        self.draw_grid()
        self.draw_camera_overlay()
        for obj in self.objects:
            self.draw_object(obj)

    # ========================================================
    # Export
    # ========================================================

    def save_json(self):
        data = { 
            "id": "", 
            "debug": { 
                "name": "", 
                "notes": "self.level_notes_entry.get()", 
            }, 
            "size": {"width": MAX_WIDTH_PX, "height": MAX_HEIGHT_PX},

            "playerSpawn": {
                "x": 0, 
                "y": 0
            }, 

            "camera": { 
                "bounds": {"x": 0, "y": 0, "width": MAX_WIDTH_PX, "height": MAX_HEIGHT_PX},
                "deadZone": {"width": 300, "height": 200},
            },
            "geometry": self.objects, 
            
        }

        path = filedialog.asksaveasfilename(defaultextension=".json")
        if not path:
            return

        with open(path, "w") as f:
            json.dump(data, f, indent=2)

        messagebox.showinfo("Saved", "Level saved successfully.")

    def clear_level(self):
        self.push_undo()
        self.objects.clear()
        self.redraw_all()


# ============================================================
# ENTRY
# ============================================================

if __name__ == "__main__":
    root = tk.Tk()
    root.title("Level Editor")
    app = LevelEditor(root)
    root.mainloop()