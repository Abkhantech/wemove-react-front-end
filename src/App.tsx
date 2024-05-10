import "./App.css";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Store } from "./store";
import WeMovePackages from "./pages/weMovePackages/weMovePackages";
import Pickupdate from "./pages/pickupDate/pickupdate";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import AddressInfo from "./pages/addressInfo/addressInfo";
import DeliveryLocationInfo from "./pages/deliveryLocationInfo/deliveryLocationInfo";
import TruckInfo from "./pages/truckInfo/truckInfo";
import VideoGuidelines from "./pages/videoGuidelines/videoGuidlines";
import ItemsInfo from "./pages/itemsInfo/itemsInfo";
import CarrierInfo from "./pages/carrierInfo/carrierInfo";
import { ThemeProvider } from "@mui/material";
import theme from "./theme/theme";
import Login from "./pages/login/login";
import OtpVerification from "./pages/otp/otpVerification";
import DeliveryCarrierDashboard from "./pages/deliveryCarrierDashboard/deliveryCarrierDashboard";
import PickupCarrierDashboard from "./pages/pickupCarrierDashboard/pickupCarrierDashboard";
import ProtectedRoute from "./routes/protectedRoute";
import Register from "./pages/register/register";
import AdminLogin from "./pages/adminLogin/adminLogin";
import AdminDashboard from "./pages/adminDashboard/adminDashboard";
import VideoRecorder from "./pages/videoRecorder/videoRecorder";
import ConsumerLogin from "./pages/consumerLogin/consumerLogin";
import MoveSummary from "./pages/moveSummary/moveSummary";
import ContractDocument from "./pages/contractDocument/contractDocument";
import UploadInventory from "./pages/uploadInventory/uploadInventory";
import MoveSuccess from "./pages/moveSuccess/moveSuccess";
import AppDrawer from "./components/appDrawer/appDrawer";

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ThemeProvider theme={theme}>
        <div className="App">
          <Provider store={Store}>
            <Router>
              <Routes>
                <Route
                  path="deliveryCarrierDashboard/:canonicalId"
                  element={<DeliveryCarrierDashboard />}
                />
              </Routes>

              <Routes>
                <Route path="/Login" element={<Login />} />
              </Routes>

              <Routes>
                <Route
                  path="/video-guidelines/:moveRequestId"
                  element={<VideoGuidelines />}
                />
              </Routes>

              <Routes>
                <Route
                  path="/video-recorder/:moveRequestId"
                  element={<VideoRecorder />}
                />
                <Route path="/consumer-signup" element={<ConsumerLogin />} />
              </Routes>

              <Routes>
                <Route
                  path="/upload-inventory/:moveRequestId"
                  element={<UploadInventory />}
                />
              </Routes>

              <Routes>
                <Route path="/carriers-onboarding" element={<Register />} />
              </Routes>

              <Routes>
                <Route path="/admin-login" element={<AdminLogin />} />
              </Routes>

              <Routes>
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
              </Routes>

              <Routes>
                <Route path="/otpVerificaion" element={<OtpVerification />} />
              </Routes>

              <Routes>
                <Route
                  path="/packages/:moveRequestId"
                  element={<WeMovePackages />}
                />
              </Routes>

              <Routes>
                <Route
                  path="/PickupDate/:moveRequestId"
                  element={<Pickupdate />}
                />
              </Routes>

              <Routes>
                <Route
                  path="/AddressInfo/:moveRequestId"
                  element={<AddressInfo />}
                />
              </Routes>

              <Routes>
                <Route
                  path="/DeliveryLocationInfo/:moveRequestId"
                  element={<DeliveryLocationInfo />}
                />
              </Routes>

              <Routes>
                <Route
                  path="/TruckInfo/:moveRequestId"
                  element={<TruckInfo />}
                />
              </Routes>

              <Routes>
                <Route
                  path="/itemsInfo/:moveRequestId"
                  element={<ItemsInfo />}
                />
              </Routes>

              <Routes>
                <Route path="/CarrierInfo" element={<CarrierInfo />} />
              </Routes>

              <Routes>
                <Route
                  path="/pickupCarrierDashboard/:canonicalId"
                  element={<PickupCarrierDashboard />}
                />
              </Routes>

              <Routes>
                <Route
                  path="/ConsumerDashboard/:consumerId"
                  element={
                    <ProtectedRoute allowedRoles={["consumer"]}>
                      <AppDrawer />
                    </ProtectedRoute>
                  }
                />
                {/* <Route path="/ConsumerDashboard/:consumerId" element={<ProtectedRoute allowedRoles={['consumer']}><ConsumerDashboard /></ProtectedRoute>} /> */}
              </Routes>

              <Routes>
                <Route
                  path="/move-summary/:moveRequestId"
                  element={<MoveSummary />}
                />
              </Routes>

              <Routes>
                <Route
                  path="/contract/:moveRequestId"
                  element={<ContractDocument />}
                />
              </Routes>

              <Routes>
                <Route
                  path="/move-success/:moveRequestId"
                  element={<MoveSuccess />}
                />
              </Routes>
            </Router>
          </Provider>
        </div>
      </ThemeProvider>
    </LocalizationProvider>
  );
}

export default App;
