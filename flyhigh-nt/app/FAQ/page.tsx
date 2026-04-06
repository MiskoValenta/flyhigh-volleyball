'use client';

import React, { useState } from "react";
import { IoChevronDownOutline } from "react-icons/io5";
import "./FAQ.css";

const faqData = [
    {
        question: "Co je to FlyHigh Volleyball?",
        answer: "FlyHigh Volleyball je moderní webová platforma navržená speciálně pro volejbalové týmy. Umožňuje snadnou správu hráčů, plánování tréninků, organizaci zápasů a podrobný zápis herních statistik na jednom místě."
    },
    {
        question: "Je používání aplikace placené?",
        answer: "Ne, aplikace je v současné době zcela zdarma. Tento systém vznikl primárně jako můj maturitní projekt s cílem usnadnit organizaci amatérským a poloprofesionálním týmům, které často bojují s nepřehlednou komunikací."
    },
    {
        question: "Pro koho je platforma určena?",
        answer: "Aplikace je ideální pro hráče, trenéry, kapitány, školní týmy i amatérské kluby. Může ji využívat jakákoliv skupina lidí, která se pravidelně schází k volejbalu a chce mít ve věcech pořádek."
    },
    {
        question: "Kdo za vývojem tohoto projektu stojí?",
        answer: "Celý systém, tedy od návrhu databáze přes backend v C# .NET až po tento frontend v Next.js, je dílem jednoho vývojáře (studenta) v rámci tvorby komplexní maturitní práce."
    },
    {
        question: "Jak jsou má data chráněna?",
        answer: "Bezpečnost bereme vážně. Hesla jsou šifrována pomocí algoritmu BCrypt, přihlašování probíhá přes zabezpečené JWT tokeny a přístup k interním datům týmu mají pouze jeho schválení členové."
    }
];

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="section-container">
            <main className="faq-main">
                <section className="faq-hero">
                    <h1 className="faq-title">Často kladené dotazy</h1>
                    <p className="faq-subtitle">
                        Odpovědi na nejběžnější otázky ohledně fungování a účelu platformy FlyHigh.
                    </p>
                </section>

                <div className="faq-container glass-card-dark">
                    <div className="faq-accordion">
                        {faqData.map((faq, index) => {
                            const isOpen = openIndex === index;

                            return (
                                <div
                                    key={index}
                                    className={`faq-item glass-card-dark ${isOpen ? 'open' : ''}`}
                                >
                                    <button
                                        className="faq-question"
                                        onClick={() => toggleFAQ(index)}
                                        aria-expanded={isOpen}
                                    >
                                        <span>{faq.question}</span>
                                        <IoChevronDownOutline className="faq-icon" />
                                    </button>

                                    <div className="faq-answer-wrapper">
                                        <p className="faq-answer-text">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>
        </div>
    );
}