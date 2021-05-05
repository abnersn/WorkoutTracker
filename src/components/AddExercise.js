import { useState } from 'react';

export default function AddExercise(props) {
    const [ name, setName ] = useState('');
    const { dispatch } = props;

    const onAddExercise = (ev) => {
        ev.preventDefault();
        setName('');
        dispatch({
            type: 'ADD_EXERCISE',
            payload: { name }
        });
    };

    return (
        <form onSubmit={onAddExercise} className='m-3 pt-3 border-t border-indigo-200'>
            <div className='flex p-2 items-center bg-indigo-50 rounded-lg border border-indigo-200'>
                <input required value={name} onChange={ev => setName(ev.target.value)} className='text-sm px-2 w-2 flex-1 py-1 rounded border border-indigo-200 placeholder-indigo-400 focus:ring-2 focus:ring-indigo-200' type='text' placeholder='Exercise name' />
            </div>
            <div className='flex justify-end mt-1'>
                <button
                    className='text-blue-500 text-sm px-1'> Add exercise
                </button>
            </div>
        </form>
    );
}