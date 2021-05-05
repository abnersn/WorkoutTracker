import { BiInfoCircle } from "react-icons/bi";
import { useState } from "react";

export default function RPEScale() {
    const [value, setValue] = useState(5);
    const [expand, setExpand] = useState(false);

    const rpeTitles = [
        'Very light activity',
        'Light activity',
        'Light activity',
        'Moderate activity',
        'Moderate activity',
        'Moderate activity',
        'Vigorous activity',
        'Vigorous activity',
        'Very hard activity',
        'Max effort activity',
    ]

    const rpeDescriptions = [
        'Hardly any exertion, but more than sleeping, watching TV, etc.',
        'Could mantain for hours. Easy to breathe and carry a conversation.',
        'Could mantain for hours. Easy to breathe and carry a conversation.',
        'Breathing heavily, can mantain a conversation, but more challenging.',
        'Breathing heavily, can mantain a conversation, but more challenging.',
        'Breathing heavily, can mantain a conversation, but more challenging.',
        'Almost uncofortable, short of breath, can speak a sentence.',
        'Almost uncofortable, short of breath, can speak a sentence.',
        'Very difficult to mantain, can barely breate, can speak a few words',
        'Almost impossible to keep going. Out of breath, unable to talk.',
    ]

    return (
        <>
            <hr className='border-t border-indigo-200'></hr>
            <div className='bg-white p-2 rounded-md shadow border border-indigo-200'>
                <span className='uppercase text-sm tracking-wider text-indigo-700'>Rate of perceived exertion 
                <button onClick={() => setExpand(!expand)}><BiInfoCircle className='inline ml-1 mb-1' /></button></span>
                <input
                    className={`val-${value}`}
                    type='range'
                    min='1'
                    value={value}
                    onChange={ev => setValue(ev.target.value)}
                    max='10'
                    step='1'
                />
                <ul className='tracks flex w-full justify-between text-xs -mt-1 text-indigo-700'>
                    {Array.from(Array(10).keys()).map((i) => 
                        <li key={i}>{i + 1}</li>
                    )}
                </ul>
                {
                    expand && (
                        <>
                            <hr className='mt-2 border-t border-indigo-200' />
                            <h4 className='text-xs font-semibold mb-1 mt-2 text-indigo-700'>{rpeTitles[value - 1]}</h4>
                            <p className='text-xs text-indigo-700'>{rpeDescriptions[value - 1]}</p>
                        </>
                    )
                }
            </div>
        </>
    )
}