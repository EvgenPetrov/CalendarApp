import { useState, useRef, useEffect } from "react";
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
            <button onClick={onPreviousClick} className={styles.navPrev}>
                <ArrowLeftIcon />
            </button>
            <span className={styles.captionLabel}>
                {date.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </span>
            <button onClick={onNextClick} className={styles.navNext}>
                <ArrowRightIcon />
            </button>
        </div>
    );
}

export default function DatePicker({
    mode = "range",
    initialRange = { from: null, to: null },
    onSelectRange,
    placeholder = "",
    error = false,
    renderToggle,
}) {
    const [open, setOpen] = useState(false);
    const [range, setRange] = useState(initialRange);
    const ref = useRef(null);

    useEffect(() => {
        const onClickOutside = (e) => {
            if (open && ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", onClickOutside);
        return () => document.removeEventListener("mousedown", onClickOutside);
    }, [open]);

    const hasValue = mode === "range" ? range.from && range.to : !!range.from;

    const valueLabel = hasValue
        ? mode === "range"
            ? `${range.from.toLocaleDateString("en-GB", {
                  month: "short",
                  day: "numeric",
              })} – \
${range.to.toLocaleDateString("en-GB", { month: "short", day: "numeric" })}`
            : range.from.toLocaleDateString("en-GB")
        : "";

    const toggle = () => setOpen((v) => !v);
    const clear = (e) => {
        e.stopPropagation();
        const empty = { from: null, to: null };
        setRange(empty);
        onSelectRange(empty);
    };

    const select = (sel) => {
        if (mode === "range") {
            setRange(sel || { from: null, to: null });
        } else {
            // single date: сразу отдаём и закрываем
            setRange({ from: sel, to: sel });
            onSelectRange({ from: sel, to: sel });
            setOpen(false);
        }
    };

    const submitRange = () => {
        if (!hasValue) return;
        onSelectRange(range);
        setOpen(false);
    };

    const trigger = renderToggle ? (
        renderToggle({ value: valueLabel, error, onToggle: toggle })
    ) : (
        <button
            type="button"
            className={cn(styles.toggle, {
                [styles.activeOutline]: open && !hasValue,
                [styles.selected]: hasValue,
                [styles["toggle--error"]]: error,
            })}
            onClick={toggle}>
            {hasValue ? (
                <>
                    <span className={styles.label}>{valueLabel}</span>
                    <FiX className={styles.icon} onClick={clear} />
                </>
            ) : (
                <FiCalendar className={styles.icon} />
            )}
        </button>
    );

    return (
        <div className={styles.wrapper} ref={ref}>
            {trigger}

            {open && (
                <div className={styles.popover}>
                    <DayPicker
                        mode={mode}
                        selected={mode === "range" ? range : range.from}
                        onSelect={select}
                        components={{ Caption: CustomCaption }}
                    />

                    {mode === "range" && (
                        <div className={styles.actions}>
                            <button
                                type="button"
                                className={styles.clear}
                                onClick={clear}>
                                Clear
                            </button>
                            <button
                                type="button"
                                className={styles.submit}
                                disabled={!hasValue}
                                onClick={submitRange}>
                                Submit
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
