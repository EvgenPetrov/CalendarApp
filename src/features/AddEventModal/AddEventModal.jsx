// AddEventModal.jsx
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Drawer } from "../../shared/ui/Drawer/Drawer";
import { Input } from "../../shared/ui/Input/Input";
import { Select } from "../../shared/ui/Select/Select";
import DatePicker from "../../shared/ui/DatePicker/DatePicker";
import { Button } from "../../shared/ui/Button/Button";
import { FiUser, FiCalendar } from "react-icons/fi";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useInfiniteMasters, useInfiniteServices } from "../../app/api/hooks";
import axios from "axios";
import styles from "./AddEventModal.module.scss";

const api = axios.create({ baseURL: "http://localhost:4000" });

function formatLocalDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

export default function AddEventModal({ isOpen, onClose, initialDate }) {
    const qc = useQueryClient();
    const defaultAt = initialDate ? formatLocalDate(initialDate) : "";

    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm({
        defaultValues: {
            customerName: "",
            service: null,
            master: null,
            at: defaultAt,
            time: "",
            status: "new",
            notes: "",
        },
        mode: "onChange",
    });

    const create = useMutation({
        mutationFn: (data) => api.post("/appointments", data).then((r) => r.data.data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["appointments"] });
            qc.invalidateQueries({ queryKey: ["dayStatuses"] });
            onClose();
        },
    });

    const onSubmit = (vals) => {
        const [y, m, d] = vals.at.split("-").map(Number);
        const [h, min] = vals.time.split(":").map(Number);
        const dt = new Date(y, m - 1, d, h, min);

        create.mutate({
            customerName: vals.customerName,
            serviceId: vals.service.id,
            masterId: vals.master.id,
            at: dt.toISOString(),
            status: vals.status,
            notes: vals.notes || null,
        });
    };

    return (
        <Drawer isOpen={isOpen} onClose={onClose} title="New event">
            <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                {/* 1-й ряд */}
                <div className={styles.row}>
                    <div className={styles.icon}>
                        <FiUser />
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label}>Customer</label>
                        <Input
                            {...register("customerName", { required: true })}
                            placeholder="Full name"
                            error={!!errors.customerName}
                        />
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label}>Service</label>
                        <Controller
                            name="service"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <Select
                                    placeholder="Service"
                                    hook={useInfiniteServices}
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                    </div>
                </div>

                {/* 2-й ряд */}
                <div className={styles.row}>
                    <div className={styles.icon}>
                        <FiCalendar />
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label}>Date</label>
                        <Controller
                            name="at"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <DatePicker
                                    mode="single"
                                    initialRange={{
                                        from: field.value ? new Date(field.value) : null,
                                        to: field.value ? new Date(field.value) : null,
                                    }}
                                    onSelectRange={({ from }) =>
                                        field.onChange(formatLocalDate(from))
                                    }
                                    renderToggle={({ value, error, onToggle }) => (
                                        <Input
                                            value={value}
                                            readOnly
                                            error={error}
                                            placeholder="DD/MM/YYYY"
                                            onClick={onToggle}
                                            onChange={() => {}}
                                        />
                                    )}
                                />
                            )}
                        />
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label}>Time</label>
                        <Input
                            {...register("time", { required: true })}
                            type="time"
                            error={!!errors.time}
                            placeholder="--:--"
                        />
                    </div>
                </div>

                {/* 3-й ряд */}
                <div className={styles.row}>
                    <div className={styles.icon}>
                        <FiUser />
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label}>Master</label>
                        <Controller
                            name="master"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <Select
                                    placeholder="Master"
                                    hook={useInfiniteMasters}
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                    </div>
                    {/* пустая, чтобы сохранить выравнивание */}
                    {/* <div className={styles.spacer} /> */}
                </div>

                {/* 4-й ряд: статус */}
                <div className={styles.row}>
                    {/* <div className={styles.spacer} /> */}
                    <div className={styles.statusGroup}>
                        {["new", "confirmed", "paid"].map((s) => (
                            <label key={s} className={styles.radioLabel}>
                                <input type="radio" value={s} {...register("status")} />
                                {s[0].toUpperCase() + s.slice(1)}
                            </label>
                        ))}
                    </div>
                    {/* <div className={styles.spacer} /> */}
                </div>

                {/* 5-й ряд: заметки */}
                <div className={styles.row}>
                    {/* <div className={styles.spacer} /> */}
                    <div className={styles.notesWrapper}>
                        <label className={styles.label}>Notes (optional)</label>
                        <textarea {...register("notes")} className={styles.textarea} />
                    </div>
                    {/* <div className={styles.spacer} /> */}
                </div>

                {/* 6-й ряд: кнопка */}
                <div className={styles.footer}>
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={!isValid || create.isLoading}>
                        Save
                    </Button>
                </div>
            </form>
        </Drawer>
    );
}
