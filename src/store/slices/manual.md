## 재능 카테고리 불러오기
### 1. !! 주의사항 : category 데이터의 경우, useIntializeTalentCategoryData() 훅을 통해서 데이터를 fetch 해와야 합니다.
  > // state.talenTCategory.talentCategories 이렇게 해야 리스트를 반환합니다.<br>
  > // FYI. state.talentCategory까지만 가져오면 {talentCategories(실제 리스트), status(fetch 됐는지 여부 등) 등 다른 정보도 포함된 객체를 반환합니다.}<br>
  > useSelector((state) => state.talentCategory.talentCategories); <br>
  > // 필수로 아래 hook까지 호출해줘야, fetch된 데이터 가져옴<br>
  > useInitializeTalentCategoryData();<br>
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
- redux에서 initialState를 비동기인 fetch로 가져온 값을 설정할 경우,
  fetch가 되기 전에 initialState가 설정되어 데이터를 가져오지 못할 수 있는 문제가 발생합니다.
  하여 커스텀 훅인 useInitializeRegionCategoryData를 통해 먼저 fetch를 하여, state 값을 업데이트 해주어야 합니다.
- 그럼에도 불구하고 그냥 loader를 쓰지 않고 redux를 쓰는 이유는, 응답에 따른 처리까지 redux로 효율적으로 관리 가능하기 때문입니다.
### 2.slices > testPages에 예시 파일 있습니다.
