import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act, Simulate } from 'react-dom/test-utils';

import SetDisplay from '../components/SetDisplay';

let container = null;

beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    jest.useFakeTimers();
});

afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
    jest.useRealTimers();
});

describe('SetDisplay component', () => {
    describe('Idle stage', () => {
        const component = <SetDisplay
            defaultRestTime={90}
            defaultReps={8}
            defaultWeight={10}
            stage = 'IDLE'
        ></SetDisplay>;

        it('displays timers correctly', () => {
            act(() => {
                render(component, container);
            });
            const $time = container.querySelector('.time');
            const $rest = container.querySelector('.rest');

            expect($time.querySelector('.value').textContent).toBe('0');
            expect($rest.querySelector('.value').textContent).toBe('1:30');
        });

        it('toggles edition for each input field', () => {
            act(() => {
                render(component, container);
            });
            const $labels = container.querySelectorAll('label');
            for (const $label of $labels) {
                Simulate.focus($label);
                expect($label.querySelector('input')).toBeTruthy();
            }
            for (const $label of $labels) {
                Simulate.blur($label);
                expect($label.querySelector('input')).toBeFalsy();
            }
        });

        it('does not update timers', () => {
            act(() => {
                render(component, container);
            });
            const $time = container.querySelector('.time');
            const $rest = container.querySelector('.rest');

            act(() => {
                jest.advanceTimersByTime(100000);
            });

            expect($time.querySelector('.value').textContent).toBe('0');
            expect($rest.querySelector('.value').textContent).toBe('1:30');
        });
    });
    describe('Active stage', () => {
        const component = <SetDisplay
            defaultRestTime={90}
            defaultReps={8}
            defaultWeight={10}
            stage = 'ACTIVE'
        ></SetDisplay>;

        it('increments duration timer', () => {
            act(() => {
                render(component, container);
            });
            const $value = container.querySelector('.time .value');

            expect($value.textContent).toBe('0');

            act(() => {
                jest.advanceTimersByTime(100000);
            });

            expect($value.textContent).toBe('1:40');
        });

        it('only increments duration timer if not editing', () => {
            act(() => {
                render(component, container);
            });
            const $value = container.querySelector('.time .value');

            expect($value.textContent).toBe('0');
            Simulate.focus($value.parentNode);

            act(() => {
                jest.advanceTimersByTime(100000);
            });

            expect($value.textContent).toBe('0');
        });

        it('does not change rest timer', () => {
            act(() => {
                render(component, container);
            });
            const $value = container.querySelector('.rest .value');

            act(() => {
                jest.advanceTimersByTime(100000);
            })

            expect($value.textContent).toBe('1:30');
        });
    });
    describe('Resting stage', () => {
        const component = <SetDisplay
            defaultRestTime={90}
            defaultReps={8}
            defaultWeight={10}
            stage = 'RESTING'
        ></SetDisplay>;

        it('decrements rest timer', () => {
            act(() => {
                render(component, container);
            });
            const $value = container.querySelector('.rest .value');

            expect($value.textContent).toBe('1:30');

            act(() => {
                jest.advanceTimersByTime(90000);
            });

            expect($value.textContent).toBe('0');
        });

        it('continues rest timer after end', () => {
            act(() => {
                render(component, container);
            });
            const $value = container.querySelector('.rest .value');

            expect($value.textContent).toBe('1:30');

            act(() => {
                jest.advanceTimersByTime(100000);
            });

            expect($value.textContent).toBe('-10');
        });

        it('only increments rest timer if not editing', () => {
            act(() => {
                render(component, container);
            });
            const $value = container.querySelector('.rest .value');

            expect($value.textContent).toBe('1:30');
            Simulate.focus($value.parentNode);

            act(() => {
                jest.advanceTimersByTime(100000);
            });

            expect($value.textContent).toBe('1:30');
        });

        it('does not change duration timer', () => {
            act(() => {
                render(component, container);
            });
            const $value = container.querySelector('.time .value');

            act(() => {
                jest.advanceTimersByTime(100000);
            })

            expect($value.textContent).toBe('0');
        });
    });
});
