import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import ExerciseSetDisplay from "../components/ExerciseSetDisplay";

let container = null;

beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    jest.useFakeTimers();
});

afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
});

const component = <ExerciseSetDisplay
    targetReps={10}
    targetWeight={5}
    targetRest={3750}
    />;

it('renders initial defaults', () => {
    act(() => {
        render(component, container);
    });
    const $reps = container.querySelector('.reps');
    const $weight = container.querySelector('.weight');
    const $rest = container.querySelector('.rest');

    expect($reps.value).toBe('10');
    expect($weight.value).toBe('5');
    expect($rest.textContent).toBe('1:02:30');
});

it ('activates on focus', () => {
    act(() => {
        render(component, container);
        const $set = container.querySelector('.set');
        $set.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    console.log(container.innerHTML);
    const $duration = container.querySelector('.duration');
    expect($duration.textContent).toBe('0');

    act(() => {
        jest.advanceTimersByTime(100);
    });
    expect($duration.textContent).toBe('1:40');
})