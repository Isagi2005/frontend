import Fuse from "fuse.js";
import { routesByRole } from "./routes/routeByRole";
import type { RouteObject } from "react-router-dom";

export interface VoiceRoute {
  path: string;
  label: string;
  keywords?: string[];
}


interface RawRoute extends Omit<RouteObject, 'children' | 'element'> {
  element: React.ReactNode;
  label?: string;
  keywords?: string[];
  children?: RawRoute[];
  roles?: string[];
}

export function getRoutesForRole(role: string): VoiceRoute[] {
  // On ne retourne que les routes enrichies pour le rôle donné
  const rawRoutes = (routesByRole as unknown as Record<string, RawRoute[]>)[role] || [];
  
  // Fonction récursive pour extraire toutes les routes, y compris les sous-routes
  const extractRoutes = (routes: RawRoute[]): VoiceRoute[] => {
    return routes.flatMap(route => {
      // S'assurer que path est une chaîne non vide
      const path = route.path ?? '';
      
      // Créer un label par défaut basé sur le nom du composant ou le chemin
      const elementName = (route.element as { type?: { name?: string } })?.type?.name;
      const defaultLabel = elementName || (typeof path === 'string' ? path.split('/').pop() : '') || 'Sans nom';
      const label = route.label || defaultLabel;
      
      const baseRoute: VoiceRoute = {
        path,
        label,
        keywords: route.keywords || []
      };
      
      // Ignorer les routes sans chemin valide
      if (!path) return [];
      
      // Ajouter les sous-routes si elles existent
      const childRoutes = route.children ? extractRoutes(route.children) : [];
      return [baseRoute, ...childRoutes];
    });
  };
  
  return extractRoutes(rawRoutes);
}

export function createRouteFuse(routes: VoiceRoute[]): Fuse<VoiceRoute> {
  return new Fuse<VoiceRoute>(routes, {
    keys: ["label", "path", "keywords"],
    threshold: 0.6, // ← plus permissif
    includeScore: true, // pour debug si besoin
  });
}

// Liste de verbes d'action et mots inutiles à ignorer lors du matching
const ACTION_WORDS = [
  "ouvre", "ouvre-moi", "va", "vas", "montre", "affiche", "montres", "montrez", "aller", "donne", "donnes", "donnez", "accède", "accéder", "sur", "le", "la", "les", "un", "une", "au", "aux", "du", "de", "des", "me", "moi", "s'il te plaît", "stp"
];

export function cleanTranscript(transcript: string): string {
  let cleaned = transcript.toLowerCase();
  ACTION_WORDS.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    cleaned = cleaned.replace(regex, " ");
  });
  cleaned = cleaned.replace(/\s+/g, " ").trim();
  return cleaned;
}

export function findBestRoute(fuse: Fuse<VoiceRoute>, transcript: string): VoiceRoute | null {
  const result = fuse.search(transcript);
  return result.length > 0 ? result[0].item : null;
}

