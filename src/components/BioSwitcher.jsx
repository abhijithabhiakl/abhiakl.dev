import React, { useState } from 'react';
import { motion } from 'framer-motion';

const colors = ["#24d05a", "#e4094b", "#10a2f5", "#e9bc3f"];

export default function BioSwitcher({ activeTab, setActiveTab }) {
    const [activeColor, setActiveColor] = useState('#e4094b'); // Default pink
    const tabs = ['Short', 'Long', 'Projects', 'Blog'];

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
        const color = colors[Math.floor(Math.random() * colors.length)];
        setActiveColor(color);
    };

    return (
        <div className="toggler" role="tablist" aria-label="Bio Switcher">
            {tabs.map(tab => {
                const tabId = tab.toLowerCase();
                const isActive = activeTab === tabId;
                return (
                    <button
                        key={tabId}
                        id={tabId}
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => handleTabClick(tabId)}
                        style={{
                            position: 'relative',
                            padding: '5px 15px',
                            background: 'transparent',
                            border: 'none',
                            color: isActive ? activeColor : 'inherit',
                            fontWeight: isActive ? 'bold' : 'normal',
                            cursor: 'pointer',
                            outline: 'none',
                            transition: 'color 0.3s'
                        }}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="active-pill"
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    borderRadius: '15px',
                                    border: `2px solid ${activeColor}`,
                                    zIndex: -1
                                }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                        {tab}
                    </button>
                );
            })}
        </div>
    );
}
