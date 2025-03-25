import React from 'react';
import { Trash } from 'lucide-react';
import styles from './FileListDisplay.module.scss'; // 스타일이 동일하다면 같은 경로로 설정

const FileListDisplay = ({ uploadedFiles, setUploadedFile }) => {

    const handleFileDelete = (index) => {
        setUploadedFile((prevFiles) => {
            return prevFiles.filter((_, i) => i !== index);
        });
    };


    return (
        <>
            {/* 첨부된 파일이 있을 때만 띄움*/}
            {uploadedFiles && (
                <div className={styles.fileNamesList}>
                    <h3>첨부 파일 목록:</h3>
                    <ul>
                        {uploadedFiles.map((file, index) => (
                            <li key={index} className={styles.fileItem}>
                                {file.name}
                                <Trash
                                    onClick={() => handleFileDelete(index)}
                                    className={styles.deleteIcon}
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
};

export default FileListDisplay;
