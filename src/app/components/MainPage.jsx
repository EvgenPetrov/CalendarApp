import { useState } from "react";
import CalendarView from "../../features/CalendarView/CalendarView";
import ListView from "../../features/ListView/ListView";
import AddEventModal from "../../features/AddEventModal/AddEventModal";
import Filters from "../../features/ListView/Filters";
import { Drawer } from "../../shared/ui/Drawer/Drawer";
import { Button } from "../../shared/ui/Button/Button";
import { FiPlus } from "react-icons/fi";
import styles from "./MainPage.module.scss";
import ViewToggle from "../../shared/ui/ViewToggle/ViewToggle";

export default function MainPage() {
    const [view, setView] = useState("calendar");
    const [eventOpen, setEventOpen] = useState(false);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [initialDate, setInitialDate] = useState(null);

    const openNewEvent = (date = null) => {
        setInitialDate(date);
        setEventOpen(true);
    };

    return (
        <div className={styles.page}>
            <div className={styles.content}>
                <header className={styles.header}>
                    <ViewToggle view={view} onChange={setView} />
                    <Button variant="primary" onClick={() => openNewEvent()}>
                        <FiPlus />
                        <span>Add event</span>
                    </Button>
                </header>

                {view === "calendar" ? (
                    <CalendarView
                        onDayClick={openNewEvent}
                        onFilterClick={() => setFiltersOpen(true)}
                    />
                ) : (
                    <ListView onFilterClick={() => setFiltersOpen(true)} />
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
                    onChange={() => {
                        // TODO: apply filters
                        setFiltersOpen(false);
                    }}
                />
            </Drawer>
        </div>
    );
}
