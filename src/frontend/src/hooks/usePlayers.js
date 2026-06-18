import { useState, useCallback } from 'react';
import api from '../api/axios';

export default function usePlayers() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPlayers, setTotalPlayers] = useState(0);

  const fetchPlayers = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      // Clean up params (remove empty fields)
      const cleanParams = {};
      Object.keys(params).forEach((key) => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          cleanParams[key] = params[key];
        }
      });

      const response = await api.get('/players', { params: cleanParams });
      
      // Map Response fields: data contains players list, pagination contains total pages
      const payload = response.data;
      setPlayers(payload.data || []);
      if (payload.pagination) {
        setTotalPages(payload.pagination.totalPages || 1);
        setTotalPlayers(payload.pagination.totalPlayers || 0);
      }
    } catch (err) {
      console.error('Error fetching players:', err);
      setError(err.response?.data?.message || 'Failed to retrieve players from the roster.');
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    players,
    loading,
    error,
    totalPages,
    totalPlayers,
    fetchPlayers,
  };
}
