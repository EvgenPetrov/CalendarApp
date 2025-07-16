import { FiSliders } from "react-icons/fi";
import navStyles from "../MonthNavigator/MonthNavigator.module.scss";
import styles from "./ViewHeader.module.scss";

export default function ViewHeader({ leftControls, title, onFilterClick }) {
    return (
        <div className={styles.header}>
            <div className={styles.left}>
                {leftControls}
                {title && <h2 className={styles.title}>{title}</h2>}
            </div>
            <button className={navStyles.filter} onClick={onFilterClick}>
                <FiSliders />
                <span>Filters</span>
            </button>
        </div>
    );
}
