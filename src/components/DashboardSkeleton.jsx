import React from 'react';

export default function DashboardSkeleton() {
    return (
        <div className="min-h-screen bg-[#FDFBF6] font-sans text-gray-800 animate-pulse">
            <div className="flex flex-col lg:flex-row">
                <aside className="bg-[#E0E7E1] w-full lg:w-64 p-4 lg:p-6 lg:min-h-screen">
                    <div className="flex items-center mb-8">
                        <div className="w-10 h-10 bg-gray-300 rounded-full" />
                        <div className="ml-3 h-6 w-32 bg-gray-300 rounded" />
                    </div>
                    <div className="space-y-3">
                        <div className="h-10 bg-gray-300 rounded" />
                        <div className="h-10 bg-gray-300 rounded" />
                        <div className="h-10 bg-gray-300 rounded" />
                    </div>
                </aside>
                <main className="flex-1 p-4 sm:p-6 md:p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <div className="h-6 w-48 bg-gray-300 rounded mb-2" />
                            <div className="h-4 w-64 bg-gray-200 rounded" />
                        </div>
                        <div className="w-12 h-12 bg-gray-300 rounded-full" />
                    </div>
                    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md mb-8">
                        <div className="h-5 w-56 bg-gray-200 rounded mb-3" />
                        <div className="h-8 w-40 bg-gray-300 rounded" />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-2xl shadow-md">
                            <div className="h-5 w-64 bg-gray-200 rounded mb-4" />
                            <div className="h-[300px] w-full bg-gray-200 rounded" />
                        </div>
                        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md">
                            <div className="h-5 w-56 bg-gray-200 rounded mb-4" />
                            <div className="space-y-3">
                                <div className="h-4 w-full bg-gray-200 rounded" />
                                <div className="h-4 w-3/4 bg-gray-200 rounded" />
                                <div className="h-px w-full bg-gray-100" />
                                <div className="h-4 w-2/3 bg-gray-200 rounded" />
                                <div className="h-4 w-1/2 bg-gray-200 rounded" />
                                <div className="h-px w-full bg-gray-100" />
                                <div className="h-5 w-2/3 bg-gray-300 rounded" />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
