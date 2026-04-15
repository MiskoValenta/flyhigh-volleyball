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
        <>
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
                <div className="BottomGrid">

                    <div className="InfoBarCard">
                        <h3>Pro koho je určena</h3>
                        <div className="TargetAudienceGrid">
                            <div className="TargetCard">
                                <IoPersonOutline className="TargetIcon" />
                                <span>Hráči</span>
                            </div>
                            <div className="TargetCard">
                                <IoClipboardOutline className="TargetIcon" />
                                <span>Trenéři</span>
                            </div>
                            <div className="TargetCard">
                                <IoSchoolOutline className="TargetIcon" />
                                <span>Školní týmy</span>
                            </div>
                            <div className="TargetCard">
                                <IoTrophyOutline className="TargetIcon" />
                                <span>Kluby</span>
                            </div>
                        </div>
                    </div>

                    <div className="InfoBarCard">
                        <h3>Technologie v pozadí</h3>
                        <div className="TechStackList">
                            <div className="TechItem">
                                <div className="TechIconWrapper">
                                    <IoCodeSlashOutline />
                                </div>
                                <div className="TechText">
                                    <span className="TechLabel">Frontend</span>
                                    <span className="TechValue">Next.js & React</span>
                                </div>
                            </div>
                            <div className="TechItem">
                                <div className="TechIconWrapper">
                                    <IoConstructOutline />
                                </div>
                                <div className="TechText">
                                    <span className="TechLabel">Backend</span>
                                    <span className="TechValue">C# / .NET</span>
                                </div>
                            </div>
                            <div className="TechItem">
                                <div className="TechIconWrapper">
                                    <IoServerOutline />
                                </div>
                                <div className="TechText">
                                    <span className="TechLabel">Databáze</span>
                                    <span className="TechValue">PostgreSQL</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}