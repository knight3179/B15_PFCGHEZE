import { BrowserRouter as Router, Routes, Route } from "react-router";

import SignIn from "./pages/AuthPages/SignIn";
import UserProfiles from "./pages/UserProfiles";

import BasicTables from "./pages/Tables/BasicTables";
import Items from "./pages/Product/product";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";



export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            

            
            

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />
            <Route path="/product" element={<Items />} />
            

            

            {/* Charts */}
            
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />

          

          
        </Routes>
      </Router>
    </>
  );
}
