import React from 'react';

export default function DarkModeToggle({ darkMode, setDarkMode }) {
    return (
        <div className="dark-mode-toggler">
            <input
                type="checkbox"
                id="toggler"
                checked={!darkMode}
                onChange={(e) => setDarkMode(!e.target.checked)}
            />
            <label htmlFor="toggler" aria-label="Toggler for Dark Mode"></label>
        </div>
    );
}
