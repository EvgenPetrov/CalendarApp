import React, { useState, useMemo } from "react";
import { useDayStatuses, useAppointments } from "../../app/api/hooks";
import MonthNavigator from "../../shared/ui/MonthNavigator/MonthNavigator";
import DayCell from "./DayCell";
import ViewHeader from "../../shared/ui/ViewHeader/ViewHeader";
import styles from "./CalendarView.module.scss";

export default function CalendarView({ onDayClick, filters, onFilterClick }) {
    const today = new Date();
    const [cal, setCal] = useState({
        year: today.getFullYear(),
        month: today.getMonth(),
    });

    const { data: statuses = [] } = useDayStatuses(cal.year, cal.month);
    const { data: apptsRes = { data: [] } } = useAppointments({
        since: new Date(cal.year, cal.month, 1).toISOString(),
        until: new Date(cal.year, cal.month + 1, 0).toISOString(),
        page: 1,
        perPage: 100,
        masterIds: filters.masters,
        serviceIds: filters.services,
    });

    // сгруппировать по дню
    const eventsByDay = useMemo(() => {
        const map = {};
        apptsRes.data.forEach((a) => {
            const d = new Date(a.at).getUTCDate();
            map[d] = map[d] || [];
            map[d].push(a);
        });
        return map;
    }, [apptsRes]);

    // собрать все ячейки месяца
    const cells = useMemo(() => {
        const firstDow = new Date(cal.year, cal.month, 1).getDay();
        const daysIn = new Date(cal.year, cal.month + 1, 0).getDate();
        const daysPrev = new Date(cal.year, cal.month, 0).getDate();
        const total = 35;

        return Array.from({ length: total }, (_, i) => {
            const offset = i - firstDow + 1;
            let date, disabled;
            if (offset <= 0) {
                date = new Date(cal.year, cal.month - 1, daysPrev + offset);
                disabled = true;
            } else if (offset > daysIn) {
                date = new Date(cal.year, cal.month + 1, offset - daysIn);
                disabled = true;
            } else {
                date = new Date(cal.year, cal.month, offset);
                disabled = false;
            }

            const day = date.getDate();
            const status = disabled ? "closed" : statuses[day - 1] || "working";
            const events = eventsByDay[day] || [];
            return { date, day, status, events, disabled };
        });
    }, [cal, statuses, eventsByDay]);

    return (
        <div className={styles.calendar}>
            <ViewHeader
                leftControls={<MonthNavigator current={cal} onChange={setCal} />}
                onFilterClick={onFilterClick}
            />
            <div className={styles.board}>
                <div className={styles.weekdays}>
                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((w, i) => (
                        <div
                            key={i}
                            className={`${styles.weekday} ${
                                i === 0 || i === 6 ? styles.weekend : ""
                            }`}>
                            {w}
                        </div>
                    ))}
                </div>
                <div className={styles.grid}>
                    {cells.map(({ date, day, status, events, disabled }, idx) => (
                        <DayCell
                            key={idx}
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
