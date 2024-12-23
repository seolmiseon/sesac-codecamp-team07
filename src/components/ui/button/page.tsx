'use client';

import { MouseEvent, FC } from 'react';
import { IButtonProps } from '@/app/types/IButtonProps';
import styles from '@/components/boardsWrite/styles.module.css';

const Button: FC<IButtonProps> = ({
    onSubmit,
    onReset,
    style,
    isDisabled,
    isEdit,
}): JSX.Element => {
    const submitBtn = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (onSubmit) onSubmit();
    };

    const resetBtn = (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (onReset) onReset();
    };

    return (
        <>
            <div className={styles.formButton}>
                <button
                    type="submit"
                    className={styles.submitBtn}
                    onClick={submitBtn}
                    style={style}
                    disabled={isDisabled}
                >
                    {isEdit ? '수정하기' : '등록하기'}
                </button>

                <button
                    type="reset"
                    className={styles.resetBtn}
                    onClick={resetBtn}
                >
                    취소
                </button>
            </div>
        </>
    );
};

export default Button;
