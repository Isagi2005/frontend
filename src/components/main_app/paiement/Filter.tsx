import { useState, useEffect } from "react";

interface FilterProps {
  onFilterChange: (filters: {
    annee: string;
    classeId: number;
    mois: string;
  }) => void;
}

export const Filter = ({ onFilterChange }: FilterProps) => {
  const [annees, setAnnees] = useState<string[]>([]);
  const [classes, setClasses] = useState<{ id: number; nom: string }[]>([]);
  const [mois] = useState<string[]>([
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
  ]);

  const [selectedAnnee, setSelectedAnnee] = useState("");
  const [selectedClasse, setSelectedClasse] = useState(0);
  const [selectedMois, setSelectedMois] = useState("");

  useEffect(() => {
    // récupérer années scolaires depuis l'API
    fetch("/api/annees").then(res => res.json()).then(setAnnees);
    // récupérer les classes
    fetch("/api/classes").then(res => res.json()).then(setClasses);
  }, []);

  useEffect(() => {
    if (selectedAnnee && selectedClasse && selectedMois) {
      onFilterChange({
        annee: selectedAnnee,
        classeId: selectedClasse,
        mois: selectedMois,
      });
    }
  }, [selectedAnnee, selectedClasse, selectedMois]);

  return (
    <div className="flex flex-wrap gap-4 p-4 bg-white rounded-xl shadow">
      <select
        className="border px-4 py-2 rounded"
        value={selectedAnnee}
        onChange={(e) => setSelectedAnnee(e.target.value)}
      >
        <option value="">Année scolaire</option>
        {annees.map((a) => (
          <option key={a} value={a}>{a}</option>
        ))}
      </select>

      <select
        className="border px-4 py-2 rounded"
        value={selectedClasse}
        onChange={(e) => setSelectedClasse(parseInt(e.target.value))}
      >
        <option value={0}>Classe</option>
        {classes.map((c) => (
          <option key={c.id} value={c.id}>{c.nom}</option>
        ))}
      </select>

      <select
        className="border px-4 py-2 rounded"
        value={selectedMois}
        onChange={(e) => setSelectedMois(e.target.value)}
      >
        <option value="">Mois</option>
        {mois.map((m) => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>
    </div>
  );
};