import type { ChangeEvent } from 'react';
import styles from './SearchBox.module.css';

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBox({ value, onChange }: SearchBoxProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value);

  return (
    <label className={styles.search}>
      <span className={styles.srOnly}>Search notes</span>
      <input
        value={value}
        onChange={handleChange}
        placeholder="Search notes..."
        aria-label="Search notes"
      />
    </label>
  );
}
