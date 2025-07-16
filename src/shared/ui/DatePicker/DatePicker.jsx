// DatePicker.jsx
import React, { useState, useRef, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { FiCalendar, FiX } from "react-icons/fi";
import ArrowLeftIcon from "../../icons/arrow-left.svg?react";
import ArrowRightIcon from "../../icons/arrow-right.svg?react";
import cn from "classnames";
import styles from "./DatePicker.module.scss";

function CustomCaption({ date, onPreviousClick, onNextClick }) {
    return (
        <div className={styles.caption}>
            <button type="button" onClick={onPreviousClick} className={styles.navPrev}>
                <ArrowLeftIcon />
            </button>
            <span className={styles.captionLabel}>
                {date.toLocaleDateString("en-US", { month: "long" })}
            </span>
            <button type="button" onClick={onNextClick} className={styles.navNext}>
                <ArrowRightIcon />
            </button>
        </div>
    );
}

export default function DatePicker({ initialRange, onSelectRange }) {
    const [open, setOpen] = useState(false);
    const [range, setRange] = useState(initialRange || { from: null, to: null });
    const ref = useRef();

    // закрываем по клику вне
    useEffect(() => {
        function onClick(e) {
            if (open && ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", onClick);
        return () => document.removeEventListener("mousedown", onClick);
    }, [open]);

    const hasRange = range.from && range.to;
    const label = hasRange
        ? `${range.from.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
          })} – ${range.to.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
          })}`
        : null;

    const clearRange = (e) => {
        e.stopPropagation();
        const empty = { from: null, to: null };
        setRange(empty);
        onSelectRange(empty);
    };
    const submitRange = () => {
        if (hasRange) {
            onSelectRange(range);
            setOpen(false);
        }
    };

    return (
        <div className={styles.wrapper} ref={ref}>
            <button
                type="button"
                className={cn(
                    styles.toggle,
                    { [styles.activeOutline]: open && !hasRange },
                    { [styles.selected]: hasRange }
                )}
                onClick={() => setOpen((v) => !v)}>
                {label ? (
                    <>
                        <span className={styles.label}>{label}</span>
                        <FiX className={styles.icon} onClick={clearRange} />
                    </>
                ) : (
                    <FiCalendar className={styles.icon} />
                )}
            </button>

            {open && (
                <div className={styles.popover}>
                    <DayPicker
                        mode="range"
                        selected={range}
                        onSelect={(r) => setRange(r || { from: null, to: null })}
                        components={{ Caption: CustomCaption }}
                    />
                    <div className={styles.actions}>
                        <button
                            type="button"
                            className={styles.clear}
                            onClick={clearRange}>
                            Clear
                        </button>
                        <button
                            type="button"
                            className={styles.submit}
                            disabled={!hasRange}
                            onClick={submitRange}>
                            Submit
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
