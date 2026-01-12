export interface Prof {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  role: "enseignant";
  [key: string]: unknown;
}

export interface PeriodeType {
  id: number;
  anneeScolaire: number;
  nom?: string | undefined;
  typePeriode?: string | undefined;
  ordre?: number | undefined;
  dateDebut?: string | undefined;
  dateFin?: string | undefined;
  anneeScolaireNom?: string | undefined;
}

export interface BulletinFormValues {
  [key: string]: unknown;
}

export interface PaieDetailsProps {
  employeId: number;
  employeNom: string;
  employePrenom: string;
  onClose: () => void;
}

export interface FactureFormProps {
  paie: Record<string, unknown>;
  onClose: () => void;
}

export interface UseMutationResult<TVariables = unknown> {
  mutate: (variables: TVariables) => void;
  isLoading?: boolean;
  [key: string]: unknown;
}
