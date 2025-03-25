import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSelector } from 'react-redux';
import styles from './ProfileSettingPage.module.scss'
import ProfileCircle from "../components/common/ProfileCircle.jsx";
import { Camera } from "lucide-react"
import { fetchUserProfile, uploadProfileImage, updateUsername } from "../services/profileApi.js";
import Button from "../components/common/Button.jsx";
import { useNavigate } from 'react-router-dom';
import InputBox from "../components/common/InputBox.jsx";
import DropDownBasic from '../components/common/DropDownBasic';
import { getSortedTalentCategories } from "../utils/sortAndGetCategories.js";

const API_URL = 'http://localhost:8999';

const ProfileSettingPage = () => {
    const [profileData, setProfileData] = useState({});
    const [formData, setFormData] = useState({
        profileImage: null,
        name: '',
        teachingCategoryId: '',
        learningCategoryId: '',
    });
    const [previewImage, setPreviewImage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    // Redux에서 현재 사용자 정보 가져오기
    const currentUser = useSelector((state) => state.auth.user);
    const talentCategories = useSelector((state) => state.talentCategory.talentCategories);
    const sortedTalentCategories = useMemo(() => getSortedTalentCategories(talentCategories), [talentCategories]);

    // 카테고리 상태 관리
    const [categoryState, setCategoryState] = useState({
        teaching: {
            main: null,
            sub: null
        },
        learning: {
            main: null,
            sub: null
        }
    });

    // 카테고리 변경 핸들러
    const handleCategoryChange = (type, level) => (selectedItem) => {
        if (!selectedItem) return;

        if (level === 'main') {
            setCategoryState(prev => ({
                ...prev,
                [type]: {
                    main: selectedItem,
                    sub: null
                }
            }));
        } else if (level === 'sub') {
            setCategoryState(prev => ({
                ...prev,
                [type]: {
                    ...prev[type],
                    sub: selectedItem
                }
            }));

            // 폼 데이터 업데이트
            if (type === 'teaching') {
                setFormData(prev => ({
                    ...prev,
                    teachingCategoryId: selectedItem.id
                }));
            } else if (type === 'learning') {
                setFormData(prev => ({
                    ...prev,
                    learningCategoryId: selectedItem.id
                }));
            }
        }
    };

    // 카테고리 초기화
    const initializeCategories = (userData) => {
        if (!talentCategories.length) return;

        const findCategoryDetails = (categoryId) => {
            // categoryId가 없을 경우
            if (!categoryId) return { main: null, sub: null };

            for (const mainCat of talentCategories) {
                for (const subCat of mainCat.subTalentList || []) {
                    if (subCat.id === categoryId) {
                        return { main: mainCat, sub: subCat };
                    }
                }
            }
            return { main: null, sub: null };
        };

        const teachingDetails = findCategoryDetails(userData.talentGId);
        const learningDetails = findCategoryDetails(userData.talentTId);

        setCategoryState({
            teaching: teachingDetails,
            learning: learningDetails
        });

        // formData도 초기화
        setFormData(prev => ({
            ...prev,
            teachingCategoryId: userData.talentGId || '',
            learningCategoryId: userData.talentTId || ''
        }));

        console.log('카테고리 초기화됨:', teachingDetails, learningDetails);
    };

    // 프로필 정보 로드
    useEffect(() => {
        const loadProfile = async () => {
            if (!currentUser?.name) {
                setError('사용자 정보를 찾을 수 없습니다.');
                setIsLoading(false);
                return;
            }

            try {
                const userData = await fetchUserProfile(currentUser.name);
                console.log('받아온 사용자 데이터:', userData);

                // 프로필 이미지 URL 처리
                let profileImageUrl = userData.profileImageUrl;
                if (profileImageUrl && !profileImageUrl.startsWith('http')) {
                    profileImageUrl = `${API_URL}${profileImageUrl}`;
                }

                setProfileData({ ...userData, profileImageUrl });

                // 초기 폼 데이터 설정
                setFormData(prev => ({
                    ...prev,
                    name: userData.name || ''
                }));

                // 카테고리 초기화 - talentGId와 talentTId 사용
                if(talentCategories.length > 0) {
                    initializeCategories(userData);
                }

                setIsLoading(false);
            } catch (err) {
                console.error('프로필 정보 로드 실패:', err);
                setError('프로필 정보를 불러오는데 실패했습니다.');
                setIsLoading(false);
            }
        };

        loadProfile();
    }, [currentUser, talentCategories]);

    // 이미지 선택 버튼 클릭
    const handleImageButtonClick = () => {
        fileInputRef.current.click();
    };

    // 파일 선택 처리
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // 이미지 파일 검증
        if (!file.type.match('image.*')) {
            alert('이미지 파일만 업로드 가능합니다.');
            return;
        }

        // 파일 크기 제한 (5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('파일 크기는 5MB 이하여야 합니다.');
            return;
        }

        // 폼 데이터 업데이트
        setFormData(prev => ({
            ...prev,
            profileImage: file
        }));

        // 미리보기 생성
        const reader = new FileReader();
        reader.onload = (e) => setPreviewImage(e.target.result);
        reader.readAsDataURL(file);
    };

    // 입력 필드 변경 처리
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // 프로필 정보 저장
    const handleSubmit = async () => {
        // 변경 사항이 있는지 확인
        const hasImageChange = !!formData.profileImage;
        const hasNameChange = formData.name && formData.name !== profileData.name;
        const hasCategoryChange =
            formData.teachingCategoryId !== profileData.teachingCategoryId ||
            formData.learningCategoryId !== profileData.learningCategoryId;

        if (!hasImageChange && !hasNameChange && !hasCategoryChange) {
            alert('변경할 내용이 없습니다.');
            return;
        }

        try {
            setIsSaving(true);

            // 프로필 이미지 업로드 (이미지가 변경된 경우)
            if (hasImageChange) {
                const imageResult = await uploadProfileImage(formData.profileImage);
                console.log('프로필 이미지 업로드 성공:', imageResult);
            }

            // 사용자 이름 업데이트 (이름이 변경된 경우)
            if (hasNameChange) {
                const nameResult = await updateUsername(formData.name);
                console.log('사용자 이름 업데이트 성공:', nameResult);
            }

            // 카테고리 업데이트 (카테고리가 변경된 경우)
            if (hasCategoryChange && (formData.teachingCategoryId || formData.learningCategoryId)) {
                try {
                    console.log('카테고리 업데이트 요청:', formData.teachingCategoryId, formData.learningCategoryId);

                    const requestData = {
                        "talent-g-id": formData.teachingCategoryId || 0,
                        "talent-t-id": formData.learningCategoryId || 0
                    };

                    console.log('API 요청 데이터:', requestData);

                    const response = await fetch(`${API_URL}/api/joayong/user/update/talent`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
                        },
                        body: JSON.stringify(requestData)
                    });

                    if (!response.ok) {
                        const errorText = await response.text();
                        console.error('서버 응답 에러:', response.status, errorText);
                        throw new Error(`재능 카테고리 업데이트 실패: ${response.status} - ${errorText}`);
                    }

                    const categoryResult = await response.json();
                    console.log('카테고리 업데이트 성공:', categoryResult);
                } catch (err) {
                    console.error('카테고리 업데이트 실패:', err);
                    throw err;
                }
            }

            // 성공 메시지 표시
            alert('프로필 정보가 성공적으로 저장되었습니다.');

            window.location.reload();
        } catch (error) {
            console.error('프로필 정보 업데이트 실패:', error);
            alert('프로필 정보 업데이트에 실패했습니다. 다시 시도해주세요.');
            setIsSaving(false);
        }
    };

    // 사용자가 취소할 때 실행되는 함수
    const handleCancel = () => {
        navigate(-1); // 이전 페이지로 이동
    };

    if (isLoading) return <div className={styles.loadingState}>로딩 중...</div>;
    if (error) return <div className={styles.errorState}>{error}</div>;

    return (
        <div className={styles.bodyContainer}>
            <div className={styles.fullContainer}>
                <div className={styles.titleContainer}>
                    <h1>Edit Profile</h1>
                </div>
                <div className={styles.profileContainer}>
                    {/* 프로필 이미지 */}
                    <ProfileCircle
                        size="llg"
                        src={previewImage || profileData.profileImageUrl}
                    />
                    <div className={styles.editPhotoContainer}>
                        {/* 파일 입력 */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        {/* 카메라 아이콘 버튼 */}
                        <button
                            className={styles.editInput}
                            onClick={handleImageButtonClick}
                        >
                            <Camera />
                        </button>
                    </div>
                </div>
                <div className={styles.bottomContainer}>
                    <div className={styles.inputContainer}>
                        <label>Username</label>
                        <InputBox
                            theme="gray"
                            width={'100%'}
                            value={formData.name}
                            name="name"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className={styles.inputContainer}>
                        <label>가르칠 카테고리</label>
                        <div className={styles.dropdownContainer}>
                            <DropDownBasic
                                options={sortedTalentCategories}
                                defaultOption={categoryState.teaching.main}
                                onChange={handleCategoryChange('teaching', 'main')}
                                selectedOption={categoryState.teaching.main}
                                width={150}
                                placeholder={'대분류'}
                            />
                            <DropDownBasic
                                options={categoryState.teaching.main?.subTalentList || []}
                                defaultOption={categoryState.teaching.sub}
                                onChange={handleCategoryChange('teaching', 'sub')}
                                selectedOption={categoryState.teaching.sub}
                                width={150}
                                placeholder={'소분류'}
                                disabled={!categoryState.teaching.main}
                            />
                        </div>
                    </div>
                    <div className={styles.inputContainer}>
                        <label>배우고 싶은 카테고리</label>
                        <div className={styles.dropdownContainer}>
                            <DropDownBasic
                                options={sortedTalentCategories}
                                defaultOption={categoryState.learning.main}
                                onChange={handleCategoryChange('learning', 'main')}
                                selectedOption={categoryState.learning.main}
                                width={150}
                                placeholder={'대분류'}
                            />
                            <DropDownBasic
                                options={categoryState.learning.main?.subTalentList || []}
                                defaultOption={categoryState.learning.sub}
                                onChange={handleCategoryChange('learning', 'sub')}
                                selectedOption={categoryState.learning.sub}
                                width={150}
                                placeholder={'소분류'}
                                disabled={!categoryState.learning.main}
                            />
                        </div>
                    </div>

                    <div className={styles.buttonContainer}>
                        <Button
                            onClick={handleSubmit}
                            theme="blackTheme"
                            disabled={isSaving}
                        >
                            {isSaving ? '저장 중...' : '수정하기'}
                        </Button>
                        <Button
                            onClick={handleCancel}
                            theme="grayTheme"
                            disabled={isSaving}
                        >
                            취소
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettingPage;