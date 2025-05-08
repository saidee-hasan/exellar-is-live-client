import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

function History() {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        const response = await fetch('https://exellar.vercel.app/payment');
        if (!response.ok) {
          throw new Error('Failed to fetch payment history');
        }
        const data = await response.json();
        
        const transformedData = Array.isArray(data) 
          ? data.map(payment => ({
              ...payment,
              _id: payment._id || payment.id || Math.random().toString(36).substr(2, 9),
              status: typeof payment.status === 'object' 
                ? payment.status.status 
                : payment.status || 'pending',
              name: payment.name || 'Unknown',
              country: payment.country || '',
              number: payment.number || '',
              senderNumber: payment.senderNumber || '',
              amount: payment.amount || '0',
              paymentMethod: payment.paymentMethod || 'Unknown',
              email: payment.email || '',
              createdAt: payment.createdAt || payment.date || new Date().toISOString()
            }))
          : [];
        
        setPayments(transformedData);
        setFilteredPayments(transformedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentHistory();
  }, []);

  useEffect(() => {
    let results = payments;
    
    if (user?.email) {
      results = results.filter(payment => payment.email === user.email);
    }
    
    if (searchTerm) {
      results = results.filter(payment =>
        payment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (payment.number && payment.number.includes(searchTerm)) ||
        (payment.senderNumber && payment.senderNumber.includes(searchTerm)) ||
        (payment.amount && payment.amount.toString().includes(searchTerm))
      );
    }
    
    if (statusFilter !== 'all') {
      results = results.filter(payment => payment.status === statusFilter);
    }
    
    setFilteredPayments(results);
  }, [payments, user, searchTerm, statusFilter]);

  const openPaymentDetails = (payment) => {
    setSelectedPayment(payment);
  };

  const closePaymentDetails = () => {
    setSelectedPayment(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center"
        >
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-indigo-500 rounded-full"></div>
            </div>
          </div>
          <motion.p 
            className="mt-4 text-indigo-600 text-lg font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Loading your payment history...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-red-50 to-pink-50">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Error Loading Data</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-1">
              {user?.email ? 'Your Payment History' : 'All Payments'}
            </h1>
            <p className="text-gray-500">Track and manage all your transactions</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto mt-4 md:mt-0">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search payments..."
                className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full bg-white shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg
                className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            
            <select
              className="border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          {filteredPayments.length === 0 ? (
            <div className="p-12 text-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="inline-block"
              >
                <svg
                  className="mx-auto h-16 w-16 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </motion.div>
              <h3 className="mt-4 text-lg font-medium text-gray-700">No payments found</h3>
              <p className="mt-2 text-gray-500">Try adjusting your search or filter criteria</p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
                className="mt-4 px-4 py-2 text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-indigo-500 to-purple-600">
                  <tr>
                    <th scope="col" className="px-8 py-5 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Transaction
                    </th>
                    <th scope="col" className="px-6 py-5 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Details
                    </th>
                    <th scope="col" className="px-6 py-5 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-5 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Status
                    </th>
                    {!user?.email && (
                      <th scope="col" className="px-6 py-5 text-left text-xs font-medium text-white uppercase tracking-wider">
                        User
                      </th>
                    )}
                    <th scope="col" className="px-6 py-5 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPayments.map((payment) => (
                    <motion.tr 
                      key={payment._id} 
                      whileHover={{ backgroundColor: 'rgba(238, 242, 255, 0.5)' }}
                      className="cursor-pointer transition-colors"
                      onClick={() => openPaymentDetails(payment)}
                    >
                      <td className="px-8 py-5 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                            {payment.paymentMethod === 'Credit Card' ? (
                              <svg className="h-6 w-6 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                              </svg>
                            ) : payment.paymentMethod === 'Bank Transfer' ? (
                              <svg className="h-6 w-6 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5 4a1 1 0 011-1h8a1 1 0 011 1v1h2a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2h2V4zm2 3a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <span className="text-indigo-600 font-medium text-lg">
                                {payment.name.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{payment.name}</div>
                            <div className="text-sm text-gray-500">{payment.paymentMethod}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center">
                            {payment.country && (
                              <span className={`fi fi-
                                
                                ${payment.country.toLowerCase()} mr-2`}></span>
                            )}
                            {payment.country || 'N/A'}
                          </div>
                          <div className="text-gray-500 mt-1">{payment.number || 'N/A'}</div>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-right">
                        <div className="text-lg font-semibold text-gray-900">
                        ৳💵{parseFloat(payment.amount || '0').toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <motion.span 
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}
                          whileHover={{ scale: 1.05 }}
                        >
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </motion.span>
                      </td>
                      {!user?.email && (
                        <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500">
                          {payment.email || 'N/A'}
                        </td>
                      )}
                      <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500">
                        {new Date(payment.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
        
        {filteredPayments.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
          >
            <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-indigo-500 hover:shadow-lg transition-shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-indigo-100 mr-4">
                  <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-500">Total Payments</h3>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{filteredPayments.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-green-500 hover:shadow-lg transition-shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 mr-4">
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-500">Completed</h3>
                  <p className="text-3xl font-bold text-gray-800 mt-1">
                    {filteredPayments.filter(p => p.status === 'completed').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-yellow-500 hover:shadow-lg transition-shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 mr-4">
                  <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-500">Pending</h3>
                  <p className="text-3xl font-bold text-gray-800 mt-1">
                    {filteredPayments.filter(p => p.status === 'pending').length}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Payment Details Modal */}
      <AnimatePresence>
        {selectedPayment && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={closePaymentDetails}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">Transaction Details</h2>
                  <button 
                    onClick={closePaymentDetails}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Information</h3>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Amount</p>
                          <p className="font-semibold">${parseFloat(selectedPayment.amount || '0').toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Status</p>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            selectedPayment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            selectedPayment.status === 'completed' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {selectedPayment.status}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Method</p>
                          <p className="font-medium">{selectedPayment.paymentMethod}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Date</p>
                          <p className="font-medium">
                            {new Date(selectedPayment.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Recipient Details</h3>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center mb-3">
                        <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-indigo-600 font-medium">
                            {selectedPayment.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{selectedPayment.name}</p>
                          <p className="text-sm text-gray-500">{selectedPayment.email}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="font-medium">{selectedPayment.number || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Country</p>
                          <p className="font-medium flex items-center">
                            {selectedPayment.country && (
                              <span className={`fi fi-${selectedPayment.country.toLowerCase()} mr-2`}></span>
                            )}
                            {selectedPayment.country || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Sender Information</h3>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="font-medium">{selectedPayment.senderNumber || 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      onClick={closePaymentDetails}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default History;