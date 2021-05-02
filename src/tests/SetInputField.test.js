import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act, Simulate } from 'react-dom/test-utils';

import SetInputField from '../components/SetInputField';
import timeFormat from '../util/timeFormat';

let container = null;

beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
});

afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
});

const component = <SetInputField
    defaultValue={90}
    formatFunction={timeFormat}
></SetInputField>;

describe('SetInputField component', () => {
    it('starts as display only', () => {
        act(() => {
            render(component, container);
        });
        const $input = container.querySelector('input');
    
        expect($input).toBeFalsy();
    });

    it('enables edit when focused', () => {
        act(() => {
            render(component, container);
        });
        const $label = container.querySelector('label');
        Simulate.focus($label);
        const $input = container.querySelector('input');
    
        expect($input).toBeTruthy();
    });

    it('disables edit when focused', () => {
        act(() => {
            render(component, container);
        });
        const $label = container.querySelector('label');
        Simulate.blur($label);
        const $input = container.querySelector('input');
    
        expect($input).toBeFalsy();
    });

    it('applies format function properly', () => {
        act(() => {
            render(component, container);
        });
        const $value = container.querySelector('.value');
        expect($value.textContent).toBe('1:30');
    });
});
