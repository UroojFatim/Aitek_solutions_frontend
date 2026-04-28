import { Button, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ROUTE_PATHS } from "@/constants/routes.constants";

export function NotFound() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleGoHome = () => {
    if (isAuthenticated && user) {
      const role = user.role?.toLowerCase();
      if (role === 'admin' || role === 'superadmin') {
        navigate(ROUTE_PATHS.ADMIN.DASHBOARD);
      } else {
        navigate(ROUTE_PATHS.DASHBOARD.HOME);
      }
    } else {
      navigate(ROUTE_PATHS.AUTH.SIGN_IN);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-8">
          <img
            src="/img/aitek_logo_light.png"
            alt="Aitek Solutions Logo"
            className="h-24 mx-auto mb-6"
          />
        </div>
        
        <Typography variant="h1" className="text-6xl font-bold text-gray-900 mb-4">
          404
        </Typography>
        
        <Typography variant="h3" className="text-2xl font-semibold text-gray-700 mb-4">
          Page Not Found
        </Typography>
        
        <Typography variant="paragraph" className="text-gray-600 mb-8">
          Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or you might have entered an incorrect URL.
        </Typography>
        
        <div className="space-y-4">
          <Button
            onClick={handleGoHome}
            className="bg-blue-600 hover:bg-blue-700"
            fullWidth
          >
            Go to Dashboard
          </Button>
          
          <Button
            variant="outlined"
            onClick={() => window.history.back()}
            className="border-gray-300 text-gray-700"
            fullWidth
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
