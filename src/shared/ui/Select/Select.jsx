import { useState, useRef, useEffect } from "react";
import { motion as Motion } from "framer-motion";
import styles from "./Select.module.scss";

export function Select({ placeholder, hook, onChange, value }) {
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const containerRef = useRef();
    const listRef = useRef();

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = hook({
        search: query,
    });
    const items = data?.pages.flatMap((p) => p.data) || [];

    // infinite scroll
    useEffect(() => {
        const el = listRef.current;
        if (!el) return;
        const onScroll = () => {
            if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10 && hasNextPage)
                fetchNextPage();
        };
        el.addEventListener("scroll", onScroll);
        return () => el.removeEventListener("scroll", onScroll);
    }, [hasNextPage, fetchNextPage]);

    // click outside closes
    useEffect(() => {
        const handler = (e) => {
            if (open && containerRef.current && !containerRef.current.contains(e.target))
                setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    // display logic
    const display = open ? query : value?.name || "";

    return (
        <div className={styles.select} ref={containerRef}>
            <input
                className={styles.select__input}
                placeholder={placeholder}
                value={display}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setOpen(true);
                }}
                onFocus={() => setOpen(true)}
            />
            {open && (
                <Motion.ul
                    className={styles.select__list}
                    ref={listRef}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}>
                    {items.map((item) => (
                        <li
                            key={item.id}
                            className={styles.select__item}
                            onClick={() => {
                                onChange(item);
                                setOpen(false);
                                setQuery("");
                            }}>
                            {item.name}
                        </li>
                    ))}
                    {isFetchingNextPage && (
                        <li className={styles.select__loading}>Загрузка...</li>
                    )}
                </Motion.ul>
            )}
        </div>
    );
}
