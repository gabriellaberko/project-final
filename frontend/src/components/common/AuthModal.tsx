import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthCard } from "../common/AuthCard";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  open: boolean;
  onClose: () => void;
  initialTab: number;
};


export const AuthModal = ({ open, onClose, initialTab }: Props) => {
  const [tab, setTab] = useState(initialTab);

  const navigate = useNavigate();

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);


  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">

          {/* overlay */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />

          {/* modal content */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.25 }}
            className="
              relative z-10
              w-full md:max-w-xl
              px-4 md:px-0
              pb-6 md:pb-0
              max-h-[90vh] overflow-y-auto
            "
            onClick={(e) => e.stopPropagation()}
          >

            {/* mobile handle */}
            <div className="flex justify-center mb-3 md:hidden">
              <div className="h-1 w-10 rounded-full bg-gray-300" />
            </div>

            <AuthCard
              activeTab={tab}
              onTabChange={(value) => {
                setTab(value);
                navigate(value === 0 ? "/signup" : "/login", { replace: true });
              }}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};