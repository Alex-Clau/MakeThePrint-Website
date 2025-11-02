function InputForm({ label, name, type = "text", value, onChange, required = false, placeholder, rows, step, variant = "light" }) {
    const isTextarea = type === "textarea";
    const InputComponent = isTextarea ? "textarea" : "input";

    const themeStyles = {
        light: {
            label: "text-sm font-medium text-slate-700 mb-2",
            input: "w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
        },
        dark: {
            label: "text-white font-bold mb-2",
            input: "w-full px-4 py-2 bg-slate-800 text-white rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
        }
    };

    const { label: labelClass, input: inputClass } = themeStyles[variant];

    return (
        <div>
            <label className={`block ${labelClass} text-left`}>
                {label}
            </label>
            <InputComponent
                type={!isTextarea ? type : undefined}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                rows={rows}
                step={step}
                className={`${inputClass} ${isTextarea ? "resize-none" : ""}`}
                placeholder={placeholder}
            />
        </div>
    );
}

export default InputForm;