import { Button } from "../../shared/ui/Button/Button";
import styles from "./ListView.module.scss";

export default function Pagination({ total, page, onPageChange }) {
    const pages = Math.ceil(total / 10);
    return (
        <div className={styles.pagination}>
            <Button onClick={() => onPageChange(page - 1)} disabled={page === 1}>
                Prev
            </Button>
            <span>
                {page} / {pages}
            </span>
            <Button onClick={() => onPageChange(page + 1)} disabled={page === pages}>
                Next
            </Button>
        </div>
    );
}
