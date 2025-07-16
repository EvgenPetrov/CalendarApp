import  { useState } from "react";
import CalendarView from "../../features/CalendarView/CalendarView";
import ListView from "../../features/ListView/ListView";
import AddEventModal from "../../features/AddEventModal/AddEventModal";
import Filters from "../../features/ListView/Filters";
import { Drawer } from "../../shared/ui/Drawer/Drawer";
import { Button } from "../../shared/ui/Button/Button";
import { FiPlus } from "react-icons/fi";
import ViewToggle from "../../shared/ui/ViewToggle/ViewToggle";
import styles from "./MainPage.module.scss";

export default function MainPage() {
    const [view, setView] = useState("calendar");
    const [eventOpen, setEventOpen] = useState(false);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [initialDate, setInitialDate] = useState(null);

    const [filterMasters, setFilterMasters] = useState([]);
    const [filterServices, setFilterServices] = useState([]);

    // При клике по дню приходит Date → используем его,
    // при клике по кнопке — undefined → ставим today.
    const openNewEvent = (clickedDate) => {
        const dateToUse = clickedDate instanceof Date ? clickedDate : new Date();
        setInitialDate(dateToUse);
        setEventOpen(true);
    };

    const applyFilters = (masters, services) => {
        setFilterMasters(masters);
        setFilterServices(services);
        setFiltersOpen(false);
    };

    return (
        <div className={styles.page}>
            <div className={styles.content}>
                <header className={styles.header}>
                    <ViewToggle view={view} onChange={setView} />
                    <Button variant="primary" onClick={() => openNewEvent()}>
                        <FiPlus /> <span>Add event</span>
                    </Button>
                </header>

                {view === "calendar" ? (
                    <CalendarView
                        filters={{ masters: filterMasters, services: filterServices }}
                        onDayClick={openNewEvent}
                        onFilterClick={() => setFiltersOpen(true)}
                    />
                ) : (
                    <ListView
                        filters={{ masters: filterMasters, services: filterServices }}
                        onFilterClick={() => setFiltersOpen(true)}
                    />
                )}
            </div>

           
            <AddEventModal
                key={initialDate ? initialDate.toISOString() : "today"}
                isOpen={eventOpen}
                onClose={() => setEventOpen(false)}
                initialDate={initialDate}
            />

            <Drawer
                isOpen={filtersOpen}
                onClose={() => setFiltersOpen(false)}
                title="Filters">
                <Filters
                    initialMasters={filterMasters}
                    initialServices={filterServices}
                    onApply={applyFilters}
                    onCancel={() => setFiltersOpen(false)}
                />
            </Drawer>
        </div>
    );
}
