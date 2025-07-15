import React, { useState } from "react";
import ViewToggle from "../../shared/ui/ViewToggle/ViewToggle";
import CalendarView from "../../features/CalendarView/CalendarView";
import ListView from "../../features/ListView/ListView";
import AddEventModal from "../../features/AddEventModal/AddEventModal";
import { Button } from "../../shared/ui/Button/Button";
import { Modal } from "../../shared/ui/Modal/Modal";
import Filters from "../../features/ListView/Filters";
import styles from "./MainPage.module.scss";
import { FiPlus } from "react-icons/fi";

export default function MainPage() {
    const [view, setView] = useState("calendar");
    const [modalOpen, setModalOpen] = useState(false);
    const [initialDate, setInitialDate] = useState(null);
    const [filtersOpen, setFiltersOpen] = useState(false);

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <ViewToggle view={view} onChange={setView} />
                <Button
                    variant="primary"
                    onClick={() => {
                        setInitialDate(null);
                        setModalOpen(true);
                    }}>
                    <FiPlus />
                    <span>Add event</span>
                </Button>
            </header>

            {view === "calendar" ? (
                <CalendarView
                    onDayClick={(date) => {
                        setInitialDate(date);
                        setModalOpen(true);
                    }}
                    onFilterClick={() => setFiltersOpen(true)}
                />
            ) : (
                <ListView />
            )}

            <AddEventModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                initialDate={initialDate}
            />

            <Modal isOpen={filtersOpen} onClose={() => setFiltersOpen(false)}>
                <Filters
                    onChange={(f) => {
                        console.log("Новые фильтры:", f);
                        setFiltersOpen(false);
                        // TODO: применить фильтры
                    }}
                />
            </Modal>
        </div>
    );
}
