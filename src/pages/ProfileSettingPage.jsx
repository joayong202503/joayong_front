import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import styles from './ProfileSettingPage.module.scss'
import ProfileCircle from "../components/common/ProfileCircle.jsx";
import { Camera } from "lucide-react"
import { fetchUserProfile, uploadProfileImage } from "../services/profileApi.js";
import Button from "../components/common/Button.jsx";
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:8999';

const ProfileSettingPage = () => {
    const [profileData, setProfileData] = useState({});
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    // Redux에서 현재 사용자 정보 가져오기
    const currentUser = useSelector((state) => state.auth.user);

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

                // 프로필 이미지 URL 처리
                let profileImageUrl = userData.profileImageUrl;
                if (profileImageUrl && !profileImageUrl.startsWith('http')) {
                    profileImageUrl = `${API_URL}${profileImageUrl}`;
                }

                setProfileData({ ...userData, profileImageUrl });
                setIsLoading(false);
            } catch (err) {
                console.error('프로필 정보 로드 실패:', err);
                setError('프로필 정보를 불러오는데 실패했습니다.');
                setIsLoading(false);
            }
        };

        loadProfile();
    }, [currentUser]);

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

        setSelectedFile(file);

        // 미리보기 생성
        const reader = new FileReader();
        reader.onload = (e) => setPreviewImage(e.target.result);
        reader.readAsDataURL(file);
    };

    // 프로필 이미지 저장
    const handleSubmit = async () => {
        if (!selectedFile) {
            alert('프로필 이미지를 먼저 선택해주세요.');
            return;
        }

        try {
            setIsSaving(true);
            const result = await uploadProfileImage(selectedFile);
            console.log('프로필 이미지 업로드 성공:', result);

            // 성공 메시지 표시
            alert('프로필 이미지가 성공적으로 저장되었습니다.');

            window.location.reload();

        } catch (error) {
            console.error('프로필 이미지 업로드 실패:', error);
            alert('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
            setIsSaving(false);
        }
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
                    <div className={styles.buttonContainer}>
                        <Button
                            onClick={handleSubmit}
                            theme="blackTheme"
                            disabled={isSaving || !selectedFile}
                        >
                            {isSaving ? '저장 중...' : '이미지 저장하기'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettingPage;