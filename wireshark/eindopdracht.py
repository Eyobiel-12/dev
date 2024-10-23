import tkinter as tk
import random

class App(tk.Tk):
    def __init__(self):
        super().__init__()
        #dit is de titel van onze programma
        self.title("Eindopdracht - Opdracht 6")
        #configuratie om het achtergrond van onze programma aan te passen, wij hebben hem een blauwe kleur gegeven
        self.configure(background="blue")

        #wij maken drie frames aan, elke opdracht heeft zijn eigen frame
        self.frames = [] #wij maken een lijst voor de frames
        self.create_frame("BTW berekening", self.calculate_btw, "Voer een bedrag in:") #label voor btw berekening, gemaakt door Eyobil
        self.create_frame("Reistijd berekening", self.calculate_reistijd, "Voer de afstand in (km):", "Voer de snelheid in (km/h):") #label voor reistijd berekening, gemaakt door David
        self.create_frame("Vierkant berekening", self.calculate_vierkant, "Voer de lengte in (m):", "Voer de breedte in (m):") #label voor vierkant meter berekening, gemaakt door Musabe
        self.create_frame("Getal raden", self.guess_number, "Voer een minimumwaarde in:", "Voer een maximumwaarde in:") #label voor willeukeurig getal, gemaakt door Serhat

    #wij maken een def aan om de frames aan te maken, wij geven hem create_frame als naam
    def create_frame(self, title, command, *labels):
        frame = tk.Frame(self) #wij maken een frame aan
        frame.pack(padx=10, pady=10) #wij voegen marges van 10 pixels op elke kant van het vierkant
        self.frames.append(frame) #de frame wordt toegevoegd in de lijst frames

        label1 = tk.Label(frame, text=title) #maken van een label waarin de titel van daarnet in komt
        label1.pack() #voegt text toe in het label en toon aan op scherm, de methode pack zorgt ervoor dat het op het scherm getoont word

        entries = [] #lijst aanmaken
        for l in labels: #voor elke l in labels wordt een label gemaakt en toegevoegd
            label = tk.Label(frame, text=l) #frame aangemaakt
            label.pack() #word getoond op scherm
            entry = tk.Entry(frame) #entry gebruiken voor binnen het frame zodat tekst en getallen geaccepteerd kunnen worden, het verzamelen van tekst en getallen van de gebruiker
            entry.pack() #word getoond op scherm
            entries.append(entry) #de frame wordt toegevoegd in de lijst frames

        button = tk.Button(frame, text="Bereken", command=lambda: command(*entries)) #creeeren button met tekst bereken, command is een callback, wanneer je op de button drukt wordt de functie command aangeroept
        button.pack(pady=5) #voegen van 5 pixels toe onder de knop

        result_label = tk.Label(frame, text="") #lege label, resultaten gaan hier later getoond worden
        result_label.pack()

    #def om btw te berekenen
    def calculate_btw(self, entry):
        bedrag = float(entry.get()) #float gebruikt om decimalen te kunnen zien en get om de getal te kunnen krijgen
        btw = bedrag * 0.21
        self.result(btw, "BTW")

    #def om de reistijd te berekenen
    def calculate_reistijd(self, entry1, entry2):
        afstand = float(entry1.get())
        snelheid = float(entry2.get())
        reistijd = afstand / snelheid
        self.result(reistijd, "Reistijd", "uur")

    #def om de oppervlakte te berekenen
    def calculate_vierkant(self, entry1, entry2):
        lengte = float(entry1.get())
        breedte = float(entry2.get())
        omtrek = 2 * (lengte + breedte)
        oppervlakte = lengte * breedte
        self.result(omtrek, "Omtrek", "\nOppervlakte", oppervlakte)

    def guess_number(self, entry1, entry2):
        min_value = int(entry1.get())
        max_value = int(entry2.get())
        random_number = random.randint(min_value, max_value)
        self.result(random_number, "Willekeurig getal")

    #hier zetten wij alle labels om de resultaten te tonen
    def result(self, val1, label1, val2="", label2=""):
        result_label = tk.Label(self.frames[-1], text=label1 + ": " + str(val1) + val2 + "\n" + label2 + ": " + str(label2))
        result_label.pack()


if __name__ == "__main__": #instantie maken
    app = App()
    app.mainloop() #start mainloop van de applicatie
