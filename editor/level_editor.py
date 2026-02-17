import os
import tkinter as tk
from tkinter import ttk, filedialog, simpledialog, messagebox
import json

class LevelEditor:
    def __init__(self, root):
        self.root = root

        # ====== Configurable Parameters ======
        self.rows = 20
        self.cols = 30
        self.tile_size = 25

        self.current_object = "empty"

        self.objects = {
            "empty": "gray",
            "ground": "#000000",
            "platform": "#505050",
            "wall": "#191919",
            "ramp_up": "#CD6600",
            "ramp_down": "#FFB300"
        }

        self.grid_data = []
        self.rect_ids = []

        self.setup_ui()
        self.create_grid()

    # ================= UI ===================

    def setup_ui(self):
        style = ttk.Style(self.root)
        try:
            style.configure("Primary.TButton", foreground="#ffffff", background="#2E8B57")
            style.configure("Accent.TFrame", background="#1f1f1f")
        except Exception:
            pass

        main = ttk.Frame(self.root)
        main.pack(fill=tk.BOTH, expand=True)

        # Left control panel
        left = ttk.Frame(main, style="Accent.TFrame", padding=(25, 25))
        left.pack(side=tk.LEFT, fill=tk.Y)

        title_frame = ttk.Frame(left)
        title_frame.pack(fill=tk.X)

        ttk.Label(title_frame, text="Level Editor", font=(None, 18, "bold")).pack(anchor=tk.W, padx=(80, 80), pady=(10, 10))

        cfg_frame = ttk.Frame(left)
        cfg_frame.pack(fill=tk.X, padx=(30, 30), pady=(20, 10))

        ttk.Label(cfg_frame, text="Rows").grid(row=0, column=0, sticky=tk.W, padx=(20, 0), pady=(10, 10))
        self.rows_entry = ttk.Entry(cfg_frame, width=6)
        self.rows_entry.insert(0, str(self.rows))
        self.rows_entry.grid(row=0, column=1,padx=(0, 20), pady=(10, 10))

        ttk.Label(cfg_frame, text="Cols").grid(row=1, column=0, sticky=tk.W, padx=(20, 0), pady=(10, 10))
        self.cols_entry = ttk.Entry(cfg_frame, width=6)
        self.cols_entry.insert(0, str(self.cols))
        self.cols_entry.grid(row=1, column=1, padx=(0, 20), pady=(10, 10))

        ttk.Label(cfg_frame, text="Tile Size").grid(row=2, column=0, sticky=tk.W, padx=(20, 20), pady=(10, 10))
        self.tile_entry = ttk.Entry(cfg_frame, width=6)
        self.tile_entry.insert(0, str(self.tile_size))
        self.tile_entry.grid(row=2, column=1, padx=(0, 20), pady=(10, 10))

        btn_frame = ttk.Frame(left)
        btn_frame.pack(fill=tk.X, padx=(50, 50), pady=(20, 20))

        ttk.Button(btn_frame, text="Resize", command=self.resize_grid, style="Primary.TButton").pack(side=tk.LEFT, padx=(10, 10), pady=(10, 10))
        ttk.Button(btn_frame, text="Save JSON", command=self.save_json).pack(side=tk.LEFT, padx=(0, 10), pady=(10, 10))

        ttk.Separator(left, orient=tk.HORIZONTAL).pack(fill=tk.X, pady=(20, 20))

        # Object selector and preview
        ttk.Label(left, text="Object Type", font=(None, 16, "bold")).pack(anchor=tk.W, padx=(20, 20), pady=(10, 10))
        self.object_var = tk.StringVar(value=self.current_object)
        dropdown = ttk.Combobox(left, textvariable=self.object_var, values=list(self.objects.keys()), state="readonly")
        dropdown.pack(fill=tk.X, padx=(20, 10), pady=(20, 10))
        dropdown.bind("<<ComboboxSelected>>", self.change_object)

        color_preview_frame = ttk.Frame(left)
        color_preview_frame.pack(fill=tk.X, padx=(20, 10), pady=(20, 10))
        ttk.Label(color_preview_frame, text="Color Preview:").pack(side=tk.LEFT, padx=(10, 10))
        self.color_preview = tk.Canvas(color_preview_frame, width=24, height=16, bd=1)
        self.color_preview.pack(side=tk.RIGHT, padx=(10, 10), pady=(5, 5))
        self._update_color_preview()

        ttk.Separator(left, orient=tk.HORIZONTAL).pack(fill=tk.X, padx=(20, 10), pady=(20, 10))

        # Description / instructions
        ttk.Label(left, text="Tool Info", font=(None, 16, "bold")).pack(anchor=tk.W, padx=(20, 20), pady=(10, 10))
        info = (
            "Left-click a tile to place the selected object.\n"
            "Right-click a tile to edit its description.\n"
            "Use Resize to change the grid and Save JSON to export geometry."
        )

        info_label = ttk.Label(left, text=info, wraplength=220, justify=tk.LEFT)
        info_label.pack(fill=tk.X, padx=(20, 10), pady=(20, 10))

        # Small live status area
        self.status_var = tk.StringVar(value="Selected: empty")
        ttk.Label(left, textvariable=self.status_var, font=(None, 9)).pack(anchor=tk.W, padx=(20, 10), pady=(20, 10))

        # Canvas on the right
        right = ttk.Frame(main)
        right.pack(side=tk.RIGHT, fill=tk.BOTH, expand=True)

        self.canvas = tk.Canvas(right, bg="#121212", highlightthickness=0)
        self.canvas.pack(fill=tk.BOTH, expand=True)

    # ============== Grid Logic ==============

    def create_grid(self):
        self.canvas.delete("all")
        self.grid_data = []
        self.rect_ids = []

        for r in range(self.rows):
            row = []
            rect_row = []
            for c in range(self.cols):
                x1 = c * self.tile_size
                y1 = r * self.tile_size
                x2 = x1 + self.tile_size
                y2 = y1 + self.tile_size

                rect = self.canvas.create_rectangle(
                    x1, y1, x2, y2,
                    fill="gray",
                    outline="white"
                )

                self.canvas.tag_bind(rect, "<Button-1>", lambda e, row=r, col=c: self.place_object(row, col))
                self.canvas.tag_bind(rect, "<Button-3>", lambda e, row=r, col=c: self.edit_description(row, col))

                row.append({
                    "type": "empty",
                    "description": ""
                })
                rect_row.append(rect)

            self.grid_data.append(row)
            self.rect_ids.append(rect_row)

        self.canvas.config(width=self.cols*self.tile_size, height=self.rows*self.tile_size)

    def resize_grid(self):
        try:
            self.rows = int(self.rows_entry.get())
            self.cols = int(self.cols_entry.get())
            self.tile_size = int(self.tile_entry.get())
            self.create_grid()
        except ValueError:
            messagebox.showerror("Error", "Rows, Cols, and Tile Size must be integers.")

    def change_object(self, event):
        self.current_object = self.object_var.get()
        self._update_color_preview()
        self.status_var.set(f"Selected: {self.current_object}")

    def place_object(self, row, col):
        obj_type = self.current_object
        self.grid_data[row][col]["type"] = obj_type

        self.canvas.itemconfig(
            self.rect_ids[row][col],
            fill=self.objects[obj_type]
        )
        self.status_var.set(f"Placed {obj_type} at {row},{col}")

    def edit_description(self, row, col):
        desc = simpledialog.askstring("Tile Description", "Enter description:")
        if desc is not None:
            self.grid_data[row][col]["description"] = desc
            self.status_var.set(f"Updated description at {row},{col}")

    def _update_color_preview(self):
        try:
            color = self.objects.get(self.object_var.get(), "gray")
        except Exception:
            color = "gray"
        self.color_preview.delete("all")
        self.color_preview.create_rectangle(0, 0, 24, 18, fill=color, outline="black")

    # ============== JSON Export ==============

    def generate_geometry(self):
        """
        Converts grid into geometry objects compatible
        with your Level class.
        """
        geometry = []

        for r in range(self.rows):
            for c in range(self.cols):
                tile = self.grid_data[r][c]
                t = tile["type"]

                if t == "empty":
                    continue

                x = c * self.tile_size
                y = r * self.tile_size

                if t in ["ground", "platform", "wall"]:
                    geometry.append({
                        "type": t,
                        "x": x,
                        "y": y,
                        "width": self.tile_size,
                        "height": self.tile_size,
                    })

                elif t == "ramp_up":
                    geometry.append({
                        "type": "ramp",
                        "x": x,
                        "y": y,
                        "width": self.tile_size,
                        "height": self.tile_size,
                        "slope": 1,
                    })

                elif t == "ramp_down":
                    geometry.append({
                        "type": "ramp",
                        "x": x,
                        "y": y,
                        "width": self.tile_size,
                        "height": self.tile_size,
                        "slope": -1,
                    })

        return geometry

    def save_json(self):
        data = {
            "rows": self.rows,
            "cols": self.cols,
            "tile_size": self.tile_size,
            "geometry": self.generate_geometry()
        }

        file_path = filedialog.asksaveasfilename(
            defaultextension=".json",
            filetypes=[("JSON files", "*.json")]
        )

        if file_path:
            with open(file_path, "w") as f:
                json.dump(data, f, indent=2)

            messagebox.showinfo("Saved", "Level saved successfully.")


if __name__ == "__main__":
    root = tk.Tk()
    root.title("Level Editor")

    # Source the theme file relative to this script's directory so
    # it works even if the working directory is different.
    script_dir = os.path.dirname(os.path.abspath(__file__))
    theme_path = os.path.join(script_dir, "azure.tcl")

    if not os.path.exists(theme_path):
        messagebox.showerror("Theme Error", f"azure.tcl not found at: {theme_path}")
    else:
        root.tk.call("source", theme_path)
        root.tk.call("set_theme", "dark")

    app = LevelEditor(root)

    root.update()
    root.minsize(root.winfo_width(), root.winfo_height())
    x_cordinate = int((root.winfo_screenwidth() / 2) - (root.winfo_width() / 2))
    y_cordinate = int((root.winfo_screenheight() / 2) - (root.winfo_height() / 2))
    root.geometry("+{}+{}".format(x_cordinate, y_cordinate-20))

    root.mainloop()
