import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import { AuthProvider, useAuth} from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";

const MemberDashboard =() => <h2>Mmber Dashboard (Coming Soon)</h2>;
const StaffDashboard =() => <h2>staff Dashboard (Coming Soon)</h2>;

const ProtectedRoute = ({children, allowedRoles}) => {
  const {user} = useAuth();
  if (!user) return <Navigate to="/login"/>;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to= "/login"/>;
  }
  return children;
};

function AppRoutes(){
  return(
    <Routes>
      <Route path="/login" element={<Login/>} />
      <Route path="/register" element={<Register/>} />
      <Route path="/member/dashboard" element={
        <ProtectedRoute allowedRoles={["MEMBER"]}>
          <MemberDashboard/>
        </ProtectedRoute>
      }/>
      <Route path="/staff/dashboard" element={
         <ProtectedRoute allowedRoles={["OFFICER","CHAIRMAN"]}>
           <StaffDashboard/>
         </ProtectedRoute>
      }/>
      <Route path="/" element={<Navigate to ="/login" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
         <AppRoutes/>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;