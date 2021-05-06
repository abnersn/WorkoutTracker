export function Container(props) {
    const { children } = props;
    return <div className='bg-white max-w-5xl min-h-screen m-auto border shadow-md place-self-center'>{children}</div>;
}

export function Footer(props) {
    const { children } = props;
    return <div className='flex justify-end sticky items-center border-t border-indigo-200 bottom-0 bg-white w-full left-0 p-3'>{children}</div>;
}

export function Button(props) {
    const { Icon, color='blue', label, ...buttonProps } = props;

    return (
        <button {...buttonProps} className={`border flex uppercase focus:ring-2 text-sm items-center text-white px-3 py-2 rounded-md bg-${color}-500 ml-2 border-${color}-600 focus:ring-${color}-200 active:bg-${color}-700`}>
            {Icon && <Icon className='mr-1 text-lg' />} {label}
        </button>
    );
}

export function DecoratedBlock(props) {
    const { color = 'indigo', children } = props;
    return (
        <div className={`text-xl mr-auto border-l-2 border-${color}-500 pl-2 bg-white text-${color}-700`}>
            {children}
        </div>
    );
}

export function TextLabel(props) {
    const { size = 'sm', children } = props;

    return (
        <p className={`text-${size} uppercase tracking-wider`}>{children}</p>
    );
}