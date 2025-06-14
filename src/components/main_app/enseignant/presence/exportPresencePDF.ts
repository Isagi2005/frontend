import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Presence {
  etudiantName: string;
  statut: string;
  heureA?: string;
  raison?: string;
}

interface CoursInfo {
  matiere: string;
  classe: string;
  date: string;
}

// Fonction utilitaire pour normaliser les statuts
function normalizeStatut(val?: string) {
  if (!val) return "";
  const v = val.trim().toUpperCase();
  if (v === "P" || v.startsWith("PRES")) return "P";
  if (v === "A" || v.startsWith("ABS")) return "A";
  if (v === "R" || v.startsWith("RET")) return "R";
  return v;
}

export function exportPresencePDF(
  presences: Presence[],
  coursInfo: CoursInfo
) {
  const doc = new jsPDF();

  // En-tête
  doc.setFontSize(16);
  doc.text("Fiche de présence", 14, 18);
  doc.setFontSize(12);
  doc.text(`Classe : ${coursInfo.classe}`, 14, 28);
  doc.text(`Date : ${coursInfo.date}`, 14, 36);

  // Tableau des présences
  const tableData = presences.map((p) => [
    p.etudiantName,
    p.statut,
    p.heureA || "",
    p.raison || ""
  ]);

  autoTable(doc, {
    head: [["Nom & Prénom", "Statut", "Heure d'arrivée", "Justification"]],
    body: tableData,
    startY: 52,
    styles: { lineColor: [0, 0, 0], lineWidth: 0.2, textColor: [0, 0, 0], fontSize: 11 },
    headStyles: { fillColor: [255,255,255], textColor: [0,0,0], fontStyle: 'bold', lineWidth: 0.4 },
    theme: 'grid',
    tableLineColor: [0, 0, 0],
    tableLineWidth: 0.2,
  });

  // Statistiques pied de page (statut normalisé)
  const nbP = presences.filter((p) => normalizeStatut(p.statut) === "P").length;
  const nbA = presences.filter((p) => normalizeStatut(p.statut) === "A").length;
  const nbR = presences.filter((p) => normalizeStatut(p.statut) === "R").length;

  // DEBUG : si tout est à zéro, afficher un message d'aide
  if (nbP + nbA + nbR === 0) {
    doc.setFontSize(10);
    doc.text("Aucune présence trouvée ou statuts mal formatés.", 14, doc.internal.pageSize.height - 10);
  }

  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(11);
  doc.text(
    `Présents : ${nbP}   Absents : ${nbA}   Retards : ${nbR}`,
    14,
    pageHeight - 18
  );

  doc.save(
    `Presence_${coursInfo.classe}_${coursInfo.date.replace(/\//g, '-')}.pdf`
  );
}
