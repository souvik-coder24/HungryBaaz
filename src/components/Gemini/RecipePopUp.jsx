import React, { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { LuClipboardList } from 'react-icons/lu';
import { Puff } from 'react-loader-spinner';
import toast from 'react-hot-toast';
import logoAI from '../../assets/Logo/HungryAI.png';

const RecipePopUp = ({ isOpen, onClose, result }) => {
    const [loading, setLoading] = useState(true);
    const [formattedResult, setFormattedResult] = useState('');

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            const timer = setTimeout(() => {
                setLoading(false);
            }, 8000);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    useEffect(() => {
        if (result) {
            setFormattedResult(formatRecipeText(result));
            setLoading(false);
        }
    }, [result]);

    const formatRecipeText = (text) => {
        let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        formattedText = formattedText.split('*').join('<br />');
        return formattedText;
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(result)
            .then(() => toast.success('Recipe copied to clipboard!'))
            .catch(err => console.error('Failed to copy recipe: ', err));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-lg w-[90%] sm:w-[80%] md:w-[70%] max-w-4xl relative flex flex-col">
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex gap-3 sm:gap-4">
                    <LuClipboardList className="text-lg sm:text-xl cursor-pointer text-blue-600" onClick={handleCopy} />
                    <IoClose className="text-lg sm:text-xl cursor-pointer" onClick={onClose} />
                </div>
                <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-2">
                    <img src={logoAI} alt="AI-Logo" className="w-20 h-10 sm:w-40 sm:h-10" />
                </div>
                <div className="mt-4 max-h-[60vh] sm:max-h-[70vh] md:max-h-[80vh] overflow-y-auto recipe-content">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-full">
                            <Puff
                                color="#3498db"
                                height={80}
                                width={80}
                            />
                            <p className="mt-4 text-sm text-slate-500 text-center">The recipe is being carefully prepared. Please give us a moment to provide you with the best possible result.</p>
                        </div>
                    ) : (
                        <div className="recipe-html" dangerouslySetInnerHTML={{ __html: formattedResult }} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecipePopUp;