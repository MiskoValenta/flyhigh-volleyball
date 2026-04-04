"use client";

import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import "./LoginModal.css";
import { useLogin } from "../../hooks/Auth/useLogin";
import { useRegister } from "../../hooks/Auth/useRegister";
import { useForgotPassword } from "../../hooks/Auth/useForgotPassword";

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type ModalView = "login" | "register" | "forgot_password";

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const [view, setView] = useState<ModalView>("login");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const { login, isLoading: isLoginLoading, error: loginError, setError: setLoginError } = useLogin();
    const { register, isLoading: isRegisterLoading, error: registerError, setError: setRegisterError } = useRegister();
    const { requestPasswordReset, isLoading: isForgotLoading, error: forgotError, setError: setForgotError, isSuccess: forgotSuccess } = useForgotPassword();

    if (!isOpen) return null;

    const isLoading = isLoginLoading || isRegisterLoading || isForgotLoading;

    const handleSwitchView = (newView: ModalView) => {
        setLoginError(null);
        setRegisterError(null);
        setForgotError(null);
        setView(newView);
    };

    const handleClose = () => {
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setFirstName("");
        setLastName("");
        setView("login");
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (view === "login") {
            const success = await login({ email, password });
            if (success) handleClose();
        }
        else if (view === "register") {
            const success = await register({ firstName, lastName, email, password, confirmPassword });
            if (success) handleClose();
        }
        else if (view === "forgot_password") {
            await requestPasswordReset({ email });
        }
    };

    const activeError = view === "login" ? loginError : view === "register" ? registerError : forgotError;

    return (
        <div className="login-overlay">
            <div className="login-modal glass-card-dark">
                <button className="login-close-btn" onClick={handleClose} disabled={isLoading}>
                    <IoClose size={24} />
                </button>

                <h2 className="login-title">
                    {view === "login" && "Vítejte zpět"}
                    {view === "register" && "Vytvořit účet"}
                    {view === "forgot_password" && "Obnova hesla"}
                </h2>

                {activeError && (
                    <div className="login-error-container">
                        <span className="login-error-text">{activeError}</span>
                    </div>
                )}

                {view === "forgot_password" && forgotSuccess && (
                    <div className="login-success-container">
                        Instrukce byly odeslány na váš e-mail.
                    </div>
                )}

                <form className="login-form" onSubmit={handleSubmit}>
                    {view === "register" && (
                        <div className="login-input-row">
                            <div className="login-input-group">
                                <label>Jméno</label>
                                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required disabled={isLoading} />
                            </div>
                            <div className="login-input-group">
                                <label>Příjmení</label>
                                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required disabled={isLoading} />
                            </div>
                        </div>
                    )}

                    <div className="login-input-group">
                        <label>E-mail</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} />
                    </div>

                    {view !== "forgot_password" && (
                        <>
                            <div className="login-input-group">
                                <label>Heslo</label>
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} />
                            </div>
                            {view === "register" && (
                                <div className="login-input-group">
                                    <label>Potvrdit heslo</label>
                                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required disabled={isLoading} />
                                </div>
                            )}
                        </>
                    )}

                    <button type="submit" className="login-submit-btn" disabled={isLoading}>
                        {isLoading ? "Pracuji..." : (view === "login" ? "Přihlásit se" : view === "register" ? "Zaregistrovat se" : "Odeslat")}
                    </button>
                </form>

                <div className="login-footer-links">
                    {view === "login" && (
                        <>
                            <button type="button" className="login-text-btn" onClick={() => handleSwitchView("forgot_password")}>Zapomenuté heslo?</button>
                            <button type="button" className="login-text-btn" onClick={() => handleSwitchView("register")}>Ještě nemáte účet? Registrace</button>
                        </>
                    )}
                    {view !== "login" && (
                        <button type="button" className="login-text-btn" onClick={() => handleSwitchView("login")}>Zpět na přihlášení</button>
                    )}
                </div>
            </div>
        </div>
    );
}