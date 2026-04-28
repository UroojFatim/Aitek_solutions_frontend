import {
  Card,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/redux/actions/auth.action";
import { ROUTE_PATHS } from "@/constants/routes.constants";
const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get auth state from redux
  const { isAuthenticated, user, redirectTo, loading } = useSelector((state) => state.auth);

  // Check if user is already authenticated and redirect based on role
  useEffect(() => {
    if (isAuthenticated) {
      // If redirectTo exists, use it
      if (redirectTo) {
        navigate(redirectTo);
      } 
      // Otherwise redirect based on user role
      else if (user) {
        const role = user.role?.toLowerCase();
        if (role === 'admin' || role === 'superadmin') {
          navigate(`${ROUTE_PATHS.ADMIN.DASHBOARD}`);
        } else {
          navigate(`${ROUTE_PATHS.DASHBOARD.HOME}`);
        }
      }
    }
  }, [isAuthenticated, redirectTo, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(login({email, password}));
  };
  
  // If user is already authenticated, don't render the sign-in form
  if (isAuthenticated) {
    return null;
  }

  return (
    <section className="min-h-screen px-4 py-10 flex items-center justify-center bg-gradient-to-br from-white via-orange-50 to-gray-100 dark:from-black dark:via-gray-950 dark:to-gray-900">
      <div className="w-full max-w-5xl grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="order-2 lg:order-1">
          <div className="mx-auto max-w-md rounded-3xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-black/60 backdrop-blur-xl shadow-xl px-6 py-8 sm:px-8">
            <div className="text-center mb-8">
              <img
                src="/img/aitek_logo_dark.png"
                alt="Aitek Solutions"
                className="mx-auto h-24 w-auto object-contain"
              />
              <Typography variant="h2" className="font-bold mt-6 mb-3 text-primary">
                Sign in to ATS Portal
              </Typography>
              <Typography
                variant="paragraph"
                color="blue-gray"
                className="text-base sm:text-lg font-normal text-gray-600 dark:text-gray-300"
              >
                Use your Aitek Solutions credentials to access ATS.
              </Typography>
            </div>

            <form onSubmit={handleSubmit} className="mb-2 w-full">
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Your email
            </Typography>
            <Input
              size="lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@mail.com"
              required
            />

            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Password
            </Typography>
            <Input
              type="password"
              size="lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
            />
          </div>

              <Link to={ROUTE_PATHS.AUTH.RESET_PASSWORD} className="text-sm text-blue-600 hover:underline block mt-2 mb-2 text-right">
                Forgot Password?
              </Link>

              <Button type="submit" className="mt-2 bg-primary hover:opacity-95" fullWidth disabled={loading}>
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </div>
        </div>

        <div className="order-1 lg:order-2 flex items-center justify-center">
          <img
            src="/img/aitek_logo_light.png"
            alt="Aitek Solutions Logo"
            className="w-full max-w-sm object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.35)]"
          />
        </div>
      </div>
    </section>
  );
}

export default SignIn;
