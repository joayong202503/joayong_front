// Redux Provider + AppContent를 제공하는 파일

import './styles/global.scss';
import AppContent from "./AppContent.jsx";
import {Provider} from "react-redux";
import { store } from "./store/index.js";
import ReduxFetcher from "./components/common/ReduxFetcher.jsx";

const App = () => {

    return (
        <>
            {/* Redux */}
            <Provider store={store}>
                 {/* 자동 로그인이나 새로고침을 대비하여, app.jsx 처음 렌더링 시 /me를 fetch하고 redux에 결과값을 저장하는 함수 */}
                 <ReduxFetcher>
                      <AppContent />
                 </ReduxFetcher>
             </Provider>
        </>
    );
}

export default App