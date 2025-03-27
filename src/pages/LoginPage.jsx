import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Video } from "lucide-react";
import styles from "./LoginPage.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/slices/authSlice";
import logoImage from "../assets/images/logo-big.png";
import { Loader } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.auth); // ✅ 로그인 상태 가져오기
  const [loginError, setLoginError] = useState(""); // 로그인 백엔드 검증

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const validateEmail = (email) => {
    setLoginError("");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setAnimateError(false);
      setEmailError("이메일을 입력해주세요.");
      setAnimateError(true);
      return false;
    } else if (!emailRegex.test(email)) {
      setAnimateError(false);
      setEmailError("유효한 이메일 주소를 입력해주세요.");
      setAnimateError(true);
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
        console.log(err);
        setLoginError(err);
      });
  };

  const [animateError, setAnimateError] = useState(false);

  useEffect(() => {
    if (loginError || emailError) {
      setAnimateError(true);  // 에러가 있으면 애니메이션 시작
      const timer = setTimeout(() => {
        setAnimateError(false);  // 0.3초 후 애니메이션을 종료 상태로 리셋
      }, 300);
      return () => clearTimeout(timer);  // 컴포넌트 언마운트 시 타이머 해제
    }
  }, [loginError, emailError]);  // loginError와 emailError가 변경되면 애니메이션 실행

  return (
    <div className={styles.container}>
      <div className={styles.logoContainer}>
        <img src={logoImage} alt="logo사진" onClick={() => navigate("/")} />
      </div>
      <form onSubmit={handleLogin} className={styles.form}>
        <div>
          <h2 className={styles.title}>로그인</h2>
          <label htmlFor="email">이메일</label>
          <input
              id="email"
              type="text"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              className={styles["input-box"]}
              placeholder="이메일 주소를 입력하세요"
              required
          />
          <p className={`${styles["error-text"]} ${animateError ? styles.shake : ""}`}>
            {(emailError) ? emailError : ""}
          </p>
          <p className={`${styles["error-text"]} ${animateError ? styles.shake : ""}`}>
            {(loginError && loginError === "존재하지 않는 회원입니다.") ? loginError : ""}
          </p>
        </div>

        <div className={styles.passwordSection}>
          <label htmlFor="password">비밀번호</label>
          <div className={styles["password-container"]}>
            <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                className={styles["input-box"]}
                placeholder="비밀번호를 입력하세요"
                required
            />
            <p className={`${styles["error-text"]} ${animateError ? styles.shake : ""}`}>
              {(loginError && loginError === "잘못된 비밀번호입니다.") ? loginError : ""}
            </p>
            <button
                type="button"
                className={styles["toggle-icon"]}
                onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                  <>
                    <Eye size={18}/>
                  </>
              ) : (
                  <EyeOff size={18}/>
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

        <button
            type="submit"
            disabled={status === "loading"}
            className={styles["btn-primary"]}
        >
          {status === "loading" ? (<Loader className={styles.spinnerIcon} />) : "로그인"}
        </button>

        {error && <p className={styles["error-text"]}>{error}</p>}

        <div className={styles["text-center"]}>
          <span>계정이 없으신가요?</span>
          <span onClick={() => navigate("/signup")} className={styles.link}>
            회원가입
          </span>
        </div>

      </form>
    </div>
  );
};

export default LoginPage;
