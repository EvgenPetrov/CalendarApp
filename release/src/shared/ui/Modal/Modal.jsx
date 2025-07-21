import { motion as Motion, AnimatePresence } from "framer-motion";
import styles from "./Modal.module.scss";

export function Modal({ isOpen, onClose, children }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <Motion.div
                        key="backdrop"
                        className={styles.backdrop}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                    <Motion.div
                        key="modal"
                        className={styles.modal}
                        initial={{ y: "-100vh" }}
                        animate={{ y: 0 }}
                        exit={{ y: "-100vh" }}>
                        {children}
                    </Motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
