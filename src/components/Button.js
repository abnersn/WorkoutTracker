export default function Button(props) {
    const { color, label, Icon, onClick = () => {} } = props;
    return (
        <button
            onClick={onClick}
            className={`btn bg-${color}-500 ml-2 border-${color}-600 focus:ring-${color}-200 active:bg-${color}-700`}
        >
            <Icon className='mr-1 text-lg' /> {label}
        </button>
    )
}
