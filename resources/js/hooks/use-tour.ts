import { driver  } from 'driver.js';
import type {DriveStep} from 'driver.js';
import { useEffect, useRef } from 'react';
import 'driver.js/dist/driver.css';

interface UseTourOptions {
    tourKey: string;
    steps: DriveStep[];
    delay?: number;
}

export function useTour({ tourKey, steps, delay = 500 }: UseTourOptions) {
    const driverRef = useRef<ReturnType<typeof driver> | null>(null);

    useEffect(() => {
        const hasSeenTour = localStorage.getItem(tourKey);

        if (hasSeenTour || steps.length === 0) {
return;
}

        const driverObj = driver({
            showProgress: true,
            animate: true,
            nextBtnText: 'Lanjut →',
            prevBtnText: '← Kembali',
            doneBtnText: 'Selesai',
            progressText: '{{current}} dari {{total}}',
            allowClose: true,
            overlayColor: 'rgba(0, 0, 0, 0.5)',
            steps,
            onDestroyStarted: () => {
                localStorage.setItem(tourKey, 'true');
                driverObj.destroy();
            },
        });

        driverRef.current = driverObj;

        const timeout = setTimeout(() => {
            const firstStep = steps[0];

            if (firstStep?.element) {
                const el = document.querySelector(firstStep.element as string);

                if (el) {
driverObj.drive();
}
            } else {
                driverObj.drive();
            }
        }, delay);

        return () => {
            clearTimeout(timeout);

            if (driverRef.current) {
                driverRef.current.destroy();
                driverRef.current = null;
            }
        };
    }, [tourKey, steps, delay]);
}
