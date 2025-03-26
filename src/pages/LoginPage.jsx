import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Video } from "lucide-react";
import styles from "./LoginPage.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/slices/authSlice";
import logoImage from "../assets/images/logo-big.png";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.auth); // ✅ 로그인 상태 가져오기

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("이메일을 입력해주세요.");
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError("유효한 이메일 주소를 입력해주세요.");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateEmail(email) || !password) return;

    dispatch(login({ email, password }))
      .unwrap() // Thunk 결과를 기다림
      .then(() => {
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }
        navigate("/"); // 로그인 성공 후 홈으로 이동
      })
      .catch((err) => {
        console.error(err); // 오류 처리
      });
  };

  return (
    <div className={styles.container}>
      <div className={styles.logoContainer}>
        <img src={logoImage} alt="logo사진" onClick={() => navigate("/")} />
      </div>
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
            className={styles["input-box"]}
            placeholder="이메일 주소를 입력하세요"
            required
          />
          {emailError && <p className={styles["error-text"]}>{emailError}</p>}
        </div>

        <div>
          <label htmlFor="password">비밀번호</label>
          <div className={styles["password-container"]}>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles["input-box"]}
              placeholder="비밀번호를 입력하세요"
              required
            />
            <button
              type="button"
              className={styles["toggle-icon"]}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <>
                  <Eye size={18} />
                </>
              ) : (
                <EyeOff size={18} />
              )}
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
        <div className={styles["text-center"]}>
          <p>계정이 없으신가요?</p>
          <p onClick={() => navigate("/signup")} className={styles.link}>
            회원가입
          </p>
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className={styles["btn-primary"]}
        >
          {status === "loading" ? "로그인 중..." : "로그인"}
        </button>

        {error && <p className={styles["error-text"]}>{error}</p>}
      </form>
    </div>
  );
};

export default LoginPage;
