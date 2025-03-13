import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const AuthRequired = ({ children }) => {
  // Redux 스토어에서 user 정보 가져오기
  const user = useSelector(state => state.auth.user);
  const location = useLocation();

  // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
  if (!user) {
    // 현재 경로 정보를 state로 전달하여 로그인 후 원래 페이지로 돌아올 수 있게 함
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // 로그인된 경우 자식 컴포넌트 렌더링
  return children;
};

export default AuthRequired;