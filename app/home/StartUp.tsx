'use client'
import React from 'react';
import { Sparkles, PenLine, GraduationCap, Sun, EggFried } from 'lucide-react';
import { Button } from '@/components/ui/button';
export default function StartUp() {

    const buttons = [
        { label: 'Dashboard', link:'', icon: <Sparkles size={18} className="text-orange-500 dark:text-orange-400" /> },
        { label: 'Hatchiry', link:'', icon: <EggFried size={18} /> },
    ];
    return (
        <div className="flex flex-col items-start justify-center   text-slate-900 dark:text-white p-8 mr-4  transition-colors duration-300">
            <div className="max-w-2xl w-full space-y-8">

                {/* Header Section */}
                <header className="space-y-2">
                    <p className="text-xl font-medium ">
                        Hi There!
                    </p>
                    <h1 className="text-4xl  font-semibold tracking-tight">
                        Where should we start?
                    </h1>
                </header>

                {/* Buttons Section */}
                <div className="flex flex-col items-start space-y-3">
                    {buttons.map((btn, index) => (
                        <Button
                            onClick={() => console.log("test")}
                            key={index}
                            className={`flex items-center gap-3 px-6 py-3  h-10 rounded-full transition-all duration-200`}
                        >
                            <span>{btn.icon}</span>
                            <span className="text-lg font-medium group-hover:dark:text-white">
                                {btn.label}
                            </span>
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
};


