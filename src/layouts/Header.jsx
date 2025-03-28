import React, { useEffect, useState } from "react";
import styles from "./Header.module.scss";
import logoImage from "../assets/images/logo-big.png";
import ProfileCircle from "../components/common/ProfileCircle.jsx";
import Button from "../components/common/Button.jsx";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../store/slices/authSlice.js";
import { fetchMatchingRequestsWithFilters } from "../services/matchingService.js";
import { BellDot, BellIcon, BellRing, Dot } from "lucide-react";
import { fetchUserProfile } from "../services/profileApi.js";
import MiniAlert from "../components/common/MiniAlert.jsx";

const Header = () => {
  // 스토어에서 유저 정보 가져오기
  const user = useSelector((state) => state.auth.user);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const location = useLocation(); // 매 페이지마다 새로 fetch 되게 하려고 useLocation 사용

  // 메인페이지 여부 확인 (정확히 루트 경로인 경우만)
  const isMainPage = location.pathname === "/";

  // 로그아웃 알럿 상태관리
  const [isMiniAlertOpen, setIsMiniAlertOpen] = useState(false);
  const [miniAlertMessage, setMiniAlertMessage] = useState("");

  // ========= 매칭관리 : 내가 수신인이고 아직 수락/거절여부 결정하지 않은 내역 있으면 빨간점으로 알림 표시  ===== //
  const [hasReceivedPendingRequests, setHasReceviedPendingRequests] =
    useState(false);

  // 현재 로그인한 사용자의 프로필 이미지 가져오기
  useEffect(() => {
    const loadUserProfileImage = async () => {
      if (!user) {
        setProfileImageUrl(null);
        return;
      }

      try {
        const userData = await fetchUserProfile(user.name);

        // API 응답에서 프로필 이미지 URL 처리
        let imageUrl = userData.profileImageUrl;
        if (imageUrl && !imageUrl.startsWith("http")) {
          imageUrl = `http://localhost:8999${imageUrl}`;
        }

        setProfileImageUrl(imageUrl);
      } catch (err) {
        console.error("프로필 이미지를 불러오는데 실패했습니다:", err);
        setProfileImageUrl(null);
      }
    };

    loadUserProfileImage();
  }, [user]);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      // 로그인 안했으면 return
      if (!user) {
        setHasReceviedPendingRequests(false);
        return;
      }

      try {
        // 내가 받은 펜딩 메시지 확인
        const data = await fetchMatchingRequestsWithFilters("RECEIVE", "N");

        // data가 없거나 배열이 아닌 경우 return
        if (!data || !Array.isArray(data)) {
          setHasReceviedPendingRequests(false);
          return;
        }

        // 내가 받은 메시지인지 다시 한번 검증
        const hasPending = data.some(
          (request) => request.receiverName === user.name
        );

        // 있을 경우 알람 설정하기 위해 hasReceivedPendingRequests의 값을 true로 전환
        setHasReceviedPendingRequests(hasPending);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchPendingRequests();
  }, [location]);

  // ============== 매칭 관리 끝 =============== //

  // 스토어에서 사용자 정보 가져오기
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 해당 페이지로 넘어가면 해당 nav부분 css 변하도록
  const getLinkClassName = ({ isActive }) => {
    return isActive ? `${styles.aItem} ${styles.activeLink}` : styles.aItem;
  };

  // 로그인이 되어있으면 로그아웃이 가능하도록 로그아웃 상태면 로그인페이지로 넘어가도록
  const handleAuthAction = () => {
    if (user) {
      // 로그아웃 처리
      dispatch(authActions.deleteUserInfo());
      localStorage.removeItem("accessToken");
      setMiniAlertMessage("로그아웃되었습니다.");
      setIsMiniAlertOpen(true);

      // 2초 후 메인 페이지로 이동
      setTimeout(() => {
        setIsMiniAlertOpen(false);
        navigate("/");
      }, 1000);

    } else {
      navigate("/login");
    }
  };

  //프로필을 클릭했을때 해당 프로필 페이지로 이동할 수 있도록
  const handleProfileClick = () => {
    if (user) {
      navigate(`/profile/${user.name}`);
    } else {
      navigate("/login");
    }
  };

  const handleNewClick = (e) => {
    e.preventDefault(); // 기본 네비게이션을 막음

    setTimeout(() => {
      navigate("/exchanges/new"); 
    }, 500); // 0.5초 지연
  };

  const handleMatcheClick = (e) => {
    e.preventDefault(); // 기본 네비게이션을 막음

    setTimeout(() => {
      navigate("/matches"); 
    }, 500); // 0.5초 지연
  };

  return (
    <header className={`${styles.headerContainer} ${isMainPage ? styles.transparentHeader : ''}`}>
      {isMiniAlertOpen && (
        <MiniAlert
          message={miniAlertMessage}
          onClose={() => {
            setIsMiniAlertOpen(false);
            navigate("/");
          }}
        />
      )}
      <div className={styles.logoContainer}>
        <NavLink to="/">
          <img src={logoImage} alt="logo사진" />
        </NavLink>
      </div>
      <div>
        <ul className={styles.menuContainer}>
          <li className={styles.menuItem}>
            <NavLink to="/exchanges" end className={getLinkClassName} >
              재능 찾아보기
            </NavLink>
          </li>
          <li className={styles.menuItem}>
            <NavLink to="/exchanges/new" className={getLinkClassName} onClick={handleNewClick}>
              재능 등록하기
            </NavLink>
          </li>
          <li className={styles.menuItem}>
            <NavLink to="/matches" className={getLinkClassName} onClick={handleMatcheClick}>
              매칭 관리
            </NavLink>
            {/* 내가 수신인이고 status가 N이면 빨간점으로 알람 */}
            <div className={styles.dotContainer}>
              {hasReceivedPendingRequests && (
                <BellDot
                  size={14}
                  color={"blue"}
                  strokeWidth={1.5}
                  style={{ fill: "white" }}
                />
              )}
            </div>
          </li>
          <li className={styles.menuItem}>
            <NavLink to="/about" className={getLinkClassName}>
              알아보기
            </NavLink>
          </li>
        </ul>
      </div>
      <div className={styles.rightContainer}>
        <div
          className={styles.profileContainer}
          onClick={handleProfileClick}
          style={{ cursor: "pointer" }}
        >
          <ProfileCircle size="sm" src={profileImageUrl} />
        </div>
        <div className={styles.buttonContainer}>
          <Button theme="blueTheme" onClick={handleAuthAction}>
            {user ? "로그아웃" : "로그인"}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
