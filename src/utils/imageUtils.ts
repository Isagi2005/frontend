/**
 * Vérifie si une valeur peut être utilisée comme source d'image
 * @param src - La source potentielle de l'image (peut être string, File ou null)
 * @param fallback - Valeur de remplacement si la source n'est pas valide
 * @returns Une URL valide pour une balise img
 */
export const getSafeImageSrc = (src: string | File | null | undefined, fallback: string = ''): string => {
  if (!src) return fallback;
  if (typeof src === 'string') return src;
  if (src instanceof File) return URL.createObjectURL(src);
  return fallback;
};
