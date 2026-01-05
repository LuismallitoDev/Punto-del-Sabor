import { Upload, Trash2, Flame, Star } from 'lucide-react';
import { RefObject } from 'react';

interface ImageUploaderProps {
    previewUrl: string;
    fileInputRef: RefObject<HTMLInputElement>;
    onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveImage: (e: React.MouseEvent) => void;
    isPopular: boolean;
    setIsPopular: (val: boolean) => void;
}

export function ImageUploader({
    previewUrl, fileInputRef, onImageChange, onRemoveImage, isPopular, setIsPopular
}: ImageUploaderProps) {
    return (
        <div className="w-full md:w-1/3 flex flex-col gap-4">
            <label className="text-xs uppercase text-gray-400 font-bold">Imagen del Producto</label>
            <div
                onClick={() => fileInputRef.current?.click()}
                className={`
                    relative aspect-square rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer overflow-hidden group transition-all
                    ${previewUrl ? 'border-gold/50' : 'border-white/20 hover:border-gold'}
                `}
            >
                {previewUrl ? (
                    <>
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                            <span className="text-xs text-white bg-black/50 px-2 py-1 rounded">Cambiar foto</span>
                        </div>
                        <button
                            onClick={onRemoveImage}
                            className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors z-20 shadow-lg"
                            title="Eliminar imagen"
                            type="button"
                        >
                            <Trash2 size={16} />
                        </button>
                    </>
                ) : (
                    <div className="text-center text-gray-500">
                        <Upload className="mx-auto mb-2 opacity-50" />
                        <span className="text-xs">Click para subir</span>
                    </div>
                )}
            </div>
            <input
                type="file"
                ref={fileInputRef}
                onChange={onImageChange}
                accept="image/*"
                className="hidden"
            />

            {/* Toggle Popular */}
            <div
                onClick={() => setIsPopular(!isPopular)}
                className={`
                    flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all
                    ${isPopular ? 'bg-gold/10 border-gold' : 'bg-white/5 border-white/10 hover:border-white/30'}
                `}
            >
                <div className="flex items-center gap-2">
                    {isPopular ? <Flame className="text-gold animate-pulse" size={18} /> : <Star className="text-gray-500" size={18} />}
                    <span className={`text-sm font-bold uppercase ${isPopular ? 'text-gold' : 'text-gray-400'}`}>
                        {isPopular ? 'Es Popular' : 'Normal'}
                    </span>
                </div>
                <div className={`w-10 h-5 rounded-full relative transition-colors ${isPopular ? 'bg-gold' : 'bg-gray-600'}`}>
                    <div className={`absolute top-1 w-3 h-3 bg-black rounded-full transition-all ${isPopular ? 'left-6' : 'left-1'}`} />
                </div>
            </div>
        </div>
    );
}