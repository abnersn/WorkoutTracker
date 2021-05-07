import { BiInfoCircle } from 'react-icons/bi';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ListItem } from '../ui';

export default function RPEScale(props) {
    const { defaultRPE = 5, isReadOnly } = props;

    const { t } = useTranslation();
    const [value, setValue] = useState(defaultRPE);
    const [expand, setExpand] = useState(false);

    const rpeTitles = [
        t('rpe_title_1'),
        t('rpe_title_2'),
        t('rpe_title_3'),
        t('rpe_title_4'),
        t('rpe_title_5'),
        t('rpe_title_6'),
        t('rpe_title_7'),
        t('rpe_title_8'),
        t('rpe_title_9'),
        t('rpe_title_10')
    ];

    const rpeDescriptions = [
        t('rpe_desc_1'),
        t('rpe_desc_2'),
        t('rpe_desc_3'),
        t('rpe_desc_4'),
        t('rpe_desc_5'),
        t('rpe_desc_6'),
        t('rpe_desc_7'),
        t('rpe_desc_8'),
        t('rpe_desc_9'),
        t('rpe_desc_10')
    ];

    return (
        <>
            <hr className='border-t border-indigo-200'></hr>
            <ListItem>
                <span className='uppercase text-sm tracking-wider text-indigo-700'>{t('rpe')}
                <button onClick={() => setExpand(!expand)}><BiInfoCircle className='inline ml-1 mb-1' /></button></span>
                <input
                    className={`rpe val-${value}`}
                    type='range'
                    min='1'
                    value={value}
                    onChange={ev => isReadOnly || setValue(ev.target.value)}
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
            </ListItem>
        </>
    );
}