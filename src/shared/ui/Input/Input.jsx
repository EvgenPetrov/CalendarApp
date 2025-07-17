import cn from "classnames";
import styles from "./Input.module.scss";

export function Input({
    value,
    onChange,
    placeholder,
    type = "text",
    error = false,
    ...rest
}) {
    return (
        <input
            {...rest}
            className={cn(styles.control, { [styles["control--error"]]: error })}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            type={type}
        />
    );
}

export function Textarea({ value, onChange, placeholder, error = false, ...rest }) {
    return (
        <textarea
            {...rest}
            className={cn(styles.control, styles.textarea, {
                [styles["control--error"]]: error,
            })}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
        />
    );
}
