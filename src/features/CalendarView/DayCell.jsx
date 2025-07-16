import cn from "classnames";
import styles from "./DayCell.module.scss";

export default function DayCell({
    date,
    day,
    status,
    today,
    events = [],
    onClick,
    disabled,
}) {
    const isToday = date.toDateString() === today.toDateString();

    const fmtTime = (iso) =>
        new Date(iso).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        });

    const renderEvent = (e, idx) => (
        <div key={idx} className={cn(styles.eventRow, styles[`event--${e.status}`])}>
            <span className={styles.eventTime}>{fmtTime(e.at)}</span>
            <span className={styles.eventName}>{e.customerName}</span>
        </div>
    );

    return (
        <div
            className={cn(
                styles.cell,
                styles[`cell--${status}`],
                { [styles["cell--today"]]: isToday },
                { [styles["cell--other"]]: disabled }
            )}
            onClick={!disabled ? () => onClick(date) : undefined}>
            {isToday && (
                <div className={styles.todayMark}>
                    <span className={styles.todayFlag}>{day}</span>
                    <span className={styles.todayLabel}>Today</span>
                </div>
            )}

            <div className={cn(styles.day, { [styles.hidden]: isToday })}>{day}</div>

            {events.length > 0 && (
                <div className={styles.events}>
                    <div className={styles.eventsRow}>
                        {events.length <= 2
                            ? events.map(renderEvent)
                            : renderEvent(events[0], 0)}
                    </div>

                    {events.length > 1 && (
                        <div className={styles.eventsRow}>
                            {events.length === 2 ? (
                                renderEvent(events[1], 1)
                            ) : (
                                <div className={styles.more}>
                                    + {events.length - 1} More
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {(status === "closed" || status === "blocked") && (
                <div className={styles.status}>
                    {status === "closed" ? "Closed" : "Blocked"}
                </div>
            )}
        </div>
    );
}
