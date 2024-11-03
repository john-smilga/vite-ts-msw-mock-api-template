import { useEffect, useState } from 'react';
import axios from 'axios';
import { Tour } from './types';
export const url = 'https://www.course-api.com/react-tours-project';

export const useFetch = () => {
  const [loading, setLoading] = useState(false);
  const [tours, setTours] = useState<Tour[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchTours = async () => {
    setLoading(true);
    try {
      const response = await axios.get<Tour[]>(url);
      setTours(response.data);
    } catch (error) {
      setError('error fetching tours');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);
  return { loading, tours, error };
};
