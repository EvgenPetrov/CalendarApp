// src/shared/ui/Select/Select.jsx
import React, { useState, useRef, useEffect } from "react";
import { motion as Motion } from "framer-motion";
import { FiChevronDown, FiChevronUp, FiX } from "react-icons/fi";
import styles from "./Select.module.scss";

export function Select({ placeholder, hook, value, onChange }) {
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const containerRef = useRef();
    const listRef = useRef();

    // подгрузка страниц
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = hook({
        search: query,
    });
    const items = data?.pages.flatMap((p) => p.data) || [];

    // infinite scroll
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

    // click outside
    useEffect(() => {
        const handler = (e) => {
            if (
                open &&
                containerRef.current &&
                !containerRef.current.contains(e.target)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    // что показывать в поле: либо ввод пользователя, либо имя value
    const display = open ? query : value?.name || "";

    const toggleOpen = () => setOpen((o) => !o);
    const clearQuery = () => {
        setQuery("");
        // если чистим уже выбранное value, сбросим value
        onChange(null);
        setOpen(true);
    };

    return (
        <div className={styles.select} ref={containerRef}>
            <input
                className={styles.input}
                placeholder={placeholder}
                value={display}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setOpen(true);
                }}
                onFocus={() => setOpen(true)}
            />
            {display && (
                <FiX className={`${styles.icon} ${styles.clear}`} onClick={clearQuery} />
            )}
            <div className={styles.icon} onClick={toggleOpen}>
                {open ? <FiChevronUp /> : <FiChevronDown />}
            </div>
            {open && (
                <Motion.ul
                    className={styles.list}
                    ref={listRef}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}>
                    {items.map((item) => (
                        <li
                            key={item.id}
                            className={styles.item}
                            onClick={() => {
                                onChange(item);
                                setOpen(false);
                                setQuery("");
                            }}>
                            {item.name}
                        </li>
                    ))}
                    {isFetchingNextPage && (
                        <li className={styles.loading}>Загрузка...</li>
                    )}
                </Motion.ul>
            )}
        </div>
    );
}
