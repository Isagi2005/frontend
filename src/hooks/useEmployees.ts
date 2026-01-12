import { useState, useEffect } from 'react';
import api from '../api/api';

interface Employee {
  id: number;
  nom: string;
  prenom: string;
  poste?: string;
}

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true);
      try {
        const response = await api.get<Employee[]>('api/employees/'); // Endpoint à adapter
        setEmployees(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  return { employees, isLoading, error };
};