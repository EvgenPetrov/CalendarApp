import { useState, useMemo } from "react";
import { useDayStatuses, useAppointments } from "../../app/api/hooks";
import MonthNavigator from "./MonthNavigator";
import DayCell from "./DayCell";
import styles from "./CalendarView.module.scss";

export default function CalendarView({ onDayClick, onFilterClick }) {
    const today = new Date();
    const [current, setCurrent] = useState({
        year: today.getFullYear(),
        month: today.getMonth(),
    });

    const { data: statuses = [] } = useDayStatuses(current.year, current.month);
    const { data: apptsData = { data: [] } } = useAppointments({
        since: new Date(current.year, current.month, 1).toISOString(),
        until: new Date(current.year, current.month + 1, 0).toISOString(),
        page: 1,
        perPage: 100,
    });

    const eventsByDay = useMemo(() => {
        const map = {};
        apptsData.data.forEach((a) => {
            const d = new Date(a.at).getDate();
            map[d] = (map[d] || 0) + 1;
        });
        return map;
    }, [apptsData]);

    const cells = useMemo(() => {
        const firstWeekday = new Date(current.year, current.month, 1).getDay(); // 0=Sun
        const daysInMonth = new Date(current.year, current.month + 1, 0).getDate();
        const daysInPrev = new Date(current.year, current.month, 0).getDate();
        const total = 35;

        return Array.from({ length: total }, (_, idx) => {
            const offset = idx - firstWeekday + 1;
            let date, disabled;
            if (offset <= 0) {
                date = new Date(current.year, current.month - 1, daysInPrev + offset);
                disabled = true;
            } else if (offset > daysInMonth) {
                date = new Date(current.year, current.month + 1, offset - daysInMonth);
                disabled = true;
            } else {
                date = new Date(current.year, current.month, offset);
                disabled = false;
            }
            const day = date.getDate();
            const status = disabled ? "closed" : statuses[day - 1] || "working";
            const eventsCount = disabled ? 0 : eventsByDay[day] || 0;
            return { date, day, status, eventsCount, disabled };
        });
    }, [current, statuses, eventsByDay]);

    return (
        <div className={styles.calendar}>
            <MonthNavigator
                current={current}
                onChange={setCurrent}
                onFilterClick={onFilterClick}
            />

            <div className={styles.board}>
                <div className={styles.weekdays}>
                    {[
                        "Sunday",
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                    ].map((d) => (
                        <div key={d} className={styles.weekday}>
                            {d}
                        </div>
                    ))}
                </div>

                <div className={styles.grid}>
                    {cells.map(({ date, day, status, eventsCount, disabled }, i) => (
                        <DayCell
                            key={i}
                            day={day}
                            status={status}
                            today={today}
                            eventsCount={eventsCount}
                            disabled={disabled}
                            onClick={() => !disabled && onDayClick(date)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
