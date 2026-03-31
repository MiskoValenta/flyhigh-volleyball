"use client";

import React from "react";
import "@/app/globals.css";
import "./Features.css";

import {
    IoPeopleOutline,
    IoClipboardOutline,
    IoCalendarOutline,
    IoCloudDoneOutline,
    IoSchoolOutline,
    IoPersonOutline,
    IoCodeSlashOutline,
    IoServerOutline,
    IoConstructOutline,
    IoCheckmarkDoneOutline,
    IoTrophyOutline
} from "react-icons/io5";

export default function Features() {
    return (
        <main>
            <div className="section-container">
                <div className="FeaturesWrapper">

                    <div className="FeaturesHeroCard">
                        <h1 className="FeaturesTitle">Co aplikace doopravdy umí</h1>
                        <p className="FeaturesSubtitle">
                            Přehled nástrojů pro hráče, trenéry a týmy bez zbytečné složitosti.<br />
                            Jasná organizace, žádný chaos.
                        </p>
                    </div>

                    <div className="FeaturesGrid">

                        <div className="FeatureCard">
                            <div className="FeatureIconBox">
                                <IoPeopleOutline />
                            </div>
                            <div className="FeatureContent">
                                <h3>Správa týmu</h3>
                                <p>
                                    Efektivní správa soupisky. Jasně definované role pro hráče či trenéry a jednoduchý systém pozvánek.
                                </p>
                            </div>
                        </div>

                        <div className="FeatureCard">
                            <div className="FeatureIconBox">
                                <IoClipboardOutline />
                            </div>
                            <div className="FeatureContent">
                                <h3>Záznamy zápasů</h3>
                                <p>
                                    Udržujte detailní přehled o zápasech. Zapisujte výsledky jednotlivých setů, spravujte soupisku a evidujte pozice.
                                </p>
                            </div>
                        </div>

                        <div className="FeatureCard">
                            <div className="FeatureIconBox">
                                <IoCalendarOutline />
                            </div>
                            <div className="FeatureContent">
                                <h3>Plánování událostí</h3>
                                <p>
                                    Kompletní přehled tréninků, zápasů a oznámení. Každý člen týmu hned vidí, kdy a kde se hraje.
                                </p>
                            </div>
                        </div>

                        <div className="FeatureCard">
                            <div className="FeatureIconBox">
                                <IoCheckmarkDoneOutline />
                            </div>
                            <div className="FeatureContent">
                                <h3>Sledování účasti</h3>
                                <p>
                                    Hráči mohou jednoduše potvrdit nebo odmítnout svou účast na událostech. Trenér tak vždy ví, s kým může počítat.
                                </p>
                            </div>
                        </div>

                        <div className="FeatureCard SpanFull">
                            <div className="FeatureIconBox">
                                <IoCloudDoneOutline />
                            </div>
                            <div className="FeatureContent">
                                <h3>Přístup odkudkoliv</h3>
                                <p>
                                    Vaše data jsou v bezpečí a okamžitě synchronizovaná. Naplánujte trénink na počítači a výsledek zápasu zapište na telefonu.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <div className="section-container">
                <div className="FeaturesWrapper">

                    <div className="BottomGrid">

                        <div className="InfoBarCard">
                            <h3>Pro koho je určena</h3>
                            <div className="InfoListVertical">
                                <div className="InfoItem">
                                    <IoPersonOutline className="InfoIcon" /> <span>Hráči</span>
                                </div>
                                <div className="InfoItem">
                                    <IoClipboardOutline className="InfoIcon" /> <span>Trenéři</span>
                                </div>
                                <div className="InfoItem">
                                    <IoSchoolOutline className="InfoIcon" /> <span>Školní týmy</span>
                                </div>
                                <div className="InfoItem">
                                    <IoTrophyOutline className="InfoIcon" /> <span>Amatérské kluby</span>
                                </div>
                            </div>
                        </div>

                        <div className="InfoBarCard">
                            <h3>Technologie v pozadí</h3>
                            <div className="InfoListVertical">
                                <div className="InfoItem">
                                    <IoCodeSlashOutline className="InfoIcon" />
                                    <span>Frontend: <strong>Next.js & React</strong></span>
                                </div>
                                <div className="InfoItem">
                                    <IoConstructOutline className="InfoIcon" />
                                    <span>Backend: <strong>C# / .NET</strong></span>
                                </div>
                                <div className="InfoItem">
                                    <IoServerOutline className="InfoIcon" />
                                    <span>Databáze: <strong>PostgreSQL</strong></span>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </main>
    );
}