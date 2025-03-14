// redux에서 initialState를 fetch로 설정할 수 없음
//  -> 1) createAsyncThunk 를 만들고, 그 안에서 fetch을 호출하면
//  -> 2) 해당 함수의 결과 값에 따라 extrareducers가 실행되어 redux의 값이 변경될 수 있께 해야 함
//  -> 3) 이 때, createAsyncThunk 함수는 자동 실행되는 것이 아니라, 수기로 호출해줘야 함
//  -> 이 hook은, createAsyncThunk로 정의된 함수를 호출하는 훅입니다.
import {useDispatch, useSelector} from "react-redux";
import {fetchRegionCategoryData} from "../../store/slices/regionCategorySlice.js";
import {useCallback, useEffect} from "react";

const useInitializeRegionCategoryRedux = () => {

    const dispatch = useDispatch();

    // fetch가 완료된 상태인지 확인하는 값
    const initialized = useSelector((state) => state.regionCategory.initialized);

    const loadRegionCategoryData = useCallback(async () => {
        if (!initialized) {
            await dispatch(fetchRegionCategoryData());
        }
    }, [dispatch, initialized]);

    useEffect(() => {
        loadRegionCategoryData();
    }, [loadRegionCategoryData]);

    return loadRegionCategoryData;
};

export default useInitializeRegionCategoryRedux;