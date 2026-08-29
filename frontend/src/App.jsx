import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import ProtectedRoute from "./routes/ProtectedRoute";

import RetailerDashboard from "./pages/retailer/RetailerDashboard";
import CreateDelivery from "./pages/retailer/CreateDelivery";

import DispatcherDashboard from "./pages/dispatcher/DispatcherDashboard";
import AssignDelivery from "./pages/dispatcher/AssignDelivery";

import RiderDashboard from "./pages/rider/RiderDashboard";
import DeliveryDetails from "./pages/rider/DeliveryDetails";
//added the 2 below imports for the deliveries pages for retailer and dispatcher
import RetailerDeliveries from "./pages/retailer/Deliveries";
import DispatcherDeliveries from "./pages/dispatcher/Deliveries";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Authentication */}
        <Route path="/login" element={<Login />} />

        {/* Retailer */}
     


        <Route
          path="/retailer/dashboard"
          element={
            <ProtectedRoute>
              <RetailerDashboard />
            </ProtectedRoute>
          }
        />
           <Route
  path="/retailer/deliveries"
  element={
    <ProtectedRoute>
      <RetailerDeliveries />
    </ProtectedRoute>
  }
/>

        <Route
          path="/retailer/deliveries/new"
          element={
            <ProtectedRoute>
              <CreateDelivery />
            </ProtectedRoute>
          }
        />

        {/* Dispatcher */}
        <Route
          path="/dispatcher/dashboard"
          element={
            <ProtectedRoute>
              <DispatcherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
  path="/dispatcher/deliveries"
  element={
    <ProtectedRoute>
      <DispatcherDeliveries />
    </ProtectedRoute>
  }
/>

        <Route
          path="/dispatcher/deliveries/:id/assign"
          element={
            <ProtectedRoute>
              <AssignDelivery />
            </ProtectedRoute>
          }
        />

        {/* Rider */}
        <Route
          path="/rider/dashboard"
          element={
            <ProtectedRoute>
              <RiderDashboard />
            </ProtectedRoute>
          }
        />
        <Route
  path="/rider/deliveries/:id"
  element={
    <ProtectedRoute>
      <DeliveryDetails />
    </ProtectedRoute>
  }
/>

        {/* Default */}
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;