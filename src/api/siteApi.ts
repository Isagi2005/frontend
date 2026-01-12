import api from "./api";

export interface PresentationType {
  id: string;
  titrePresentation: string;
  section: string;
  textePresentation: string;
  objectifs: string;
  image: string | File | null;
  date: string;
}

export interface accueilType {
  id: string;
  titre: string;
  texteAccueil: string;
  image1: string | File | null;
  image2: string | File | null;
  image3: string | File | null;
  date: string;
}

export interface Footertype {
  id: string;
  contact: string;
  emailInfo: string;
  adresse: string;
  date: string;
}

export interface DemandeType {
  id: number;
  nomEleve: string;
  statut: "L" | "NL";
  prenomEleve: string;
  lieu: string;
  emailParent: string;
  contactParent: string;
  classeDemande: string;
  date: string;
  dateDeNaissance: string;
  dateNaissance: string;
  dateDeDemande: string | null;
}

const prepareAccueilData = (data: accueilType): FormData => {
  const formData = new FormData();
  formData.append("titre", data.titre);
  formData.append("texteAccueil", data.texteAccueil);
  if (data.image1 !== null && data.image1 instanceof File)
    formData.append("image1", data.image1);
  if (data.image2 !== null && data.image2 instanceof File)
    formData.append("image2", data.image2);
  if (data.image3 !== null && data.image3 instanceof File)
    formData.append("image3", data.image3);
  return formData;
};
const preparePresentationData = (data: PresentationType): FormData => {
  const formData = new FormData();
  formData.append("titrePresentation", data.titrePresentation);
  formData.append("section", data.section);
  formData.append("textePresentation", data.textePresentation);
  formData.append("objectifs", data.objectifs);
  if (data.image !== null && data.image instanceof File)
    formData.append("image", data.image);

  return formData;
};

const contenuApi = {
  getPresentation: async (): Promise<PresentationType[]> => {
    const { data } = await api.get("api/presentation/");
    return data as PresentationType[];
  },
  getAccueilData: async (): Promise<accueilType[]> => {
    const { data } = await api.get("api/accueil/");
    return data as accueilType[];
  },
  getFooterData: async (): Promise<Footertype[]> => {
    const { data } = await api.get("api/footer/");
    return data as Footertype[];
  },
  getInscriptionData: async (): Promise<DemandeType[]> => {
    const { data } = await api.get("api/demande/");
    return data as DemandeType[];
  },

  retrieve: async (id: string, endpoints: string): Promise<unknown> => {
    const { data } = await api.get(`api/${endpoints}/${id}/`);
    return data;
  },
  addInscription: async (demande: DemandeType): Promise<DemandeType> => {
    const { data } = await api.post("api/demande/", demande);
    return data as DemandeType;
  },
  addPresentation: async (
    dataPres: PresentationType
  ): Promise<PresentationType> => {
    const formData = preparePresentationData(dataPres);
    const { data } = await api.post("api/presentation/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data as PresentationType;
  },
  updatePresentation: async (
    dataPres: PresentationType
  ): Promise<PresentationType> => {
    const formData = preparePresentationData(dataPres);
    const { data } = await api.patch(
      `/api/presentation/${dataPres.id}/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data as PresentationType;
  },
  updateAccueil: async (dataAccueil: accueilType): Promise<accueilType> => {
    const formData = prepareAccueilData(dataAccueil);
    const { data } = await api.patch(
      `/api/accueil/${dataAccueil.id}/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data as accueilType;
  },
  updateFooter: async (footer: Footertype): Promise<Footertype> => {
    const { data } = await api.patch(`/api/footer/${footer.id}/`, footer);
    return data as Footertype;
  },
  updateStatut: async (donnee: { id: number; statut: string }) => {
    const { data } = await api.patch(`/api/demande/${donnee.id}/`, {
      statut: donnee.statut,
    });
    return data;
  },

  deleteInscription: async (id: number): Promise<void> => {
    await api.delete(`/api/demande/${id}/`);
  },
  deletePresentation: async (id: number): Promise<void> => {
    await api.delete(`/api/presentation/${id}/`);
  },
};
export default contenuApi;
