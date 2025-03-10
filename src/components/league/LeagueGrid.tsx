'use client';

import { useState, useEffect } from 'react';
import { LeagueCard } from './LeagueCard';
import { FootballDataApi } from '@/lib/client/api/football-data';
import type { Competition } from '@/types/api/responses';
import { KLeagueCards } from './KLeagueCard';

export function LeagueGrid() {
    const [competitions, setCompetitions] = useState<Competition[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadCompetitions = async () => {
            try {
                const footballApi = new FootballDataApi();
                const result = await footballApi.getCompetitions();

                if (!result.success) {
                    setError(result.error);
                    return;
                }

                console.log(
                    'API leagues:',
                    result.data.map((comp) => comp.code)
                );
                const majorLeagues = result.data.filter(
                    (comp: Competition) =>
                        comp.type === 'LEAGUE' &&
                        ['PL', 'BL1', 'SA', 'PD', 'FL1', 'ELC'].includes(
                            comp.code
                        )
                );

                setCompetitions(majorLeagues);
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : 'Failed to load competitions'
                );
            } finally {
                setLoading(false);
            }
        };
        loadCompetitions();
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[...Array(8)].map((_, index) => (
                    <div
                        key={index}
                        className="bg-gray-100 animate-pulse rounded-lg h-48"
                    />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-600 py-8">
                <p>{error}</p>
                {/* 선택적으로 재시도 버튼 추가 */}
            </div>
        );
    }
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 auto-rows-fr">
            {competitions.map((competition) => (
                <LeagueCard key={competition.id} competition={competition} />
            ))}
            <KLeagueCards />
        </div>
    );
}
