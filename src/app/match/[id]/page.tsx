'use client';

import { Error, Loading } from '@/components/ui/common';
import { FootballDataApi } from '@/lib/client/api/football-data';
import { MatchResponse } from '@/types/api/responses';
import Image from 'next/image';
import * as Tabs from '@radix-ui/react-tabs';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './styles.module.css';
import { getPlaceholderImageUrl } from '@/utils/imageUtils';
import {
    LineupDisplay,
    LiveMatches,
    MatchStatistics,
    PositionTable,
    ScoreDisplay,
    TeamDisplay,
} from '@/components/match';
import { MatchVideo } from '@/components/match/detail/MatchVideo';

export default function MatchDetailPage() {
    const params = useParams<{ id: string }>();
    const [match, setMatch] = useState<MatchResponse | undefined>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const api = new FootballDataApi();
                const matchResult = await api.getMatch(params.id);

                if (matchResult.success) {
                    setMatch(matchResult.data);
                }
            } catch (error) {
                setError(`Failed to load: ${error}`);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [params.id]);

    if (loading) return <Loading />;
    if (error) return <Error message={error} />;
    if (!match) return null;

    return (
        <div className={styles.container}>
            {/* 라이브 매치 캐러셀 */}
            <LiveMatches />
            {/* 리그 정보 헤더 */}
            <div className={styles.header}>
                <Image
                    src={
                        match.competition.emblem ||
                        getPlaceholderImageUrl('badge')
                    }
                    alt={match.competition.name || '대회 엠블럼'}
                    width={40}
                    height={40}
                />
                <h1 className={styles.headerTitle}>{match.competition.name}</h1>
                {match.status === 'IN_PLAY' && (
                    <span className={styles.liveBadge}>Live</span>
                )}
            </div>

            <div className={styles.mainContent}>
                {/* 메인 스코어보드 섹션 */}
                <div className={styles.scoreboardSection}>
                    <div className={styles.scoreboardCard}>
                        <div className={styles.matchInfo}>
                            {/* 홈팀 */}
                            <TeamDisplay team={match.homeTeam} align="right" />

                            {/* 스코어 */}
                            <ScoreDisplay
                                score={match.score}
                                status={match.status}
                            />

                            {/* 원정팀 */}
                            <TeamDisplay team={match.awayTeam} align="left" />
                        </div>
                    </div>

                    <div className={styles.videoSection}>
                        <MatchVideo
                            homeTeam={match.homeTeam.name}
                            awayTeam={match.awayTeam.name}
                            utcDate={match.utcDate}
                        />
                    </div>
                </div>

                {/* 우측 통계 탭 */}
                <div className={styles.statsSection}>
                    <Tabs.Root
                        defaultValue="details"
                        className={styles.tabsRoot}
                    >
                        <Tabs.List className={styles.tabsList}>
                            <Tabs.TabsTrigger
                                value="details"
                                className={styles.tabsTrigger}
                            >
                                Match Detail
                            </Tabs.TabsTrigger>
                            <Tabs.TabsTrigger
                                value="lineup"
                                className={styles.tabsTrigger}
                            >
                                Line up
                            </Tabs.TabsTrigger>
                            <Tabs.TabsTrigger
                                value="stats"
                                className={styles.tabsTrigger}
                            >
                                Statistics
                            </Tabs.TabsTrigger>
                            <Tabs.TabsTrigger
                                value="position"
                                className={styles.tabsTrigger}
                            >
                                Position table
                            </Tabs.TabsTrigger>
                        </Tabs.List>

                        <Tabs.Content
                            value="lineup"
                            className={styles.tabsContent}
                        >
                            {match.lineup && (
                                <LineupDisplay
                                    matchId={match.id}
                                    status={match.status}
                                    kickoff={match.utcDate}
                                    homeTeam={match.lineup.homeTeam}
                                    awayTeam={match.lineup.awayTeam}
                                />
                            )}
                        </Tabs.Content>

                        <Tabs.Content
                            value="stats"
                            className={styles.tabsContent}
                        >
                            {match.statistics && (
                                <MatchStatistics
                                    statistics={match.statistics}
                                    homeTeamName={match.homeTeam.name}
                                    awayTeamName={match.awayTeam.name}
                                />
                            )}
                        </Tabs.Content>

                        <Tabs.Content
                            value="position"
                            className={styles.tabsContent}
                        >
                            <PositionTable
                                standings={[]}
                                highlightTeamId={match.homeTeam.id}
                            />
                        </Tabs.Content>
                    </Tabs.Root>
                </div>
            </div>
        </div>
    );
}
