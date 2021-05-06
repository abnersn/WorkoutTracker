import serializeWorkout from '../util/serializeWorkout';

export function eraseWorkout(id) {
    const { localStorage } = window;

    if (!localStorage) {
        return;
    }
    const logKey = `${(new Date()).toISOString().split('T')[0]}_${id}`;
    localStorage.removeItem(logKey);
}

export function saveWorkout(id) {
    const { localStorage } = window;

    if (!localStorage) {
        return;
    }
    const logKey = `${(new Date()).toISOString().split('T')[0]}_${id}`;

    const json = serializeWorkout(id);

    localStorage.setItem(logKey, json);
}