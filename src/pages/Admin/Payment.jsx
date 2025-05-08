import React, { useState, useEffect } from 'react';
import { 
  FiRefreshCw, 
  FiCheck, 
  FiX, 
  FiClock, 
  FiDollarSign, 
  FiPhone, 
  FiMail, 
  FiUser, 
  FiGlobe 
} from 'react-icons/fi';

function Payment() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');

  // Safely fetch payment history
  const fetchPayments = async () => {
    try {
      setRefreshing(true);
      const response = await fetch('https://exellar.vercel.app/payment');
      if (!response.ok) {
        throw new Error('Failed to fetch payments');
      }
      const data = await response.json();
      
      // Ensure data is properly formatted
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format received from server');
      }
      
      setPayments(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setPayments([]); // Reset payments on error
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // Safely update payment status
  const updatePaymentStatus = async (id, newStatus) => {
    try {
      if (!id) {
        throw new Error('Invalid payment ID');
      }

      const response = await fetch(`https://exellar.vercel.app/payment/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update payment status');
      }

      setPayments(prevPayments => 
        prevPayments.map(payment => 
          payment._id === id ? { ...payment, status: newStatus } : payment
        )
      );
      
      // Optionally switch to the appropriate tab after status change
      setActiveTab(newStatus === 'completed' ? 'completed' : newStatus === 'rejected' ? 'rejected' : 'pending');
    } catch (err) {
      setError(err.message);
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium";
    
    switch (status) {
      case 'completed':
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800`}>
            <FiCheck className="mr-1" /> Completed
          </span>
        );
      case 'rejected':
        return (
          <span className={`${baseClasses} bg-red-100 text-red-800`}>
            <FiX className="mr-1" /> Rejected
          </span>
        );
      default:
        return (
          <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
            <FiClock className="mr-1" /> Pending
          </span>
        );
    }
  };

  // Filter payments based on active tab
  const filteredPayments = payments.filter(payment => {
    switch (activeTab) {
      case 'pending':
        return payment?.status === 'pending';
      case 'completed':
        return payment?.status === 'completed';
      case 'rejected':
        return payment?.status === 'rejected';
      default:
        return true;
    }
  });

  // Safely render loading state
  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[200px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
      <p className="text-gray-600">Loading payment history...</p>
    </div>
  );

  // Safely render error state
  if (error) return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">Error: {error}</p>
          </div>
          <div className="ml-auto pl-3">
            <button 
              onClick={fetchPayments} 
              className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium text-red-700 hover:bg-red-100 focus:outline-none"
            >
              <FiRefreshCw className="mr-1" /> Retry
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <FiDollarSign className="mr-2" /> Payment Management
        </h1>
        <button 
          onClick={fetchPayments} 
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${refreshing ? 'opacity-75 cursor-not-allowed' : ''}`}
          disabled={refreshing}
        >
          <FiRefreshCw className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} /> 
          {refreshing ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Total Payments</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">{payments.length}</p>
          </div>
        </div>
        <div 
          className={`bg-white overflow-hidden shadow rounded-lg cursor-pointer ${activeTab === 'pending' ? 'ring-2 ring-yellow-500' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Pending</h3>
            <p className="mt-2 text-3xl font-semibold text-yellow-600">
              {payments.filter(p => p?.status === 'pending').length}
            </p>
          </div>
        </div>
        <div 
          className={`bg-white overflow-hidden shadow rounded-lg cursor-pointer ${activeTab === 'completed' ? 'ring-2 ring-green-500' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Completed</h3>
            <p className="mt-2 text-3xl font-semibold text-green-600">
              {payments.filter(p => p?.status === 'completed').length}
            </p>
          </div>
        </div>
        <div 
          className={`bg-white overflow-hidden shadow rounded-lg cursor-pointer ${activeTab === 'rejected' ? 'ring-2 ring-red-500' : ''}`}
          onClick={() => setActiveTab('rejected')}
        >
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Rejected</h3>
            <p className="mt-2 text-3xl font-semibold text-red-600">
              {payments.filter(p => p?.status === 'rejected').length}
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('pending')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'pending' ? 'border-yellow-500 text-yellow-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            <FiClock className="inline mr-2" />
            Pending
            <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {payments.filter(p => p?.status === 'pending').length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'completed' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            <FiCheck className="inline mr-2" />
            Completed
            <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {payments.filter(p => p?.status === 'completed').length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('rejected')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'rejected' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            <FiX className="inline mr-2" />
            Rejected
            <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {payments.filter(p => p?.status === 'rejected').length}
            </span>
          </button>
        </nav>
      </div>

      {/* Payment Table with safe data rendering */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <FiUser className="mr-2" /> Name
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <FiGlobe className="mr-2" /> Country
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <FiPhone className="mr-2" /> Number
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <FiDollarSign className="mr-2" /> Amount
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sender
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <FiMail className="mr-2" /> Email
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => (
                  <tr key={payment?._id || Math.random()} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                          {payment?.name?.charAt(0) || '?'}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {payment?.name || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment?.country || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment?.number || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${payment?.amount || '0'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment?.senderNumber || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment?.paymentMethod || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment?.email || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(payment?.status || 'pending')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {(payment?.status === 'pending') && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => updatePaymentStatus(payment._id, 'completed')}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            <FiCheck className="mr-1" /> Approve
                          </button>
                          <button
                            onClick={() => updatePaymentStatus(payment._id, 'rejected')}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            <FiX className="mr-1" /> Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="px-6 py-4 text-center text-sm text-gray-500">
                    No {activeTab} payments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Payment;