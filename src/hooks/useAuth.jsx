import React from 'react';
import { useState, useEffect, createContext, useContext } from 'react';
import { toast } from "sonner";

// API URLs configuration - prepare for real API integration
const API_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  SIGNUP: '/api/auth/signup',
  LOGOUT: '/api/auth/logout',
};

// This would be replaced with actual API calls
const mockApiCall = async (endpoint, data) => {
  console.log(`Making API call to ${endpoint} with data:`, data);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For now, return mock data
  if (endpoint === API_ENDPOINTS.LOGIN) {
    // Validate credentials (in real app, this would be done on the server)
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
    if (!validEmail) {
      throw new Error('올바른 이메일 형식이 아닙니다');
    }
    
    if (data.password.length < 6) {
      throw new Error('비밀번호는 최소 6자 이상이어야 합니다');
    }
    
    return {
      user: {
        id: '1',
        email: data.email,
        username: data.email.split('@')[0]
      }
    };
  }
  
  if (endpoint === API_ENDPOINTS.SIGNUP) {
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
    if (!validEmail) {
      throw new Error('올바른 이메일 형식이 아닙니다');
    }
    
    return {
      user: {
        id: Date.now().toString(),
        email: data.email,
        username: data.username
      }
    };
  }
  
  return {};
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 로컬 스토리지에서 저장된 사용자 정보를 확인
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password, remember) => {
    try {
      setLoading(true);
      setError(null);
      
      // API 호출
      const response = await mockApiCall(API_ENDPOINTS.LOGIN, { email, password });
      
      // 로그인 성공 처리
      setUser(response.user);
      
      // 사용자 기억 설정
      if (remember) {
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('rememberedEmail', email);
      } else {
        sessionStorage.setItem('user', JSON.stringify(response.user));
        localStorage.removeItem('rememberedEmail');
      }
      
      toast.success("로그인 성공!");
      return response.user;
    } catch (err) {
      setError(err.message || '로그인에 실패했습니다. 다시 시도해주세요.');
      toast.error(err.message || "로그인 실패. 다시 시도해주세요.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email, username, password, confirmPassword) => {
    try {
      setLoading(true);
      setError(null);
      
      // 비밀번호 확인
      if (password !== confirmPassword) {
        throw new Error('비밀번호가 일치하지 않습니다.');
      }
      
      // API 호출
      const response = await mockApiCall(API_ENDPOINTS.SIGNUP, { 
        email, 
        username, 
        password 
      });
      
      // 회원가입 성공 처리
      setUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      toast.success("회원가입 성공!");
      return response.user;
    } catch (err) {
      const errorMessage = err.message || '회원가입에 실패했습니다. 다시 시도해주세요.';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // In a real app, you would call the logout API here
    setUser(null);
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    toast.success("로그아웃 되었습니다.");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};