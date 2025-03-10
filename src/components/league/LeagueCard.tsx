'use client';

import Link from 'next/link';
import styles from './LeagueCard.module.css';
import Image from 'next/image';
import type { Competition } from '@/types/api/responses';
import { getPlaceholderImageUrl } from '@/utils/imageUtils';

interface LeagueCardProps {
    competition: Competition;
}

export function LeagueCard({ competition }: LeagueCardProps) {
    return (
        <Link href={`/league/${competition.id}`} className={styles.card}>
            <div className={styles.logoContainer}>
                {competition.emblem ? (
                    <Image
                        src={competition.emblem}
                        alt={`${competition.name} emblem`}
                        width={96}
                        height={96}
                        className={styles.logo}
                        onError={(e) => {
                            e.currentTarget.src =
                                getPlaceholderImageUrl('league');
                        }}
                    />
                ) : (
                    <div
                        className={`w-28 h-28 bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg flex items-center justify-center`}
                    >
                        <span className="text-2xl font-bold text-white">
                            {competition.name.slice(0, 2)}
                        </span>
                    </div>
                )}
            </div>
            <h3 className={styles.leagueName}>{competition.name}</h3>
            <p className={styles.countryName}>{competition.area.name}</p>
        </Link>
    );
}
