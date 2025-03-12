// Redux Provider + AppContent를 제공하는 파일

import './styles/global.module.scss';
import AppContent from "./AppContent.jsx";
import {Provider} from "react-redux";
import { store } from "./store/index.js";

const App = () => {

    return (
        <>
            {/* Redux */}
            <Provider store={store}>
                <AppContent />
            </Provider>
        </>
    );
}

export default App