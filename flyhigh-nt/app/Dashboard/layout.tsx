'use client';

import React from "react";
import SidebarDashboard from "@/components/SidebarDashboard/SidebarDashboard";
import { useProfile } from "@/hooks/Profile/useProfile";
import "./DashboardLayout.css";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useProfile();

    if (isLoading) {
        return <div className="dashboard-loading-screen">Načítání...</div>;
    }

    return (
        <div className="dashboard-layout-container">
            <SidebarDashboard user={user} />
            <main className="dashboard-main-content">
                {children}
            </main>
        </div>
    );
}