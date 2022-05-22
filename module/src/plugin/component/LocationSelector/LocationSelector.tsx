import { cx } from 'emotion';
import React, { useState } from 'react';
import { useFMLocations } from '../../pages/Locations/Stores/hooks';

interface LocationSelectorProps {
  initialValue: string;
  onChange: (value: string) => void;
}
export const LocationSelector = ({ initialValue, onChange }: LocationSelectorProps) => {
  const fmLocations = useFMLocations();
  const [selectedLocation, setSelectedLocation] = useState(initialValue);

  return (
    <select
      className={cx('form-control')}
      name="fmLocationSelect"
      value={selectedLocation}
      onChange={e => {
        const updated = e.currentTarget.value;
        setSelectedLocation(updated);
        onChange(updated);
      }}
      required
    >
      <option></option>
      {fmLocations &&
        fmLocations.map(s => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
    </select>
  );
};
