import React from "react";
import './index.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {Toaster} from "react-hot-toast";
import {Login} from "./components/Auth/Login.jsx";
import Register from "./components/Auth/Register.jsx";
import Dashboard from "./components/dashboard/dashboard.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoutes from "./components/ProtectedRoute.jsx";


const App = () => {

 return (
    <>
    <AuthProvider>
        <BrowserRouter>
         <Toaster 
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
              fontSize: '14px',
              padding: '12px 20px',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />

        <Routes>
          <Route path="/login" element={<Login />}/>
          <Route path="/register" element={<Register />}/>
          <Route path="/dashboard" element={
            <ProtectedRoutes>
                <Dashboard/>
            </ProtectedRoutes>
            }/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </>
  )
}

export default App;
