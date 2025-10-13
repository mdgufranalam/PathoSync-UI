import { Patient, Doctor, Test, CollectionCenter, Bill } from '../types';

const API_URL = 'http://localhost:3001/api';

async function fetchFromAPI<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${API_URL}/${endpoint}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${endpoint}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error in fetchFromAPI for ${endpoint}:`, error);
    throw error;
  }
}

// Specific fetch functions for each data type
export const getPatients = () => fetchFromAPI<Patient[]>('patients');
export const getDoctors = () => fetchFromAPI<Doctor[]>('doctors');
export const getTests = () => fetchFromAPI<Test[]>('tests');
export const getCollectionCenters = () => fetchFromAPI<CollectionCenter[]>('collection-centers');
export const getBills = () => fetchFromAPI<Bill[]>('bills');

// Generic function to add data
async function addToAPI<T>(endpoint: string, data: Omit<T, 'id'>): Promise<T> {
  try {
    const response = await fetch(`${API_URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to add to ${endpoint}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error in addToAPI for ${endpoint}:`, error);
    throw error;
  }
}

// Specific add functions
export const addPatient = (patient: Omit<Patient, 'id'>) => addToAPI<Patient>('patients', patient);
export const addDoctor = (doctor: Omit<Doctor, 'id'>) => addToAPI<Doctor>('doctors', doctor);
export const addTest = (test: Omit<Test, 'id'>) => addToAPI<Test>('tests', test);
export const addBill = (bill: Omit<Bill, 'id'>) => addToAPI<Bill>('bills', bill);

// Generic function to update data
async function updateInAPI<T extends { id: string }>(endpoint: string, data: T): Promise<T> {
  try {
    const response = await fetch(`${API_URL}/${endpoint}/${data.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to update ${endpoint}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error in updateInAPI for ${endpoint}:`, error);
    throw error;
  }
}

// Specific update functions
export const updatePatient = (patient: Patient) => updateInAPI<Patient>('patients', patient);
export const updateDoctor = (doctor: Doctor) => updateInAPI<Doctor>('doctors', doctor);
export const updateTest = (test: Test) => updateInAPI<Test>('tests', test);
export const updateBill = (bill: Bill) => updateInAPI<Bill>('bills', bill);

// Generic function to delete data
async function deleteFromAPI(endpoint: string, id: string): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/${endpoint}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete from ${endpoint}: ${response.statusText}`);
    }
  } catch (error) {
    console.error(`Error in deleteFromAPI for ${endpoint}:`, error);
    throw error;
  }
}

// Specific delete functions
export const deletePatient = (id: string) => deleteFromAPI('patients', id);
export const deleteDoctor = (id: string) => deleteFromAPI('doctors', id);
export const deleteTest = (id: string) => deleteFromAPI('tests', id);
export const deleteBill = (id: string) => deleteFromAPI('bills', id);
