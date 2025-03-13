## 재능 카테고리 불러오기
#### 원리
#### 1. App을 감싸는 ReduxFetcher 컴포너트에서 초기 값 fetch
#### 2. 값 가져오기 : useSelector(state => state.talentCategory.talentCategories)
#### 3. 값 수정 : dispatch(talentCategoryAction.setCategory('변경된 값'))
###  4.slices > testPages에 예시 파일 있습니다.
> // state.talentCategory.talentCategories 이렇게 해야 리스트를 반환합니다.<br>
> // FYI. state.talentCategory까지만 가져오면 {talentCategories(실제 리스트), status(fetch 됐는지 여부 등) 등 다른 정보도 포함된 객체를 반환합니다.}<br>
> useSelector((state) => state.talentCategory.talentCategories); <br>
> <br>
> 값 수정 <br>
> const dispatch = useDispatch();  <br>
> dispatch(talentCategoryAction.setCategory('변경된 값'));  <br>

## 지역 카테고리 불러오기
> // state.regionCategory.regionCategories 이렇게 해야 리스트를 반환합니다.<br>
> // FYI. state.regionCategory까지만 가져오면 {regionCategories(실제 리스트), status(fetch 됐는지 여부 등) 등 다른 정보도 포함된 객체를 반환합니다.}<br>
>  useSelector((state) => state.regionCategory.regionCategories); <br>
> <br>
> 값 수정 <br>
> const dispatch = useDispatch();  <br>
> dispatch(categoryCategoryAction.setCategory('변경된 값'));  <br>
#### - slices > testPages에 예시 파일 있습니다.


## 3. 로그인 사용자 정보 가져오기
>    // 로그인인 된 사용자 정보를 가져오는 함수. 로그인 되지 않았으면 null 반환<br>
>    const userInfo = useSelector((state) => state.auth.user); <br>
>    <br>
>   <p style="color: red"> !! 로그인 시에는, 반드시 아래 함수를 호출하여 redux에서 유저의 정보를 업데이트 해줘야 합니다.</p>
>   const disPatch = useDispatch();<br>
>   await dispatch(fetchMe()); // api중 /me를 호출한 후, 반환된 값을 redux에 저장하는 함수<br>
> <br>
>    <p style="color: red"> !! 로그인 후에는, 반드시 아래 함수를 호출하여 redux에서 유저 정보를 없애줘야 합니다.</p>
> dispatch(authActions.deleteUserInfo());<br>
>
>    <p style="color: red"> !! api /me에서 관리하는 값을 변경한 후에는,반드시 await dispatch(fetchMe()) 를 통해서 redux에서도 값을 수정해주어야 합니다.</p><br>
>   await dispatch(fetchMe());<br>
>   <br>
>   <br>
>    <p style="color: red"> !! 자동 로그인이나 새로고침시에도 /me  정보를 가져올 수 있도록, App 컴포너트를 감싸두었습니다.</p><br>