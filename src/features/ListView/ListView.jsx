import React, { useMemo, useState } from "react";
import { useAppointments } from "../../app/api/hooks";
import DatePicker from "../../shared/ui/DatePicker/DatePicker";
import Pagination from "./Pagination";
import ViewHeader from "../../shared/ui/ViewHeader/ViewHeader";
import cn from "classnames";
import styles from "./ListView.module.scss";

export default function ListView({ filters, onFilterClick }) {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [range, setRange] = useState({ from: null, to: null });

    const { data, isLoading } = useAppointments({
        page,
        perPage: 10,
        since: range.from?.toISOString(),
        until: range.to?.toISOString(),
        search,
        masterIds: filters.masters,
        serviceIds: filters.services,
    });

    const rows = useMemo(
        () =>
            (data?.data || []).map((a) => ({
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
            })),
        [data]
    );

    const total = data?.total || 0;

    return (
        <div className={styles.list}>
            <ViewHeader title="Orders" onFilterClick={onFilterClick} />

            <div className={styles.tableWrapper}>
                <div className={styles.tableToolbar}>
                    <div className={styles.searchWrapper}>
                        <input
                            type="text"
                            className={styles.searchInput}
                            placeholder="Search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <DatePicker
                        mode="range"
                        initialRange={range}
                        onSelectRange={setRange}
                    />
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
