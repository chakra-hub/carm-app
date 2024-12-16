import "./App.css";
import React from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import LandingPage from "./components/LandingPage";
import TodoPage from "./components/TodoPage";
import Navbar from "./components/Navbar";
import { useAuth } from "./authContex";

const ProtectedRoute = ({ children }) => {
  const { user, isEmailVerified } = useAuth();
  const location = useLocation();

  return user && isEmailVerified ? (
    children
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
};

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/todos"
            element={
              <ProtectedRoute>
                <TodoPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
