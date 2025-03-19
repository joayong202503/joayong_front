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
      
<<<<<<< HEAD
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
=======
      // 실제 구현에서는 API 호출을 통해 인증을 처리해야 합니다.
      // 여기서는 간단한 모의 인증을 구현합니다.
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 모의 사용자 데이터 (실제 환경에서는 백엔드에서 받아와야 함)
      const mockUser = {
        id: '1',
        email,
        username: email.split('@')[0]
      };
      
      // 로그인 성공 처리
      setUser(mockUser);
      
      // 사용자 기억 설정
      if (remember) {
        localStorage.setItem('user', JSON.stringify(mockUser));
        localStorage.setItem('rememberedEmail', email);
      } else {
        sessionStorage.setItem('user', JSON.stringify(mockUser));
>>>>>>> b9a1291280d459fddf79b6e6e370edc6547e7db0
        localStorage.removeItem('rememberedEmail');
      }
      
      toast.success("로그인 성공!");
<<<<<<< HEAD
      return response.user;
    } catch (err) {
      setError(err.message || '로그인에 실패했습니다. 다시 시도해주세요.');
      toast.error(err.message || "로그인 실패. 다시 시도해주세요.");
      throw err;
=======
    } catch (err) {
      setError('로그인에 실패했습니다. 다시 시도해주세요.');
      toast.error("로그인 실패. 다시 시도해주세요.");
>>>>>>> b9a1291280d459fddf79b6e6e370edc6547e7db0
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
      
<<<<<<< HEAD
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
=======
      // 실제 구현에서는 API 호출을 통해 회원가입을 처리해야 합니다.
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 회원가입 성공 처리 (실제 환경에서는 백엔드에서 처리)
      const newUser = {
        id: Date.now().toString(),
        email,
        username
      };
      
      // 회원가입 후 자동 로그인
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      toast.success("회원가입 성공!");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        toast.error(err.message);
      } else {
        setError('회원가입에 실패했습니다. 다시 시도해주세요.');
        toast.error("회원가입 실패. 다시 시도해주세요.");
      }
>>>>>>> b9a1291280d459fddf79b6e6e370edc6547e7db0
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
<<<<<<< HEAD
    // In a real app, you would call the logout API here
=======
>>>>>>> b9a1291280d459fddf79b6e6e370edc6547e7db0
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
<<<<<<< HEAD
};
=======
};
>>>>>>> b9a1291280d459fddf79b6e6e370edc6547e7db0
