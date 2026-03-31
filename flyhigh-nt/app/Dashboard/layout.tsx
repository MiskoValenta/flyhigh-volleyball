'use client';

import React from 'react';
import SidebarDashboard from '@/components/SidebarDashboard/SidebarDashboard';
import { useProfile } from '@/hooks/Profile/useProfile';
import './DashboardLayout.css';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useProfile();

    if (isLoading) {
        return <div className="LayoutLoading">Načítání aplikace...</div>;
    }

    return (
        <div className="LayoutContainer">
            <SidebarDashboard user={user} />
            <main className="MainContent">
                {children}
            </main>
        </div>
    );
}