import { GiDumpling, GiBanana, GiPotato, GiMoon, GiSodaCan, GiKnifeFork } from 'react-icons/gi';
import { motion } from 'framer-motion';

interface CategoryNavProps {
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
}

const categories = [
    // Botón "Todos" al principio
    { id: 'all', name: 'Todos', icon: GiKnifeFork },
    { id: 'empanadas', name: 'Empanadas', icon: GiDumpling },
    { id: 'patacones', name: 'Patacones', icon: GiBanana },
    { id: 'papas', name: 'Papas', icon: GiPotato },
    { id: 'fritos', name: 'Fritos', icon: GiMoon },
    { id: 'bebidas', name: 'Bebidas', icon: GiSodaCan }
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
        opacity: 1, scale: 1, y: 0,
        transition: { type: "spring", stiffness: 300, damping: 20 }
    }
};

export function CategoryNav({ selectedCategory, onSelectCategory }: CategoryNavProps) {
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="flex flex-wrap justify-center gap-6 md:gap-10 py-12"
        >
            {categories.map((cat) => {
                // Verificamos si este botón es el que está activo
                const isActive = selectedCategory === cat.id;

                return (
                    <motion.button
                        key={cat.id}
                        variants={itemVariants}
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onSelectCategory(cat.id)}
                        className="group flex flex-col items-center gap-3 will-change-transform"
                    >
                        {/* Círculo del Icono */}
                        <div className={`relative w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center backdrop-blur-sm border transition-all duration-300 
                            ${isActive
                                ? "bg-gold/20 border-gold shadow-[0_0_15px_rgba(255,215,0,0.3)]" // Estilo Activo
                                : "bg-black/40 border-gold/30 group-hover:border-gold" // Estilo Inactivo
                            }`}
                        >
                            <cat.icon
                                className={`w-6 h-6 md:w-8 md:h-8 transition-colors duration-300 relative z-10 
                                    ${isActive ? "text-gold" : "text-gold/70 group-hover:text-gold"}`}
                            />

                            {/* Anillo animado (solo visible en hover o activo) */}
                            <div className={`absolute inset-0 rounded-full border transition-all duration-500 
                                ${isActive ? "border-gold scale-110" : "border-gold/0 group-hover:border-gold/30 group-hover:scale-110"}`}
                            />
                        </div>

                        <span className={`text-xs md:text-sm uppercase tracking-widest transition-colors duration-300 font-medium 
                            ${isActive ? "text-gold" : "text-gray-400 group-hover:text-gold"}`}>
                            {cat.name}
                        </span>
                    </motion.button>
                );
            })}
        </motion.div>
    );
}