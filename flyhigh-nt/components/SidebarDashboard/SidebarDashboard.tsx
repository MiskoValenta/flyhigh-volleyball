'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { logoutUser } from '@/lib/api';
import { UserProfile } from '@/types/user';
import './SidebarDashboard.css';

interface SidebarProps {
    user: UserProfile | null;
}

export default function SidebarDashboard({ user }: SidebarProps) {
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = async () => {
        try {
            await logoutUser();
            router.push('/');
        } catch (error) {
            console.error("Nepodařilo se odhlásit:", error);
        }
    };

    const isActive = (path: string) => pathname === path ? 'active' : '';

    return (
        <aside className="SidebarContainer">
            <div className="SidebarProfile">
                <div className="ProfileAvatar">
                    {user?.firstName?.charAt(0) || ''}{user?.lastName?.charAt(0) || ''}
                </div>
                <div className="ProfileName">
                    {user ? `${user.firstName} ${user.lastName}` : 'Načítání...'}
                </div>
            </div>

            <nav className="SidebarNav">
                <Link href="/Dashboard" className={`NavLink ${isActive('/Dashboard')}`}>
                    Nástěnka
                </Link>
                <Link href="/Dashboard/Teams" className={`NavLink ${isActive('/Dashboard/Teams')}`}>
                    Moje Týmy
                </Link>
                <Link href="/Dashboard/Matches" className={`NavLink ${isActive('/Dashboard/Matches')}`}>
                    Zápasy
                </Link>
                <Link href="/Dashboard/Profile" className={`NavLink ${isActive('/Dashboard/Profile')}`}>
                    Profil
                </Link>
            </nav>

            <div className="SidebarFooter">
                <button onClick={handleLogout} className="LogoutButton">
                    Odhlásit se
                </button>
            </div>
        </aside>
    );
}