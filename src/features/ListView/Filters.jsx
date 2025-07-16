import React, { useState } from "react";
import { FiRotateCw, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useInfiniteMasters, useInfiniteServices } from "../../app/api/hooks";
import { Input } from "../../shared/ui/Input/Input";
import { Button } from "../../shared/ui/Button/Button";
import styles from "./Filters.module.scss";

export default function Filters({
    selectedMasters,
    selectedServices,
    onChangeMasters,
    onChangeServices,
    onApply,
}) {
    const [mastersExpanded, setMastersExpanded] = useState(true);
    const [servicesExpanded, setServicesExpanded] = useState(false);
    const [searchMasters, setSearchMasters] = useState("");
    const [searchServices, setSearchServices] = useState("");

    const {
        data: mastersPages,
        fetchNextPage: fetchMoreMasters,
        hasNextPage: hasMoreMasters,
    } = useInfiniteMasters({ search: searchMasters });
    const {
        data: servicesPages,
        fetchNextPage: fetchMoreServices,
        hasNextPage: hasMoreServices,
    } = useInfiniteServices({ search: searchServices });

    const masters = mastersPages?.pages.flatMap((p) => p.data) || [];
    const services = servicesPages?.pages.flatMap((p) => p.data) || [];

    const toggleMaster = (id) => {
        const next = selectedMasters.includes(id)
            ? selectedMasters.filter((x) => x !== id)
            : [...selectedMasters, id];
        onChangeMasters(next);
    };
    const toggleService = (id) => {
        const next = selectedServices.includes(id)
            ? selectedServices.filter((x) => x !== id)
            : [...selectedServices, id];
        onChangeServices(next);
    };

    const resetMasters = () => onChangeMasters([]);
    const resetServices = () => onChangeServices([]);
    const resetAll = () => {
        resetMasters();
        resetServices();
    };

    return (
        <div className={styles.root}>
            <div className={styles.resetAll}>
                <button onClick={resetAll}>
                    <FiRotateCw /> Reset all
                </button>
            </div>

            {/* Masters */}
            <div className={styles.section}>
                <div className={styles.header}>
                    <span>Masters</span>
                    <div className={styles.controls}>
                        {selectedMasters.length > 0 && (
                            <button onClick={resetMasters} className={styles.resetBtn}>
                                <FiRotateCw /> Reset
                            </button>
                        )}
                        <button
                            onClick={() => setMastersExpanded((e) => !e)}
                            className={styles.toggleBtn}>
                            {mastersExpanded ? <FiChevronUp /> : <FiChevronDown />}
                        </button>
                    </div>
                </div>
                {mastersExpanded && (
                    <>
                        <Input
                            className={styles.search}
                            placeholder="Search"
                            value={searchMasters}
                            onChange={setSearchMasters}
                        />
                        <div className={styles.list}>
                            {masters.map((m) => (
                                <label key={m.id} className={styles.item}>
                                    <input
                                        type="checkbox"
                                        checked={selectedMasters.includes(m.id)}
                                        onChange={() => toggleMaster(m.id)}
                                    />
                                    {m.name}
                                </label>
                            ))}
                            {hasMoreMasters && (
                                <button
                                    onClick={fetchMoreMasters}
                                    className={styles.loadMore}>
                                    Load more
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Services */}
            <div className={styles.section}>
                <div className={styles.header}>
                    <span>Services</span>
                    <div className={styles.controls}>
                        {selectedServices.length > 0 && (
                            <button onClick={resetServices} className={styles.resetBtn}>
                                <FiRotateCw /> Reset
                            </button>
                        )}
                        <button
                            onClick={() => setServicesExpanded((e) => !e)}
                            className={styles.toggleBtn}>
                            {servicesExpanded ? <FiChevronUp /> : <FiChevronDown />}
                        </button>
                    </div>
                </div>
                {servicesExpanded && (
                    <>
                        <Input
                            className={styles.search}
                            placeholder="Search"
                            value={searchServices}
                            onChange={setSearchServices}
                        />
                        <div className={styles.list}>
                            {services.map((s) => (
                                <label key={s.id} className={styles.item}>
                                    <input
                                        type="checkbox"
                                        checked={selectedServices.includes(s.id)}
                                        onChange={() => toggleService(s.id)}
                                    />
                                    {s.name}
                                </label>
                            ))}
                            {hasMoreServices && (
                                <button
                                    onClick={fetchMoreServices}
                                    className={styles.loadMore}>
                                    Load more
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>

            <div className={styles.footer}>
                <Button variant="primary" onClick={onApply}>
                    Show results
                </Button>
            </div>
        </div>
    );
}
