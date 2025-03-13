import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '@/components/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // 이미 로그인되어 있는 경우 홈으로 리다이렉트
    if (user) {
      navigate('/');
    }
    
    // 저장된 이메일이 있는지 확인
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await login(email, password, rememberMe);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout title="로그인" authType="login">
      <form onSubmit={handleLogin} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">아이디</Label>
          <div className="relative">
            <Input
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="이메일 주소를 입력하세요"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">비밀번호</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input pr-10"
              placeholder="비밀번호를 입력하세요"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked === true)}
            />
            <Label
              htmlFor="remember"
              className="text-sm font-normal cursor-pointer"
            >
              로그인 정보 기억하기
            </Label>
          </div>
          
          <a
            href="#"
            className="text-sm text-gray-500 hover:text-brand-blue auth-link"
          >
            비밀번호 찾기
          </a>
        </div>
        
        <div className="pt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="auth-button w-full h-11 font-medium bg-brand-blue hover:bg-brand-lightBlue"
          >
            {isSubmitting ? '로그인 중...' : '로그인'}
          </Button>
        </div>
        
        <div className="text-center">
          <p className="text-gray-500 text-sm">
            로그인 정보가 일치하지 않습니다.
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Login;
