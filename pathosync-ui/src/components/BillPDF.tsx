import React from 'react';
import { Bill, Tenant } from '../types';

interface BillPDFProps {
  bill: Bill;
  tenant: Tenant;
}

export function BillPDF({ bill, tenant }: BillPDFProps) {
  const printBill = () => {
    window.print();
  };

  return (
    <div className="bg-white p-8 max-w-4xl mx-auto" id="bill-pdf">
      {/* Header */}
      <div className="border-b pb-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl text-blue-600 mb-2">{tenant.name}</h1>
            <div className="text-gray-600 space-y-1">
              <p>{tenant.address}</p>
              <p>Phone: {tenant.phone} | Email: {tenant.email}</p>
              <p>License No: {tenant.license_number}</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-2xl mb-2">BILL</h2>
            <div className="text-gray-600">
              <p>Bill ID: {bill.id}</p>
              <p>Date: {new Date(bill.created_at).toLocaleDateString()}</p>
              <p>Time: {new Date(bill.created_at).toLocaleTimeString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Patient Information */}
      <div className="grid grid-cols-2 gap-8 mb-6">
        <div>
          <h3 className="text-lg mb-3 text-gray-800 border-b pb-1">Patient Information</h3>
          <div className="space-y-2 text-gray-600">
            <p><span className="font-medium">Name:</span> {bill.patient?.first_name} {bill.patient?.last_name}</p>
            <p><span className="font-medium">Email:</span> {bill.patient?.email}</p>
            <p><span className="font-medium">Phone:</span> {bill.patient?.phone}</p>
            <p><span className="font-medium">Address:</span> {bill.patient?.address}</p>
            <p><span className="font-medium">Date of Birth:</span> {new Date(bill.patient.date_of_birth).toLocaleDateString()}</p>
            <p><span className="font-medium">Gender:</span> {bill.patient?.gender.charAt(0).toUpperCase() + bill.patient.gender.slice(1)}</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg mb-3 text-gray-800 border-b pb-1">Doctor Information</h3>
          <div className="space-y-2 text-gray-600">
            <p><span className="font-medium">Name:</span> {bill.doctor?.first_name} {bill.doctor?.last_name}</p>
            <p><span className="font-medium">Specialization:</span> {bill.doctor?.specialization}</p>
            <p><span className="font-medium">Email:</span> {bill.doctor?.email}</p>
            <p><span className="font-medium">Phone:</span> {bill.doctor?.phone}</p>
            <p><span className="font-medium">License No:</span> {bill.doctor?.license_number}</p>
          </div>
        </div>
      </div>

      {/* Tests */}
      <div className="mb-6">
        <h3 className="text-lg mb-3 text-gray-800 border-b pb-1">Tests Ordered</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-2 px-4 font-medium">Test Name</th>
                <th className="text-left py-2 px-4 font-medium">Category</th>
                <th className="text-center py-2 px-4 font-medium">Quantity</th>
                <th className="text-right py-2 px-4 font-medium">Unit Price</th>
                <th className="text-right py-2 px-4 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {bill.tests.map((item, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium">{item.test.name}</p>
                      <p className="text-sm text-gray-500">{item.test.description}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{item.test.category_id}</td>
                  <td className="py-3 px-4 text-center">{item.quantity}</td>
                  <td className="py-3 px-4 text-right">₹{item.test.price.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right">₹{(item.quantity * item.price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="flex justify-end mb-6">
        <div className="w-80">
          <div className="space-y-2 text-right">
            <div className="flex justify-between py-1 border-b border-gray-200">
              <span className="text-gray-600">Subtotal:</span>
              <span>₹{bill.subtotal.toFixed(2)}</span>
            </div>
            {bill.discount_amount > 0 && (
              <div className="flex justify-between py-1 border-b border-gray-200 text-green-600">
                <span>Discount:</span>
                <span>-₹{bill.discount_amount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between py-1 border-b border-gray-200">
              <span className="text-gray-600">Tax:</span>
              <span>₹{bill.total_tax_amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 border-t-2 border-gray-400 text-xl font-semibold">
              <span>Total Amount:</span>
              <span>₹{bill.total_amount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Details */}
      <div className="grid grid-cols-2 gap-8 mb-6">
        <div>
          <h3 className="text-lg mb-3 text-gray-800 border-b pb-1">Payment Details</h3>
          <div className="space-y-2 text-gray-600">
            <p><span className="font-medium">Status:</span> 
              <span className={`ml-2 px-2 py-1 rounded text-sm ${
                bill.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                bill.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {bill.payment_status.charAt(0).toUpperCase() + bill.payment_status.slice(1)}
              </span>
            </p>
            {bill.payment_method && (
              <p><span className="font-medium">Payment Method:</span> {bill.payment_method.charAt(0).toUpperCase() + bill.payment_method.slice(1)}</p>
            )}
          </div>
        </div>

        {bill.notes && (
          <div>
            <h3 className="text-lg mb-3 text-gray-800 border-b pb-1">Notes</h3>
            <p className="text-gray-600">{bill.notes}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t pt-6 mt-8">
        <div className="text-center text-gray-500 space-y-2">
          <p>Thank you for choosing {tenant.name}</p>
          <p className="text-sm">This is a computer-generated bill and does not require a signature.</p>
          <p className="text-sm">For any queries, please contact us at {tenant.phone} or {tenant.email}</p>
        </div>
      </div>

      {/* Print Button (hidden in print) */}
      <div className="text-center mt-6 print:hidden">
        <button
          onClick={printBill}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Print Bill
        </button>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #bill-pdf, #bill-pdf * {
            visibility: visible;
          }
          #bill-pdf {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
