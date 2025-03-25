import React from 'react';
import styles from './Spinner.module.scss';
import classNames from 'classnames';

const Spinner = ({ size = 'medium' }) => {
    return (
        <div 
            className={classNames(styles.spinner, styles[size])} 
            role="status"
            aria-label="loading"
        >
            <span>●</span>
        </div>
    );
};

export default Spinner;