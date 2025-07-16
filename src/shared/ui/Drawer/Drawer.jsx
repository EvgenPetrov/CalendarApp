import { AnimatePresence, motion as Motion } from "framer-motion";
import { FiX } from "react-icons/fi";
import styles from "./Drawer.module.scss";

export function Drawer({ isOpen, onClose, title, children }) {
    return (
        <AnimatePresence initial={false}>
            {isOpen && (
                <>
                    <Motion.div
                        className={styles.backdrop}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                    <Motion.aside
                        className={styles.drawer}
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}>
                        <header className={styles.header}>
                            <h2 className={styles.title}>{title}</h2>
                            <button
                                className={styles.closeBtn}
                                onClick={onClose}
                                aria-label="Close">
                                <FiX size={20} />
                            </button>
                        </header>
                        <div className={styles.body}>{children}</div>
                    </Motion.aside>
                </>
            )}
        </AnimatePresence>
    );
}
