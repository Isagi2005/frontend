/**
 * Service de gestion sécurisée des tokens
 * Remplace l'utilisation directe de localStorage pour les tokens sensibles
 */

interface TokenStorage {
  getAccessToken(): string | null;
  getRefreshToken(): string | null;
  setTokens(accessToken: string, refreshToken: string): void;
  removeTokens(): void;
  isTokenExpired(token: string): boolean;
}

class SecureTokenStorage implements TokenStorage {
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly TOKEN_EXPIRY_KEY = 'token_expiry';

  /**
   * Récupère le token d'accès
   */
  getAccessToken(): string | null {
    try {
      const token = localStorage.getItem(this.ACCESS_TOKEN_KEY);
      if (!token) return null;

      // Vérifier si le token est expiré
      if (this.isTokenExpired(token)) {
        this.removeTokens();
        return null;
      }

      return token;
    } catch (error) {
      console.error('Erreur lors de la récupération du token d\'accès:', error);
      return null;
    }
  }

  /**
   * Récupère le token de rafraîchissement
   */
  getRefreshToken(): string | null {
    try {
      return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Erreur lors de la récupération du token de rafraîchissement:', error);
      return null;
    }
  }

  /**
   * Stocke les tokens de manière sécurisée
   */
  setTokens(accessToken: string, refreshToken: string): void {
    try {
      // Calculer la date d'expiration (15 minutes pour access token)
      const expiryTime = Date.now() + (15 * 60 * 1000);
      
      localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
      localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
      localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString());
    } catch (error) {
      console.error('Erreur lors du stockage des tokens:', error);
    }
  }

  /**
   * Supprime tous les tokens du stockage
   */
  removeTokens(): void {
    try {
      localStorage.removeItem(this.ACCESS_TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
    } catch (error) {
      console.error('Erreur lors de la suppression des tokens:', error);
    }
  }

  /**
   * Vérifie si un token JWT est expiré
   */
  isTokenExpired(token: string): boolean {
    try {
      // Décoder le payload du token JWT
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      // Ajouter une marge de 30 secondes pour éviter les problèmes d'horloge
      return payload.exp < (currentTime - 30);
    } catch {
      // Si le décodage échoue, considérer le token comme expiré
      return true;
    }
  }

  /**
   * Vérifie si un rafraîchissement est nécessaire
   */
  shouldRefreshToken(): boolean {
    const token = this.getAccessToken();
    if (!token) return true;

    const expiryTime = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
    if (!expiryTime) return true;

    // Rafraîchir 2 minutes avant l'expiration
    return Date.now() > (parseInt(expiryTime) - (2 * 60 * 1000));
  }
}

// Instance singleton du service
export const tokenService = new SecureTokenStorage();
export default tokenService;
