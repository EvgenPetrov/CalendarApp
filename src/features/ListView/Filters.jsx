
import  { useState, useEffect } from "react";
import { FiRotateCw, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useInfiniteMasters, useInfiniteServices } from "../../app/api/hooks";
import { Input } from "../../shared/ui/Input/Input";
import { Button } from "../../shared/ui/Button/Button";
import styles from "./Filters.module.scss";

export default function Filters({ initialMasters, initialServices, onApply }) {
    const [localMasters, setLocalMasters] = useState(initialMasters);
    const [localServices, setLocalServices] = useState(initialServices);

    const [mastersExpanded, setMastersExpanded] = useState(true);
    const [searchMasters, setSearchMasters] = useState("");
    const [servicesExpanded, setServicesExpanded] = useState(false);
    const [searchServices, setSearchServices] = useState("");

    // ресет внутренних выборов, когда внешние props меняются
    useEffect(() => {
        setLocalMasters(initialMasters);
        setLocalServices(initialServices);
    }, [initialMasters, initialServices]);

    // infinite hooks
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

    const toggleMaster = (id) =>
        setLocalMasters((ms) =>
            ms.includes(id) ? ms.filter((x) => x !== id) : [...ms, id]
        );

    const toggleService = (id) =>
        setLocalServices((ss) =>
            ss.includes(id) ? ss.filter((x) => x !== id) : [...ss, id]
        );

    const resetAll = () => {
        setLocalMasters([]);
        setLocalServices([]);
    };

    return (
        <div className={styles.root}>
           
            <div className={styles.header}>
                <button onClick={resetAll} className={styles.resetAll}>
                    <FiRotateCw /> Reset all
                </button>
            </div>

           
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <span>Masters</span>
                    <div>
                        {localMasters.length > 0 && (
                            <button
                                onClick={() => setLocalMasters([])}
                                className={styles.resetBtn}>
                                <FiRotateCw /> Reset
                            </button>
                        )}
                        <button
                            onClick={() => setMastersExpanded((v) => !v)}
                            className={styles.toggleBtn}>
                            {mastersExpanded ? <FiChevronUp /> : <FiChevronDown />}
                        </button>
                    </div>
                </div>
                {mastersExpanded && (
                    <>
                        <Input
                            className={styles.search}
                            placeholder="Search masters…"
                            value={searchMasters}
                            onChange={setSearchMasters}
                        />
                        <div className={styles.listGrid}>
                            {masters.map((m) => (
                                <label key={m.id} className={styles.item}>
                                    <input
                                        type="checkbox"
                                        checked={localMasters.includes(m.id)}
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

         
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <span>Services</span>
                    <div>
                        {localServices.length > 0 && (
                            <button
                                onClick={() => setLocalServices([])}
                                className={styles.resetBtn}>
                                <FiRotateCw /> Reset
                            </button>
                        )}
                        <button
                            onClick={() => setServicesExpanded((v) => !v)}
                            className={styles.toggleBtn}>
                            {servicesExpanded ? <FiChevronUp /> : <FiChevronDown />}
                        </button>
                    </div>
                </div>
                {servicesExpanded && (
                    <>
                        <Input
                            className={styles.search}
                            placeholder="Search services…"
                            value={searchServices}
                            onChange={setSearchServices}
                        />
                        <div className={styles.listGrid}>
                            {services.map((s) => (
                                <label key={s.id} className={styles.item}>
                                    <input
                                        type="checkbox"
                                        checked={localServices.includes(s.id)}
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
                <Button
                    variant="primary"
                    onClick={() => onApply(localMasters, localServices)}
                    fullWidth>
                    Show results
                </Button>
            </div>
        </div>
    );
}
