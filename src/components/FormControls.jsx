function InputField({
  label,
  value,
  onChange,
  type = "number",
  step = "any",
  placeholder,
  suffix,
  min,
  options,
}) {
  const inputType = type === "textarea" ? "textarea" : type === "select" ? "select" : "input";

  return (
    <label className="field">
      <span className="field__label">{label}</span>
      <div className="field__control">
        {inputType === "textarea" ? (
          <textarea
            className="field__input field__input--textarea"
            value={value}
            placeholder={placeholder}
            onChange={(event) => onChange(event.target.value)}
          />
        ) : null}
        {inputType === "select" ? (
          <select className="field__input field__input--select" value={value} onChange={(event) => onChange(event.target.value)}>
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : null}
        {inputType === "input" ? (
          <input
            className="field__input"
            type={type}
            step={step}
            min={min}
            value={value}
            placeholder={placeholder}
            onChange={(event) => onChange(event.target.value)}
          />
        ) : null}
        {suffix ? <span className="field__suffix">{suffix}</span> : null}
      </div>
    </label>
  );
}

function YearlyFieldGroup({ label, values, onChange }) {
  return (
    <div className="year-grid">
      <span className="field__label">{label}</span>
      <div className="year-grid__items">
        {["year1", "year2", "year3", "year4"].map((key, index) => (
          <label className="mini-field" key={key}>
            <span className="mini-field__label">Y{index + 1}</span>
            <input
              className="field__input"
              type="number"
              step="any"
              value={values[key]}
              onChange={(event) => onChange(key, event.target.value)}
            />
          </label>
        ))}
      </div>
    </div>
  );
}

function SectionCard({ title, intro, children, footer }) {
  return (
    <section className="surface-card section-card">
      <div className="section-card__header">
        <h3>{title}</h3>
        <p>{intro}</p>
      </div>
      <div className="section-card__body">{children}</div>
      {footer ? <div className="section-card__footer">{footer}</div> : null}
    </section>
  );
}

function PartsEditor({ copy, items, onChange, onAdd, onRemove }) {
  return (
    <div className="parts-editor">
      <div className="parts-editor__rows">
        {items.map((item, index) => (
          <div className="parts-row" key={`${item.name}-${index}`}>
            <InputField
              label={copy.name}
              type="text"
              value={item.name}
              onChange={(value) => onChange(index, "name", value)}
            />
            <InputField
              label={copy.quantity}
              value={item.quantity}
              onChange={(value) => onChange(index, "quantity", value)}
            />
            <InputField
              label={copy.price}
              value={item.price}
              onChange={(value) => onChange(index, "price", value)}
            />
            <InputField
              label={copy.frequency}
              value={item.frequency}
              onChange={(value) => onChange(index, "frequency", value)}
            />
            <button className="ghost-button ghost-button--danger" type="button" onClick={() => onRemove(index)}>
              {copy.remove}
            </button>
          </div>
        ))}
      </div>
      <button className="ghost-button" type="button" onClick={onAdd}>
        {copy.add}
      </button>
    </div>
  );
}

export { InputField, PartsEditor, SectionCard, YearlyFieldGroup };
