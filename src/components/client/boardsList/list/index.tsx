'use client';

import Image from 'next/image';
import useBoardsList from './hook';
import styles from './styles.module.css';
import { getDate } from '@/commons/units/date';

export default function BoardsListUI() {
    const { data, loading, error, handleOnClick, handleOnClickDelete } =
        useBoardsList();

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error : {error.message}</p>;

    const boardData = data?.fetchBoards ?? [];

    return (
        <>
            <div className={styles.layout}>
                <div className={styles.Body}>
                    <div className={styles.listBox}>
                        <header className={styles.header}>
                            <span className={styles.headerItem}>번호</span>
                            <span className={styles.headerItem}>제목</span>
                            <span className={styles.headerItem}>작성자</span>
                            <span className={styles.headerItem}>날짜</span>
                            <span className={styles.headerItem}>삭제</span>
                        </header>
                        {boardData.length > 0 ? (
                            boardData.map((el) => (
                                <div
                                    key={el._id}
                                    className={styles.wrapper}
                                    onClick={() => handleOnClick(el._id)}
                                >
                                    <span className={styles.listItem}>
                                        {el._id}
                                    </span>
                                    <span className={styles.listItem}>
                                        {el.title}
                                    </span>
                                    <span className={styles.listItem}>
                                        {el.writer}
                                    </span>
                                    <span className={styles.listItem}>
                                        {getDate(el.createdAt)}
                                    </span>

                                    <span>
                                        <button
                                            id={el._id}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleOnClickDelete(e);
                                            }}
                                        >
                                            <Image
                                                src="/images/deleteIcon.png"
                                                alt="delete"
                                                className={styles.deleteBtn}
                                                width={14}
                                                height={14}
                                            />
                                        </button>
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p>게시물이 없어요</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
