import { useState, useRef, useEffect } from "react";
import { motion as Motion } from "framer-motion";
import styles from "./Select.module.scss";

export function Select({ placeholder, hook, onChange }) {
    const [query, setQuery] = useState("");
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = hook({
        search: query,
    });
    const listRef = useRef();

    useEffect(() => {
        const el = listRef.current;
        if (!el) return;
        const onScroll = () => {
            if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10 && hasNextPage) {
                fetchNextPage();
            }
        };
        el.addEventListener("scroll", onScroll);
        return () => el.removeEventListener("scroll", onScroll);
    }, [hasNextPage, fetchNextPage]);

    const items = data?.pages.flatMap((p) => p.data) || [];

    return (
        <div className={styles.select}>
            <input
                className={styles.select__input}
                placeholder={placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <Motion.ul
                className={styles.select__list}
                ref={listRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}>
                {items.map((item) => (
                    <li
                        key={item.id}
                        className={styles.select__item}
                        onClick={() => onChange(item)}>
                        {item.name}
                    </li>
                ))}
                {isFetchingNextPage && (
                    <li className={styles.select__loading}>Загрузка...</li>
                )}
            </Motion.ul>
        </div>
    );
}
