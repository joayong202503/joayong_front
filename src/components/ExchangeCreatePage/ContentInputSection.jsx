import styles from './ContentInputSection.module.scss';
import TextAreaInput from '../common/TextAreaInput';
import { forwardRef } from 'react';

const ContentInputSection = forwardRef((props, ref) => {
    return (
        <div className={styles.contentInputSection}>
            <label htmlFor='content' className={styles.label}>내용</label>
            <TextAreaInput
                placeholder='가르칠 내용과 이 재능에 대한 경험을 설명해주세요'
                ref={ref}
                name='content'
                id='content'
            />
        </div>
    );
});

export default ContentInputSection;
