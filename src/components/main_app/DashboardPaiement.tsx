import { useMemo, useState } from "react";
import { usePaiementHistorique } from "../../src/hooks/usePaiement";
import { useGetAnneeScolaire, useGetClass } from "../../src/hooks/useClass";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { motion } from "framer-motion";

const COLORS = ["#16a34a", "#dc2626"]; // Payé / Non payé
const moisOptions = [
  "JANVIER", "FEVRIER", "MARS", "AVRIL", "MAI", "JUIN",
  "JUILLET", "AOUT", "SEPTEMBRE", "OCTOBRE", "NOVEMBRE", "DECEMBRE"
];

const DashboardPaiement = () => {
  const [selectedAnnee, setSelectedAnnee] = useState("");
  const [selectedClasse, setSelectedClasse] = useState<number | null>(null);
  const { data: annees } = useGetAnneeScolaire();
  const { data: classes } = useGetClass();

  const { data: historique = [], isLoading } = usePaiementHistorique(selectedClasse!, selectedAnnee);

  const stats = useMemo(() => {
    const total = historique.length;
    const payes = historique.filter((e: any) => e.status === "Payé").length;
    const nonPayes = total - payes;
    return { total, payes, nonPayes };
  }, [historique]);

  const pieData = [
    { name: "Payé", value: stats.payes },
    { name: "Non payé", value: stats.nonPayes },
  ];

  const barData = useMemo(() => {
    const moisMap: { [key: string]: { mois: string; payes: number; nonPayes: number } } = {};
    historique.forEach((item: any) => {
      const mois = item.mois || "Non défini";
      if (!moisMap[mois]) {
        moisMap[mois] = { mois, payes: 0, nonPayes: 0 };
      }
      item.status === "Payé" ? moisMap[mois].payes++ : moisMap[mois].nonPayes++;
    });
    return Object.values(moisMap);
  }, [historique]);

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto"
      >
        <h2 className="text-3xl font-bold text-emerald-700 mb-6 text-center">Tableau de bord des paiements</h2>

        {/* Filtres */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <select
            className="p-3 rounded border"
            value={selectedAnnee}
            onChange={(e) => setSelectedAnnee(e.target.value)}
          >
            <option value="">-- Sélectionner une année --</option>
            {annees?.map((a: any) => (
              <option key={a.id} value={a.anneeScolaire}>
                {a.anneeScolaire}
              </option>
            ))}
          </select>

          <select
            className="p-3 rounded border"
            value={selectedClasse ?? ""}
            onChange={(e) => setSelectedClasse(Number(e.target.value))}
          >
            <option value="">-- Sélectionner une classe --</option>
            {classes?.map((c: any) => (
              <option key={c.id} value={c.id}>
                {c.nom}
              </option>
            ))}
          </select>
        </div>

        {/* Cartes Statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded shadow text-center">
            <h4 className="text-gray-500">Total</h4>
            <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
          </div>
          <div className="bg-green-100 p-6 rounded shadow text-center">
            <h4 className="text-green-700">Payés</h4>
            <p className="text-3xl font-bold text-green-700">{stats.payes}</p>
          </div>
          <div className="bg-red-100 p-6 rounded shadow text-center">
            <h4 className="text-red-700">Non payés</h4>
            <p className="text-3xl font-bold text-red-700">{stats.nonPayes}</p>
          </div>
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Pie Chart */}
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-xl font-semibold mb-4 text-center">Répartition globale</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  label
                  outerRadius={100}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-xl font-semibold mb-4 text-center">Paiement par mois</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mois" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="payes" fill="#16a34a" name="Payé" />
                <Bar dataKey="nonPayes" fill="#dc2626" name="Non payé" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardPaiement;
