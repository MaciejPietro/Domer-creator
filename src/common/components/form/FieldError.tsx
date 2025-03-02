import type { ValidationError } from '@tanstack/react-form';

type ComponentProps = {
    errors: Array<ValidationError>;
};

const FieldError = ({ errors }: ComponentProps) => {
    return <span className="absolute -bottom-5 left-4 text-red-500 block text-[11px]">{errors.join(', ')}</span>;
};

export default FieldError;
