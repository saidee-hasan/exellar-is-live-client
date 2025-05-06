import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from './useAxiosSecure';
import useAuth from './useAuth';
import { data } from 'react-router-dom';

function useAdmin() {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const { data: roleData, isLoading, error, refetch } = useQuery(
    {
      queryKey: [user?.email, 'userRole'],
      queryFn: async () => {
        if (!user?.email) {
          return null; // Prevent request if no email is available
        }
        const res = await axiosSecure.get(`/users/admin/${user?.email}`);
        return res.data; // Returning the full roles object
      },
      enabled: !!user?.email,
    }
  );

  const isAdmin = roleData?.admin || false;
  const isModerator = roleData?.moderator || false;
  const isGuest = roleData?.guest || false;
 

  return {
    isAdmin,
    isModerator,
    isGuest,
    isLoading,
    error,
    roleData,
    refetch,
  };
}

export default useAdmin;
