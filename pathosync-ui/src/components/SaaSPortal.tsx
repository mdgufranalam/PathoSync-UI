import React, { useState, useEffect } from 'react';
import { apiClient } from '../utils/apiClient';

interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  email: string;
  subscription: string;
  billingCycle: string;
  status: string;
}

const SaaSPortal = () => {
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);

    useEffect(() => {
        fetchTenants();
    }, []);

    const fetchTenants = async () => {
        const response = await apiClient.get('/saas/tenants');
        setTenants(response.data);
    };

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const tenantData = Object.fromEntries(formData.entries());

        if (currentTenant) {
            await apiClient.put(`/saas/tenants/${currentTenant.id}`, tenantData);
        } else {
            await apiClient.post('/saas/tenants', tenantData);
        }
        
        fetchTenants();
        setModalOpen(false);
        setCurrentTenant(null);
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">SaaS Portal</h1>
            
            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold">Total Tenants</h2>
                    <p className="text-3xl">{tenants.length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold">Active Subscriptions</h2>
                    <p className="text-3xl">{tenants.filter(t => t.status === 'Active').length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold">Total Revenue</h2>
                    <p className="text-3xl">$ {tenants.length * 100}</p> {/* Placeholder */}
                </div>
            </div>

            {/* Tenant Table */}
            <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between mb-4">
                    <h2 className="text-xl font-bold">Client Management</h2>
                    <button 
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={() => { setModalOpen(true); setCurrentTenant(null); }}
                    >
                        Add Tenant
                    </button>
                </div>
                <table className="w-full">
                    <thead>
                        <tr className="border-b">
                            <th className="text-left p-2">Name</th>
                            <th className="text-left p-2">Subdomain</th>
                            <th className="text-left p-2">Email</th>
                            <th className="text-left p-2">Subscription</th>
                            <th className="text-left p-2">Billing Cycle</th>
                            <th className="text-left p-2">Status</th>
                            <th className="text-left p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tenants.map(tenant => (
                            <tr key={tenant.id} className="border-b">
                                <td className="p-2">{tenant.name}</td>
                                <td className="p-2">{tenant.subdomain}</td>
                                <td className="p-2">{tenant.email}</td>
                                <td className="p-2">{tenant.subscription}</td>
                                <td className="p-2">{tenant.billingCycle}</td>
                                <td className="p-2">{tenant.status}</td>
                                <td className="p-2">
                                    <button 
                                        className="text-blue-500 mr-2"
                                        onClick={() => { setModalOpen(true); setCurrentTenant(tenant); }}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        className="text-red-500"
                                        onClick={async () => {
                                            await apiClient.delete(`/saas/tenants/${tenant.id}`);
                                            fetchTenants();
                                        }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal for Add/Edit Tenant */}
            {modalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                        <h2 className="text-xl font-bold mb-4">{currentTenant ? 'Edit Tenant' : 'Add Tenant'}</h2>
                        <form onSubmit={handleFormSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <input type="text" name="name" defaultValue={currentTenant?.name} className="w-full p-2 border rounded" required />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Subdomain</label>
                                <input type="text" name="subdomain" defaultValue={currentTenant?.subdomain} className="w-full p-2 border rounded" required />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <input type="email" name="email" defaultValue={currentTenant?.email} className="w-full p-2 border rounded" required />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Subscription</label>
                                <select name="subscription" defaultValue={currentTenant?.subscription} className="w-full p-2 border rounded">
                                    <option>Basic</option>
                                    <option>Standard</option>
                                    <option>Premium</option>
                                    <option>Enterprise</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Billing Cycle</label>
                                <select name="billingCycle" defaultValue={currentTenant?.billingCycle} className="w-full p-2 border rounded">
                                    <option>Monthly</option>
                                    <option>Yearly</option>
                                </select>
                            </div>
                            <div className="flex justify-end">
                                <button type="button" className="bg-gray-300 text-black px-4 py-2 rounded mr-2" onClick={() => setModalOpen(false)}>Cancel</button>
                                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SaaSPortal;