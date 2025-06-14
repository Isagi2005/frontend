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
        const response = await api.get('api/employees/'); // Endpoint à adapter
        setEmployees(response.data);
      } catch (err) {
        setError('Erreur lors du chargement des employés');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  return { employees, isLoading, error };
};