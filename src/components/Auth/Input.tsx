import { ChangeEventHandler, FC } from "react";

type Props = {
  type: string; 
  id: string; 
  name: string; 
  onChange: ChangeEventHandler<HTMLInputElement>;
  placeholder: string; 
  label: string;
  htmlFor: string;
}

const Input: FC<Props> = ({ 
  type, 
  id, 
  name, 
  onChange, 
  placeholder,
  label,
  htmlFor,
}) => {

  return (
    <section>
      <input 
        type={type}
        id={id}
        name={name}
        onChange={onChange}
        placeholder={placeholder}
      />
      <label htmlFor={htmlFor}>{label}</label>
    </section>
  )
}

export default Input;
