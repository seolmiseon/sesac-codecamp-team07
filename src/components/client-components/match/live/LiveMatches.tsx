'use client';

import { Card } from '@/components/ui/common/card';
import { Loading, Error, Empty } from '@/components/ui/common';
import { useLiveMatches } from '@/hooks/useLiveMatches';
import { MatchCarousel } from '../carousel/MatchCarousel';

export function LiveMatches() {
    const { matches, loading, error, refetch } = useLiveMatches();

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, index) => (
                    <div
                        key={index}
                        className="bg-gray-100 animate-pulse rounded-lg h-32"
                    />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <Error message={error} retry={refetch} className="text-center" />
        );
    }

    if (!matches.length) {
        return <Empty message="No live matches at the moment" />;
    }

    return <MatchCarousel matches={matches} visibleMatches={3} />;
}
