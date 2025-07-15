import { useState, useMemo } from "react";
import { useAppointments } from "../../app/api/hooks";
import Filters from "./Filters";
import Pagination from "./Pagination";
import styles from "./ListView.module.scss";

export default function ListView({ onFilterClick }) {
    const [page, setPage] = useState(1);
    const { data, isLoading } = useAppointments({ page, perPage: 10 });

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
                    <div /> {/* пустой, чтобы правый блок встал по правому краю */}
                    <div className={styles.searchWrapper}>
                        <input
                            type="text"
                            className={styles.searchInput}
                            placeholder="Search"
                        />
                        <button className={styles.calendarBtn}>
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                        </button>
                    </div>
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
                                    <td>{r.service}</td>
                                    <td>{r.master}</td>
                                    <td>{r.status}</td>
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
