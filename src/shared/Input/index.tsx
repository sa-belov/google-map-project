import styles from './input.module.css';
import { ChangeEvent, FC, HTMLProps } from 'react';

export interface IInputTypes extends Omit<HTMLProps<HTMLInputElement>, 'onChange'> {
  placeholder?: string;
  onChange: (value: string, name: string) => void;
}

const Input: FC<IInputTypes> = ({ onChange, ...props }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value, e.target.name);
  };
  return <input onChange={handleChange} className={styles.input} {...props} type="text" />;
};

export default Input;
