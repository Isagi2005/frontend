import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface BulletinPDFType {
  total_heures_retard?: number;
  total_heures_absence?: number;
  totalHeuresRetard?: number;
  totalHeuresAbsence?: number;
  eleve_nom?: string;
  classe_nom?: string;
  periode_nom?: string;
  moyenneGenerale?: number;
  dateEdition?: string;
  appreciationGenerale?: string;
  pointsForts?: string;
  besoins?: string;
  evaluations?: {
    domaine?: {
      nom?: string;
    };
    valeurNote?: number;
    appreciation?: string;
    observations?: string;
  }[];
}

export function exportBulletinPDF(bulletin: BulletinPDFType): void {
  const doc = new jsPDF();
  // En-tête principal
  doc.setFontSize(18);
  doc.setTextColor(40, 76, 113);
  doc.text("Bulletin scolaire", 105, 16, { align: "center" });
  doc.setLineWidth(0.5);
  doc.line(14, 20, 196, 20);
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);

  // Informations générales
  doc.text(`Nom de l'élève : ${bulletin.eleve_nom || ''}`, 14, 30);
  doc.text(`Classe : ${bulletin.classe_nom || ''}`, 14, 38);
  doc.text(`Période : ${bulletin.periode_nom || ''}`, 14, 46);

  let y = 54;

  // Tableau des évaluations
  if (bulletin.evaluations && bulletin.evaluations.length > 0) {
    const evalData = bulletin.evaluations.map((ev, idx) => [
      idx + 1,
      ev.domaine?.nom || '',
      ev.valeurNote ?? '',
      ev.appreciation || '',
      ev.observations || ''
    ]);
    autoTable(doc, {
      head: [["N°", "Domaine", "Note /20", "Appréciation", "Observations"]],
      body: evalData,
      startY: y,
      theme: 'grid',
      headStyles: { fillColor: [40, 76, 113], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 11, cellPadding: 2 },
      margin: { left: 14, right: 14 },
    });
    y = (doc as any).lastAutoTable.finalY + 16; // espace de 2 lignes après le tableau
  }

  // Affichage des heures de retard et d'absence juste après le tableau
  // y est déjà positionné après le tableau
  doc.setFont(undefined, 'bold');
  doc.setTextColor(251, 191, 36); // jaune pour le retard
  doc.text("Retard total :", 14, y);
  doc.setFont(undefined, 'normal');
  // Récupération des totaux depuis l'API (nouveaux champs backend ou fallback)
  // Affichage compatible snake_case et camelCase
  const retardVal = typeof bulletin.total_heures_retard === 'number'
    ? bulletin.total_heures_retard
    : (typeof bulletin.totalHeuresRetard === 'number' ? bulletin.totalHeuresRetard : 0);
  const retardStr = retardVal < 1 ? `${Math.round(retardVal * 60)} min` : `${retardVal.toFixed(2)} h`;
  doc.text(retardStr, 44, y);

  doc.setFont(undefined, 'bold');
  doc.setTextColor(96, 165, 250); // bleu pour l'absence
  doc.text("Absence totale :", 70, y);
  doc.setFont(undefined, 'normal');
  const absenceVal = typeof bulletin.total_heures_absence === 'number'
    ? bulletin.total_heures_absence
    : (typeof bulletin.totalHeuresAbsence === 'number' ? bulletin.totalHeuresAbsence : 0);
  const absenceStr = absenceVal < 1 ? `${Math.round(absenceVal * 60)} min` : `${absenceVal.toFixed(2)} h`;
  doc.text(absenceStr, 110, y);
  doc.setTextColor(0, 0, 0); // reset couleur

  doc.setFont(undefined, 'bold');
  doc.text("Moyenne générale :", 140, y);
  doc.setFont(undefined, 'normal');
  doc.text(String(bulletin.moyenneGenerale ?? ''), 180, y);
  y += 8;
  doc.setFont(undefined, 'bold');
  doc.text("Appréciation générale :", 14, y);
  doc.setFont(undefined, 'normal');
  doc.text(String(bulletin.appreciationGenerale ?? ''), 60, y);
  y += 8;
  doc.setFont(undefined, 'bold');
  doc.text("Points forts :", 14, y);
  doc.setFont(undefined, 'normal');
  doc.text(String(bulletin.pointsForts ?? ''), 45, y);
  y += 8;
  doc.setFont(undefined, 'bold');
  doc.text("Besoins :", 14, y);
  doc.setFont(undefined, 'normal');
  doc.text(String(bulletin.besoins ?? ''), 38, y);

  

  // Signatures
  y += 14;
  doc.setFont(undefined, 'bold');
  doc.setFontSize(11);
  doc.text('Signature du parent', 25, y);
  doc.text('Signature de l\'enseignant', 90, y);
  doc.text('Signature de la direction', 155, y);

  // Footer
  doc.setFontSize(10);
  doc.setTextColor(150);
  doc.text("Document généré par RaitraKidz", 14, 285);
  doc.save(`bulletin_${String(bulletin.eleve_nom ?? '')}.pdf`);
}
