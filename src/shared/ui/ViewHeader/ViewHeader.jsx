import styles from "./ViewHeader.module.scss";
import FiltersIcon from "src/shared/icons/filters.svg?react";

export default function ViewHeader({ leftControls, title, onFilterClick }) {
    return (
        <div className={styles.header}>
            <div className={styles.left}>
                {leftControls}
                {title && <h2 className={styles.title}>{title}</h2>}
            </div>
            <button className={styles.filter} onClick={onFilterClick}>
                <FiltersIcon className={styles.filterIcon} />
                <span>Filters</span>
            </button>
        </div>
    );
}
