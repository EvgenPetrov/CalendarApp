
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
            className={cn(styles.input, { [styles["input--error"]]: error })}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            type={type}
        />
    );
}
