import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { IoClose} from "react-icons/io5";
import { LuClipboardList } from "react-icons/lu";
import { Puff } from 'react-loader-spinner';
import logoAI from '../../assets/Logo/HungryAI.png';
import toast from 'react-hot-toast';

const formatResult = (text) => {
    let formattedText = text.replace(/\*\*/g, '<br>');
    formattedText = formattedText.replace(/\*([^*]+)\*/g, '<b>$1</b>');
    return formattedText;
};

const RecipePopUp = ({ isOpen, onClose, result }) => {
    const [loading, setLoading] = useState(true);
    const [formattedResult, setFormattedResult] = useState('');

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            const timer = setTimeout(() => {
                setLoading(false);
            }, 6000);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    useEffect(() => {
        if (result) {
            setFormattedResult(formatResult(result));
            setLoading(false);
        }
    }, [result]);

    const handleCopy = () => {
        navigator.clipboard.writeText(result)
            .then(() => toast.success('Recipe copied to clipboard!'))
            .catch(err => console.error('Failed to copy recipe: ', err));
    };

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-gray-900/20 bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[70%] max-w-3xl">
                <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
                    <img src={logoAI} alt="AI-Logo" className='w-20 h-10'/>
                    <div className='flex gap-7'>
                        <LuClipboardList className="mr-2 cursor-pointer" onClick={handleCopy} />
                        <IoClose className="text-xl cursor-pointer" onClick={onClose} />
                    </div>
                </div>
                <div className="flex justify-between items-center mb-4">
                </div>
                <div className="mt-4 max-h-[400px] overflow-y-auto recipe-content">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-full">
                            <Puff
                                color="#3498db"
                                height={100}
                                width={100}
                            />
                            <p className="mt-4 text-sm text-slate-500">The recipe is being carefully prepared. Please give us a moment to provide you with the best possible result.</p>
                        </div>
                    ) : (
                        <div className="recipe-html" dangerouslySetInnerHTML={{ __html: formattedResult }} />
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default RecipePopUp;
