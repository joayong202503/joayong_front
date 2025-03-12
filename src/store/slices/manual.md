## 재능 카테고리 불러오기
### 1. !! 주의사항 : category 데이터의 경우, useIntializeTalentCategoryData() 훅을 통해서 데이터를 fetch 해와야 합니다.
> // state.talenTCategory.talentCategories 이렇게 해야 리스트를 반환합니다.<br>
> // FYI. state.talentCategory까지만 가져오면 {talentCategories(실제 리스트), status(fetch 됐는지 여부 등) 등 다른 정보도 포함된 객체를 반환합니다.}<br>
> useSelector((state) => state.talentCategory.talentCategories); <br>
> // 필수로 아래 hook까지 호출해줘야, fetch된 데이터 가져옴<br>
> useInitializeTalentCategoryData();<br>
> <br>
> 값 수정 <br>
> const dispatch = useDispatch();  <br>
> dispatch(talentCategoryAction.setCategory('변경된 값'));  <br>
- redux에서 initialState를 비동기인 fetch로 가져온 값을 설정할 경우,
  fetch가 되기 전에 initialState가 설정되어 데이터를 가져오지 못할 수 있는 문제가 발생합니다.
  하여 커스텀 훅인 useInitializeTalentCategoryData를 통해 먼저 fetch를 하여, state 값을 업데이트 해주어야 합니다.
- 그럼에도 불구하고 그냥 loader를 쓰지 않고 redux를 쓰는 이유는, 응답에 따른 처리까지 redux로 효율적으로 관리 가능하기 때문입니다.
### 2.slices > testPages에 예시 파일 있습니다.

## 지역 카테고리 불러오기
### 1. !! 주의사항 : category 데이터의 경우, useIntializeRegionCategoryData() 훅을 통해서 데이터를 fetch 해와야 합니다.
> // state.regionCategory.regionCategories 이렇게 해야 리스트를 반환합니다.<br>
> // FYI. state.regionCategory까지만 가져오면 {regionCategories(실제 리스트), status(fetch 됐는지 여부 등) 등 다른 정보도 포함된 객체를 반환합니다.}<br>
>  useSelector((state) => state.regionCategory.regionCategories); <br>
> // 필수로 아래 hook까지 호출해줘야, fetch된 데이터 가져옴<br>
> useInitializeRegionCategoryData();<br>
> <br>
> 값 수정 <br>
> const dispatch = useDispatch();  <br>
> dispatch(categoryCategoryAction.setCategory('변경된 값'));  <br>
- redux에서 initialState를 비동기인 fetch로 가져온 값을 설정할 경우,
  fetch가 되기 전에 initialState가 설정되어 데이터를 가져오지 못할 수 있는 문제가 발생합니다.
  하여 커스텀 훅인 useInitializeRegionCategoryData를 통해 먼저 fetch를 하여, state 값을 업데이트 해주어야 합니다.
- 그럼에도 불구하고 그냥 loader를 쓰지 않고 redux를 쓰는 이유는, 응답에 따른 처리까지 redux로 효율적으로 관리 가능하기 때문입니다.
### 2.slices > testPages에 예시 파일 있습니다.


## 3. 로그인 사용자 정보 가져오기
>    // 로그인인 된 사용자 정보를 가져오는 함수. 로그인 되지 않았으면 null 반환<br>
>    const userInfo = useSelector((state) => state.auth.user); <br>
>    <br>
>   <p style="color: red"> !! 로그인 시에는, 반드시 아래 함수를 호출하여 redux에서 유저의 정보를 업데이트 해줘야 합니다. (+localstorage에 token 저장)</p><br>
>   const disPatch = useDispatch();<br>
>   dispatch(authActions.login(/login api로 해서 반환된 값));<br>
>   await dispatch(fetchMe()); // api중 /me를 호출한 후, 반환된 값을 redux에 저장하는 함수<br>
> <br>
>    <p style="color: red"> !! 로그인 후에는, 반드시 아래 함수를 호출하여 redux에서 유저 정보를 없애줘야 합니다. (+localstorage에 토큰 삭제)</p><br>
> <br>
> dispatch(authActions.logout());<br>
>
>    <p style="color: red"> !! api /me에서 관리하는 값을 변경한 후에는,반드시 await dispatch(fetchMe()) 를 통해서 redux에서도 값을 수정해주어야 합니다.</p><br>
>   await dispatch(fetchMe());<br>