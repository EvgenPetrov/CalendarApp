// src/features/ListView/ListView.jsx
import React, { useMemo, useState } from "react";
import { useAppointments } from "../../app/api/hooks";
import DatePicker from "../../shared/ui/DatePicker/DatePicker";
import Pagination from "./Pagination";
import ViewHeader from "../../shared/ui/ViewHeader/ViewHeader";
import cn from "classnames";
import styles from "./ListView.module.scss";

// иконки
import { FiSearch, FiX } from "react-icons/fi";

export default function ListView({ filters, onFilterClick }) {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [range, setRange] = useState({ from: null, to: null });

    // считаем since/until
    let since, until;
    if (range.from) {
        const f = new Date(range.from);
        f.setHours(0, 0, 0, 0);
        const t = new Date(range.to || range.from);
        t.setHours(23, 59, 59, 999);
        since = f.toISOString();
        until = t.toISOString();
    }

    // fetch без search — будем фильтровать локально
    const { data, isLoading } = useAppointments({
        page,
        perPage: 10,
        masterIds: filters.masters,
        serviceIds: filters.services,
        ...(since ? { since, until } : {}),
    });

    // готовим строки
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

    // фильтруем по name/service/master
    const filteredRows = useMemo(() => {
        if (!search.trim()) return rows;
        const q = search.toLowerCase();
        return rows.filter(
            ({ name, service, master }) =>
                name.toLowerCase().includes(q) ||
                service.toLowerCase().includes(q) ||
                master.toLowerCase().includes(q)
        );
    }, [rows, search]);

    const total = data?.total || 0;

    return (
        <div className={styles.list}>
            <ViewHeader title="Orders" onFilterClick={onFilterClick} />

            <div className={styles.tableWrapper}>
                <div className={styles.tableToolbar}>
                    <div className={styles.searchWrapper}>
                        <div className={styles.searchInputWrapper}>
                            <input
                                type="text"
                                className={styles.searchInput}
                                placeholder="Search"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                            />
                            {search && (
                                <FiX
                                    className={styles.clearIcon}
                                    onClick={() => {
                                        setSearch("");
                                        setPage(1);
                                    }}
                                />
                            )}
                            <FiSearch className={styles.searchIcon} />
                        </div>
                    </div>

                    <DatePicker
                        mode="range"
                        initialRange={range}
                        onSelectRange={(r) => {
                            setRange(r);
                            setPage(1);
                        }}
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
                            {filteredRows.map((r) => (
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
