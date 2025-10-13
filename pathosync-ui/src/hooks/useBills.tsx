import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Bill } from '../types/index';
import { getBills, addBill as apiAddBill, updateBill as apiUpdateBill, deleteBill as apiDeleteBill } from '../utils/api';
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

    useEffect(() => {
        const fetchBills = async () => {
            try {
                setLoading(true);
                const fetchedBills = await getBills();
                setBills(fetchedBills as Bill[]);
                setError(null);
            } catch (err) {
                console.error('Error fetching bills:', err);
                setError('Failed to load bills. Please try again later.');
                toast.error('Failed to load bills.');
            } finally {
                setLoading(false);
            }
        };

        fetchBills();
    }, []);

    const addBill = async (bill: Omit<Bill, 'id'>) => {
        try {
            const newBill = await apiAddBill(bill);
            setBills(prev => [...prev, newBill as Bill]);
            toast.success('Bill added successfully!');
        } catch (err) {
            console.error('Error adding bill:', err);
            toast.error('Failed to add bill.');
        }
    };

    const updateBill = async (id: string, updates: Partial<Bill>) => {
        const billToUpdate = bills.find(b => b.id === id);
        if (!billToUpdate) {
            toast.error('Bill not found');
            return;
        }
        
        const updatedBillData = { ...billToUpdate, ...updates };

        try {
            const updatedBill = await apiUpdateBill(updatedBillData);
            setBills(prev => prev.map(bill => (bill.id === id ? updatedBill as Bill : bill)));
            toast.success('Bill updated successfully!');
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
            await apiDeleteBill(id);
            setBills(prev => prev.filter(bill => bill.id !== id));
            toast.success('Bill deleted successfully!');
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
