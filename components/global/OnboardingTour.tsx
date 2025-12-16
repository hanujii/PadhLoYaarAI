'use client';

import { useEffect } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

export function OnboardingTour() {
    useEffect(() => {
        const hasSeenTour = localStorage.getItem('hasSeenTour');

        if (!hasSeenTour) {
            const driverObj = driver({
                showProgress: true,
                steps: [
                    { element: 'header', popover: { title: 'Welcome to Padh Lo Yaar AI', description: 'Your ultimate AI study companion. Let&apos;s take a quick tour!' } },
                    { element: '#topic-typer', popover: { title: 'Topic Scroller', description: 'Get inspired by thousands of study topics here.' } },
                    { element: '#tools-grid', popover: { title: 'AI Tools', description: 'Access powerful tools like Tutor, Code Transformer, and Teacher Chat.' } },
                    { element: '#notes-widget', popover: { title: 'Quick Notes', description: 'Jot down thoughts instantly without leaving the app.' } },
                ],
                onDestroyStarted: () => {
                    localStorage.setItem('hasSeenTour', 'true');
                    driverObj.destroy();
                },
            });

            // Small delay to ensure render
            setTimeout(() => {
                driverObj.drive();
            }, 1500);
        }
    }, []);

    return null; // Logic only component
}
