import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import QueryPage from "@/pages/QueryPage";
import Signin from "@/pages/Signin";
import Signup from "@/pages/Signup";
import ServerError from "@/pages/ServerError";
import NotFound from "@/pages/NotFound";
import AuthProvider from "@/context/AuthProvider";
import QueryPageLayout from "@/layouts/QueryPageLayout";

const Approutes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route element={<QueryPageLayout />}>
              <Route path="/" element={<QueryPage />} />
              <Route path="/c/:chat_token" element={<QueryPage />} />
            </Route>
          </Route>

          <Route path="/auth">
            <Route path="signin" element={<Signin />} />
            <Route path="signup" element={<Signup />} />
          </Route>

          <Route path="/server-error" element={<ServerError />} />

          {/* for not found use alert message or not found page  */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default Approutes;
