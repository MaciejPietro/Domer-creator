type ComponentProps = {
    maxLength: number | undefined;
    value: string;
};

const MaxLengthCount = ({ maxLength, value }: ComponentProps) => {
    if (!maxLength) return null;
    return (
        <span
            className={`absolute -bottom-5 text-[11px] right-0 ${
                value.length === maxLength ? 'text-red-500' : 'text-gray-400'
            }`}>
            {value.length} / {maxLength}
        </span>
    );
};

export default MaxLengthCount;
