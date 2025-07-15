import axios from "axios";
import {
    useQuery,
    useInfiniteQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

const api = axios.create({ baseURL: "http://localhost:4000" });

// ===== Дни месяца =====
export function useDayStatuses(year, month) {
    return useQuery({
        queryKey: ["dayStatuses", year, month],
        queryFn: () =>
            api
                .get("/day-statuses", { params: { year, month } })
                .then((res) => res.data.data),
    });
}

// ===== Список appointments =====
export function useAppointments({
    since,
    until,
    search,
    masterIds,
    serviceIds,
    page,
    perPage,
}) {
    return useQuery({
        queryKey: [
            "appointments",
            { since, until, search, masterIds, serviceIds, page, perPage },
        ],
        queryFn: () =>
            api
                .get("/appointments", {
                    params: {
                        since,
                        until,
                        search,
                        masterIds,
                        serviceIds,
                        page,
                        perPage,
                    },
                })
                .then((res) => res.data),
        keepPreviousData: true,
    });
}

// ===== Создание записи =====
export function useCreateAppointment() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data) =>
            api.post("/appointments", data).then((res) => res.data.data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["appointments"] });
            qc.invalidateQueries({ queryKey: ["dayStatuses"] });
        },
    });
}

// ===== Masters/Services для селектов (infinite scroll) =====
function makeInfiniteHook(url) {
    return ({ search }) =>
        useInfiniteQuery({
            queryKey: [url, search],
            queryFn: ({ pageParam = 1 }) =>
                api
                    .get(`/${url}`, { params: { search, page: pageParam, perPage: 10 } })
                    .then((res) => res.data),
            getNextPageParam: (lastPage, allPages) =>
                allPages.length * 10 < lastPage.total ? allPages.length + 1 : undefined,
        });
}

export const useInfiniteMasters = makeInfiniteHook("masters");
export const useInfiniteServices = makeInfiniteHook("services");
