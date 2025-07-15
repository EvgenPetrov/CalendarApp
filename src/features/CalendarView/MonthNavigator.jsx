import { FiChevronLeft, FiChevronRight, FiSliders } from "react-icons/fi";
import styles from "./MonthNavigator.module.scss";

export default function MonthNavigator({ current, onChange, onFilterClick }) {
    const prev = () =>
        onChange({
            year: current.month === 0 ? current.year - 1 : current.year,
            month: current.month === 0 ? 11 : current.month - 1,
        });
    const next = () =>
        onChange({
            year: current.month === 11 ? current.year + 1 : current.year,
            month: current.month === 11 ? 0 : current.month + 1,
        });

    const monthName = new Date(current.year, current.month)
        .toLocaleString("en-US", { month: "long" })
        .replace(/^./, (c) => c.toUpperCase());
    const label = `${monthName}, ${current.year}`;

    return (
        <div className={styles.nav}>
            <div className={styles.title}>{label}</div>

            <div className={styles.arrows}>
                <button
                    onClick={prev}
                    className={styles.arrow}
                    aria-label="Previous month">
                    <FiChevronLeft />
                </button>
                <button onClick={next} className={styles.arrow} aria-label="Next month">
                    <FiChevronRight />
                </button>
            </div>

            <button onClick={onFilterClick} className={styles.filter}>
                <FiSliders />
                <span>Filters</span>
            </button>
        </div>
    );
}
