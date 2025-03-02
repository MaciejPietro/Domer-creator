const InputWrapper = ({
  children,
  label,
  error,
}: {
  children: React.ReactNode;
  label?: string;
  error?: string;
}) => (
  <div className="input-wrapper">
    {label && <label className="input-label">{label}</label>}
    {children}
    {error && <span className="input-error-message">{error}</span>}
  </div>
);

export default InputWrapper;
