// import React, { useState } from 'react';
// import useAxiosSecure from '../../hooks/useAxiosSecure';
// import Swal from 'sweetalert2';
// import { useQuery } from '@tanstack/react-query';

// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   FiSearch, 
//   FiTrash2, 
//   FiEdit, 
//   FiUser, 
//   FiUserCheck, 
//   FiUserX, 
//   FiUsers, 
//   FiShield,
//   FiTrendingUp,
//   FiBarChart2,
//   FiActivity,
//   FiChevronDown,
//   FiChevronUp,
//   FiFilter,
//   FiRefreshCw
// } from 'react-icons/fi';
// import useAuth from '../../hooks/useAuth';



// const Users = () => {
//   const axiosSecure = useAxiosSecure();
//   const { user: currentUser } = useAuth();
//   console.log(currentUser);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [roleFilter, setRoleFilter] = useState('All');
//   const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
//   const [expandedUser, setExpandedUser] = useState(null);
//   const [showFilters, setShowFilters] = useState(false);

//   // Fetch users using React Query
//   const { data: users = [], isLoading, isError, refetch } = useQuery({
//     queryKey: ['users'],
//     queryFn: async () => {
//       const res = await axiosSecure.get('/users');
//       return res.data;
//     },
//     refetchOnWindowFocus: false,
//   });


//   // Calculate user statistics
//   const userStats = {
//     total: users.length,
//     admins: users.filter(u => u.role === 'Admin').length,
//     moderators: users.filter(u => u.role === 'Moderator').length,
//     guests: users.filter(u => u.role === 'Guest').length,
//     growth: 12.5, 
//     active: Math.floor(users.length * 0.75),
//     newThisMonth: Math.floor(users.length * 0.15)
//   };

//   // Handle role change
//   const handleRoleChange = async (user, newRole) => {
//     if (user._id === currentUser._id && newRole !== 'Admin') {
//       Swal.fire({
//         icon: 'warning',
//         title: 'Cannot Demote Yourself',
//         text: 'You cannot remove your own admin privileges.',
//         background: '#1e1e2d',
//         color: '#fff',
//         confirmButtonColor: '#6366f1'
//       });
//       return;
//     }

//     try {
//       const res = await axiosSecure.patch(`/users/admin/${user._id}`, { role: newRole });
//       if (res.data.modifiedCount > 0) {
//         await Swal.fire({
//           position: 'top-end',
//           icon: 'success',
//           title: `${user.name}'s role updated to ${newRole}`,
//           showConfirmButton: false,
//           timer: 1500,
//           background: '#1e1e2d',
//           color: '#fff',
//         });
//         refetch();
//       }
//     } catch (error) {
//       Swal.fire({
//         title: 'Error',
//         text: error.response?.data?.message || 'Failed to update role',
//         icon: 'error',
//         background: '#1e1e2d',
//         color: '#fff',
//         confirmButtonColor: '#6366f1'
//       });
//     }
//   };

//   // Handle delete action
//   const handleDelete = (userId, userName) => {
//     if (userId === currentUser._id) {
//       Swal.fire({
//         icon: 'error',
//         title: 'Cannot Delete Yourself',
//         text: 'You cannot delete your own account from here.',
//         background: '#1e1e2d',
//         color: '#fff',
//         confirmButtonColor: '#6366f1'
//       });
//       return;
//     }

//     Swal.fire({
//       title: `Delete ${userName}?`,
//       text: 'This will permanently remove the user account.',
//       icon: 'question',
//       showCancelButton: true,
//       confirmButtonColor: '#ef4444',
//       cancelButtonColor: '#6b7280',
//       confirmButtonText: 'Delete',
//       cancelButtonText: 'Cancel',
//       background: '#1e1e2d',
//       color: '#fff',
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         try {
//           const res = await axiosSecure.delete(`/users/${userId}`);
//           if (res.data.deletedCount > 0) {
//             await Swal.fire({
//               title: 'Deleted!',
//               text: 'User account has been removed.',
//               icon: 'success',
//               background: '#1e1e2d',
//               color: '#fff',
//               confirmButtonColor: '#6366f1'
//             });
//             refetch();
//           }
//         } catch (error) {
//           Swal.fire({
//             title: 'Error',
//             text: error.response?.data?.message || 'Failed to delete user',
//             icon: 'error',
//             background: '#1e1e2d',
//             color: '#fff',
//             confirmButtonColor: '#6366f1'
//           });
//         }
//       }
//     });
//   };

//   // Request sort
//   const requestSort = (key) => {
//     let direction = 'asc';
//     if (sortConfig.key === key && sortConfig.direction === 'asc') {
//       direction = 'desc';
//     }
//     setSortConfig({ key, direction });
//   };

//   // Sort users
//   const sortedUsers = [...users].sort((a, b) => {
//     if (a[sortConfig.key] < b[sortConfig.key]) {
//       return sortConfig.direction === 'asc' ? -1 : 1;
//     }
//     if (a[sortConfig.key] > b[sortConfig.key]) {
//       return sortConfig.direction === 'asc' ? 1 : -1;
//     }
//     return 0;
//   });

//   // Filter users
//   const filteredUsers = sortedUsers.filter(
//     (user) =>
//       (roleFilter === 'All' || (user.role || 'User') === roleFilter) &&
//       ((user.name ? user.name.toLowerCase() : '').includes(searchQuery.toLowerCase()) ||
//         (user.email ? user.email.toLowerCase() : '').includes(searchQuery.toLowerCase()))
//   );

//   // Loading state
//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gray-50">
//         <div className="flex flex-col items-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
//           <p className="mt-4 text-gray-600">Loading user data...</p>
//         </div>
//       </div>
//     );
//   }

//   // Error state
//   if (isError) {
//     return (
//       <motion.div 
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         className="text-center py-12 bg-gray-50 min-h-screen flex items-center justify-center"
//       >
//         <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg border-l-4 border-red-500">
//           <p className="font-bold text-lg text-gray-800">Error Loading Data</p>
//           <p className="text-gray-600 mt-2">Failed to fetch users. Please try again.</p>
//           <button
//             className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition-colors flex items-center mx-auto"
//             onClick={refetch}
//           >
//             <FiRefreshCw className="mr-2" />
//             Retry
//           </button>
//         </div>
//       </motion.div>
//     );
//   }

//   // Role badge component
//   const RoleBadge = ({ role }) => {
//     const roleConfig = {
//       Admin: { bg: 'bg-red-500/10', text: 'text-red-600', icon: <FiShield className="mr-1.5" /> },
//       Moderator: { bg: 'bg-blue-500/10', text: 'text-blue-600', icon: <FiUserCheck className="mr-1.5" /> },
//       User: { bg: 'bg-green-500/10', text: 'text-green-600', icon: <FiUser className="mr-1.5" /> },
//       Guest: { bg: 'bg-gray-500/10', text: 'text-gray-600', icon: <FiUserX className="mr-1.5" /> },
//     };

//     const config = roleConfig[role] || roleConfig.User;

//     return (
//       <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
//         {config.icon}
//         {role}
//       </span>
//     );
//   };

//   // Premium Stat Card Component
//   const StatCard = ({ title, value, icon, trend, description, color }) => {
//     return (
//       <motion.div 
//         whileHover={{ y: -3 }}
//         className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md`}
//       >
//         <div className="p-5">
//           <div className="flex justify-between items-start">
//             <div>
//               <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{title}</p>
//               <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
//             </div>
//             <div className={`p-2 rounded-lg ${color} text-white`}>
//               {icon}
//             </div>
//           </div>
//           {trend && (
//             <div className="mt-3 flex items-center">
//               <span className={`inline-flex items-center text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
//                 {trend > 0 ? (
//                   <FiTrendingUp className="mr-1" />
//                 ) : (
//                   <FiTrendingUp className="mr-1 transform rotate-180" />
//                 )}
//                 {Math.abs(trend)}%
//               </span>
//               <span className="text-gray-500 text-xs ml-2">{description}</span>
//             </div>
//           )}
//         </div>
//       </motion.div>
//     );
//   };

//   return (
//     <motion.div 
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.3 }}
//       className="min-h-screen bg-gray-50"
//     >
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         <div className="mb-8">
//           <motion.h1 
//             initial={{ y: -20 }}
//             animate={{ y: 0 }}
//             className="text-3xl font-bold text-gray-900"
//           >
//             User Management
//           </motion.h1>
//           <p className="mt-2 text-gray-600">
//             Manage all platform users, roles, and permissions
//           </p>
//         </div>

//         {/* Stats Overview */}
//         <motion.div 
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.1 }}
//           className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8"
//         >
//           <StatCard
//             title="Total Users"
//             value={userStats.total}
//             icon={<FiUsers className="w-5 h-5" />}
//             trend={userStats.growth}
//             description="vs last month"
//             color="bg-indigo-100 text-indigo-600"
//           />
//           <StatCard
//             title="Active Users"
//             value={userStats.active}
//             icon={<FiActivity className="w-5 h-5" />}
//             description="Currently active"
//             color="bg-green-100 text-green-600"
//           />
//           <StatCard
//             title="New Users"
//             value={userStats.newThisMonth}
//             icon={<FiUser className="w-5 h-5" />}
//             color="bg-purple-100 text-purple-600"
//           />
//           <StatCard
//             title="Administrators"
//             value={userStats.admins}
//             icon={<FiShield className="w-5 h-5" />}
//             color="bg-red-100 text-red-600"
//           />
//         </motion.div>

//         {/* Controls */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//           className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6"
//         >
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//             <div className="relative flex-grow max-w-2xl">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FiSearch className="text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search users by name or email..."
//                 className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>

//             <div className="flex items-center space-x-3">
//               <button 
//                 onClick={() => setShowFilters(!showFilters)}
//                 className="flex items-center space-x-1 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors"
//               >
//                 <FiFilter className="text-gray-500" />
//                 <span>Filters</span>
//               </button>

//               <div className="relative">
//                 <select
//                   className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
//                   value={roleFilter}
//                   onChange={(e) => setRoleFilter(e.target.value)}
//                 >
//                   <option value="All">All Roles</option>
//                   <option value="Admin">Admin</option>
//                   <option value="Moderator">Moderator</option>
//                   <option value="User">User</option>
//                   <option value="Guest">Guest</option>
//                 </select>
//                 <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
//                   <FiChevronDown />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Additional Filters - Animated */}
//           <AnimatePresence>
//             {showFilters && (
//               <motion.div
//                 initial={{ opacity: 0, height: 0 }}
//                 animate={{ opacity: 1, height: 'auto' }}
//                 exit={{ opacity: 0, height: 0 }}
//                 transition={{ duration: 0.2 }}
//                 className="mt-4 pt-4 border-t border-gray-200"
//               >
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//                     <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500">
//                       <option>All Statuses</option>
//                       <option>Active</option>
//                       <option>Inactive</option>
//                       <option>Suspended</option>
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Joined Date</label>
//                     <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500">
//                       <option>All Time</option>
//                       <option>Last 7 Days</option>
//                       <option>Last 30 Days</option>
//                       <option>Last Year</option>
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Activity</label>
//                     <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500">
//                       <option>Any Activity</option>
//                       <option>Recently Active</option>
//                       <option>Inactive</option>
//                     </select>
//                   </div>
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </motion.div>

//         {/* Results Count */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.3 }}
//           className="flex justify-between items-center mb-4"
//         >
//           <p className="text-sm text-gray-600">
//             Showing <span className="font-medium">{filteredUsers.length}</span> of <span className="font-medium">{users.length}</span> users
//           </p>
//           <button 
//             onClick={refetch}
//             className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
//           >
//             <FiRefreshCw className="mr-1" /> Refresh
//           </button>
//         </motion.div>

//         {/* Table */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.4 }}
//           className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden"
//         >
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th 
//                     scope="col" 
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
//                     onClick={() => requestSort('name')}
//                   >
//                     <div className="flex items-center">
//                       User
//                       {sortConfig.key === 'name' && (
//                         <span className="ml-1">
//                           {sortConfig.direction === 'asc' ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
//                         </span>
//                       )}
//                     </div>
//                   </th>
//                   <th 
//                     scope="col" 
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
//                     onClick={() => requestSort('email')}
//                   >
//                     <div className="flex items-center">
//                       Email
//                       {sortConfig.key === 'email' && (
//                         <span className="ml-1">
//                           {sortConfig.direction === 'asc' ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
//                         </span>
//                       )}
//                     </div>
//                   </th>
//                   <th 
//                     scope="col" 
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
//                     onClick={() => requestSort('role')}
//                   >
//                     <div className="flex items-center">
//                       Role
//                       {sortConfig.key === 'role' && (
//                         <span className="ml-1">
//                           {sortConfig.direction === 'asc' ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
//                         </span>
//                       )}
//                     </div>
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredUsers.length === 0 ? (
//                   <tr>
//                     <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
//                       <div className="flex flex-col items-center justify-center">
//                         <FiUserX className="w-12 h-12 text-gray-400 mb-3" />
//                         <p className="text-lg font-medium">No users found</p>
//                         <p className="text-sm">Try adjusting your search or filters</p>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : (
//                   filteredUsers.map((user) => (
//                     <React.Fragment key={user._id}>
//                       <motion.tr 
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         className={`hover:bg-gray-50 transition-colors ${expandedUser === user._id ? 'bg-gray-50' : ''}`}
//                       >
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex items-center">
//                             <div className="flex-shrink-0 h-10 w-10">
                           
//                             </div>
//                             <div className="ml-4">
//                               <div className="text-sm font-medium text-gray-900">{user.name}</div>
//                               <div className="text-xs text-gray-500">Joined: {new Date(user.createdAt).toLocaleDateString()}</div>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm text-gray-900">{user.email}</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex items-center space-x-2">
//                             <RoleBadge role={user.role || 'User'} />
//                             <select
//                               className="border border-gray-300 rounded-md py-1 px-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
//                               value={user.role || 'User'}
//                               onChange={(e) => handleRoleChange(user, e.target.value)}
                             
//                             >
//                               <option value="Admin">Admin</option>
//                               <option value="Moderator">Moderator</option>
//                               <option value="User">User</option>
//                               <option value="Guest">Guest</option>
//                             </select>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                           <div className="flex space-x-3">
//                             <button
//                               className="text-indigo-600 hover:text-indigo-900 transition-colors p-1 rounded hover:bg-indigo-50"
//                               onClick={() => {
//                                 Swal.fire({
//                                   title: 'Edit User',
//                                   html: `Edit functionality for ${user.name} would go here`,
//                                   icon: 'info',
//                                   background: '#1e1e2d',
//                                   color: '#fff',
//                                   confirmButtonColor: '#6366f1'
//                                 });
//                               }}
//                             >
//                               <FiEdit className="w-5 h-5" />
//                             </button>
//                             <button
//                               className="text-red-600 hover:text-red-900 transition-colors p-1 rounded hover:bg-red-50"
//                               onClick={() => handleDelete(user._id, user.name)}
                            
//                             >
//                               <FiTrash2 className="w-5 h-5" />
//                             </button>
//                             <button
//                               className="text-gray-600 hover:text-gray-900 transition-colors p-1 rounded hover:bg-gray-50"
//                               onClick={() => setExpandedUser(expandedUser === user._id ? null : user._id)}
//                             >
//                               {expandedUser === user._id ? (
//                                 <FiChevronUp className="w-5 h-5" />
//                               ) : (
//                                 <FiChevronDown className="w-5 h-5" />
//                               )}
//                             </button>
//                           </div>
//                         </td>
//                       </motion.tr>

//                       {/* Expanded Row */}
//                       <AnimatePresence>
//                         {expandedUser === user._id && (
//                           <motion.tr
//                             initial={{ opacity: 0, height: 0 }}
//                             animate={{ opacity: 1, height: 'auto' }}
//                             exit={{ opacity: 0, height: 0 }}
//                             transition={{ duration: 0.2 }}
//                             className="bg-gray-50"
//                           >
//                             <td colSpan="4" className="px-6 py-4">
//                               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                                 <div>
//                                   <h3 className="text-sm font-medium text-gray-500 mb-2">Contact Information</h3>
//                                   <div className="space-y-1">
//                                     <p className="text-sm text-gray-900">{user.email}</p>
//                                     {user.phone && (
//                                       <p className="text-sm text-gray-900">{user.phone}</p>
//                                     )}
//                                     <p className="text-xs text-gray-500">Member since: {new Date(user.createdAt).toLocaleDateString()}</p>
//                                   </div>
//                                 </div>
//                                 <div>
//                                   <h3 className="text-sm font-medium text-gray-500 mb-2">User Activity</h3>
//                                   <div className="space-y-1">
//                                     <p className="text-sm text-gray-900">Last active: {new Date().toLocaleDateString()}</p>
//                                     <p className="text-sm text-gray-900">Login count: 42</p>
//                                   </div>
//                                 </div>
//                                 <div>
//                                   <h3 className="text-sm font-medium text-gray-500 mb-2">Quick Actions</h3>
//                                   <div className="flex space-x-2">
//                                     <button className="text-xs px-3 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors">
//                                       Send Message
//                                     </button>
//                                     <button className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors">
//                                       Reset Password
//                                     </button>
//                                   </div>
//                                 </div>
//                               </div>
//                             </td>
//                           </motion.tr>
//                         )}
//                       </AnimatePresence>
//                     </React.Fragment>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </motion.div>
//       </div>
//     </motion.div>
//   );
// };

// export default Users;