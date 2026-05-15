import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import NewSitePage from "./pages/NewSitePage";
import EditSitePage from "./pages/EditSitePage";
import SummaryPage from "./pages/SummaryPage";
import AdminPage from "./pages/AdminPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<SignupPage />} />

      <Route
        path="/projects"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/projects/new"
        element={
          <ProtectedRoute>
            <NewSitePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/projects/:id/edit"
        element={
          <ProtectedRoute>
            <EditSitePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/summary"
        element={
          <ProtectedRoute>
            <SummaryPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;