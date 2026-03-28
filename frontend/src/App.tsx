import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Index";
import { useAuth } from "./hooks/useAuth";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const user = useAuth();

  if (user === undefined) return <div>Loading...</div>;

  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  const user = useAuth();

  if (user === undefined) return <div>Loading...</div>;

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />

      {/* Protected route */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}