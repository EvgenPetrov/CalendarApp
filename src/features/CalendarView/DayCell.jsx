import React from "react";
import cn from "classnames";
import styles from "./DayCell.module.scss";

export default function DayCell({ day, status, today, eventsCount, onClick, disabled }) {
    const cellDate = new Date(today.getFullYear(), today.getMonth(), day);
    const isToday = cellDate.toDateString() === today.toDateString();

    return (
        <div
            className={cn(
                styles.cell,
                styles[`cell--${status}`],
                { [styles["cell--today"]]: isToday },
                { [styles["cell--other"]]: disabled }
            )}
            onClick={!disabled ? () => onClick(cellDate) : undefined}>
            {/* Today-маркер */}
            {isToday && (
                <div className={styles.todayMark}>
                    {/* цифра внутри цветного флага */}
                    <span className={styles.todayFlag}>{day}</span>
                    {/* надпись справа от флага */}
                    <span className={styles.todayLabel}>Today</span>
                </div>
            )}

            {/* обычный номер дня (скроется при isToday) */}
            <div className={cn(styles.day, { [styles.hidden]: isToday })}>{day}</div>

            {status === "closed" && !disabled && (
                <div className={styles.status}>Closed</div>
            )}
            {status === "blocked" && <div className={styles.status}>Blocked</div>}

            {eventsCount > 0 && <div className={styles.badge}>{eventsCount}</div>}
        </div>
    );
}
