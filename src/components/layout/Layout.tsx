import type { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { StoreStatusAlert } from '../ui/StoreStatusAlert';
interface LayoutProps {
    children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden relative flex flex-col font-sans">

            {/* Background Texture Layer (Optimized opacity for mobile readability) */}
            <div className="fixed inset-0 bg-noise pointer-events-none z-0 mix-blend-overlay opacity-40 md:opacity-50" />
            <StoreStatusAlert />
            {/* Navbar (Fixed position managed inside Navbar component styling if needed, or stick here) */}
            <Navbar />

            {/* Main Content - Flex Grow pushes footer down */}
            <main className="flex-grow relative z-10 w-full max-w-[100vw]">
                {children}
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}