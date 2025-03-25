import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { authApi } from '../services/api'; // ✅ 실제 API 사용
import styles from './LoginPage.module.scss';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

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

  const handleLogin = async (e) => {
    e.preventDefault();
  
    if (!validateEmail(email) || !password) return;
  
    setIsSubmitting(true);
    setError('');
  
    try {
      const loginRequest = {
        "email":email,
        "password":password
      }
      // ✅ 실제 로그인 API 호출
      const rs = await fetch(authApi.login,{
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body:JSON.stringify(loginRequest)
      })
      const response = await rs.json();
  
      // ✅ 회원 정보가 없을 경우 오류 발생
      if (!response || !response.accessToken) {
        throw new Error('존재하지 않는 회원입니다. 회원가입을 진행해주세요.');
      }
  
      // ✅ 토큰 저장 (인증 유지)
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('token', response.token);
  
      // ✅ "로그인 정보 기억하기" 체크 시 이메일 저장
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
  
      navigate('/'); // 로그인 성공 시 홈으로 이동
    } catch (err) {
      setError(err.message || '로그인 실패. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className={styles.container}>
      <h2 className={styles.title}>로그인</h2>
      <form onSubmit={handleLogin} className={styles.form}>
        <div>
          <label htmlFor="email">아이디</label>
          <input
            id="email"
            type="text"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) validateEmail(e.target.value);
            }}
            className={styles['input-box']}
            placeholder="이메일 주소를 입력하세요"
            required
          />
          {emailError && <p className={styles['error-text']}>{emailError}</p>}
        </div>

        <div>
          <label htmlFor="password">비밀번호</label>
          <div className={styles['password-container']}>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles['input-box']}
              placeholder="비밀번호를 입력하세요"
              required
            />
            <button
              type="button"
              className={styles['toggle-icon']}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className={styles.checkbox}>
          <input
            type="checkbox"
            id="remember"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
          />
          <label htmlFor="remember">로그인 정보 기억하기</label>
        </div>

        <div className={styles['text-center']}>
          <p>계정이 없으신가요?</p>
          <button onClick={() => navigate('/signup')} className={styles.link}>
            회원가입
          </button>
        </div>

        <button type="submit" disabled={isSubmitting} className={styles['btn-primary']}>
          {isSubmitting ? '로그인 중...' : '로그인'}
        </button>

        {error && <p className={styles['error-text']}>{error}</p>}
      </form>
    </div>
  );
};


export default LoginPage;
