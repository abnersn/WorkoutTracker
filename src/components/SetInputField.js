import { useState } from "react";

export default function SetInputField(props) {
    const {
        inputProps,
        labelText,
        defaultValue = null,
        formatFunction = val => val
    } = props;
    const [value, setValue] = useState(defaultValue);
    const [isEdit, setIsEdit] = useState(false);

    return (
        <label onFocus={() => setIsEdit(true)} onBlur={() => setIsEdit(false)}>
            <span>{labelText}</span>
            {
                isEdit ? (
                    <input
                        {...inputProps}
                        value={value}
                        onChange={ev => setValue(ev.target.value)}
                    ></input>
                ) : (
                    <span className='value'>
                        {formatFunction(value)}
                    </span>
                )
            }
        </label>
    )
}
