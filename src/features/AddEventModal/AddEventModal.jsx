import { useForm, Controller } from "react-hook-form";
import { Modal } from "../../shared/ui/Modal/Modal";
import { Input } from "../../shared/ui/Input/Input";
import { Select } from "../../shared/ui/Select/Select";
import { DatePicker } from "../../shared/ui/DatePicker/DatePicker";
import { Button } from "../../shared/ui/Button/Button";
import axios from "axios";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useInfiniteMasters, useInfiniteServices } from "../../app/api/hooks";
import styles from "./AddEventModal.module.scss";

const api = axios.create({ baseURL: "http://localhost:4000" });

export default function AddEventModal({ isOpen, onClose, initialDate }) {
    const qc = useQueryClient();
    const { register, control, handleSubmit, formState } = useForm({
        defaultValues: {
            at: initialDate ? initialDate.toISOString().slice(0, 10) : "",
            customerName: "",
            master: null,
            service: null,
            status: "new",
            notes: "",
        },
        mode: "onChange",
    });

    const create = useMutation({
        mutationFn: (data) =>
            api.post("/appointments", data).then((res) => res.data.data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["appointments"] });
            qc.invalidateQueries({ queryKey: ["dayStatuses"] });
            onClose();
        },
    });

    const onSubmit = (values) => {
        create.mutate({
            at: values.at,
            customerName: values.customerName,
            masterId: values.master.id,
            serviceId: values.service.id,
            status: values.status,
            notes: values.notes || null,
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name="at"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <DatePicker {...field} error={!!formState.errors.at} />
                    )}
                />

                <Input
                    {...register("customerName", { required: true })}
                    placeholder="Customer Name"
                    error={!!formState.errors.customerName}
                />

                <Controller
                    name="master"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <Select
                            placeholder="Master"
                            hook={useInfiniteMasters}
                            onChange={field.onChange}
                        />
                    )}
                />

                <Controller
                    name="service"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <Select
                            placeholder="Service"
                            hook={useInfiniteServices}
                            onChange={field.onChange}
                        />
                    )}
                />

                <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                        <Select
                            placeholder="Status"
                            hook={() => ({
                                data: {
                                    pages: [
                                        {
                                            data: [
                                                "new",
                                                "paid",
                                                "confirmed",
                                                "cancelled",
                                            ].map((s) => ({
                                                id: s,
                                                name: s,
                                            })),
                                        },
                                    ],
                                    total: 4,
                                },
                                fetchNextPage: () => {},
                                hasNextPage: false,
                                isFetchingNextPage: false,
                            })}
                            onChange={field.onChange}
                        />
                    )}
                />

                <textarea {...register("notes")} placeholder="Notes (optional)" />

                <Button type="submit" disabled={!formState.isValid || create.isLoading}>
                    Save
                </Button>
            </form>
        </Modal>
    );
}
