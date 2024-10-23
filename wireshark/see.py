import tkinter as tk
import random
import datetime

class App(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Eindopdracht - Opdracht 6")
        self.configure(background="blue")

        self.frames = {}
        self.result_frames = {}
        self.create_frame("BTW berekening", self.calculate_btw, "Voer een bedrag in:")
        self.create_frame("Reistijd berekening", self.calculate_reistijd, "Voer de afstand in (km):", "Voer de snelheid in (km/h):")
        self.create_frame("Leeftijd berekening", self.calculate_age, "Voer je geboortejaar in:")
        self.create_frame("Getal raden", self.guess_number, "Voer een minimumwaarde in:", "Voer een maximumwaarde in:")

    def create_frame(self, title, command, *labels):
        main_frame = tk.Frame(self, width=700, height=200, padx=10, pady=10)  # Larger main frame
        main_frame.pack(fill='both', expand=True, padx=20, pady=20)

        frame = tk.Frame(main_frame, width=350)  # Left side for inputs
        frame.pack(side='left', fill='both', expand=True)
        self.frames[command] = frame

        label1 = tk.Label(frame, text=title)
        label1.pack()

        entries = []
        for l in labels:
            label = tk.Label(frame, text=l)
            label.pack()
            entry = tk.Entry(frame)
            entry.pack()
            entries.append(entry)

        button = tk.Button(frame, text="Bereken", command=lambda: command(*entries))
        button.pack(pady=5)

        result_frame = tk.Frame(main_frame, width=350)  # Right side for results
        result_frame.pack(side='bottom', fill='both', expand=True)
        self.result_frames[command] = result_frame

    def calculate_btw(self, entry):
        bedrag = float(entry.get())
        btw = bedrag * 0.21
        self.result(self.calculate_btw, btw, "BTW")

    def calculate_reistijd(self, entry1, entry2):
        afstand = float(entry1.get())
        snelheid = float(entry2.get())
        reistijd = afstand / snelheid
        self.result(self.calculate_reistijd, reistijd, "Reistijd", "uur")

    def calculate_age(self, entry):
        birth_year = int(entry.get())
        current_year = datetime.datetime.now().year  # Get the current year
        age = current_year - birth_year
        self.result(self.calculate_age, age, "Je leeftijd")

    def guess_number(self, entry1, entry2):
        min_value = int(entry1.get())
        max_value = int(entry2.get())
        random_number = random.randint(min_value, max_value)
        self.result(self.guess_number, random_number, "Willekeurig getal")

    def result(self, command, val1, label1, val2=None, label2=None):
        result_text = label1 + ": " + str(val1)
        if val2 is not None and label2 is not None:  # Check if val2 and label2 are given
            result_text += "\n" + label2 + ": " + str(val2)
        result_label = tk.Label(self.result_frames[command], text=result_text)
        result_label.pack()

if __name__ == "__main__":
    app = App()
    app.mainloop()
