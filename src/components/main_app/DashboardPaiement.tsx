import { useMemo, useState, useCallback } from "react";
import { usePaiementHistorique } from "../../hooks/usePaiement";
import { useGetClass } from "../../hooks/useClass";
import { useGet } from "../../hooks/useAnnee";
import type { AnneeProfile } from "../../api/anneeApi";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { motion } from "framer-motion";
import { Skeleton } from "../SkeletonLoader";

interface PaiementItem {
  mois?: string;
  status: "Payé" | "Non payé";
}

interface MoisData {
  mois: string;
  payes: number;
  nonPayes: number;
}

const COLORS = ["#16a34a", "#dc2626"]; // Payé / Non payé

const DashboardPaiement = () => {
  const [selectedAnnee, setSelectedAnnee] = useState("");
  const [selectedClasse, setSelectedClasse] = useState<number | null>(null);
  const { data: annees, isLoading: anneesLoading } = useGet();
  const { data: classes, isLoading: classesLoading } = useGetClass();
  const { data: historique = [], isLoading: historiqueLoading } = usePaiementHistorique(selectedClasse!, selectedAnnee, "");

  // Optimiser les calculs avec useMemo
  const stats = useMemo(() => {
    const total = historique.length;
    const payes = historique.filter((e: PaiementItem) => e.status === "Payé").length;
    const nonPayes = total - payes;
    return { total, payes, nonPayes };
  }, [historique]);

  const pieData = useMemo(() => [
    { name: "Payé", value: stats.payes },
    { name: "Non payé", value: stats.nonPayes },
  ], [stats]);

  const barData = useMemo(() => {
    const moisMap: { [key: string]: MoisData } = {};
    historique.forEach((item: PaiementItem) => {
      const mois = item.mois || "Non défini";
      if (!moisMap[mois]) {
        moisMap[mois] = { mois, payes: 0, nonPayes: 0 };
      }
      if (item.status === "Payé") {
        moisMap[mois].payes++;
      } else {
        moisMap[mois].nonPayes++;
      }
    });
    return Object.values(moisMap);
  }, [historique]);

  // Optimiser les handlers avec useCallback
  const handleAnneeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAnnee(e.target.value);
  }, []);

  const handleClasseChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClasse(Number(e.target.value));
  }, []);

  // Afficher le skeleton pendant le chargement
  if (anneesLoading || classesLoading || historiqueLoading) {
    return (
      <div className="p-8 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton width="w-64" height="h-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <Skeleton lines={3} />
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <Skeleton lines={4} />
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          <div className="flex space-x-4 mb-6">
            <select
              value={selectedAnnee}
              onChange={handleAnneeChange}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Sélectionner une année</option>
              {annees?.map((annee: AnneeProfile) => (
                <option key={annee.id} value={annee.anneeScolaire}>
                  {annee.anneeScolaire}
                </option>
              ))}
            </select>

            <select
              value={selectedClasse?.toString() || ""}
              onChange={handleClasseChange}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Sélectionner une classe</option>
              {classes?.map((classe: { id: number; nom: string }) => (
                <option key={classe.id} value={classe.id}>
                  {classe.nom}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Statistiques globales */}
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
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
