import { Button } from "../../shared/ui/Button/Button";
import styles from "./Pagination.module.scss";

export default function Pagination({ total, page, onPageChange }) {
    const pages = Math.ceil(total / 10);

    return (
        <div className={styles.pagination}>
            <Button
                variant="ghost"
                disabled={page <= 1}
                onClick={() => onPageChange(1)}
                className={styles.button}>
                «
            </Button>
            <Button
                variant="ghost"
                disabled={page <= 1}
                onClick={() => onPageChange(page - 1)}
                className={styles.button}>
                ‹
            </Button>

            <span className={styles.info}>
                Page{" "}
                <select
                    className={styles.select}
                    value={page}
                    onChange={(e) => onPageChange(Number(e.target.value))}>
                    {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                        <option key={p} value={p}>
                            {p}
                        </option>
                    ))}
                </select>{" "}
                of {pages}
            </span>

            <Button
                variant="ghost"
                disabled={page >= pages}
                onClick={() => onPageChange(page + 1)}
                className={styles.button}>
                ›
            </Button>
            <Button
                variant="ghost"
                disabled={page >= pages}
                onClick={() => onPageChange(pages)}
                className={styles.button}>
                »
            </Button>
        </div>
    );
}
