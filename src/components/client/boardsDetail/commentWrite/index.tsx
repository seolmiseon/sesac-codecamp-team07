'use client';

import Image from 'next/image';
import styles from './styles.module.css';
import Button from '@/components/button/page';
import useCommentWrite from './hook';
import BoardRatingUI from '@/components/rating';

export default function CommentWriteUI() {
    const {
        commentInput,
        handleSubmit,
        handleCommentInputChange,
        resetForm,
        errorAlert,
        isActive,
    } = useCommentWrite();

    return (
        <>
            <div className={styles.layoutBox}>
                <div className={styles.boxWrapper}>
                    <div className={styles.commentHeader}>
                        <Image
                            src="/images/chat.png"
                            alt="댓글창"
                            width={24}
                            height={24}
                        />
                        <span>댓글</span>
                    </div>
                    <BoardRatingUI />

                    <div className={styles.inputWrapper}>
                        <div>
                            <input
                                className={styles.inputArea}
                                placeholder="작성자"
                                onChange={handleCommentInputChange}
                                value={commentInput.writer}
                                autoComplete="writer"
                            />
                        </div>
                        <div>
                            <input
                                className={styles.inputArea}
                                type="password"
                                placeholder="비밀번호"
                                onChange={handleCommentInputChange}
                                value={commentInput.password}
                                autoComplete="current-password"
                            />
                        </div>
                    </div>
                    <div className={styles.contentsWrapper}>
                        <textarea
                            className={styles.contents}
                            maxLength={100}
                            onChange={handleCommentInputChange}
                            value={commentInput.contents}
                            placeholder="댓글을 입력해주세요"
                        />
                        {errorAlert && (
                            <p className={styles.errorAlert}>{errorAlert}</p>
                        )}
                        <Button
                            onSubmit={handleSubmit}
                            isDisabled={!isActive}
                            isEdit={false}
                            showResetButton={false}
                            onReset={resetForm}
                            style={{
                                backgroundColor: isActive
                                    ? '#2974E5'
                                    : '#CCCCCC',
                            }}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
