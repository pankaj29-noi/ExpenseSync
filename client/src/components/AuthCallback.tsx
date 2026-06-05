

// // This is not used - kyu ki we directly use the supabase - login With google




// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { supabase } from "../lib/supabase";
// import { useAuth } from "../context/AuthContext";

// const AuthCallback = () => {
//   const navigate = useNavigate();
//   const { setUser } = useAuth();
//   const [status, setStatus] = useState("Completing authentication...");

//   useEffect(() => {
//     const handleCallback = async () => {
//       try {
//         const { data, error } = await supabase.auth.getSessionFromUrl();
//         if (error) throw error;

//         const session = data.session;
//         if (!session?.user) {
//           setStatus("Authentication failed.");
//           return navigate("/log");
//         }

//         // Set Supabase client session
//         const { error: setSessionError } = await supabase.auth.setSession({
//           access_token: session.access_token,
//           refresh_token: session.refresh_token,
//         });
//         if (setSessionError) throw setSessionError;

//         // Update AuthContext
//         setUser(session.user);

//         setStatus("Redirecting...");
//         navigate("/dash");
//       } catch (err) {
//         console.error("OAuth callback error:", err);
//         setStatus("Authentication failed.");
//         setTimeout(() => navigate("/log"), 2000);
//       }
//     };

//     handleCallback();
//   }, [navigate, setUser]);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-900">
//       <div className="text-white text-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
//         <p>{status}</p>
//       </div>
//     </div>
//   );
// };

// export default AuthCallback;
