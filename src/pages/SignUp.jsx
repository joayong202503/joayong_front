import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { authApi } from '../services/api'; // API 호출을 위한 import
import '../pages/LoginPage.css';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate(); // ✅ 페이지 이동을 위한 useNavigate()

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('이메일을 입력해주세요.');
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError('유효한 이메일 주소를 입력해주세요.');
      return false;
    }
    
    setEmailError('');
    return true;
  };

  const validatePassword = () => {
    if (password !== confirmPassword) {
      setPasswordError('비밀번호가 일치하지 않습니다.');
      return false;
    }
    
    if (password.length < 6) {
      setPasswordError('비밀번호는 최소 6자 이상이어야 합니다.');
      return false;
    }
    
    setPasswordError('');
    return true;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword();
    
    if (!isEmailValid || !isPasswordValid || !username) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await authApi.signup(email, username, password);
      console.log('회원가입 성공:', response);
      
      // 회원가입 성공 시 로그인 페이지로 이동
      navigate('/login');
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <h2 className="title">회원가입</h2>
      <form onSubmit={handleSignUp} className="form">
        <div>
          <label htmlFor="email">이메일</label>
          <input
            id="email"
            type="text"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) validateEmail(e.target.value);
            }}
            className="input-box"
            placeholder="이메일 주소를 입력하세요"
            required
          />
          {emailError && <p className="error-text">{emailError}</p>}
        </div>

        <div>
          <label htmlFor="username">사용자 이름</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input-box"
            placeholder="사용자 이름을 입력하세요"
            required
          />
        </div>

        <div>
          <label htmlFor="password">비밀번호</label>
          <div className="password-container">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) validatePassword();
              }}
              className="input-box"
              placeholder="비밀번호를 입력하세요"
              required
            />
            <button
              type="button"
              className="toggle-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword">비밀번호 확인</label>
          <div className="password-container">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (passwordError) validatePassword();
              }}
              className="input-box"
              placeholder="비밀번호를 다시 입력하세요"
              required
            />
            <button
              type="button"
              className="toggle-icon"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {passwordError && <p className="error-text">{passwordError}</p>}
        </div>

        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? '가입 중...' : '회원가입'}
        </button>

        <div className="text-center">
          <p>이미 계정이 있으신가요?</p>
          <button type="button" className="link" onClick={() => navigate('/login')}>
            로그인
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
