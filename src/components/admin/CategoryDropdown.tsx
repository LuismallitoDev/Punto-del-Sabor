import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CategoryDropdownProps {
    value: string;
    onChange: (val: string) => void;
}

const CATEGORIES = [
    { value: 'empanadas', label: 'Empanadas' },
    { value: 'papas', label: 'Papas' },
    { value: 'patacones', label: 'Patacones' },
    { value: 'fritos', label: 'Fritos' },
    { value: 'bebidas', label: 'Bebidas' }
];

export function CategoryDropdown({ value, onChange }: CategoryDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full bg-white/5 border rounded p-3 text-white flex justify-between items-center transition-all duration-300
                    ${isOpen ? 'border-gold bg-white/10' : 'border-white/10 hover:border-gold/50'}
                `}
            >
                <span className="capitalize">
                    {CATEGORIES.find(c => c.value === value)?.label || value}
                </span>
                {isOpen ? <ChevronUp size={18} className="text-gold" /> : <ChevronDown size={18} className="text-gray-400" />}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.ul
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 w-full mt-2 bg-[#1a1a1a] border border-white/10 rounded shadow-xl z-50 overflow-hidden max-h-48 overflow-y-auto custom-scrollbar"
                    >
                        {CATEGORIES.map((cat) => (
                            <li key={cat.value}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        onChange(cat.value);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-3 text-sm hover:bg-gold hover:text-black transition-colors
                                        ${value === cat.value ? 'text-gold bg-white/5' : 'text-gray-300'}
                                    `}
                                >
                                    {cat.label}
                                </button>
                            </li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );
}