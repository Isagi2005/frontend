// Types de base
export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: {
    url?: string;
    method?: string;
    headers?: Record<string, string>;
    params?: Record<string, string | number | boolean>;
    data?: unknown;
    [key: string]: unknown;
  };
}

// Exemple de type pour une réponse de liste
export interface ListResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Types pour les erreurs API
export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

// Type pour les paramètres de requête
export interface QueryParams {
  [key: string]: string | number | boolean | undefined;
}

// Type pour les options de requête
export interface RequestOptions {
  params?: QueryParams;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}
