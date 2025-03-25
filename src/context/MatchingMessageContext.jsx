
// 1. 위치 정보를 비동기적으로 가져오는 로더 함수
import {createContext} from "react";

const getMatchingMessagesWithStatus = async () => {
    // 브라우저에서 위치 파악 지원하지 않으면 메시지 반환
    if (!navigator.geolocation) {
        return {
            latitude: null,
            longitude: null,
            message: '브라우저에서 위치 정보 파악을 지원하지 않습니다.',
            loading: false,
        };
    }

    // 브라우저에서 위치 파악 지원하면 위치 정보를 비동기적으로 받아옴
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
};

// 매칭 요청 메시지를 상세페이지+관리 페이지에서 함께 관리(상세페이지에서 수락/거절하면 관리페이지에도 반영되도록 함)

// 1. Context 생성 및 초기 상태 정의
const initialContext = {
    messageList: [], // 메시지 목록
    dispatch: () => {}, //
}
const MatchingMessagesContext = createContext({

});

// 2. 초기 상태 정의

// 3. LocationProvider 컴포넌트 (상태 관리 및 로딩)
const LocationProvider = ({ children }) => {
    // 위치 정보 상태
    const [location, setLocation] = useState({
        latitude: null,
        longitude: null,
        message: null,
        loading: true,
    });

    useEffect(() => {
        // 위치 정보 로딩 함수
        const loadLocation = async () => {
            try {
                const position = await getUserLocationLoader();

                // 위치 파악이 불가한 경우
                if (position.latitude === null || position.longitude === null) {
                    setLocation({
                        latitude: null,
                        longitude: null,
                        message: '위치 정보를 파악할 수 없습니다.',
                        loading: false,
                    });
                } else {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        message: '유저 위치 파악 완료',
                        loading: false,
                    });
                }
            } catch (error) {
                // 에러 발생 시
                setLocation({
                    latitude: null,
                    longitude: null,
                    message: '위치 정보 파악에 실패했습니다.',
                    loading: false,
                });
            }
        };

        loadLocation(); // 비동기 함수 호출

    }, []); // 컴포넌트가 처음 렌더링될 때 한 번만 실행

    return (
        <LocationContext.Provider value={location}>
            {children}
        </LocationContext.Provider>
    );
};

// 위치 정보를 사용할 수 있는 커스텀 훅
const useLocation = () => {
    return useContext(LocationContext);
};

export { LocationProvider, useLocation };
