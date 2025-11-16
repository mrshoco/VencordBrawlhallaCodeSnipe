/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { copyToClipboard } from "@utils/clipboard";
import { ModalCloseButton, ModalContent, ModalHeader, ModalRoot, ModalSize } from "@utils/modal";
import { React, useState } from "@webpack/common";

interface CodesModalProps {
    CodesCollection: Record<string, string[]>;
    onClose: () => void;
    transitionState: any;
}

export default function CodesModal({ CodesCollection, ...modalProps }: CodesModalProps) {
    const { transitionState, onClose } = modalProps;

    const [codes, setCodes] = useState<Record<string, string[]>>(CodesCollection);
    const keys = Object.keys(codes);

    const [selectedType, setSelectedType] = useState<string | null>(keys[0] ?? null);

    injectVcScrollbarCSS();
    const scrollClass = "vc-scroll";

    function handleCodeClick(type: string, code: string) {
        copyToClipboard(code);

        setCodes(prev => ({
            ...prev,
            [type]: prev[type].filter(c => c !== code)
        }));
    }

    return (
        <ModalRoot transitionState={transitionState} size={ModalSize.LARGE}>
            <ModalHeader>
                <div style={{ color: "#ffffff" }}>
                    Alerts
                    <ModalCloseButton onClick={onClose} />
                </div>
            </ModalHeader>

            <ModalContent
                style={{
                    display: "flex",
                    flex: 1,
                    padding: 0,
                    minHeight: 0,
                    overflow: "hidden",
                }}
            >
                {/* LEFT: Code Types */}
                <div
                    className={scrollClass}
                    style={{
                        width: "30%",
                        borderRight: "1px solid var(--background-tertiary)",
                        overflowY: "auto",
                        paddingRight: "8px",
                        color: "#fff",
                    }}
                >
                    {keys.map(type => {
                        const isSelected = selectedType === type;

                        return (
                            <div
                                key={type}
                                onClick={() => setSelectedType(type)}
                                style={{
                                    padding: "6px",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    background: isSelected
                                        ? "var(--background-modifier-selected)"
                                        : "transparent",
                                    marginBottom: "2px",
                                }}
                            >
                                <div style={{ fontWeight: 500 }}>{type}</div>
                            </div>
                        );
                    })}
                </div>

                {/* RIGHT: Codes */}
                <div
                    className={scrollClass}
                    style={{
                        flex: 1,
                        padding: "0 8px",
                        overflowY: "auto",
                        color: "#fff",
                    }}
                >
                    {selectedType === null && (
                        <div style={{ opacity: 0.6 }}>Select code type</div>
                    )}

                    {selectedType !== null &&
                        codes[selectedType]?.map(code => (
                            <div
                                key={code}
                                onClick={() => handleCodeClick(selectedType, code)}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    padding: "6px",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    marginBottom: "4px",
                                    background: "var(--background-secondary)",
                                }}
                            >
                                <div style={{ fontWeight: 500 }}>{code}</div>
                            </div>
                        ))}
                </div>
            </ModalContent>
        </ModalRoot>
    );
}

const vcScrollbarCSS = `
            /* Container class used as fallback */
            .vc-scroll {
                overflow-y: auto;
}

            /* Webkit (Chromium) scrollbars */
            .vc-scroll::-webkit-scrollbar {
                width: 10px;
            height: 10px;
}
            .vc-scroll::-webkit-scrollbar-track {
                background: rgba(0,0,0,0); /* keep transparent track to match Discord */
}
            .vc-scroll::-webkit-scrollbar-thumb {
                background: linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.04));
            border-radius: 10px;
            border: 2px solid transparent;
            background-clip: padding-box;
}
            .vc-scroll::-webkit-scrollbar-thumb:hover {
                background: linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.06));
}

            /* Make sure text color is correct inside */
            .vc-scroll {color: var(--text-normal); }
            `;


// scroller
function injectVcScrollbarCSS() {
    if (document.getElementById("vc-scroll-styles")) return;
    const s = document.createElement("style");
    s.id = "vc-scroll-styles";
    s.textContent = vcScrollbarCSS;
    document.head.appendChild(s);
}
