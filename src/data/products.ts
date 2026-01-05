import type { Product } from '../types';

// --- TUS IMPORTS DE IMÁGENES (SE MANTIENEN IGUAL) ---
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
    {
        id: '1',
        name: 'Empanada de Carne',
        description: 'Clásica empanada de harina de trigo rellena de carne molida con el sazón de la casa.',
        price: 2000,
        category: 'empanadas',
        image: EmpanadaCarne,
        isPopular: true,
        ingredients: ['Harina de Trigo', 'Carne Molida', 'Guiso Criollo', 'Especias'],
        calories: 180,
    },
    {
        id: '2',
        name: 'Empanada de Carne (Maíz)',
        description: 'Masa crocante de maíz amarillo rellena de carne molida guisada.',
        price: 2000,
        category: 'empanadas',
        image: EmpanadaCarneMaiz,
        ingredients: ['Maíz Amarillo', 'Carne Molida', 'Guiso Casero'],
        calories: 240
    },
    {
        id: '3',
        name: 'Empanada de Pollo',
        description: 'Empanada de harina rellena de pollo desmechado jugoso.',
        price: 2000,
        category: 'empanadas',
        image: EmpanadaPollo,
        ingredients: ['Harina de Trigo', 'Pechuga de Pollo', 'Verduras Frescas', 'Caldo de Pollo'],
        calories: 180
    },
    {
        id: '4',
        name: 'Empanada de Pollo (Maíz)',
        description: 'Crocante masa de maíz con relleno de pollo y guisado.',
        price: 2000,
        category: 'empanadas',
        image: EmpanadaPolloMaiz,
        ingredients: ['Maíz Amarillo', 'Pollo Desmechado', 'Guiso Casero'],
        calories: 240
    },
    {
        id: '5',
        name: 'Empanada Hawaiana',
        description: 'La combinación perfecta de jamón, queso costeño y piña dulce.',
        price: 2000,
        category: 'empanadas',
        image: EmpanadaHawaiana,
        ingredients: ['Harina de Trigo', 'Jamón Ahumado', 'Queso Costeño', 'Piña Hervida'],
        calories: 225
    },
    {
        id: '6',
        name: 'Empanada Cubana',
        description: 'Rellena de pollo desmechado, jamón y su queso costeño.',
        price: 2000,
        category: 'empanadas',
        image: EmpanadaCubana,
        ingredients: ['Harina de Trigo', 'Pollo Desmechado', 'Jamón Ahumado', 'Queso Costeño Bajo en Sal'],
        calories: 180,
    },
    {
        id: '7',
        name: 'Empanada China',
        description: 'Un toque oriental con raíces, verduras salteadas y carnes.',
        price: 2000,
        category: 'empanadas',
        image: EmpanadaChina,
        ingredients: ['Raíces Chinas', 'Zanahoria', 'Carne Desmechada', 'Salsa de Soya', 'Harina'],
        calories: 180
    },

    // --- FRITOS ---
    {
        id: '8',
        name: 'Deditos de Queso',
        description: 'Masa hojaldrada envolviendo un trozo generoso de queso costeño.',
        price: 2000,
        category: 'fritos',
        image: Dedito,
        isPopular: true,
        ingredients: ['Masa', 'Queso Costeño Bajo en Sal', 'Mantequilla'],
        calories: 150  
    },
    {
        id: '9',
        name: 'Carimañola de Carne',
        description: 'Masa de yuca frita rellena de carne molida.',
        price: 2500,
        category: 'fritos',
        image: CarimanolaCarne,
        ingredients: ['Yuca Fresca', 'Carne Molida', 'Guiso', 'Especias'],
        calories: 200
    },
    {
        id: '10',
        name: 'Carimañola de Pollo',
        description: 'Masa de yuca frita rellena de pollo desmechado.',
        price: 2500,
        category: 'fritos',
        image: CarimanolaPollo,
        ingredients: ['Yuca Fresca', 'Pollo Desmechado', 'Verduras', 'Especias'],
        calories: 200
    },
    {
        id: '11',
        name: 'Buñuelos',
        description: 'Tradicionales, redonditos y calientes. Queso y masa en su punto.',
        price: 1200,
        category: 'fritos',
        image: Bunuelos,
        ingredients: ['Queso Costeño', 'Fécula de Maíz', 'Queso Molido', 'Huevo'],
        calories: 180
    },

    // --- PAPAS ---
    {
        id: '12',
        name: 'Papa Rellena de Carne',
        description: 'Bola de puré de papa apanada rellena de carne guisada y verduras.',
        price: 3000,
        category: 'papas',
        image: PapaCarne,
        ingredients: ['Puré de Papa', 'Carne Guisada', 'Verduras', 'Rebozado Crocante'],
        calories: 400,
    },
    {
        id: '13',
        name: 'Papa Carne con Huevo',
        description: 'Nuestra famosa papa rellena de carne con un huevo cocido entero en su interior.',
        price: 3000,
        category: 'papas',
        image: PapaCarneHuevo,
        isPopular: true,
        ingredients: ['Puré de Papa', 'Carne Molida', 'Capa Crocante', 'Huevo Cocido Entero'],
        calories: 490
    },
    {
        id: '14',
        name: 'Papa Rellena de Pollo',
        description: 'Bola de puré de papa apanada rellena de pollo guisado.',
        price: 3000,
        category: 'papas',
        image: PapaPollo,
        ingredients: ['Puré de Papa', 'Pollo Guisado', 'Especias', 'Rebozado'],
        calories: 400
    },
    {
        id: '15',
        name: 'Papa Pollo con Huevo',
        description: 'Papa rellena de pollo con huevo cocido en su interior.',
        price: 3000,
        category: 'papas',
        image: PapaPolloHuevo,
        ingredients: ['Pollo Desmechado', 'Puré de Papa', 'Rebozado', 'Huevo Cocido Entero',],
        calories: 490
    },

    // --- PATACONES ---
    {
        id: '16',
        name: 'Patacón con Carne',
        description: 'Patacón de guineo verde pisado con carne desmechada.',
        price: 5000,
        category: 'patacones',
        image: PataconCarne,
        ingredients: ['Plátano Verde', 'Carne Desmechada', 'Guiso', 'Rebozado'],
        calories: 550
    },
    {
        id: '17',
        name: 'Patacón con Pollo',
        description: 'Patacón de guineo verde pisado con pollo desmechado.',
        price: 5000,
        category: 'patacones',
        image: PataconPollo,
        ingredients: ['Plátano Verde', 'Pollo Desmechado', 'Guiso', 'Rebozado'],
        calories: 550
    },
    {
        id: '18',
        name: 'Patacón Trifásico',
        description: 'La bestia: Patacón de guineo verde pisado con Carne, Pollo y Chicharrón crocante en trozos.',
        price: 5500,
        category: 'patacones',
        image: PataconTrifasico,
        isPopular: true,
        ingredients: ['Guineo Verde', 'Carne Desmechada', 'Pollo Desmechado', 'Chicharrón Carnudo', 'Guiso', 'Rebozado'],
        calories: 750
    },
];