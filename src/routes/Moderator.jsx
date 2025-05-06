import { Navigate } from "react-router-dom";
import useAdmin from "../hooks/useAdmin";
import useAuth from "../hooks/useAuth";

function ModeratorRoute({ children }) {
  const { user, loading: authLoading } = useAuth();
  const { isModerator, isLoading: adminLoading, error } = useAdmin();



  // Handle error state
  if (error) {
    return (
      <div className="text-center mt-52 text-red-500">
        <p>Something went wrong. Please try again later.</p>
      </div>
    );
  }

  // Allow access if user is authenticated and an admin
  if (user && isModerator) {
    return children;
  }

  // Redirect unauthorized users
  return <Navigate to="/" />;
}

export default ModeratorRoute;
