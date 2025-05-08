import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OtpInput from 'react-otp-input';
import { Bounce, toast, ToastContainer } from "react-toastify";
import { AuthContext } from "../provider/AuthProvider";
import useAuth from "../hooks/useAuth";

export default function Login() {
  const [email, setEmail] = useState("mdsaideehasan6@gmail.com");
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const {user}=useAuth()
  useEffect(() => {
    if (user) {
      navigate('/admin');
    }
  }, [user, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (showOtp) {
        handleToast("OTP verified successfully");
        navigate("/admin");
      } else {
        await loginUser(email, otp);
        handleToast("Login successful");
        navigate("/");
      }
    } catch (err) {
      handleToast(err.message || "Authentication failed");
    }
  };

  const handleToast = (message) => {
    toast(message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Bounce,
      style: {
        borderRadius: '12px',
        fontFamily: 'Inter, sans-serif',
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute w-96 h-96 bg-indigo-500/10 rounded-full -top-48 -right-48"></div>
      <div className="absolute w-96 h-96 bg-sky-500/10 rounded-full -bottom-48 -left-48"></div>

      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl p-8 transition-all duration-300 hover:shadow-3xl relative border border-white/10">
        <ToastContainer />

        {/* Glowing border effect */}
        <div className="absolute inset-0 rounded-2xl border-t border-white/20 pointer-events-none"></div>
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-300 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-300 text-sm">Secure access to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="group">
            <div className="flex flex-col gap-1 mb-6">
              <label className="text-sm font-medium text-gray-300 ml-1">Verification Code</label>
              <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                renderInput={(props) => (
                  <input
                    {...props}
                    className="otp-input !w-12 !h-12 mx-1 text-center rounded-xl border-2 border-white/10 bg-white/5 text-white text-lg font-semibold focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition-all outline-none shadow-lg hover:border-white/20"
                  />
                )}
                containerStyle="justify-center"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white py-4 rounded-xl hover:opacity-90 transition-all font-semibold shadow-lg hover:shadow-xl active:scale-[0.98] transform-gpu"
            >
              Verify Identity
              <span className="ml-2 opacity-80">→</span>
            </button>
          </div>

          <div className="relative mt-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-transparent text-gray-400">Secure authentication</span>
            </div>
          </div>

       
        </form>

        <p className="text-center mt-8 text-gray-400 text-sm">
          Need help? {' '}
          <Link to="/" className="text-sky-400 hover:text-sky-300 font-medium transition-colors">
            Contact support
          </Link>
        </p>
      </div>
    </div>
  );
}