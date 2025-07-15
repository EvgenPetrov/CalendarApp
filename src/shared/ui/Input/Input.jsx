import cn from "classnames";
import styles from "./Input.module.scss";

export function Input({ value, onChange, placeholder, type = "text", error }) {
    return (
        <input
            className={cn(styles.input, { [styles["input--error"]]: error })}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            type={type}
        />
    );
}
