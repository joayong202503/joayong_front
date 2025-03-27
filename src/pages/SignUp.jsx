import React, {useState, useEffect, useRef} from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { authApi } from "../services/api"; // API 호출을 위한 import
import styles from "./SignUp.module.scss";
import logoImage from "../assets/images/logo-big.png";
import MiniAlert from "../components/common/MiniAlert.jsx";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [nameError, setNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [emailAvailable, setEmailAvailable] = useState(true); // 이메일 사용 가능 여부 상태
  const [isCheckingEmail, setIsCheckingEmail] = useState(false); // 이메일 중복 확인 중 상태

  const [nameAvailable, setNameAvailable] = useState(true); // 이름 사용 가능 여부 상태
  const [isCheckingName, setIsCheckingName] = useState(false); // 이름 중복 확인 중 상태

  const [showMiniAlert, setShowMiniAlert] = useState(false); // 로그인 성공 후 알림용
  const [redirected, setRedirected] = useState(false); // 이미 미니 alert를 눌러서 다른 페이지로 이동 완료했는지

  const navigate = useNavigate(); // ✅ 페이지 이동을 위한 useNavigate()

  const loginButtonRef = useRef(null);

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

  // 비밀번호 확인란 전용 : 비밀번호가 일치하는지만 검사
  const validateConfirmPassword = () => {
    if (confirmPassword && (password !== confirmPassword)) {
        setPasswordError("비밀번호가 일치하지 않습니다.");
        return false;
      } else {
        setPasswordError("");
        return true;
      }
  }

  const validatePassword = () => {

    console.log('password 입력값:', password);

    // 아예 입력 값 없으면 에러 메시지 안 보여주기
    if (!password) {
      setPasswordError("");
      return true;
    }

    // 최소 8자리
    if (password.length < 8) {
      setPasswordError("비밀번호는 최소 8자 이상이어야 합니다.");
      return false;
    }

    // 특수문자 검사 (@$!%*#?&만 가능)
    if (/[^A-Za-z\d@$!%*#?&]/.test(password)) {
      setPasswordError("특수문자는 @$!%*#?& 만 사용가능합니다.");
      return false;
    }

    // 영문, 숫자 최소 1개 포함
    if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      setPasswordError("비밀번호는 영문과 숫자를 최소 1개 이상 포함해야 합니다.");
      return false;
    }

    // 비밀번호 확인란 입력했을 때만 진행
    if (confirmPassword) {
      validateConfirmPassword();
    }

    setPasswordError("");
    return true;
  };


  const checkEmailAvailability = async () => {
    if (!validateEmail(email)) return;
    setIsCheckingEmail(true);
    try {
      const response = await fetch(
        `${authApi.duplicate}?type=email&value=${email}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log("data : ", data);

      if (data.available) {
        setEmailAvailable(true);
        setEmailError("");
      } else {
        setEmailAvailable(false);
        setEmailError("이메일이 이미 사용 중입니다.");
      }
    } catch (error) {
      console.error("이메일 중복 확인 오류:", error);
      setEmailAvailable(false);
      setEmailError("이메일 중복 확인 오류가 발생했습니다.");
    } finally {
      setIsCheckingEmail(false);
    }
  };

  // 이메일 중복확인 디바운스로 0.8초 관리
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (email) {
        checkEmailAvailability(); // 이메일 중복 확인
      }
    }, 800);

    return () => clearTimeout(delayDebounceFn);
  }, [email]);


  // 비밀번호 실시간 검증 : 0.8초 바운스
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      validatePassword();
    }, 800);

    return () => clearTimeout(delayDebounceFn);
  }, [password]);

  // 비밀번호 확인 란 입력 시 검증
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (password && confirmPassword) {  // 비밀번호가 입력된 경우만 실행
        if (passwordError) return;
        validateConfirmPassword();
      }
    }, 800);  // 300ms 디바운싱 적용

    return () => clearTimeout(delayDebounceFn);  // 이전 타이머 클리어
  }, [confirmPassword, password]);  // password도 의존성에 추가

  const checkNameAvailability = async () => {
    setIsCheckingName(true);
    try {
      const response = await fetch(
        `${authApi.duplicate}?type=name&value=${username}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log("data : ", data);

      if (data.available) {
        setNameAvailable(true);
        setNameError("");
      } else {
        setNameAvailable(false);
        setNameError("이름이 이미 사용 중입니다.");
      }
    } catch (error) {
      console.error("이름 중복 확인 오류:", error);
      setNameAvailable(false);
      setNameError("이름 중복 확인 오류가 발생했습니다.");
    } finally {
      setIsCheckingName(false);
    }
  };

  // 이름 중복확인 디바운스로 0.8초 관리
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (username) {
        checkNameAvailability(); // 이메일 중복 확인
      }
    }, 800);

    return () => clearTimeout(delayDebounceFn);
  }, [username]);

  const handleRedirect = () => {
    setShowMiniAlert(false);
    setTimeout(() => {
      navigate("/login");
    }, 200);
  };

  const handleSignUp = async (e) => {

    // minialert가 열려 있을 떄 miniaelrt를 닫기 위해 enter를 누르면
    // form의 기본 기능인 엔터로 form 제출되는 이벤트가 함께 발생하는 것을 방지
    if (showMiniAlert) return;

    e.preventDefault();

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword();
    const isConfirmPasswordValid = validateConfirmPassword();

    if (!isEmailValid || !isPasswordValid || !nameAvailable || !emailAvailable || !isConfirmPasswordValid) {
      return;
    }

    setIsSubmitting(true);

    try {
      const signupRequest = {
        email: email,
        name: username,
        password: password,
      };
      const rs = await fetch(authApi.signup, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(signupRequest),
      });
      const response = await rs.json();
      console.log("회원가입 성공:", response);

      // 회원가입 성공 페이지 표시
      setShowMiniAlert(true);
      // mini alert에서 이미 로그인 페이지로 이동한 상태가 아닌 경우, 로그인 페이지로 이동
      if (!redirected) {
        setTimeout(() => {
          handleRedirect();
        }, 800);
      }

    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <>
          <div className={styles.container}>
            <div className={styles.logoContainer}>
              <img src={logoImage} alt="logo사진" onClick={() => navigate("/")} />
            </div>

            <form
              onSubmit={handleSignUp}
              className={styles.form}
              // MiniAlert가 표시중일 때는 onKeyDown 이벤트를 막음
              onKeyDown={(e) => {
                if (showMiniAlert && e.key === 'Enter') {
                  e.preventDefault();
                }
              }}
            >
              <div>
                <h2 className={styles.title}>회원가입</h2>
                <label htmlFor="email">이메일</label>
                <input
                    id="email"
                    type="text"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value); // 이메일 변경 시 상태 업데이트
                    }}
                    className={styles["input-box"]}
                    placeholder="이메일 주소를 입력하세요"
                    required
                />
                {emailError &&
                    <p className={`${styles["error-text"]}`}>
                      {emailError}
                    </p>
                }
                {/* 아래는 0.1초 나타났다가 사라져서 UX 고려하여 주석 처리 함*/}
                {/*{isCheckingEmail && <p>이메일 중복 확인 중...</p>}*/}
              </div>

              <div>
                <label htmlFor="username">사용자 이름</label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={styles["input-box"]}
                  placeholder="사용자 이름을 입력하세요"
                  required
                />
                {nameError && <p className={styles["error-text"]}>{nameError}</p>}
                {/* 아래는 0.1초 나타났다가 사라져서 UX 고려하여 주석 처리 함*/}
                {/*{isCheckingName && <p>이름 중복 확인 중...</p>}*/}
              </div>

              <div>
                <label htmlFor="password">비밀번호
                  <span className={styles.passwordDescription}>(영문 및 숫자 포함 최소 8자리)</span>
                </label>
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
                  <button
                    type="button"
                    className={styles["toggle-icon"]}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword">비밀번호 확인</label>
                <div className={styles["password-container"]}>
                  <input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      console.log('비밀번호 확인란', e.target.value);
                      setConfirmPassword(e.target.value);
                    }}
                    className={styles["input-box"]}
                    placeholder="비밀번호를 다시 입력하세요"
                    required
                  />
                  <button
                    type="button"
                    className={styles["toggle-icon"]}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
                {passwordError && (
                  <p className={styles["error-text"]}>{passwordError}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={styles["btn-primary"]}
              >
                {isSubmitting ? "가입 중..." : "회원가입"}
              </button>

              <div className={styles["text-center"]}>
                <div className={styles.loginButtonContainer}>
                  <span>이미 계정이 있으신가요?</span>
                  <button
                      type="button"
                      className={styles.link}
                      onClick={() => navigate("/login")}
                  >
                    로그인
                  </button>
                </div>
              </div>
            </form>
          </div>

        {showMiniAlert &&
            <MiniAlert
                message={"회원가입이 완료되었습니다. 로그인 페이지로 이동합니다"}
                duration={800}
                onClose={() => {
                // form의 엔터 키가 다시 눌려지는 것들 방지하기 위해, 엔터 키 눌려서 제출하기 눌려지는 것을 방지
                loginButtonRef.current.blur();
                setRedirected(true);
                handleRedirect();
              }}
          />}


        </>
  );
};

export default SignUp;
