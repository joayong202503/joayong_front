
import React from 'react';
import { Link } from 'react-router-dom';
import "../pages/LoginPage.css";

const AuthLayout = ({ 
  children, 
  title, 
  subtitle,
  authType 
}) => {
  return (
    <div className="flex">
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-white to-gray-50 wrapper">
        <div className="auth-card w-full max-w-md p-8 bg-white rounded-xl border border-gray-100">
          <div className="text-center mb-6 animate-slideUp">
            <h1 className="text-2xl font-bold text-brand-purple mb-2">{title}</h1>
            {subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
          </div>
          
          {children}
          
          <div className="mt-6 text-center text-sm text-gray-500">
            {authType === 'login' ? (
              <p>
                계정이 없으신가요? <Link to="/signup" className="text-brand-blue font-medium auth-link">회원가입</Link>
              </p>
            ) : (
              <p>
                이미 계정이 있으신가요? <Link to="/login" className="text-brand-blue font-medium auth-link">로그인</Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;