
import { useState, useEffect } from "react"
import { useGetRapports, useGetRapportDetails } from "../../../hooks/useRapportEcolage"
import Loading from "../../../components/Loading"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronDown,
  BarChart3,
  PieChartIcon,
  LineChartIcon,
  Users,
  Clock,
  CreditCard,
  FileText,
  Calendar,
  School,
} from "lucide-react"
import classNames from "classnames"

const DashboardEcolage = () => {
  const [selectedRapportId, setSelectedRapportId] = useState<number | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"bar" | "pie" | "line">("bar")
  const { data: rapports, isLoading } = useGetRapports()
  const { data: rapportDetails } = useGetRapportDetails(selectedRapportId)

  // Fermer le dropdown quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = () => setIsDropdownOpen(false)
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  // Statistiques globales
  const statsGlobales = {
    payants: 0,
    nonPayants: 0,
    total: 0,
    montantTotal: 0,
  }

  // Statistiques par classe
  const statsParClasse: Record<string, typeof statsGlobales> = {}

  // Calcul des statistiques
  if (rapportDetails) {
    rapportDetails.forEach((etudiant) => {
      const aPaye = etudiant.paiements.length > 0
      const montantPaye = etudiant.paiements.reduce((acc, p) => acc + p.montant, 0)
      const classe = rapports?.find((r) => r.id === selectedRapportId)?.classe_nom || "Autre"

      if (!statsParClasse[classe]) {
        statsParClasse[classe] = { ...statsGlobales }
      }

      if (aPaye) {
        statsGlobales.payants++
        statsParClasse[classe].payants++
        statsGlobales.montantTotal += montantPaye
        statsParClasse[classe].montantTotal += montantPaye
      } else {
        statsGlobales.nonPayants++
        statsParClasse[classe].nonPayants++
      }

      statsGlobales.total++
      statsParClasse[classe].total++
    })
  }

  // Préparation des données pour les graphiques
  const dataPourGraphique = Object.entries(statsParClasse).map(([classe, stats], index) => ({
    id: index + 1,
    nom: classe,
    payants: stats.payants,
    nonPayants: stats.nonPayants,
    total: stats.total,
    tauxPaiement: stats.total > 0 ? Math.round((stats.payants / stats.total) * 100) : 0,
    montantTotal: stats.montantTotal,
  }))

  // Données pour le graphique linéaire (tendance)
  const lineData = dataPourGraphique.map((item) => ({
    nom: item.nom,
    taux: item.tauxPaiement,
  }))

  // Couleurs pour les graphiques
  const COLORS = {
    primary: "#3b82f6", // Bleu
    secondary: "#8b5cf6", // Violet
    success: "#10b981", // Vert
    danger: "#ef4444", // Rouge
    warning: "#f59e0b", // Jaune
    info: "#06b6d4", // Cyan
    light: "#f3f4f6", // Gris clair
    dark: "#1f2937", // Gris foncé
  }

  const PIE_COLORS = [COLORS.success, COLORS.danger]

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  }

  const cardVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
  }

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <Loading />
      </div>
    )

  const selectedRapport = rapports?.find((r) => r.id === selectedRapportId)
  const rapportIndex = rapports?.findIndex((r) => r.id === selectedRapportId) ?? -1

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-8 bg-gradient-to-b from-white to-slate-50 rounded-2xl shadow-lg border border-gray-100"
    >
      <div className="flex items-center mb-8">
        <div className="bg-blue-100 p-3 rounded-full mr-4">
          <BarChart3 className="h-6 w-6 text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800">Tableau de Bord Financier</h2>
      </div>

      {/* Sélection du rapport avec dropdown stylisé */}
      <div className="mb-8 relative">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
          Sélectionner un rapport
        </label>
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsDropdownOpen(!isDropdownOpen)
            }}
            className="flex items-center justify-between w-full max-w-md bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-left shadow-sm hover:border-blue-500 transition-colors"
          >
            <span className="block truncate">
              {selectedRapportId
                ? `${rapportIndex + 1}. ${selectedRapport?.classe_nom} - ${selectedRapport?.mois} ${selectedRapport?.annee_scolaire_nom}`
                : "-- Sélectionnez un rapport --"}
            </span>
            <ChevronDown
              className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute z-10 mt-1 w-full max-w-md bg-white shadow-lg rounded-lg py-1 border border-gray-200 max-h-60 overflow-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {rapports?.map((rapport, index) => (
                  <button
                    key={rapport.id}
                    onClick={() => {
                      setSelectedRapportId(rapport.id || 0)
                      setIsDropdownOpen(false)
                    }}
                    className={classNames(
                      "w-full text-left px-4 py-2.5 hover:bg-blue-50 transition-colors flex items-center",
                      selectedRapportId === rapport.id ? "bg-blue-50 text-blue-700" : "text-gray-700",
                    )}
                  >
                    <School className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="font-medium mr-1">{index + 1}.</span>
                    {rapport.classe_nom} - {rapport.mois} {rapport.annee_scolaire_nom}
                  </button>
                ))}
                {rapports?.length === 0 && (
                  <div className="px-4 py-2 text-gray-500 text-center">Aucun rapport disponible</div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {selectedRapportId ? (
          <motion.div key="content" initial="hidden" animate="visible" exit="hidden" variants={containerVariants}>
            {/* Statistiques globales avec indicateur de rapport */}
            <motion.div
              variants={itemVariants}
              className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-center"
            >
              <FileText className="h-5 w-5 text-blue-500 mr-3" />
              <div>
                <h3 className="font-medium text-gray-700">
                  Rapport <span className="text-blue-600 font-bold">#{rapportIndex + 1}</span> sur {rapports?.length} :
                  <span className="ml-2 font-semibold text-blue-800">
                    {selectedRapport?.classe_nom} - {selectedRapport?.mois} {selectedRapport?.annee_scolaire_nom}
                  </span>
                </h3>
              </div>
            </motion.div>

            {/* Statistiques globales */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <motion.div
                variants={cardVariants}
                className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-xl shadow-sm border border-green-200 flex items-start"
              >
                <div className="bg-green-500/10 p-3 rounded-lg mr-4">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-600 mb-1">Élèves à jour</h3>
                  <p className="text-3xl font-bold text-green-700">{statsGlobales.payants}</p>
                  <p className="text-sm text-green-600 mt-1 font-medium">
                    {statsGlobales.total > 0 ? Math.round((statsGlobales.payants / statsGlobales.total) * 100) : 0}%
                  </p>
                </div>
              </motion.div>

              <motion.div
                variants={cardVariants}
                className="bg-gradient-to-br from-red-50 to-red-100 p-5 rounded-xl shadow-sm border border-red-200 flex items-start"
              >
                <div className="bg-red-500/10 p-3 rounded-lg mr-4">
                  <Clock className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-600 mb-1">Élèves en retard</h3>
                  <p className="text-3xl font-bold text-red-700">{statsGlobales.nonPayants}</p>
                  <p className="text-sm text-red-600 mt-1 font-medium">
                    {statsGlobales.total > 0 ? Math.round((statsGlobales.nonPayants / statsGlobales.total) * 100) : 0}%
                  </p>
                </div>
              </motion.div>

              <motion.div
                variants={cardVariants}
                className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl shadow-sm border border-blue-200 flex items-start"
              >
                <div className="bg-blue-500/10 p-3 rounded-lg mr-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-600 mb-1">Total élèves</h3>
                  <p className="text-3xl font-bold text-blue-700">{statsGlobales.total}</p>
                  <p className="text-sm text-blue-600 mt-1 font-medium">Effectif complet</p>
                </div>
              </motion.div>

              <motion.div
                variants={cardVariants}
                className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-5 rounded-xl shadow-sm border border-indigo-200 flex items-start"
              >
                <div className="bg-indigo-500/10 p-3 rounded-lg mr-4">
                  <CreditCard className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-600 mb-1">Montant total</h3>
                  <p className="text-3xl font-bold text-indigo-700">{statsGlobales.montantTotal.toLocaleString()} Ar</p>
                  <p className="text-sm text-indigo-600 mt-1 font-medium">Recettes perçues</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Onglets pour les graphiques */}
            <motion.div variants={itemVariants} className="mb-4">
              <div className="flex space-x-2 border-b">
                <button
                  onClick={() => setActiveTab("bar")}
                  className={classNames(
                    "flex items-center px-4 py-2 font-medium rounded-t-lg transition-colors",
                    activeTab === "bar"
                      ? "bg-blue-50 text-blue-700 border-b-2 border-blue-500"
                      : "text-gray-600 hover:text-blue-600 hover:bg-blue-50/50",
                  )}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Statut par classe
                </button>
                <button
                  onClick={() => setActiveTab("pie")}
                  className={classNames(
                    "flex items-center px-4 py-2 font-medium rounded-t-lg transition-colors",
                    activeTab === "pie"
                      ? "bg-blue-50 text-blue-700 border-b-2 border-blue-500"
                      : "text-gray-600 hover:text-blue-600 hover:bg-blue-50/50",
                  )}
                >
                  <PieChartIcon className="h-4 w-4 mr-2" />
                  Répartition
                </button>
                <button
                  onClick={() => setActiveTab("line")}
                  className={classNames(
                    "flex items-center px-4 py-2 font-medium rounded-t-lg transition-colors",
                    activeTab === "line"
                      ? "bg-blue-50 text-blue-700 border-b-2 border-blue-500"
                      : "text-gray-600 hover:text-blue-600 hover:bg-blue-50/50",
                  )}
                >
                  <LineChartIcon className="h-4 w-4 mr-2" />
                  Tendance
                </button>
              </div>
            </motion.div>

            {/* Graphiques */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 gap-8 mb-8">
              <AnimatePresence mode="wait">
                {activeTab === "bar" && (
                  <motion.div
                    key="bar"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
                  >
                    <h3 className="font-medium text-lg mb-6 text-gray-800 flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
                      Statut de paiement par classe
                    </h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dataPourGraphique} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="nom" tick={{ fill: "#6b7280" }} />
                          <YAxis tick={{ fill: "#6b7280" }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "white",
                              borderRadius: "8px",
                              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                              border: "1px solid #e5e7eb",
                            }}
                          />
                          <Legend wrapperStyle={{ paddingTop: "10px" }} />
                          <Bar dataKey="payants" name="À jour" fill={COLORS.success} radius={[4, 4, 0, 0]} />
                          <Bar dataKey="nonPayants" name="En retard" fill={COLORS.danger} radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>
                )}

                {activeTab === "pie" && (
                  <motion.div
                    key="pie"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
                  >
                    <h3 className="font-medium text-lg mb-6 text-gray-800 flex items-center">
                      <PieChartIcon className="h-5 w-5 mr-2 text-blue-500" />
                      Répartition des paiements
                    </h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: "À jour", value: statsGlobales.payants },
                              { name: "En retard", value: statsGlobales.nonPayants },
                            ]}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            animationDuration={1000}
                            animationBegin={200}
                          >
                            {PIE_COLORS.map((color, index) => (
                              <Cell key={`cell-${index}`} fill={color} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "white",
                              borderRadius: "8px",
                              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                              border: "1px solid #e5e7eb",
                            }}
                          />
                          <Legend wrapperStyle={{ paddingTop: "20px" }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>
                )}

                {activeTab === "line" && (
                  <motion.div
                    key="line"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
                  >
                    <h3 className="font-medium text-lg mb-6 text-gray-800 flex items-center">
                      <LineChartIcon className="h-5 w-5 mr-2 text-blue-500" />
                      Tendance des taux de paiement par classe
                    </h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={lineData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="nom" tick={{ fill: "#6b7280" }} />
                          <YAxis tick={{ fill: "#6b7280" }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "white",
                              borderRadius: "8px",
                              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                              border: "1px solid #e5e7eb",
                            }}
                          />
                          <Legend wrapperStyle={{ paddingTop: "10px" }} />
                          <Line
                            type="monotone"
                            dataKey="taux"
                            name="Taux de paiement (%)"
                            stroke={COLORS.primary}
                            strokeWidth={3}
                            dot={{ r: 6, fill: COLORS.primary, strokeWidth: 2, stroke: "white" }}
                            activeDot={{ r: 8, fill: COLORS.primary, strokeWidth: 2, stroke: "white" }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Détails par classe avec numérotation */}
            <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-medium text-lg mb-6 text-gray-800 flex items-center">
                <School className="h-5 w-5 mr-2 text-blue-500" />
                Détails par classe
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        N°
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Classe
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        À jour
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        En retard
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Taux
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Montant
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dataPourGraphique.map((classe, index) => (
                      <motion.tr
                        key={classe.nom}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{classe.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{classe.nom}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {classe.payants}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            {classe.nonPayants}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{classe.total}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2.5 mr-2">
                              <div
                                className={classNames(
                                  "h-2.5 rounded-full",
                                  classe.tauxPaiement > 75
                                    ? "bg-green-500"
                                    : classe.tauxPaiement > 50
                                      ? "bg-yellow-500"
                                      : "bg-red-500",
                                )}
                                style={{ width: `${classe.tauxPaiement}%` }}
                              ></div>
                            </div>
                            <span
                              className={classNames(
                                "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                                classe.tauxPaiement > 75
                                  ? "bg-green-100 text-green-800"
                                  : classe.tauxPaiement > 50
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800",
                              )}
                            >
                              {classe.tauxPaiement}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {classe.montantTotal.toLocaleString()} Ar
                        </td>
                      </motion.tr>
                    ))}
                    {dataPourGraphique.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                          Aucune donnée disponible
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200"
          >
            <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">Sélectionnez un rapport pour afficher les statistiques</p>
            <p className="text-gray-400 mt-2">Les données financières seront affichées ici</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default DashboardEcolage
