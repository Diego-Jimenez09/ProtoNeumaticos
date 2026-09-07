import React, { useId } from 'react';
import { GENERAL_INSPECTION_OPTIONS } from './options.js';
import { InspectionIcon } from './InspectionIcon.jsx';
import './GeneralInspection.css';

/**
 * Controlled, optional checklist. The parent owns the selection and saving.
 * @param {{value?: string[], onChange: (ids: string[]) => void, name?: string}} props
 */
export function GeneralInspection({ value = [], onChange, name = 'generalInspection' }) {
  const instanceId = useId();
  const selected = new Set(value);

  function changeOption(id, checked) {
    const next = new Set(value);
    if (checked) next.add(id);
    else next.delete(id);
    // Emit known, unique identifiers in display order without mutating props.
    onChange(GENERAL_INSPECTION_OPTIONS.filter(option => next.has(option.id)).map(option => option.id));
  }

  return (
    <fieldset className="ig-menu" aria-describedby={`${instanceId}-instruction`}>
      <legend className="ig-menu__legend">
        <span className="ig-menu__heading">
          <span className="ig-menu__heading-icon"><InspectionIcon name="clipboard" /></span>
          <span>Inspección general</span>
        </span>
      </legend>

      <p className="ig-menu__instruction" id={`${instanceId}-instruction`}>
        Marca solo lo revisado
      </p>

      <div className="ig-menu__options">
        {GENERAL_INSPECTION_OPTIONS.map(option => {
          const checked = selected.has(option.id);
          return (
            <label className="ig-menu__option" data-selected={checked} key={option.id}>
              <input
                className="ig-menu__input"
                type="checkbox"
                name={name}
                value={option.id}
                checked={checked}
                onChange={event => changeOption(option.id, event.target.checked)}
                aria-labelledby={`${instanceId}-${option.id}-label`}
              />
              <span className="ig-menu__option-icon"><InspectionIcon name={option.icon} /></span>
              <span className="ig-menu__option-content">
                <span className="ig-menu__option-label" id={`${instanceId}-${option.id}-label`}>{option.label}</span>
              </span>
              <span className="ig-menu__checkbox" aria-hidden="true"><InspectionIcon name="check" /></span>
              <span className="ig-menu__focus" aria-hidden="true" />
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
