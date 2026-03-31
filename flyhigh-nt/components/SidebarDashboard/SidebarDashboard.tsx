'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { logoutUser } from '@/lib/api';
import { UserProfile, SidebarProps } from '@/types/user';
import Logo from '@/public/ballin.svg';
import { IoHomeOutline, IoPeopleOutline, IoCalendarOutline, IoPersonOutline, IoLogOutOutline, IoMenu } from 'react-icons/io5';
import './SidebarDashboard.css';


export default function SidebarDashboard({ user }: SidebarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await logoutUser();
            router.push('/');
        } catch (error) {

        }
    };

    const isActive = (path: string) => pathname === path ? 'active' : '';
    const closeMobile = () => setIsMobileOpen(false);

    return (
        <>
            <div className="mobile-sidebar-toggle">
                <div className="mobile-logo-container">
                    <Image src={Logo} alt="Logo" className="mobile-logo-icon dark:invert dark:hue-rotate-180" />
                    <span className="mobile-logo-text">Fly High</span>
                </div>
                <button className="mobile-toggle-btn" onClick={() => setIsMobileOpen(true)}>
                    <IoMenu className="mobile-toggle-icon" />
                </button>
            </div>

            {isMobileOpen && (
                <div className="sidebar-overlay" onClick={closeMobile}></div>
            )}

            <aside className={`sidebar-dashboard ${isMobileOpen ? 'open' : ''}`}>
                <div className="sidebar-dashboard-logo">
                    <Link href="/Dashboard" className="logo-link" onClick={closeMobile}>
                        <Image src={Logo} alt="Logo" className="sidebar-logo-icon dark:invert dark:hue-rotate-180" />
                        <span className="sidebar-logo-text">Fly High</span>
                    </Link>
                </div>

                <nav className="sidebar-dashboard-nav">
                    <Link href="/Dashboard" className={isActive('/Dashboard')} onClick={closeMobile}>
                        <IoHomeOutline className="sidebar-icon" />
                        Nástěnka
                    </Link>
                    <Link href="/Dashboard/Teams" className={isActive('/Dashboard/Teams')} onClick={closeMobile}>
                        <IoPeopleOutline className="sidebar-icon" />
                        Moje Týmy
                    </Link>
                    <Link href="/Dashboard/Matches" className={isActive('/Dashboard/Matches')} onClick={closeMobile}>
                        <IoCalendarOutline className="sidebar-icon" />
                        Zápasy
                    </Link>
                    <Link href="/Dashboard/Profile" className={isActive('/Dashboard/Profile')} onClick={closeMobile}>
                        <IoPersonOutline className="sidebar-icon" />
                        Profil
                    </Link>
                </nav>

                <div className="sidebar-dashboard-footer">
                    <button onClick={handleLogout} className="logout-btn">
                        <IoLogOutOutline className="sidebar-icon" />
                        Odhlásit se
                    </button>
                </div>
            </aside>
        </>
    );
}