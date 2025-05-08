import React, { useState, useEffect, useMemo } from 'react';
import { 
  FiRefreshCw, 
  FiCheck, 
  FiX, 
  FiClock, 
  FiDollarSign, 
  FiPhone, 
  FiMail, 
  FiUser, 
  FiGlobe,
  FiChevronUp,
  FiChevronDown,
  FiEye,
  FiDownloadCloud
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { saveAs } from 'file-saver';

function Payment() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const statusCounts = useMemo(() => ({
    all: payments.length,
    pending: payments.filter(p => p?.status === 'pending').length,
    completed: payments.filter(p => p?.status === 'completed').length,
    rejected: payments.filter(p => p?.status === 'rejected').length
  }), [payments]);

  const fetchPayments = async () => {
    try {
      setRefreshing(true);
      const response = await fetch('https://exellar.vercel.app/payment');
      if (!response.ok) throw new Error('Failed to fetch payments');
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error('Invalid data format');
      setPayments(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setPayments([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const updatePaymentStatus = async (id, newStatus) => {
    try {
      if (!id) throw new Error('Invalid payment ID');
      const response = await fetch(`https://exellar.vercel.app/payment/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error('Failed to update status');
      setPayments(prev => prev.map(p => 
        p._id === id ? { ...p, status: newStatus } : p
      ));
      setActiveTab(newStatus === 'completed' ? 'completed' : newStatus === 'rejected' ? 'rejected' : 'pending');
    } catch (err) {
      setError(err.message);
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors";
    switch (status) {
      case 'completed':
        return <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100`}>
          <FiCheck className="mr-1" /> Completed
        </motion.span>;
      case 'rejected':
        return <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100`}>
          <FiX className="mr-1" /> Rejected
        </motion.span>;
      default:
        return <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100`}>
          <FiClock className="mr-1" /> Pending
        </motion.span>;
    }
  };

  const filteredPayments = useMemo(() => {
    let filtered = payments.filter(payment => {
      if (activeTab !== 'all') {
        if (payment?.status !== activeTab) return false;
      }
      const searchLower = searchTerm.toLowerCase();
      const fieldsToSearch = [
        payment?.name,
        payment?.country,
        payment?.number,
        payment?.senderNumber,
        payment?.paymentMethod,
        payment?.email,
        payment?.status
      ];
      const matchesSearch = fieldsToSearch.some(field => 
        (field || '').toLowerCase().includes(searchLower)
      );
      return matchesSearch;
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [payments, activeTab, searchTerm, sortConfig]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPayments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Name', 'Country', 'Phone', 'Amount', 'Sender', 'Method', 'Email', 'Status'],
      ...filteredPayments.map(payment => [
        payment.name,
        payment.country,
        payment.number,
        payment.amount,
        payment.senderNumber,
        payment.paymentMethod,
        payment.email,
        payment.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'payments.csv');
  };

  if (loading) return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="flex flex-col items-center justify-center min-h-[200px]">
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"
        />
        <p className={`text-gray-600 ${darkMode ? 'text-gray-400' : ''}`}>Loading payment history...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} p-4`}>
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <FiX className="h-5 w-5 text-red-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              Error loading payments: {error}
            </p>
            <div className="mt-4">
              <button
                onClick={fetchPayments}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none"
              >
                <FiRefreshCw className="mr-2" />
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <h1 className={`text-2xl font-bold flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              <FiDollarSign className="mr-2" /> Payment Manager
            </h1>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full bg-opacity-20 hover:bg-opacity-30 transition-all"
              style={{ backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
            >
              {darkMode ? '🌞' : '🌙'}
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative rounded-md shadow-sm flex-1 max-w-xs">
              <input
                type="text"
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`block w-full px-4 py-2 rounded-md transition-all ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700 text-white focus:ring-blue-500 focus:border-blue-500' 
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <FiX className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </button>
              )}
            </div>
            <button 
              onClick={fetchPayments} 
              className={`inline-flex items-center px-4 py-2 rounded-md shadow-sm transition-all ${
                darkMode
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              } ${refreshing ? 'opacity-75 cursor-not-allowed' : ''}`}
              disabled={refreshing}
            >
              <FiRefreshCw className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} /> 
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            <button
              onClick={exportToCSV}
              className={`inline-flex items-center px-4 py-2 rounded-md shadow-sm transition-all ${
                darkMode
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              <FiDownloadCloud className="mr-2" /> Export
            </button>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {['all', 'pending', 'completed', 'rejected'].map((status) => (
            <motion.div 
              key={status}
              whileHover={{ scale: 1.02 }}
              className={`p-6 rounded-xl cursor-pointer transition-all ${
                darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
              } shadow-lg ${activeTab === status ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => setActiveTab(status)}
            >
              <h3 className={`text-lg font-medium ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </h3>
              <p className={`mt-2 text-3xl font-semibold ${
                status === 'pending' ? 'text-yellow-600' :
                status === 'completed' ? 'text-green-600' :
                status === 'rejected' ? 'text-red-600' :
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {statusCounts[status]}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-xl shadow-lg overflow-hidden ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <tr>
                  {[
                    { key: 'name', label: 'Name' },
                    { key: 'country', label: 'Country' },
                    { key: 'number', label: 'Phone' },
                    { key: 'amount', label: 'Amount' },
                    { key: 'senderNumber', label: 'Sender' },
                    { key: 'paymentMethod', label: 'Method' },
                    { key: 'email', label: 'Email' },
                    { key: 'status', label: 'Status' },
                    { label: 'Actions' }
                  ].map((header) => (
                    <th 
                      key={header.key || header.label}
                      scope="col" 
                      className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      } cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors`}
                      onClick={() => header.key && handleSort(header.key)}
                    >
                      <div className="flex items-center">
                        {header.label}
                        {header.key && (
                          <span className="ml-2">
                            {sortConfig.key === header.key && (
                              sortConfig.direction === 'asc' ? <FiChevronUp /> : <FiChevronDown />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className={`divide-y divide-gray-200 dark:divide-gray-700 ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}>
                <AnimatePresence>
                  {currentItems.length > 0 ? (
                    currentItems.map((payment) => (
                      <motion.tr
                        key={payment._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} cursor-pointer transition-colors`}
                        onClick={() => setSelectedPayment(payment)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center font-medium ${
                              darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-600'
                            }`}>
                              {payment?.name?.charAt(0) || '?'}
                            </div>
                            <div className="ml-4">
                              <div className={`text-sm font-medium ${
                                darkMode ? 'text-white' : 'text-gray-900'
                              }`}>
                                {payment?.name || 'N/A'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                            {payment?.country || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                            {payment?.number || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-medium ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            ${payment?.amount || '0.00'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                            {payment?.senderNumber || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                            {payment?.paymentMethod || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                            {payment?.email || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(payment?.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {(payment?.status === 'pending') && (
                            <div className="flex space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updatePaymentStatus(payment._id, 'completed');
                                }}
                                className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium transition-all bg-green-600 hover:bg-green-700 text-white"
                              >
                                <FiCheck className="mr-1" /> Approve
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updatePaymentStatus(payment._id, 'rejected');
                                }}
                                className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium transition-all bg-red-600 hover:bg-red-700 text-white"
                              >
                                <FiX className="mr-1" /> Reject
                              </button>
                            </div>
                          )}
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center"
                    >
                      <td colSpan="9" className="px-6 py-4">
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          No payments found matching your criteria
                        </div>
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredPayments.length > 0 && (
            <div className={`px-6 py-3 border-t ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className={`text-sm ${
                  darkMode ? 'text-gray-400' : 'text-gray-700'
                }`}>
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredPayments.length)} of {filteredPayments.length} results
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === 1 
                        ? 'cursor-not-allowed opacity-50' 
                        : darkMode 
                          ? 'text-gray-300 hover:bg-gray-700' 
                          : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Previous
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === pageNum 
                            ? 'bg-blue-600 text-white' 
                            : darkMode 
                              ? 'text-gray-300 hover:bg-gray-700' 
                              : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === totalPages 
                        ? 'cursor-not-allowed opacity-50' 
                        : darkMode 
                          ? 'text-gray-300 hover:bg-gray-700' 
                          : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Payment Details Modal */}
        <AnimatePresence>
          {selectedPayment && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedPayment(null)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className={`rounded-xl p-6 w-full max-w-2xl ${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                } shadow-2xl`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className={`text-xl font-bold ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Payment Details
                  </h2>
                  <button
                    onClick={() => setSelectedPayment(null)}
                    className={`p-1 rounded-full ${
                      darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className={`p-4 rounded-lg ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <h3 className={`text-sm font-medium mb-3 ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Customer Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <FiUser className={`mr-2 ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                        <span className={`${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {selectedPayment.name || 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <FiPhone className={`mr-2 ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                        <span className={`${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {selectedPayment.number || 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <FiMail className={`mr-2 ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                        <span className={`${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {selectedPayment.email || 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <FiGlobe className={`mr-2 ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                        <span className={`${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {selectedPayment.country || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <h3 className={`text-sm font-medium mb-3 ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Transaction Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className={`${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>Amount:</span>
                        <span className={`font-medium ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          ${selectedPayment.amount || '0.00'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>Payment Method:</span>
                        <span className={`font-medium ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {selectedPayment.paymentMethod || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>Sender Number:</span>
                        <span className={`font-medium ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {selectedPayment.senderNumber || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>Status:</span>
                        <span>
                          {getStatusBadge(selectedPayment.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedPayment.status === 'pending' && (
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => {
                        updatePaymentStatus(selectedPayment._id, 'rejected');
                        setSelectedPayment(null);
                      }}
                      className="inline-flex items-center px-4 py-2 rounded-md shadow-sm text-sm font-medium bg-red-600 hover:bg-red-700 text-white transition-colors"
                    >
                      <FiX className="mr-2" /> Reject Payment
                    </button>
                    <button
                      onClick={() => {
                        updatePaymentStatus(selectedPayment._id, 'completed');
                        setSelectedPayment(null);
                      }}
                      className="inline-flex items-center px-4 py-2 rounded-md shadow-sm text-sm font-medium bg-green-600 hover:bg-green-700 text-white transition-colors"
                    >
                      <FiCheck className="mr-2" /> Approve Payment
                    </button>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Payment;