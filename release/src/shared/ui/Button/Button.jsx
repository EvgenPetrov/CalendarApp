import cn from "classnames";
import styles from "./Button.module.scss";

export function Button({ children, onClick, variant = "primary", disabled }) {
    return (
        <button
            className={cn(styles.btn, styles[`btn--${variant}`])}
            onClick={onClick}
            disabled={disabled}>
            {children}
        </button>
    );
}
