import { useState } from 'react';

export function useVisibility({initialState = false}) {
    const [isVisible, setIsVisible] = useState(initialState);

    const show = () => setIsVisible(true);
    const hide = () => setIsVisible(false);
    const toggle = () => setIsVisible(prev => !prev);

    return {isVisible, show, hide, toggle};
}