import React, { useEffect, useState } from 'react';
import { useTypingEffect } from '../hooks/useTypingEffect';

export default function Header() {
    const text = useTypingEffect();
    const [photoNum, setPhotoNum] = useState(1);

    useEffect(() => {
        const interval = setInterval(() => {
            setPhotoNum(prev => (prev % 2) + 1); // 2 photos
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    return (
        <header className="header-section">
            <div className="header-frame">
                <h1>Abhijith Sunil</h1>
                <h2>
                    <span id="dynamic-text">{text}</span><span className="cursor">|</span> from<br />Kerala, India.
                </h2>
            </div>
            <div className="img-frame">
                <img id="propic" src={`/img/face${photoNum}.jpg`} alt="Abhijith Sunil's profile picture" />
            </div>
        </header>
    );
}
