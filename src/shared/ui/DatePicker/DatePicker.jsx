import styles from "./DatePicker.module.scss";

export function DatePicker({ value, onChange }) {
    return (
        <input
            type="date"
            className={styles["date-picker"]}
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    );
}
