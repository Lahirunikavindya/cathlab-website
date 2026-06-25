function InventorySelect({
  id,
  label,
  value,
  onChange,
  options,
  disabled,
  placeholder,
  fullWidth,
  required = true,
}) {
  return (
    <div className={`form-group${fullWidth ? " form-full" : ""}`}>
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required && !disabled}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default InventorySelect;
