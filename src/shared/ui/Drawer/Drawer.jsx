
import { AnimatePresence, motion as Motion } from "framer-motion";
import { FiX } from "react-icons/fi";
import styles from "./Drawer.module.scss";

export function Drawer({ isOpen, onClose, title, children }) {
    return (
        <AnimatePresence initial={false} exitBeforeEnter>
            {isOpen && (
                <>
                   
                    <Motion.div
                        className={styles.backdrop}
                        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        animate={{ opacity: 0.5, backdropFilter: "blur(2px)" }}
                        exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        onClick={onClose}
                    />

                    
                    <Motion.aside
                        className={styles.drawer}
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 28,
                        }}>
                        <header className={styles.header}>
                            <h2 className={styles.title}>{title}</h2>
                            <button
                                className={styles.closeBtn}
                                onClick={onClose}
                                aria-label="Close">
                                <Motion.span
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}>
                                    <FiX size={20} />
                                </Motion.span>
                            </button>
                        </header>

                        
                        <Motion.div
                            className={styles.body}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ delay: 0.1, duration: 0.2 }}>
                            {children}
                        </Motion.div>
                    </Motion.aside>
                </>
            )}
        </AnimatePresence>
    );
}
