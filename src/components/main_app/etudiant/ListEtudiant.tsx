import { useState } from "react";
import { useGetStudent } from "../../../hooks/useStudent";
import Modals from "./Modals";
import ActionButtons from "./ActionButtons";
import SearchBar from "../SearchBar";
import ClassFilter from "./ClassFilter";
import SortSelect from "../SortSelect";
import StudentTable from "./StudentTable";
import Pagination from "../Pagination";
import { studentDataSorted } from "../../../dataMenu/SortDataType";
import { ClassProfile } from "../../../api/classApi";
import { filterProps } from "../../../dataMenu/filterItem";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

interface Props {
  listClasse: ClassProfile[] | filterProps[] | undefined;
}

const ListEtudiant = ({ listClasse }: Props) => {
  const { data: listEtudiant, isLoading, isError } = useGetStudent();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("nom");
  const [showForm, setShowForm] = useState(false);
  const [showPage, setShowPage] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedClass, setSelectedClass] = useState("");
  const itemsPerPage = 5;

  // Filtrage par recherche
  const filteredEtudiants = listEtudiant?.filter((etudiant) => {
    const matchesSearch =
      `${etudiant.nom} ${etudiant.prenom} ${etudiant.classeName}`
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesClass = selectedClass
      ? etudiant.classeName === selectedClass
      : true;

    return matchesSearch && matchesClass;
  });

  // Tri des étudiants
  const sortedEtudiants = filteredEtudiants?.sort((a, b) =>
    (a[sortBy] as string).localeCompare(b[sortBy] as string)
  );

  // Pagination
  const totalPages = Math.ceil((sortedEtudiants?.length || 0) / itemsPerPage);
  const displayedEtudiants = sortedEtudiants?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isLoading)
    return <p className="text-center text-gray-500">Chargement...</p>;
  if (isError)
    return (
      <p className="text-center text-red-500">Erreur lors du chargement</p>
    );

  // Fonction d'export PDF
  const handleExportPDF = () => {
    if (!sortedEtudiants || sortedEtudiants.length === 0) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Liste des étudiants", 14, 18);
    const classe = sortedEtudiants[0]?.classeName || "";
    doc.setFontSize(12);
    doc.text(`Classe : ${classe}`, 14, 28);
    // Préparation des données du tableau
    const tableData = sortedEtudiants.map((etudiant, idx) => [
      idx + 1,
      etudiant.nom,
      etudiant.prenom
    ]);
    autoTable(doc, {
      head: [["N°", "Nom", "Prénom"]],
      body: tableData,
      startY: 36,
      theme: 'grid',
      styles: { fontSize: 11 },
      headStyles: { fillColor: [255,255,255], textColor: [0,0,0], fontStyle: 'bold', lineWidth: 0.4 },
    });
    // Statistiques
    const total = sortedEtudiants.length;
    const garcons = sortedEtudiants.filter(e => e.sexe === "H").length;
    const filles = sortedEtudiants.filter(e => e.sexe === "F").length;
    const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable?.finalY || 36 + 10;
    doc.setFontSize(11);
    doc.text(`Effectif total : ${total}`, 14, finalY + 10);
    doc.text(`Garçons : ${garcons}   Filles : ${filles}`, 14, finalY + 18);
    doc.text(`Classe : ${classe}`, 14, finalY + 26);
    doc.save("liste_etudiants.pdf");
  };

  // Fonction d'export Excel
  const handleExportExcel = () => {
    if (!sortedEtudiants || sortedEtudiants.length === 0) return;
    const classe = sortedEtudiants[0]?.classeName || "";
    const total = sortedEtudiants.length;
    const garcons = sortedEtudiants.filter(e => e.sexe === "H").length;
    const filles = sortedEtudiants.filter(e => e.sexe === "F").length;
    // Préparer les données sans en-tête
    const data = sortedEtudiants.map((etudiant, idx) => [
      idx + 1,
      etudiant.nom,
      etudiant.prenom
    ]);
    // Ajouter les infos en bas
    data.push([]);
    data.push(["Classe", classe as string]);
    data.push(["Effectif total", total]);
    data.push(["Garçons", garcons]);
    data.push(["Filles", filles]);
    // Générer la feuille
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Etudiants");
    XLSX.writeFile(wb, "liste_etudiants.xlsx");
  };

  return (
    <div className="mx-auto px-4 py-2 w-full max-w-8xl ">
      <Modals
        showForm={showForm}
        setShowForm={setShowForm}
        showPage={showPage}
        setShowPage={setShowPage}
      />

      <div className="flex flex-wrap justify-between items-center mb-4">
        <ActionButtons setShowForm={setShowForm} setShowPage={setShowPage} />
        <SearchBar search={search} setSearch={setSearch} />
        <ClassFilter
          listClasse={listClasse}
          selectedClass={selectedClass}
          setSelectedClass={setSelectedClass}
        />
        <SortSelect
          data={studentDataSorted}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
      </div>

      {/* BOUTONS EXPORT */}
      <div className="flex gap-2 mb-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleExportPDF}
        >
          Exporter PDF
        </button>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={handleExportExcel}
        >
          Exporter Excel
        </button>
      </div>

      <StudentTable displayedEtudiants={displayedEtudiants || []} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default ListEtudiant;
