import Fuse from "fuse.js";
import { routesByRole } from "./routes/routeByRole";

export interface VoiceRoute {
  path: string;
  label: string;
  keywords?: string[];
}

// Typage strict pour l'accès aux routes
import type { routesByRole as routesByRoleType } from "./routes/routeByRole";
type Role = keyof typeof routesByRoleType;

type RawRoute = {
  path: string;
  element: React.ReactNode;
  label?: string;
  keywords?: string[];
};

export function getRoutesForRole(role: string): VoiceRoute[] {
  // On ne retourne que les routes enrichies pour le rôle donné
  const rawRoutes = (routesByRole as Record<string, RawRoute[]>)[role] || [];
  return rawRoutes.map(route => ({
    path: route.path,
    label: route.label || (route.element as any)?.type?.name || route.path,
    keywords: route.keywords || []
  }));
}

export function createRouteFuse(routes: VoiceRoute[]): Fuse<VoiceRoute> {
  return new Fuse(routes, {
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

