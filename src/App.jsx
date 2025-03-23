import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import authService from "./appwrite/auth";
import { login, logout } from "./store/authSlice";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

function App() {
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Try to get current user
        const userData = await authService.getCurrentUser();
        if (userData) {
          console.log("User authenticated:", userData.$id);
          dispatch(login({ userData }));
        } else {
          console.log("No authenticated user");
          dispatch(logout());
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setAuthError(error.message || "Authentication failed");
        dispatch(logout()); // Ensure user is logged out on error
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <span className="block mt-4 text-lg font-semibold text-gray-600">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-200">
      <Header />
      <main className="flex-grow container mx-auto p-4">
        {authError && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {authError}
                  <a
                    href="/appwrite-guide"
                    className="font-medium underline ml-2"
                  >
                    View Configuration Guide
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main content area uses Outlet for React Router */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;
