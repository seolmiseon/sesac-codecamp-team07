import Image from 'next/image';
import styles from './HomeBanner.module.css';

export const HomeBanner = () => {
    return (
        <div
            className={`${styles.bannerContainer} relative h-96 overflow-hidden`}
        >
            <Image
                src="/images/stadium.png"
                alt="Stadium background"
                fill
                priority
                className={styles.bannerImage}
            />
            <div className={`${styles.overlay} absolute inset-0`} />
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
                <h1 className="text-5xl font-bold">Full of Soccer Fun</h1>
                <p className="text-xl mt-4">Your Gateway to Football Joy</p>
            </div>
        </div>
    );
};
