import React, {useEffect, useRef} from 'react';
import { Trash } from 'lucide-react';
import styles from './FileListDisplay.module.scss'; // 스타일이 동일하다면 같은 경로로 설정

const FileListDisplay = ({ uploadedFiles, onDelete }) => {

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
                                {/*// lucide react 라이브러리 아이콘 사용*/}
                                {/*<Trash*/}
                                {/*    onClick={() => handleDelete(index)}*/}
                                {/*    className={styles.deleteIcon}*/}
                                {/*/>*/}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
};

export default FileListDisplay;
