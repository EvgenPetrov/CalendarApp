import { FiSliders } from "react-icons/fi";
import styles from "./ListView.module.scss";

export default function Filters({ onFilterClick }) {
    return (
        <div className={styles.filtersHeader}>
            <h2 className={styles.title}>Orders</h2>
            <button className={styles.filterBtn} onClick={onFilterClick}>
                <FiSliders />
                <span>Filters</span>
            </button>
        </div>
    );
}
