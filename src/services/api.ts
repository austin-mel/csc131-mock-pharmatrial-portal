import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Patients
export const getPatients = () => api.get('/patients');
export const getPatientById = (id: string) => api.get(`/patients/${id}`);

// Trials
export const getTrials = () => api.get('/trials');
export const getTrialById = (id: string) => api.get(`/trials/${id}`);

export default api;
