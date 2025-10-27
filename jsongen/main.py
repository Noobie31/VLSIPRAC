import json
import tkinter as tk
from tkinter import ttk, filedialog, messagebox

TOPIC_COUNT = 15

class App(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Topics → JSON (15 items)")
        self.geometry("900x650")

        # Scrollable frame
        container = ttk.Frame(self)
        container.pack(fill="both", expand=True, padx=10, pady=10)

        canvas = tk.Canvas(container, borderwidth=0)
        vscroll = ttk.Scrollbar(container, orient="vertical", command=canvas.yview)
        self.frame = ttk.Frame(canvas)

        self.frame.bind(
            "<Configure>",
            lambda e: canvas.configure(scrollregion=canvas.bbox("all"))
        )
        canvas.create_window((0, 0), window=self.frame, anchor="nw")
        canvas.configure(yscrollcommand=vscroll.set)

        canvas.pack(side="left", fill="both", expand=True)
        vscroll.pack(side="right", fill="y")

        self.title_vars = []
        self.body_widgets = []

        for i in range(1, TOPIC_COUNT + 1):
            box = ttk.LabelFrame(self.frame, text=f"Topic {i}")
            box.pack(fill="x", expand=True, pady=6)

            row = ttk.Frame(box)
            row.pack(fill="x", expand=True, padx=8, pady=6)

            ttk.Label(row, text="Title", width=10).grid(row=0, column=0, sticky="w")
            tvar = tk.StringVar(value=f"Topic {i}")
            self.title_vars.append(tvar)
            ttk.Entry(row, textvariable=tvar).grid(row=0, column=1, sticky="ew")
            row.columnconfigure(1, weight=1)

            ttk.Label(row, text="Body", width=10).grid(row=1, column=0, sticky="nw", pady=(6,0))
            body = tk.Text(row, height=6, wrap="word")
            body.insert("1.0", f"Pasteable content for Topic {i}")
            body.grid(row=1, column=1, sticky="ew", pady=(6,0))

            self.body_widgets.append(body)

        # Output + buttons
        btns = ttk.Frame(self)
        btns.pack(fill="x", padx=10, pady=(0,8))
        ttk.Button(btns, text="Generate JSON", command=self.generate_json).pack(side="left", padx=(0,6))
        ttk.Button(btns, text="Copy JSON", command=self.copy_json).pack(side="left", padx=(0,6))
        ttk.Button(btns, text="Save JSON", command=self.save_json).pack(side="left", padx=(0,6))

        outbox = ttk.LabelFrame(self, text="Output JSON")
        outbox.pack(fill="both", expand=True, padx=10, pady=(0,10))
        self.out = tk.Text(outbox, height=12, wrap="none")
        self.out.pack(fill="both", expand=True)

    def _collect(self):
        topics = []
        for i in range(TOPIC_COUNT):
            title = self.title_vars[i].get().strip() or f"Topic {i+1}"
            body = self.body_widgets[i].get("1.0", "end-1c")
            topics.append({"title": title, "body": body})
        return {"topics": topics}

    def generate_json(self):
        data = self._collect()
        pretty = json.dumps(data, indent=2, ensure_ascii=False)
        self.out.delete("1.0", "end")
        self.out.insert("1.0", pretty)
        messagebox.showinfo("Done", "JSON generated.")

    def copy_json(self):
        if not self.out.get("1.0", "end-1c").strip():
            self.generate_json()
        text = self.out.get("1.0", "end-1c")
        self.clipboard_clear()
        self.clipboard_append(text)
        messagebox.showinfo("Copied", "JSON copied to clipboard.")

    def save_json(self):
        if not self.out.get("1.0", "end-1c").strip():
            self.generate_json()
        path = filedialog.asksaveasfilename(
            title="Save JSON",
            defaultextension=".json",
            filetypes=[("JSON Files","*.json"), ("All Files","*.*")]
        )
        if path:
            with open(path, "w", encoding="utf-8") as f:
                f.write(self.out.get("1.0", "end-1c"))
            messagebox.showinfo("Saved", f"Saved to:\n{path}")

if __name__ == "__main__":
    App().mainloop()
