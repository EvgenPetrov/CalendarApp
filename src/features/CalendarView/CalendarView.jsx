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

    // Группируем фактические апойнтменты по дню
    const eventsByDay = useMemo(() => {
        const m = {};
        apptsData.data.forEach((a) => {
            const d = new Date(a.at).getDate();
            if (!m[d]) m[d] = [];
            m[d].push(a);
        });
        return m;
    }, [apptsData]);

    //  35 ячеек, передаём в них ивенты массива
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
            const events = eventsByDay[day] || [];
            return { date, day, status, events, disabled };
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
                    {cells.map(({ date, day, status, events, disabled }, i) => (
                        <DayCell
                            key={i}
                            date={date}
                            day={day}
                            status={status}
                            today={today}
                            events={events}
                            disabled={disabled}
                            onClick={() => !disabled && onDayClick(date)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
