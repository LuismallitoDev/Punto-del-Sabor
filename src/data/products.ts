import type { Product } from '../types';

// --- IMPORTACIÓN DE IMÁGENES ---
import EmpanadaCarne from '../assets/Empanada_Carne.jpg';
import EmpanadaCarneMaiz from '../assets/Empanada_Carne_Maiz.png';
import EmpanadaPollo from '../assets/Empanada_Pollo.png';
import EmpanadaPolloMaiz from '../assets/Empanada_Pollo_Maiz.png';
import EmpanadaHawaiana from '../assets/Empanada_Hawaiana.png';
import EmpanadaCubana from '../assets/Empanada_Cubana.png';
import EmpanadaChina from '../assets/Empanada_China.png';

import Dedito from '../assets/Deditos.png';
import Bunuelos from '../assets/Bunuelos.jpg';
import CarimanolaCarne from '../assets/Carimanola_Carne.png';
import CarimanolaPollo from '../assets/Carimanola_Pollo.png';

import PapaCarne from '../assets/Papa_Carne.png';
import PapaCarneHuevo from '../assets/Papa_Carne_Huevo.png';
import PapaPollo from '../assets/Papa_Pollo.png';
import PapaPolloHuevo from '../assets/Papa_Pollo_Huevo.png';

import PataconCarne from '../assets/Patacon_Carne.png';
import PataconPollo from '../assets/Patacon_Pollo.png';
import PataconTrifasico from '../assets/Patacon_Trifasico.png';

export const products: Product[] = [
    // --- EMPANADAS ---
    { id: '1', name: 'Empanada de Carne', description: 'Clásica empanada de harina de trigo rellena de carne molida con el sazón de la casa.', price: 2000, category: 'empanadas', image: EmpanadaCarne, isPopular: true },
    { id: '2', name: 'Empanada de Carne (Maíz)', description: 'Masa crocante de maíz amarillo rellena de carne molida guisada.', price: 2000, category: 'empanadas', image: EmpanadaCarneMaiz },
    { id: '3', name: 'Empanada de Pollo', description: 'Empanada de harina rellena de pollo desmechado jugoso.', price: 2000, category: 'empanadas', image: EmpanadaPollo },
    { id: '4', name: 'Empanada de Pollo (Maíz)', description: 'Crocante masa de maíz con relleno de pollo guisado.', price: 2000, category: 'empanadas', image: EmpanadaPolloMaiz },
    { id: '5', name: 'Empanada Hawaiana', description: 'La combinación perfecta de jamón, queso y piña dulce.', price: 2000, category: 'empanadas', image: EmpanadaHawaiana },
    { id: '6', name: 'Empanada Cubana', description: 'Rellena de carne, tocineta y una mezcla especial de quesos.', price: 2000, category: 'empanadas', image: EmpanadaCubana },
    { id: '7', name: 'Empanada China', description: 'Un toque oriental con raíces, verduras salteadas y carnes.', price: 2000, category: 'empanadas', image: EmpanadaChina },

    // --- FRITOS ---
    { id: '8', name: 'Deditos de Queso', description: 'Masa hojaldrada envolviendo un trozo generoso de queso costeño.', price: 2000, category: 'fritos', image: Dedito, isPopular: true },
    { id: '9', name: 'Carimañola de Carne', description: 'Masa de yuca frita rellena de carne molida.', price: 2500, category: 'fritos', image: CarimanolaCarne },
    { id: '10', name: 'Carimañola de Pollo', description: 'Masa de yuca frita rellena de pollo desmechado.', price: 2500, category: 'fritos', image: CarimanolaPollo },
    { id: '11', name: 'Buñuelos', description: 'Tradicionales, redonditos y calientes. Queso y maíz en su punto.', price: 1200, category: 'fritos', image: Bunuelos },

    // --- PAPAS ---
    { id: '12', name: 'Papa Rellena de Carne', description: 'Bola de puré de papa apanada rellena de carne guisada y verduras.', price: 3000, category: 'papas', image: PapaCarne },
    { id: '13', name: 'Papa Carne con Huevo', description: 'Nuestra famosa papa rellena de carne con un huevo cocido entero en su interior.', price: 3000, category: 'papas', image: PapaCarneHuevo, isPopular: true },
    { id: '14', name: 'Papa Rellena de Pollo', description: 'Bola de puré de papa apanada rellena de pollo guisado.', price: 3000, category: 'papas', image: PapaPollo },
    { id: '15', name: 'Papa Pollo con Huevo', description: 'Papa rellena de pollo con huevo cocido en su interior.', price: 3000, category: 'papas', image: PapaPolloHuevo },

    // --- PATACONES ---
    { id: '16', name: 'Patacón con Carne', description: 'Patacón de guineo verde pisado con carne desmechada, queso costeño y suero.', price: 5000, category: 'patacones', image: PataconCarne },
    { id: '17', name: 'Patacón con Pollo', description: 'Patacón crocante con pollo desmechado, lechuga, queso y salsas.', price: 5000, category: 'patacones', image: PataconPollo },
    { id: '18', name: 'Patacón Trifásico', description: 'La bestia: Carne, Pollo y Chicharron con todo el suero.', price: 5500, category: 'patacones', image: PataconTrifasico, isPopular: true },
];