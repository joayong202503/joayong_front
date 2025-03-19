import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { Provider } from "react-redux";
import { store } from "./store/index.js";
import ReduxFetcher from "./components/common/ReduxFetcher.jsx";
import AppContent from "./AppContent.jsx";
import Index from "./pages/Index";
import Login from "./pages/LoginPage.jsx";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";

const App = () => (


  
  <Provider store={store}>
    <ReduxFetcher>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/home" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <AppContent />
        </AuthProvider>
      </TooltipProvider>
    </ReduxFetcher>
  </Provider>
);

export default App;
