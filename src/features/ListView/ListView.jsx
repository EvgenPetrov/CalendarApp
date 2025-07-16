import React, { useState, useMemo } from "react";
import { useAppointments } from "../../app/api/hooks";
import Filters from "./Filters";
import Pagination from "./Pagination";
import DatePicker from "../../shared/ui/DatePicker/DatePicker";
import cn from "classnames";
import styles from "./ListView.module.scss";

export default function ListView({ onFilterClick }) {
    const [page, setPage] = useState(1);
    const [dateRange, setDateRange] = useState({ from: null, to: null });
    const { data, isLoading } = useAppointments({
        page,
        perPage: 10,
        since: dateRange.from?.toISOString(),
        until: dateRange.to?.toISOString(),
    });

    const rows = useMemo(
        () =>
            data?.data.map((a) => ({
                id: a.id,
                name: a.customerName,
                datetime: new Date(a.at).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                }),
                service: a.service.name,
                master: a.master.name,
                status: a.status,
            })) || [],
        [data]
    );

    const total = data?.total || 0;

    return (
        <div className={styles.list}>
            <Filters onFilterClick={onFilterClick} />

            <div className={styles.tableWrapper}>
                <div className={styles.tableToolbar}>
                    <div className={styles.searchWrapper}>
                        <input
                            type="text"
                            className={styles.searchInput}
                            placeholder="Search"
                        />
                    </div>
                    <DatePicker initialRange={dateRange} onSelectRange={setDateRange} />
                </div>

                {isLoading ? (
                    <p>Loading…</p>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Date / time</th>
                                <th>Service</th>
                                <th>Master</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((r) => (
                                <tr key={r.id}>
                                    <td>{r.name}</td>
                                    <td>{r.datetime}</td>
                                    <td>
                                        <span className={styles.service}>
                                            {r.service}
                                        </span>
                                    </td>
                                    <td>{r.master}</td>
                                    <td>
                                        <span
                                            className={cn(
                                                styles.statusPill,
                                                styles[`statusPill--${r.status}`]
                                            )}>
                                            {r.status.charAt(0).toUpperCase() +
                                                r.status.slice(1)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                <Pagination total={total} page={page} onPageChange={setPage} />
            </div>
        </div>
    );
}
