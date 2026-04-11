import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Home from "./pages/Home";
import MyProperties from "./pages/MyProperties";
import AddProperty from "./pages/AddProperty";
import Register from "./pages/Register";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./pages/Navbar";
import OwnerRequests from "./pages/OwnerRequests";
import PropertyDetails from "./pages/PropertyDetails";
import Profile from "./pages/Profile";
import ApplyOwner from "./pages/ApplyOwner";
import PropertyRequests from "./pages/PropertyRequests";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOwners from "./pages/AdminOwners";
import DetailsList from "./pages/admin/DetailsList";
import AdminUserDetails from "./pages/admin/AdminUserDetails";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <Navbar />
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected */}
          <Route path="/" element={ <Home /> }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-properties/:id" element={
              <ProtectedRoute>
                <MyProperties />
              </ProtectedRoute>
            }
          />

          <Route
            path="/add-property" element={
              <ProtectedRoute>
                <AddProperty />
              </ProtectedRoute>
            }
          />

          <Route
            path="/owner-requests"
            element={
              <ProtectedRoute>
                <OwnerRequests />
              </ProtectedRoute>
            }
          />

          <Route
            path="/property/:id"
            element={
              // <ProtectedRoute>
                <PropertyDetails />
              // </ProtectedRoute>
            }
          />

          <Route
            path="/apply-owner"
            element={
              <ProtectedRoute>
                <ApplyOwner />
              </ProtectedRoute>
            }
          />

          <Route
            path="/property-requests/:id"
            element={
              <ProtectedRoute>
                <PropertyRequests />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/owners"
            element={
              <ProtectedRoute>
                <AdminOwners />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/list"
            element={
              <ProtectedRoute>
                <DetailsList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/user/:id"
            element={
              <ProtectedRoute>
                <AdminUserDetails />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;