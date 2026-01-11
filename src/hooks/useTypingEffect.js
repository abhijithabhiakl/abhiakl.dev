import { useState, useEffect } from 'react';

const textArray = [
    "Hardware Developer",
    "Network Technician",
    "Maker & Tinkerer",
    "DIY Hobbyist"
];

const typingSpeed = 100;
const deletingSpeed = 50;
const pauseTime = 2000;

export const useTypingEffect = () => {
    const [text, setText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [loopNum, setLoopNum] = useState(0);

    useEffect(() => {
        let timer;
        const i = loopNum % textArray.length;
        const fullText = textArray[i];

        if (isDeleting) {
            if (text === '') {
                setIsDeleting(false);
                setLoopNum(prev => prev + 1);
            } else {
                timer = setTimeout(() => {
                    setText(fullText.substring(0, text.length - 1));
                }, deletingSpeed);
            }
        } else {
            if (text === fullText) {
                timer = setTimeout(() => setIsDeleting(true), pauseTime);
            } else {
                timer = setTimeout(() => {
                    setText(fullText.substring(0, text.length + 1));
                }, typingSpeed);
            }
        }

        return () => clearTimeout(timer);
    }, [text, isDeleting, loopNum]);

    return text;
};
