import React, { useState } from 'react';

function Order() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  const fetchOrderData = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://exellar.vercel.app/payment');
      const data = await response.json();
      setOrders(Array.isArray(data) ? data : []);
      setFetched(true);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filteredOrders = Array.isArray(orders)
    ? orders.filter((order) => order?.orderId?.includes(search))
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 p-6 animate-gradient-x">
      <div className="max-w-6xl mx-auto">
        {/* Floating Card with Glass Effect */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/10 transform transition-all duration-500 hover:shadow-indigo-500/20">
          {/* Header with Animated Gradient */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 animate-gradient-xy"></div>
            <div className="relative p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold text-white tracking-tight">Order Tracking</h1>
                  <p className="text-indigo-100/80 mt-2">Manage and track all customer orders</p>
                </div>
                <div className="bg-white/10 p-3 rounded-full backdrop-blur-sm border border-white/20">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Action Area */}
          <div className="p-8 pt-6">
            <div className="flex flex-col md:flex-row gap-6 items-end">
              <div className="flex-grow w-full">
                <label className="block text-sm font-medium text-indigo-100 mb-2">Search Order ID</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. ORD-12345..."
                    value={search}
                    onChange={handleSearch}
                    className="block w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30 text-white placeholder-indigo-200/70 transition-all duration-300 outline-none"
                  />
                </div>
              </div>
              <button
                onClick={fetchOrderData}
                disabled={loading}
                className={`px-8 py-3.5 rounded-xl font-medium transition-all duration-300 flex items-center justify-center ${
                  loading
                    ? 'bg-indigo-400/80 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-lg hover:shadow-indigo-500/40'
                } text-white relative overflow-hidden group w-full md:w-auto`}
              >
                <span className="absolute inset-0 bg-white/10 group-hover:bg-white/5 transition-all duration-500 transform group-hover:scale-150 opacity-0 group-hover:opacity-100"></span>
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                    Fetch Orders
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Area */}
          <div className="px-8 pb-8">
            {search && filteredOrders.length > 0 ? (
              <div className="overflow-hidden rounded-2xl border border-white/10 shadow-lg">
                <table className="min-w-full divide-y divide-white/10">
                  <thead className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20">
                    <tr>
                      <th className="px-8 py-5 text-left text-sm font-semibold text-white uppercase tracking-wider">Order ID</th>
                      <th className="px-8 py-5 text-left text-sm font-semibold text-white uppercase tracking-wider">Customer</th>
                      <th className="px-8 py-5 text-left text-sm font-semibold text-white uppercase tracking-wider">Amount</th>
                      <th className="px-8 py-5 text-left text-sm font-semibold text-white uppercase tracking-wider">Payment</th>
                      <th className="px-8 py-5 text-left text-sm font-semibold text-white uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 bg-white/5 backdrop-blur-sm">
                    {filteredOrders.map((order, index) => (
                      <tr 
                        key={order._id} 
                        className="hover:bg-white/10 transition-colors duration-200"
                        style={{ animation: `fadeIn 0.3s ease-out ${index * 0.05}s both` }}
                      >
                        <td className="px-8 py-5 whitespace-nowrap">
                          <div className="text-sm font-medium text-white flex items-center">
                            <svg className="w-4 h-4 mr-2 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                            </svg>
                            {order.orderId}
                          </div>
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap">
                          <div className="text-sm text-indigo-100">{order.name}</div>
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap">
                          <div className="text-sm font-medium text-green-400 flex items-center">
                            <svg className="w-4 h-4 mr-1 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            ${order.amount}
                          </div>
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap">
                          <div className="text-sm text-indigo-100 capitalize flex items-center">
                            {order.paymentMethod === 'credit card' ? (
                              <svg className="w-4 h-4 mr-2 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                              </svg>
                            ) : (
                              <svg className="w-4 h-4 mr-2 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                              </svg>
                            )}
                            {order.paymentMethod}
                          </div>
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${
                            order.status === 'completed' 
                              ? 'bg-green-500/20 text-green-100'
                              : order.status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-100 animate-pulse'
                              : 'bg-red-500/20 text-red-100'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : search ? (
              <div className="mt-8 p-8 bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/30 rounded-2xl text-center backdrop-blur-sm">
                <svg className="mx-auto h-16 w-16 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h3 className="mt-4 text-2xl font-semibold text-red-100">No Orders Found</h3>
                <p className="mt-2 text-red-200/80 max-w-md mx-auto">
                  We couldn't find any orders matching "{search}". Please check the Order ID and try again.
                </p>
                <button 
                  onClick={() => setSearch('')}
                  className="mt-6 px-6 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all duration-300"
                >
                  Clear Search
                </button>
              </div>
            ) : fetched ? (
              <div className="mt-8 p-12 text-center bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl border-2 border-dashed border-white/20">
                <svg className="mx-auto h-20 w-20 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <h3 className="mt-6 text-2xl font-semibold text-indigo-100">Ready to Search</h3>
                <p className="mt-3 text-indigo-200/80 max-w-md mx-auto">
                  {orders.length > 0 
                    ? `We've loaded ${orders.length} orders. Enter an Order ID to search.`
                    : "Orders fetched but none available. Please try again later."}
                </p>
              </div>
            ) : (
              <div className="mt-8 p-12 text-center bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl border-2 border-dashed border-white/20">
                <svg className="mx-auto h-20 w-20 text-indigo-300 animate-float" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
                <h3 className="mt-6 text-2xl font-semibold text-indigo-100">Welcome to Order Tracking</h3>
                <p className="mt-3 text-indigo-200/80 max-w-md mx-auto">
                  Click "Fetch Orders" to load your order data, then search by Order ID to track specific orders.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes animate-gradient-xy {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes animate-gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default Order;