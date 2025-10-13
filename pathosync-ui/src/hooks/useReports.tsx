import { useState, useEffect } from 'react';
import { apiClient } from '../utils/apiClient';
import { LabReport } from '../types'; // Assuming you have a LabReport type defined

export const useReports = () => {
  const [reports, setReports] = useState<LabReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/reports');
        if (response.success) {
          setReports(response.data as LabReport[]);
        } else {
          setError(response.error || 'Failed to fetch reports');
        }
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return { reports, loading, error, setReports };
};
