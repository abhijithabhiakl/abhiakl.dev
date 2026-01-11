import React, { useState } from 'react';

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
                        className={isActive ? 'show' : ''}
                        aria-selected={isActive}
                        onClick={() => handleTabClick(tabId)}
                        style={isActive ? { borderColor: activeColor, color: activeColor, fontWeight: 'bold' } : {}}
                    >
                        {tab}
                    </button>
                );
            })}
        </div>
    );
}
