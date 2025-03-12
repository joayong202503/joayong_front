// 초기 데이터는 fetch를 통해 가져와야 하므로,
// 처음에 무조건 한 번 fetch를 해 줘야 함
// 이 파일은 fetch를 하고 redux에 저장하는 것을 저장해 놓은 hook입니다.
import {useDispatch, useSelector} from "react-redux";
import {fetchRegionCategoryData} from "./regionCategorySlice.js";
import {useEffect} from "react";

const useInitializeRegionCategoryData = () => {

    const dispatch = useDispatch();

    // fetch가 완료된 상태인지 확인하는 값
    const initialized = useSelector((state) => state.regionCategory.initialized);

    const loadRegionCategoryData = () => {
        if (!initialized) {
            dispatch(fetchRegionCategoryData());
        }
    };

    useEffect(() => {
        loadRegionCategoryData();
    }, [dispatch, initialized]);
};

export default useInitializeRegionCategoryData;