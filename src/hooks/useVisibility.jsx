import { useState } from 'react';

export function useVisibility({initialState = false}) {
    const [state, setState] = useState(initialState);

    const show = () => setState(true);
    const hide = () => setState(false);
    const toggle = () => setState(prev => !prev);

    return {state, show, hide, toggle};
}