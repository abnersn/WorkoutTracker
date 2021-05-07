export function Container(props) {
    const { children } = props;
    return <div className='container bg-white max-w-5xl min-h-screen m-auto border shadow-md place-self-center'>{children}</div>;
}

export function Footer(props) {
    const { children } = props;
    return <div className='fixed flex justify-center bottom-0 w-screen left-0'>
        <div className='flex justify-end items-center border-t border-indigo-200 bg-white w-full max-w-5xl p-3 pb-8'>{children}</div>
    </div>;
}

export function Button(props) {
    const { Icon, type='neutral', label, ...buttonProps } = props;

    const colorClasses = {
        primary: 'bg-blue-500 ml-2 border-blue-600 focus:ring-blue-200 active:bg-blue-700',
        neutral: 'bg-indigo-500 ml-2 border-indigo-600 focus:ring-indigo-200 active:bg-indigo-700',
        success: 'bg-green-500 ml-2 border-green-600 focus:ring-green-200 active:bg-green-700'
    };

    const colorClass = colorClasses[type] || colorClasses.neutral;

    return (
        <button {...buttonProps} className={`border flex uppercase focus:ring-2 text-sm items-center text-white px-3 py-2 rounded-md ${colorClass}`}>
            {Icon && <Icon className='mr-1 text-lg' />} {label}
        </button>
    );
}

export function DecoratedBlock(props) {
    const { type = 'neutral', children } = props;

    const colorClasses = {
        primary: 'border-blue-500 text-blue-700',
        neutral: 'border-indigo-500 text-indigo-700',
        success: 'border-green-500 text-green-700'
    };

    const colorClass = colorClasses[type] || colorClasses.neutral;

    return (
        <div className={`text-xl mr-auto border-l-2 pl-2 bg-white ${colorClass}`}>
            {children}
        </div>
    );
}

export function TextLabel(props) {
    const { small = false, className, children } = props;

    const sizeClass = small ? 'text-xs' : 'text-sm';

    return (
        <p className={`${sizeClass} uppercase tracking-wider ${className}`}>{children}</p>
    );
}

export function SingleInputForm(props) {
    const { onSubmit, value, onChange, placeholder, label } = props;

    return (
        <form onSubmit={onSubmit} className='m-3 pt-3 border-t border-indigo-200'>
            <div className='flex p-2 items-center bg-indigo-50 rounded-xl border border-indigo-200'>
                <input required value={value} onChange={onChange}
                    className='text-indigo-800 px-2 w-2 flex-1 py-1 rounded border border-indigo-200 placeholder-indigo-400 focus:ring-2 focus:ring-indigo-200'
                    type='text' placeholder={placeholder} />
            </div>
            <div className='flex justify-end mt-1'>
                <button
                    className='text-indigo-500 text-sm px-1'> {label}
                </button>
            </div>
        </form>
    );
}

export function Block(props) {
    const { isActive = false, type='neutral', children } = props;

    const colorClasses = {
        primary: `border-blue-200 bg-blue-50 ${isActive ? 'ring-2 ring-blue-200' : ''}`,
        neutral: `border-indigo-200 bg-indigo-50 ${isActive ? 'ring-2 ring-indigo-200' : ''}`,
        success: `border-green-200 bg-green-50 ${isActive ? 'ring-2 ring-green-200' : ''}`,
    };

    let colorClass = colorClasses[type] || colorClasses.neutral;

    return <div className={`p-2 border ${colorClass} rounded-xl`}>{children}</div>;
}

export function List(props) {
    const { children } = props;
    return <ul className='flex flex-col space-y-3'>{children}</ul>;
}

export function ListItem(props) {
    const { isActive, children, className, ...itemProps } = props;
    const ring = isActive ? 'ring-2 ring-indigo-200 border-indigo-400' : '';
    return <div {...itemProps} className={`bg-white p-2 rounded-md shadow border border-indigo-200 ${ring} ${className}`}>{children}</div>;
}

export function TitleH3(props) {
    const { children, className } = props;
    return <h3 className={`text-lg font-semibold text-indigo-800 ${className}`}>{children}</h3>;
}

export function EmptyMessage(props) {
    const { children } = props;
    return <p className='text-indigo-500 text-sm pb-1'>{children}</p>;
}

export function LightButton(props) {
    const { children, ...buttonProps } = props;
    return <button {...buttonProps} className='text-indigo-500 text-sm px-1'>{children}</button>;
}

export function BlockActions(props) {
    const { children } = props;
    return <div className='flex justify-end mt-1 space-x-4'>{children}</div>;
}