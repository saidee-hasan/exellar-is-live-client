import { Navigate } from "react-router-dom";
import useAdmin from "../hooks/useAdmin";
import useAuth from "../hooks/useAuth";

function AdminRoute({ children }) {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, isLoading: adminLoading, error } = useAdmin();

  // Combine loading states
  if (authLoading || adminLoading) {
    return (
      <div className="text-center mt-52">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="text-center mt-52 text-red-500">
        <p>Something went wrong. Please try again later.</p>
      </div>
    );
  }

  // Allow access if user is authenticated and an admin
  if (user && isAdmin) {
    return children;
  }

  // Redirect unauthorized users
  return <Navigate to="/" />;
}

export default AdminRoute;
