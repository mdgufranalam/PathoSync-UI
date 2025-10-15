import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Bill } from '../types/index';
import { apiClient } from '../utils/apiClient';
import { toast } from 'sonner';

interface BillsContextType {
    bills: Bill[];
    addBill: (bill: Omit<Bill, 'id'>) => Promise<void>;
    updateBill: (id: string, updates: Partial<Bill>) => Promise<void>;
    getBillById: (id: string) => Bill | undefined;
    deleteBill: (id: string) => Promise<void>;
    loading: boolean;
    error: string | null;
}

const BillsContext = createContext<BillsContextType | undefined>(undefined);

export function BillsProvider({ children }: { children: ReactNode }) {
    const [bills, setBills] = useState<Bill[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBills = useCallback(async () => {
        try {
            setLoading(true);
            const response = await apiClient.get<Bill[]>('/billing');
            if (response.success && response.data) {
                setBills(response.data);
            } else {
                setError(response.error || 'Failed to load bills.');
                toast.error(response.error || 'Failed to load bills.');
            }
        } catch (err) {
            console.error('Error fetching bills:', err);
            setError('Failed to load bills. Please try again later.');
            toast.error('Failed to load bills.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBills();
    }, [fetchBills]);

    const addBill = async (bill: Omit<Bill, 'id'>) => {
        try {
            const response = await apiClient.post<Bill>('/billing', bill);
            if (response.success && response.data) {
                setBills(prev => [...prev, response.data!]);
                toast.success('Bill added successfully!');
            }
            else {
                toast.error(response.error || 'Failed to add bill.');
            }
        } catch (err) {
            console.error('Error adding bill:', err);
            toast.error('Failed to add bill.');
        }
    };

    const updateBill = async (id: string, updates: Partial<Bill>) => {
        try {
            const response = await apiClient.put<Bill>(`/billing/${id}`, updates);
            if (response.success && response.data) {
                setBills(prev => prev.map(bill => (bill.id === id ? response.data! : bill)));
                toast.success('Bill updated successfully!');
            }
            else {
                toast.error(response.error || 'Failed to update bill.');
            }
        } catch (err) {
            console.error('Error updating bill:', err);
            toast.error('Failed to update bill.');
        }
    };

    const getBillById = (id: string) => {
        return bills.find(bill => bill.id === id);
    };

    const deleteBill = async (id: string) => {
        try {
            const response = await apiClient.delete<void>(`/billing/${id}`);
            if (response.success) {
                setBills(prev => prev.filter(bill => bill.id !== id));
                toast.success('Bill deleted successfully!');
            }
            else {
                toast.error(response.error || 'Failed to delete bill.');
            }
        } catch (err) {
            console.error('Error deleting bill:', err);
            toast.error('Failed to delete bill.');
        }
    };

    return (
        <BillsContext.Provider value={{
            bills,
            addBill,
            updateBill,
            getBillById,
            deleteBill,
            loading,
            error,
        }}>
            {children}
        </BillsContext.Provider>
    );
}

export function useBills() {
    const context = useContext(BillsContext);
    if (context === undefined) {
        throw new Error('useBills must be used within a BillsProvider');
    }
    return context;
}
