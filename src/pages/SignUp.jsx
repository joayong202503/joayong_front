import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '@/components/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // 이미 로그인되어 있는 경우 홈으로 리다이렉트
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    if (!email || !name || !password || !confirmPassword || !agreeTerms) {
      return;
    }
    
    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await signup(email, name, password, confirmPassword);
      navigate('/');
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout 
      title="회원가입" 
      subtitle="간단한 정보를 입력하고 회원가입을 완료하세요." 
      authType="signup"
    >
      <form onSubmit={handleSignUp} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="signup-email">이메일</Label>
          <Input
            id="signup-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
            placeholder="이메일 주소를 입력하세요"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="name">이름</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input"
            placeholder="이름을 입력하세요"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="signup-password">비밀번호</Label>
          <div className="relative">
            <Input
              id="signup-password"
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
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            8자 이상, 하나 이상의 숫자와 특수문자를 포함해주세요.
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirm-password">비밀번호 확인</Label>
          <div className="relative">
            <Input
              id="confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-input pr-10"
              placeholder="비밀번호를 다시 입력하세요"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 pt-2">
          <Checkbox
            id="terms"
            checked={agreeTerms}
            onCheckedChange={(checked) => setAgreeTerms(checked === true)}
            required
          />
          <Label htmlFor="terms" className="text-sm font-normal cursor-pointer">
            이용약관 및 개인정보처리방침에 동의합니다
          </Label>
        </div>
        
        <div className="pt-4">
          <Button
            type="submit"
            disabled={isSubmitting || !agreeTerms}
            className="auth-button w-full h-11 font-medium bg-brand-blue hover:bg-brand-lightBlue"
          >
            {isSubmitting ? '가입하는 중...' : '가입하기'}
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default SignUp;
