import { useForm, Controller } from "react-hook-form";
import { Drawer } from "../../shared/ui/Drawer/Drawer";
import { Input, Textarea } from "../../shared/ui/Input/Input";
import { Select } from "../../shared/ui/Select/Select";
import DatePicker from "../../shared/ui/DatePicker/DatePicker";
import { Button } from "../../shared/ui/Button/Button";
import { FiUser, FiClock, FiUsers } from "react-icons/fi";
import {
    useCreateAppointment,
    useInfiniteMasters,
    useInfiniteServices,
} from "../../app/api/hooks";
import styles from "./AddEventModal.module.scss";

function formatLocalDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

export default function AddEventModal({ isOpen, onClose, initialDate }) {
    const create = useCreateAppointment();

    // defaultAt пересчитывается на каждый монт/рендер
    const defaultAt = formatLocalDate(initialDate || new Date());

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

    const onSubmit = (vals) => {
        const [y, m, d] = vals.at.split("-").map(Number);
        const [h, mi] = vals.time.split(":").map(Number);
        const atIso = new Date(y, m - 1, d, h, mi).toISOString();

        create.mutate(
            {
                customerName: vals.customerName,
                serviceId: vals.service.id,
                masterId: vals.master.id,
                at: atIso,
                status: vals.status,
                notes: vals.notes || null,
            },
            {
                onSuccess: () => {
                    onClose();
                },
            }
        );
    };

    return (
        <Drawer isOpen={isOpen} onClose={onClose} title="New event">
            <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                {/* 1. Customer + Service */}
                <div className={styles.row}>
                    <div className={styles.icon}>
                        <FiUsers />
                    </div>
                    <div className={styles.field}>
                        <label>Customer</label>
                        <Input
                            {...register("customerName", { required: true })}
                            placeholder="Full name"
                            error={!!errors.customerName}
                        />
                    </div>
                    <div className={styles.field}>
                        <label>Service</label>
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

                {/* 2. Date + Time */}
                <div className={styles.row}>
                    <div className={styles.icon}>
                        <FiClock />
                    </div>
                    <div className={styles.field}>
                        <label>Date</label>
                        <Controller
                            name="at"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <DatePicker
                                    mode="single"
                                    initialRange={{
                                        from: new Date(field.value),
                                        to: new Date(field.value),
                                    }}
                                    onSelectRange={({ from }) =>
                                        field.onChange(formatLocalDate(from))
                                    }
                                    renderToggle={({ value, error, onToggle }) => (
                                        <Input
                                            value={value}
                                            readOnly
                                            error={!!error}
                                            placeholder="YYYY‑MM‑DD"
                                            onClick={onToggle}
                                        />
                                    )}
                                />
                            )}
                        />
                    </div>
                    <div className={styles.field}>
                        <label>Time</label>
                        <Input
                            {...register("time", { required: true })}
                            type="time"
                            error={!!errors.time}
                        />
                    </div>
                </div>

                {/* 3. Master */}
                <div className={styles.row}>
                    <div className={styles.icon}>
                        <FiUser />
                    </div>
                    <div className={styles.field}>
                        <label>Master</label>
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
                </div>

                {/* 4. Status */}
                <div className={styles.row}>
                    <div className={styles.statusGroup}>
                        {["new", "confirmed", "paid"].map((s) => (
                            <label key={s} className={styles.radioLabel}>
                                <input type="radio" value={s} {...register("status")} />
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                            </label>
                        ))}
                    </div>
                </div>

                {/* 5. Notes */}
                <div className={styles.row}>
                    <div className={styles.notesWrapper}>
                        <label>Notes (optional)</label>
                        <Controller
                            name="notes"
                            control={control}
                            render={({ field }) => (
                                <Textarea
                                    {...field}
                                    error={!!errors.notes}
                                    placeholder="Enter here"
                                />
                            )}
                        />
                    </div>
                </div>

                {/* 6. Save */}
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
