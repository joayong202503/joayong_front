import { useState, useEffect, createContext, useContext } from 'react';
import { toast } from "sonner";

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
        localStorage.removeItem('rememberedEmail');
      }
      
      toast.success("로그인 성공!");
    } catch (err) {
      setError('로그인에 실패했습니다. 다시 시도해주세요.');
      toast.error("로그인 실패. 다시 시도해주세요.");
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
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
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
