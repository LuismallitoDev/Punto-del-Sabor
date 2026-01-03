import { HeroCarousel } from '../components/HeroCarousel';
import { CategoryNav } from '../components/CategoryNav';
import { FoodPlate } from '../components/FoodPlate';
import { motion } from 'framer-motion';
const dishes = [{
  title: 'Seared Scallops',
  description: 'Hokkaido scallops, cauliflower purée, truffle oil, micro greens',
  price: '$42',
  imageGradient: 'bg-gradient-to-br from-orange-100 to-orange-200'
}, {
  title: 'Wagyu Ribeye',
  description: 'A5 Japanese Wagyu, roasted garlic, red wine reduction',
  price: '$125',
  imageGradient: 'bg-gradient-to-br from-red-900 to-rose-950'
}, {
  title: 'Black Cod',
  description: 'Miso glazed, bok choy, ginger dashi broth',
  price: '$58',
  imageGradient: 'bg-gradient-to-br from-amber-100 to-amber-200'
}, {
  title: 'Truffle Risotto',
  description: 'Carnaroli rice, wild mushrooms, parmesan crisp',
  price: '$38',
  imageGradient: 'bg-gradient-to-br from-yellow-100 to-yellow-200'
}, {
  title: 'Lobster Thermidor',
  description: 'Maine lobster, cognac cream sauce, gruyère cheese',
  price: '$85',
  imageGradient: 'bg-gradient-to-br from-red-100 to-red-200'
}, {
  title: 'Chocolate Soufflé',
  description: 'Valrhona dark chocolate, crème anglaise, gold leaf',
  price: '$24',
  imageGradient: 'bg-gradient-to-br from-stone-800 to-stone-900'
}];
export function RestaurantLanding() {
  return <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
    {/* Background Texture Layer */}
    <div className="fixed inset-0 bg-noise pointer-events-none z-50 mix-blend-overlay opacity-50" />

    {/* Navigation Header */}
    <nav className="absolute top-0 w-full z-50 px-6 py-6 flex justify-between items-center border-b border-white/5 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
      <div className="text-2xl font-serif font-bold tracking-widest text-white">
        LUMIÈRE
      </div>
      <div className="hidden md:flex gap-8 text-sm uppercase tracking-widest text-gray-300">
        <a href="#" className="hover:text-gold transition-colors">
          Menu
        </a>
        <a href="#" className="hover:text-gold transition-colors">
          Reservations
        </a>
        <a href="#" className="hover:text-gold transition-colors">
          Private Dining
        </a>
        <a href="#" className="hover:text-gold transition-colors">
          Contact
        </a>
      </div>
      <button className="md:hidden text-white">
        <span className="block w-6 h-0.5 bg-white mb-1.5"></span>
        <span className="block w-6 h-0.5 bg-white mb-1.5"></span>
        <span className="block w-4 h-0.5 bg-white ml-auto"></span>
      </button>
    </nav>

    {/* Hero Section */}
    <HeroCarousel />

    {/* Categories Section */}
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505] to-[#0a0a0a]" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <span className="text-gold text-xs uppercase tracking-[0.2em] mb-3 block">
            Discover
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-4">
            Our Menu
          </h2>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto opacity-50" />
        </div>
        <CategoryNav />
      </div>
    </section>

    {/* Featured Dishes Section */}
    <section className="py-24 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-900/40 via-[#0a0a0a] to-[#0a0a0a] -z-10" />

      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <span className="text-gold text-xs uppercase tracking-[0.2em] mb-3 block">
            Signature
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">
            Chef's Selection
          </h2>
          <p className="max-w-xl mx-auto text-gray-400 font-light leading-relaxed">
            A curation of our finest culinary creations, featuring seasonal
            ingredients and innovative techniques.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-20">
          {dishes.map((dish, index) => <FoodPlate key={index} {...dish} delay={index * 0.1} />)}
        </div>

        <div className="mt-24 text-center">
          <motion.button whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }} className="px-10 py-4 border border-gold/50 text-gold hover:bg-gold hover:text-black transition-all duration-300 uppercase tracking-widest text-xs font-semibold">
            View Full Menu
          </motion.button>
        </div>
      </div>
    </section>

    {/* Footer */}
    <footer className="bg-[#050505] py-20 border-t border-white/5 relative">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-serif text-white mb-8">LUMIÈRE</h2>
        <div className="flex justify-center gap-8 mb-12 text-gray-500">
          <a href="#" className="hover:text-gold transition-colors">
            Instagram
          </a>
          <a href="#" className="hover:text-gold transition-colors">
            Facebook
          </a>
          <a href="#" className="hover:text-gold transition-colors">
            Twitter
          </a>
        </div>
        <p className="text-gray-600 text-sm uppercase tracking-widest">
          © 2024 Lumière Restaurant. All rights reserved.
        </p>
      </div>
    </footer>
  </div>;
}