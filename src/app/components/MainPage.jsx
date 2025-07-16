import React, { useState } from "react";
import CalendarView from "../../features/CalendarView/CalendarView";
import ListView from "../../features/ListView/ListView";
import AddEventModal from "../../features/AddEventModal/AddEventModal";
import Filters from "../../features/ListView/Filters";
import { Drawer } from "../../shared/ui/Drawer/Drawer";
import { Button } from "../../shared/ui/Button/Button";
import { FiPlus, FiSliders } from "react-icons/fi";
import ViewToggle from "../../shared/ui/ViewToggle/ViewToggle";
import styles from "./MainPage.module.scss";

export default function MainPage() {
    const [view, setView] = useState("calendar");
    const [eventOpen, setEventOpen] = useState(false);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [initialDate, setInitialDate] = useState(null);

    // единое состояние фильтров
    const [filterMasters, setFilterMasters] = useState([]); // массив ID мастеров
    const [filterServices, setFilterServices] = useState([]); // массив ID услуг

    const openNewEvent = (date = null) => {
        setInitialDate(date);
        setEventOpen(true);
    };

    return (
        <div className={styles.page}>
            <div className={styles.content}>
                <header className={styles.header}>
                    <ViewToggle view={view} onChange={setView} />

                    {/* Кнопка открытия дровера фильтров */}
                    <Button
                        variant="secondary"
                        className={styles.filterToggle}
                        onClick={() => setFiltersOpen(true)}>
                        <FiSliders />
                        <span>Filters</span>
                    </Button>

                    <Button variant="primary" onClick={() => openNewEvent()}>
                        <FiPlus />
                        <span>Add event</span>
                    </Button>
                </header>

                {view === "calendar" ? (
                    <CalendarView
                        onDayClick={openNewEvent}
                        filters={{
                            masters: filterMasters,
                            services: filterServices,
                        }}
                    />
                ) : (
                    <ListView
                        filters={{
                            masters: filterMasters,
                            services: filterServices,
                        }}
                    />
                )}
            </div>

            <AddEventModal
                isOpen={eventOpen}
                onClose={() => setEventOpen(false)}
                initialDate={initialDate}
            />

            <Drawer
                isOpen={filtersOpen}
                onClose={() => setFiltersOpen(false)}
                title="Filters">
                <Filters
                    selectedMasters={filterMasters}
                    selectedServices={filterServices}
                    onChangeMasters={setFilterMasters}
                    onChangeServices={setFilterServices}
                    onApply={() => setFiltersOpen(false)}
                />
            </Drawer>
        </div>
    );
}
