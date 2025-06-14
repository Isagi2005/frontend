import monImage from "../assets/bd/bd22.jpg";
import autreImage from "../assets/bd/bd32.jpg";

export interface typeData {
  id: number;
  image: File | string | null;
  titre: string;
  sous_titres: string;
  liste: string[];
}
export const dataText: typeData[] = [
  {
    id: 1,
    image: monImage,
    titre: "PRESENTATION",
    sous_titres: "",
    liste: [
      "Notre école suit le système éducatif français, offrant une formation complète de la maternelle au collège. ",
      "L'objectif principal de notre établissement est de préparer chaque élève à obtenir le Diplôme National du Brevet (DNB) en fin de cycle collège et le Baccalauréat en cycle Terminale.",
    ],
  },
];
export const dataText1: typeData[] = [
  {
    id: 1,
    image: monImage,
    titre: "COLLEGE",
    sous_titres: "Le collège (11-15 ans) :",
    liste: [
      "Composé de quatre niveaux : Sixième, Cinquième, Quatrième, Troisième.",
      "Objectifs : Le collège vise à garantir une formation générale commune et à préparer les élèves à leur orientation future.L’enseignement inclut le français, les mathématiques, les langues étrangères, l'histoire, les sciences, la technologie, l'éducation physique et les arts plastiques.",
      "Diplôme de fin de cycle : À la fin du collège, les élèves passent le Diplôme National du Brevet (DNB), qui met en valeur leurs compétences dans plusieurs matières.",
    ],
  },
];
export const dataText2: typeData[] = [
  {
    id: 1,
    image: monImage,
    titre: "ECOLE",
    sous_titres: "L'école maternelle (3-6 ans) :",
    liste: [
      "Objectifs : L'école maternelle vise à préparer les enfants à l'entrée dans l'école élémentaire. Elle est divisée en trois sections : petite section (PS), moyenne section (MS) et grande section (GS).",
      "Enseignement : L'accent est mis sur le développement des compétences sociales, le langage, la motricité et la découverte du monde.",
    ],
  },
  {
    id: 2,
    image: autreImage,
    titre: "",
    sous_titres: "L'école élémentaire (6-11 ans) :",
    liste: [
      "Composée de cinq niveaux : Cours préparatoire ( CP ) , Cours élémentaire 1 ( CE1 ) , Cours élémentaire 2 ( CE2 ) , Cours moyen 1 ( CM1 ) et Cours moyen 2 ( CM2 ) ",
      "Objectifs : Enseignement des bases fondamentales comme le français, les mathématiques, l'histoire, la géographie, les sciences, l'éducation civique, …",
    ],
  },
];
