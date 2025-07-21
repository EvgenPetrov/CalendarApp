import cn from "classnames";
import { FiCalendar, FiList } from "react-icons/fi";
import styles from "./ViewToggle.module.scss";

export default function ViewToggle({ view, onChange }) {
    return (
        <div className={styles.toggle}>
            <button
                className={cn(styles.option, { [styles.active]: view === "calendar" })}
                onClick={() => onChange("calendar")}>
                <FiCalendar />
                <span>Calendar</span>
            </button>
            <button
                className={cn(styles.option, { [styles.active]: view === "list" })}
                onClick={() => onChange("list")}>
                <FiList />
                <span>List</span>
            </button>
        </div>
    );
}
