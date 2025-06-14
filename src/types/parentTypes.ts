// Types pour le parent
export interface ParentTuteur {
  id: number
  nom: string
  prenom: string
}

export interface ParentEnfantPedagogique {
  id: number
  nom: string
  prenom: string
  classe: string
  titulaires: ParentTuteur[]
  trimestres: any[] // tu peux typer plus précisément si besoin
}
