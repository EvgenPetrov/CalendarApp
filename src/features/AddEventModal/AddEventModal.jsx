import { useForm, Controller } from "react-hook-form";
import { Drawer } from "../../shared/ui/Drawer/Drawer";
import { Input } from "../../shared/ui/Input/Input";
import { Select } from "../../shared/ui/Select/Select";
import DatePicker from "../../shared/ui/DatePicker/DatePicker";
import { Button } from "../../shared/ui/Button/Button";
import { FiUser, FiCalendar, FiClock, FiUserCheck, FiFileText } from "react-icons/fi";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useInfiniteMasters, useInfiniteServices } from "../../app/api/hooks";
import axios from "axios";
import styles from "./AddEventModal.module.scss";

const api = axios.create({ baseURL: "http://localhost:4000" });

export default function AddEventModal({ isOpen, onClose, initialDate }) {
    const qc = useQueryClient();
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
            at: initialDate?.toISOString().slice(0, 10) || "",
            time: new Date().toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
            }),
            status: "new",
            notes: "",
        },
        mode: "onChange",
    });

    const create = useMutation({
        mutationFn: (data) => api.post("/appointments", data).then((r) => r.data.data),
        onSuccess: () => {
            qc.invalidateQueries(["appointments"]);
            qc.invalidateQueries(["dayStatuses"]);
            onClose();
        },
    });

    const onSubmit = (vals) =>
        create.mutate({
            customerName: vals.customerName,
            serviceId: vals.service.id,
            masterId: vals.master.id,
            at: `${vals.at}T${vals.time}:00.000Z`,
            status: vals.status,
            notes: vals.notes || null,
        });

    return (
        <Drawer isOpen={isOpen} onClose={onClose} title="New event">
            <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.icon}>
                    <FiUser />
                </div>
                <div>
                    <label className={styles.label}>Customer</label>
                    <Input
                        {...register("customerName", { required: true })}
                        placeholder="Full name"
                        error={!!errors.customerName}
                    />
                </div>
                <div />
                <div>
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

                <div className={styles.icon}>
                    <FiCalendar />
                </div>
                <div>
                    <label className={styles.label}>Date</label>
                    <Controller
                        name="at"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <DatePicker
                                initialRange={
                                    field.value
                                        ? {
                                              from: new Date(field.value),
                                              to: new Date(field.value),
                                          }
                                        : { from: null, to: null }
                                }
                                onSelectRange={({ from }) =>
                                    field.onChange(from.toISOString().slice(0, 10))
                                }
                                error={!!errors.at}
                                data-placeholder={
                                    field.value || new Date().toISOString().slice(0, 10)
                                }
                            />
                        )}
                    />
                </div>
                <div />
                <div>
                    <label className={styles.label}>Time</label>
                    <Input
                        {...register("time", { required: true })}
                        type="time"
                        error={!!errors.time}
                    />
                </div>

                <div className={styles.icon}>
                    <FiUser />
                </div>
                <div className={styles.fullWidth}>
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
                <div />
                <div />

                <div className={styles.statusGroup}>
                    {["new", "confirmed", "paid"].map((s) => (
                        <label key={s} className={styles.radioLabel}>
                            <input type="radio" value={s} {...register("status")} />
                            {s[0].toUpperCase() + s.slice(1)}
                        </label>
                    ))}
                </div>
                <div />
                <div />

                <div className={styles.notesWrapper}>
                    <label className={styles.label}>Notes (optional)</label>
                    <textarea {...register("notes")} className={styles.textarea} />
                </div>
                <div />
                <div />

                <div />
                <div className={styles.footer}>
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={!isValid || create.isLoading}>
                        Save
                    </Button>
                </div>
                <div />
            </form>
        </Drawer>
    );
}
