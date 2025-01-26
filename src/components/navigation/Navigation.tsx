'use client';

import { Button } from '@/components/ui/button/Button';
import FSFLogo from '@/components/ui/logo/FSFLogo';
import { Search, Menu, X, User, LogOut, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useModalStore } from '@/store/useModalStore';
import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropDown/DropDownMenu';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navigation() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [imageError, setImageError] = useState(false);
    const { open } = useModalStore();
    const { user, loading } = useAuthStore();
    const pathname = usePathname();

    const getHref = (basePath: string) => {
        if (pathname?.startsWith(`/${basePath}/`)) {
            return pathname;
        }
        return `/${basePath}`;
    };

    const leagues = [
        { id: 'PL', name: 'Premier League' },
        { id: 'PD', name: 'La Liga' },
        { id: 'SA', name: 'Serie A' },
        { id: 'BL1', name: 'Bundesliga' },
        { id: 'FL1', name: 'Ligue 1' },
    ];

    const navLinks = [
        {
            href: getHref('match'),
            label: 'Match',
        },
        {
            href: '/stats',
            label: 'Stats',
        },
        {
            href: '/community',
            label: 'Community',
            onClick: (e: React.MouseEvent) => {
                if (!user) {
                    e.preventDefault();
                    open('signin', {
                        kind: 'auth',
                        mode: 'signin',
                    });
                }
            },
        },
    ];

    const renderAuthButtons = () => {
        if (loading) return null;

        //로그인 상태
        if (user) {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="relative rounded-full"
                            aria-label="사용자 메뉴"
                        >
                            {user.image && !imageError ? (
                                <Image
                                    src={user.image}
                                    alt={`${user.name || 'User'}'s profile`}
                                    fill
                                    className="rounded-full object-cover"
                                    sizes="32px"
                                    loading="eager"
                                    onError={() => setImageError(true)}
                                />
                            ) : (
                                <User className="w-5 h-5" aria-hidden="true" />
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuItem asChild>
                            <Link
                                href="/auth/profile"
                                className="flex items-center"
                            >
                                <User className="mr-2 h-4 w-4" />
                                프로필
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link
                                href="/my-teams"
                                className="flex items-center"
                            >
                                내 팀
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link
                                href="/settings"
                                className="flex items-center"
                            >
                                설정
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                                console.log('로그아웃 버튼 클릭');
                                console.log(
                                    '모달 상태:',
                                    useModalStore.getState()
                                );
                                open('logout', {
                                    kind: 'auth',
                                    mode: 'logout',
                                });
                                console.log(
                                    '클릭 후 모달 상태:',
                                    useModalStore.getState()
                                );
                            }}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            로그아웃
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        }

        //비로그인 상태
        return (
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                        open('signin', { kind: 'auth', mode: 'signin' })
                    }
                >
                    로그인
                </Button>
                <Button
                    variant="primary"
                    size="sm"
                    onClick={() =>
                        open('signup', { kind: 'auth', mode: 'signup' })
                    }
                >
                    회원가입
                </Button>
            </div>
        );
    };

    return (
        <header className="bg-white shadow-sm h-16">
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md">
                <div className="max-w-6xl mx-auto flex justify-between h-16 px-4">
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0">
                            <FSFLogo
                                width={100}
                                height={110}
                                className="hover:opacity-80 transition-opacity"
                            />
                        </Link>
                    </div>

                    <div className="hidden sm:flex sm:items-center sm:space-x-8">
                        <div className="flex items-center">
                            <Link
                                href={`/league/${leagues[0].id}`}
                                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                League
                            </Link>
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <ChevronDown className="h-4 w-4" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    {leagues.map((league) => (
                                        <DropdownMenuItem
                                            key={league.id}
                                            asChild
                                        >
                                            <Link href={`/league/${league.id}`}>
                                                {league.name}
                                            </Link>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        {navLinks.map(({ href, label, onClick }) => (
                            <Link
                                key={href}
                                href={href}
                                onClick={onClick}
                                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                {label}
                            </Link>
                        ))}
                    </div>

                    <div className="hidden sm:flex items-center gap-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search leagues..."
                                className="pl-10 pr-4 py-2 border rounded-lg"
                                onFocus={() =>
                                    open('search', {
                                        kind: 'search',
                                        query: '',
                                        page: 1,
                                    })
                                }
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                        <div className="flex items-center">
                            {renderAuthButtons()}
                        </div>
                    </div>

                    <div className="sm:hidden flex items-center">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                            aria-controls="mobile-menu"
                            aria-expanded={isMenuOpen}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMenuOpen ? (
                                <X
                                    className="block h-6 w-6"
                                    aria-hidden="true"
                                />
                            ) : (
                                <Menu
                                    className="block h-6 w-6"
                                    aria-hidden="true"
                                />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu (isMenuOpen 시) */}
                {isMenuOpen && (
                    <div className="sm:hidden" id="mobile-menu">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            <div className="flex items-center">
                                <Link
                                    href={`/league/${leagues[0].id}`}
                                    className="flex-1 px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    League
                                </Link>
                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <ChevronDown className="h-4 w-4" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        {leagues.map((league) => (
                                            <DropdownMenuItem
                                                key={league.id}
                                                asChild
                                            >
                                                <Link
                                                    href={`/league/${league.id}`}
                                                    onClick={() =>
                                                        setIsMenuOpen(false)
                                                    }
                                                >
                                                    {league.name}
                                                </Link>
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            {navLinks.map(({ href, label, onClick }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    onClick={(e) => {
                                        onClick?.(e);
                                        setIsMenuOpen(false);
                                    }}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                                >
                                    {label}
                                </Link>
                            ))}

                            {user ? (
                                <>
                                    <Link
                                        href="/auth/profile"
                                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        프로필
                                    </Link>
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => {
                                            open('logout', {
                                                kind: 'auth',
                                                mode: 'logout',
                                            });
                                            setIsMenuOpen(false);
                                        }}
                                        className="w-full mt-2"
                                    >
                                        로그아웃
                                    </Button>
                                </>
                            ) : (
                                <div className="mt-4 flex flex-col space-y-2 px-3">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            open('signin', {
                                                kind: 'auth',
                                                mode: 'signin',
                                            });
                                            setIsMenuOpen(false);
                                        }}
                                        className="w-full"
                                    >
                                        로그인
                                    </Button>
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => {
                                            open('signup', {
                                                kind: 'auth',
                                                mode: 'signup',
                                            });
                                            setIsMenuOpen(false);
                                        }}
                                        className="w-full"
                                    >
                                        회원가입
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}
