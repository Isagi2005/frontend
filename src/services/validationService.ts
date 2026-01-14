/**
 * Service de validation et sanitization des entrées utilisateur
 */

export class ValidationService {
  /**
   * Nettoie une chaîne de caractères pour prévenir les injections
   */
  static sanitizeString(input: string): string {
    if (typeof input !== 'string') return '';
    
    return input
      .trim()
      .replace(/[<>]/g, '') // Supprimer les chevrons
      .replace(/javascript:/gi, '') // Supprimer les protocoles javascript
      .replace(/on\w+=/gi, ''); // Supprimer les gestionnaires d'événements
  }

  /**
   * Valide un email
   */
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Valide un numéro de téléphone (format malgache)
   */
  static validatePhone(phone: string): boolean {
    const phoneRegex = /^(03[2-9]|\+261[2-9])\d{7}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }

  /**
   * Valide la force d'un mot de passe
   */
  static validatePasswordStrength(password: string): {
    isValid: boolean;
    score: number;
    feedback: string[];
  } {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('Le mot de passe doit contenir au moins 8 caractères');
    }

    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Le mot de passe doit contenir des lettres minuscules');
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Le mot de passe doit contenir des lettres majuscules');
    }

    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push('Le mot de passe doit contenir des chiffres');
    }

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Le mot de passe doit contenir des caractères spéciaux');
    }

    return {
      isValid: score >= 4,
      score,
      feedback
    };
  }

  /**
   * Valide un nom ou prénom
   */
  static validateName(name: string): boolean {
    const nameRegex = /^[a-zA-ZàâäéèêëïîôöùûçÀÂÄÉÈÊËÏÎÔÖÙÛÇ\s'-]{2,50}$/;
    return nameRegex.test(name.trim());
  }

  /**
   * Limite la longueur d'une chaîne
   */
  static truncateString(input: string, maxLength: number): string {
    if (typeof input !== 'string') return '';
    return input.length > maxLength ? input.substring(0, maxLength) : input;
  }

  /**
   * Nettoie le contenu HTML pour l'affichage
   */
  static sanitizeHtml(input: string): string {
    if (typeof input !== 'string') return '';
    
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '');
  }

  /**
   * Valide un rôle utilisateur
   */
  static validateRole(role: string): boolean {
    const validRoles = ['direction', 'enseignant', 'parent', 'finance'];
    return validRoles.includes(role);
  }

  /**
   * Valide une date
   */
  static validateDate(dateString: string): boolean {
    const date = new Date(dateString);
    return !isNaN(date.getTime()) && date <= new Date();
  }

  /**
   * Nettoie et valide une adresse
   */
  static validateAddress(address: string): boolean {
    const cleanAddress = this.sanitizeString(address);
    return cleanAddress.length >= 5 && cleanAddress.length <= 200;
  }
}

export default ValidationService;
