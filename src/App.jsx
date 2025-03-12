// Redux Provider + AppContent를 제공하는 파일

import './styles/global.module.scss';
import AppContent from "./AppContent.jsx";
import {Provider} from "react-redux";

const App = () => {

    return (
        <>
            {/*<Provider store={store}>*/}
                <AppContent />
            {/*</Provider>*/}
        </>
    );
}

export default App