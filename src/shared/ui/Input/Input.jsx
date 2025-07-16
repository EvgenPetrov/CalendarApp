import React from "react";
import cn from "classnames";
import styles from "./Input.module.scss";

export function Input({
    value,
    onChange = () => {},
    placeholder,
    type = "text",
    error,
    ...rest
}) {
    const handleChange = (e) => {
        onChange(e.target.value, e);
    };

    return (
        <input
            {...rest}
            className={cn(styles.input, { [styles["input--error"]]: error })}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            type={type}
        />
    );
}
