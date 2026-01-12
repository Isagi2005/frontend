import { useState, useEffect } from "react";
import { usePaiementHistorique, useEnvoyerRapport } from "../../../hooks/usePaiement";
import {  useGetClass } from "../../../hooks/useClass";
import { motion } from "framer-motion";
import { BookOpen, School, Calendar, Send } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useGet } from "../../../hooks/useAnnee";

const HistoriquePaiement = () => {
  const [selectedAnnee, setSelectedAnnee] = useState("");
  const [selectedClasse, setSelectedClasse] = useState<number | null>(null);
  const [selectedMois, setSelectedMois] = useState("");

  const { data: annees } = useGet();
  const { data: classes } = useGetClass();
  const { data: historique, isLoading } = usePaiementHistorique(
    selectedClasse!,
    selectedAnnee,
    selectedMois
  );
  const { mutate: envoyerRapport, isPending: sending } = useEnvoyerRapport();

  const moisOptions = [
    "JANVIER", "FEVRIER", "MARS", "AVRIL", "MAI", "JUIN",
    "JUILLET", "AOUT", "SEPTEMBRE", "OCTOBRE", "NOVEMBRE", "DECEMBRE"
  ];

  // Réinitialiser la classe sélectionnée quand l'année change
  useEffect(() => {
    setSelectedClasse(null);
  }, [selectedAnnee]);

  const handleSendReport = () => {
    if (!selectedClasse || !selectedAnnee || !selectedMois) {
      alert("Veuillez remplir tous les filtres.");
      return;
    }

    envoyerRapport(
      { classeId: selectedClasse, annee: selectedAnnee, mois: selectedMois },
      {
        onSuccess: () => alert("✅ Rapport envoyé à la direction."),
        onError: () => alert("❌ Une erreur s'est produite lors de l'envoi."),
      }
    );
  };

  const handleDownloadExcel = () => {
    if (!historique || historique.length === 0) {
      alert("Aucune donnée à exporter.");
      return;
    }

    const dataToExport = historique.map((item: any) => ({
      Nom: item.nom,
      Prénom: item.prenom,
      Classe: item.classe,
      Mois: selectedMois,
      Statut: item.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Paiements");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(blob, `Paiements_${selectedClasse}_${selectedMois}_${selectedAnnee}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-white py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-8"
      >
        <h1 className="text-3xl font-bold text-emerald-600 mb-8 text-center">
          📊 Suivi des Paiements
        </h1>

        {/* Filtres */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Année */}
          <div className="relative">
            <BookOpen className="absolute left-3 top-3 text-emerald-500" />
            <select
              className="w-full pl-10 pr-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              value={selectedAnnee}
              onChange={(e) => setSelectedAnnee(e.target.value)}
            >
              <option value="">Année scolaire</option>
              {annees?.map((a: any) => (
                <option key={a.id} value={a.anneeScolaire}>{a.anneeScolaire}</option>
              ))}
            </select>
          </div>

          {/* Classe */}
          <div className="relative">
            <School className="absolute left-3 top-3 text-emerald-500" />
            <select
              className="w-full pl-10 pr-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              value={selectedClasse ?? ""}
              onChange={(e) => setSelectedClasse(Number(e.target.value))}
              disabled={!selectedAnnee}
            >
              <option value="">Classe</option>
              {classes?.map((c: any) => (
                <option key={c.id} value={c.id}>{c.nom}</option>
              ))}
            </select>
          </div>

          {/* Mois */}
          <div className="relative">
            <Calendar className="absolute left-3 top-3 text-emerald-500" />
            <select
              className="w-full pl-10 pr-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              value={selectedMois}
              onChange={(e) => setSelectedMois(e.target.value)}
            >
              <option value="">Mois</option>
              {moisOptions.map((mois) => (
                <option key={mois} value={mois}>{mois}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Résultats */}
        {isLoading ? (
          <p className="text-center text-gray-500">Chargement...</p>
        ) : historique?.length && historique.length > 0 ? (
          <>
            <div className="overflow-x-auto rounded-lg border">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-emerald-100 text-left text-gray-600 font-semibold">
                  <tr>
                    <th className="px-6 py-3">Nom</th>
                    <th className="px-6 py-3">Prénom</th>
                    <th className="px-6 py-3">Classe</th>
                    <th className="px-6 py-3">Mois</th>
                    <th className="px-6 py-3">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {historique?.map((etudiant: any) => (
                    <tr key={etudiant.etudiant_id} className="hover:bg-gray-50">
                      <td className="px-6 py-3">{etudiant.nom}</td>
                      <td className="px-6 py-3">{etudiant.prenom}</td>
                      <td className="px-6 py-3">{etudiant.classe}</td>
                      <td className="px-6 py-3">{selectedMois}</td>
                      <td className={`px-6 py-3 font-medium ${etudiant.status === "Payé" ? "text-green-600" : "text-red-500"}`}>
                        {etudiant.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={handleDownloadExcel}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-md transition"
              >
                📥 Exporter en Excel
              </button>
              <button
                onClick={handleSendReport}
                disabled={sending}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg shadow-md transition"
              >
                <Send className="w-5 h-5" />
                {sending ? "Envoi..." : "Envoyer à la direction"}
              </button>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500 mt-6">
            Aucun résultat trouvé. Vérifiez vos filtres.
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default HistoriquePaiement;