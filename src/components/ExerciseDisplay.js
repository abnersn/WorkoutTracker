import { useState } from "react";


export default function ExerciseDisplay({ id, name, onUpdate }) {
    const [isEdit, setIsEdit] = useState(false);
    const [editName, setEditName] = useState('');

    function toggleEditMode() {
        setIsEdit(!isEdit);
    }

    function saveNewName() {
        onUpdate(id, name);
    }

    function cancelNewName() {
        setEditName(editName);
        toggleEditMode(false);
    }

    if (isEdit) {
        return (
            <div>
                <input
                    type='text'
                    onChange={ev => setEditName(ev.target.value)}
                ></input>
                <button onClick={saveNewName}>Save</button>
                <button onClick={cancelNewName}>Cancel</button>
            </div>
        )       
    }
    return (
        <div>
            <button onClick={toggleEditMode}>Edit</button>
        </div>
    )
}