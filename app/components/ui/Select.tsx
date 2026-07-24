"use client";

import React, {
  forwardRef,
  useId,
  useRef,
  useState,
  useEffect,
  useMemo,
} from "react";
import { FiChevronDown, FiCheck, FiSearch, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, className = "", id, children, value, onChange, disabled, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    
    const containerRef = useRef<HTMLDivElement>(null);
    const nativeSelectRef = useRef<HTMLSelectElement | null>(null);

    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Detect mobile viewport
    useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
      };
      checkMobile();
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Extract options from children
    const options = useMemo(() => {
      const parsedOptions: SelectOption[] = [];
      
      const parseChild = (child: React.ReactNode) => {
        if (!React.isValidElement(child)) return;
        
        const element = child as React.ReactElement<{
          value?: any;
          children?: React.ReactNode;
          disabled?: boolean;
        }>;

        if (element.type === "option") {
          parsedOptions.push({
            value: String(element.props.value ?? ""),
            label: String(element.props.children ?? ""),
            disabled: !!element.props.disabled,
          });
        } else if (element.type === React.Fragment) {
          React.Children.forEach(element.props.children, parseChild);
        }
      };

      React.Children.forEach(children, parseChild);
      return parsedOptions;
    }, [children]);

    // Local state to track selected value
    const [selectedValue, setSelectedValue] = useState<string>(() => {
      if (value !== undefined) return String(value);
      if (props.defaultValue !== undefined) return String(props.defaultValue);
      return options[0]?.value || "";
    });

    // Update selected value when value prop changes
    useEffect(() => {
      if (value !== undefined) {
        setSelectedValue(String(value));
      }
    }, [value]);

    // Find active option
    const activeOption = useMemo(() => {
      return options.find((opt) => opt.value === selectedValue) || options[0];
    }, [options, selectedValue]);

    // Handle selection change
    const handleSelectOption = (optionValue: string) => {
      setSelectedValue(optionValue);
      setIsOpen(false);
      setSearchQuery("");

      const selectEl = nativeSelectRef.current;
      if (selectEl) {
        // Set value on hidden native select
        const nativeSelectValueSetter = Object.getOwnPropertyDescriptor(
          HTMLSelectElement.prototype,
          "value"
        )?.set;
        
        if (nativeSelectValueSetter) {
          nativeSelectValueSetter.call(selectEl, optionValue);
        } else {
          selectEl.value = optionValue;
        }

        // Trigger native change event so react listener notices
        const event = new Event("change", { bubbles: true });
        selectEl.dispatchEvent(event);
      }
    };

    // Close on click outside (for desktop dropdown mode)
    useEffect(() => {
      if (!isOpen || isMobile) return;

      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsOpen(false);
          setSearchQuery("");
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, isMobile]);

    // Filter options by search query
    const filteredOptions = useMemo(() => {
      if (!searchQuery) return options;
      const lowerQuery = searchQuery.toLowerCase();
      return options.filter((opt) =>
        opt.label.toLowerCase().includes(lowerQuery)
      );
    }, [options, searchQuery]);

    // Clean placeholder search text
    const searchPlaceholder = `Search ${label || "options"}...`;

    // Forward ref to native select
    const setRefs = (node: HTMLSelectElement | null) => {
      nativeSelectRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLSelectElement | null>).current = node;
      }
    };

    return (
      <div className="flex flex-col gap-1.5 relative w-full" ref={containerRef}>
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-dark dark:text-zinc-200">
            {label}
          </label>
        )}

        {/* Hidden native select for form integration */}
        <select
          ref={setRefs}
          id={inputId}
          value={selectedValue}
          onChange={onChange}
          disabled={disabled}
          className="sr-only"
          {...props}
        >
          {children}
        </select>

        {/* Custom trigger button */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className={[
            "w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-zinc-800 text-sm transition-colors text-dark dark:text-zinc-100 flex items-center justify-between text-left cursor-pointer",
            disabled ? "bg-zinc-50 dark:bg-zinc-900/50 text-zinc-400 dark:text-zinc-650 cursor-not-allowed border-zinc-200 dark:border-zinc-800" : "border-border dark:border-zinc-700/50",
            error ? "border-red-400 focus:ring-red-500/30 focus:border-red-400" : "focus:outline-none focus:ring-2 focus:ring-deepgreen/30 dark:focus:ring-blue-500/30 focus:border-deepgreen dark:focus:border-blue-500",
            className,
          ].join(" ")}
        >
          <span className="truncate">{activeOption ? activeOption.label : "Select..."}</span>
          <FiChevronDown className={`w-4 h-4 text-zinc-450 dark:text-zinc-450 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {error && <p className="text-xs text-red-600 mt-1">{error}</p>}

        {/* DESKTOP DROPDOWN VIEW */}
        <AnimatePresence>
          {isOpen && !isMobile && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 right-0 z-50 mt-1.5 max-h-60 overflow-y-auto rounded-xl border border-slate-200 dark:border-zinc-800/80 bg-white/95 dark:bg-[#0E0F12]/95 backdrop-blur-md shadow-xl py-1.5 focus:outline-none flex flex-col"
            >
              {options.length > 8 && (
                <div className="px-2 pb-1.5 pt-0.5 sticky top-0 bg-white/95 dark:bg-[#0E0F12]/95 z-10 border-b border-slate-100 dark:border-zinc-800/50">
                  <div className="relative">
                    <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-450 dark:text-zinc-500 w-3.5 h-3.5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={searchPlaceholder}
                      className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-zinc-800/60 bg-slate-50 dark:bg-zinc-900/50 focus:outline-none focus:border-deepgreen dark:focus:border-blue-500 text-dark dark:text-zinc-200"
                    />
                  </div>
                </div>
              )}
              <div className="overflow-y-auto max-h-48 py-1">
                {filteredOptions.length === 0 ? (
                  <p className="text-xs text-zinc-400 dark:text-zinc-550 text-center py-4">No results found</p>
                ) : (
                  filteredOptions.map((opt) => {
                    const isSelected = opt.value === selectedValue;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        disabled={opt.disabled}
                        onClick={() => handleSelectOption(opt.value)}
                        className={[
                          "w-full text-left px-3.5 py-2 text-xs transition-colors flex items-center justify-between cursor-pointer",
                          opt.disabled
                            ? "text-zinc-350 dark:text-zinc-650 cursor-not-allowed bg-transparent"
                            : isSelected
                            ? "bg-deepgreen/5 dark:bg-blue-500/5 text-deepgreen dark:text-blue-400 font-semibold"
                            : "text-zinc-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-850/60",
                        ].join(" ")}
                      >
                        <span className="truncate">{opt.label}</span>
                        {isSelected && <FiCheck className="w-3.5 h-3.5 text-deepgreen dark:text-blue-400 flex-shrink-0 ml-2" />}
                      </button>
                    );
                  })
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MOBILE MODAL VIEW */}
        <AnimatePresence>
          {isOpen && isMobile && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/65 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-[#0E0F12] border dark:border-zinc-800 text-dark dark:text-white rounded-2xl w-full max-w-sm max-h-[80vh] flex flex-col shadow-2xl overflow-hidden"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-border dark:border-zinc-800/80 bg-white dark:bg-[#0E0F12]">
                  <h3 className="text-sm font-bold text-dark dark:text-white">
                    {label ? `Select ${label}` : "Choose option"}
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      setSearchQuery("");
                    }}
                    className="text-zinc-400 hover:text-dark dark:hover:text-white text-lg leading-none cursor-pointer flex items-center justify-center w-6 h-6"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>

                {/* Optional Search */}
                {options.length > 5 && (
                  <div className="px-5 py-3 border-b border-slate-100 dark:border-zinc-800/50 bg-slate-50/50 dark:bg-zinc-900/20">
                    <div className="relative">
                      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-450 dark:text-zinc-500 w-4 h-4" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={searchPlaceholder}
                        className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:outline-none focus:border-deepgreen dark:focus:border-blue-500 text-dark dark:text-zinc-200"
                      />
                    </div>
                  </div>
                )}

                {/* Modal Options List */}
                <div className="p-3 overflow-y-auto flex-1 space-y-1">
                  {filteredOptions.length === 0 ? (
                    <p className="text-xs text-zinc-400 dark:text-zinc-550 text-center py-8">No results found</p>
                  ) : (
                    filteredOptions.map((opt) => {
                      const isSelected = opt.value === selectedValue;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          disabled={opt.disabled}
                          onClick={() => handleSelectOption(opt.value)}
                          className={[
                            "w-full text-left px-4 py-3 text-sm rounded-xl transition-colors flex items-center justify-between cursor-pointer",
                            opt.disabled
                              ? "text-zinc-350 dark:text-zinc-650 cursor-not-allowed opacity-50"
                              : isSelected
                              ? "bg-deepgreen/5 dark:bg-blue-500/5 text-deepgreen dark:text-blue-400 font-semibold"
                              : "text-zinc-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-850/60",
                          ].join(" ")}
                        >
                          <span className="truncate">{opt.label}</span>
                          {isSelected && <FiCheck className="w-4 h-4 text-deepgreen dark:text-blue-400 flex-shrink-0" />}
                        </button>
                      );
                    })
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Select.displayName = "Select";
