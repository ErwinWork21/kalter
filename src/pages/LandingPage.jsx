import React from 'react';
import { Stethoscope, BarChart2, FileText, User, ArrowRight, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FeatureCard = ({ icon, title, description }) => (
    <div className="p-8 bg-white rounded-xl shadow-lg flex flex-col transition-transform transform hover:-translate-y-2">
        {React.cloneElement(icon, { className: "w-12 h-12 mx-auto text-[#C89F74] mb-4" })}
        <h4 className="text-xl font-semibold mb-2">{title}</h4>
        <p className="text-gray-600 flex-grow">{description}</p>
    </div>
);

const PricingCard = ({ plan, description, price, originalPrice, period, features, isPopular = false, onClick }) => (
    <div className={`p-8 bg-white rounded-2xl shadow-lg flex flex-col w-full max-w-md ${isPopular ? 'border-4 border-[#C89F74] transform lg:scale-105' : 'border border-gray-200'}`}>
        {isPopular && <span className="bg-[#C89F74] text-white text-xs font-bold px-3 py-1 rounded-full self-center mb-4 -mt-12">Paling Populer</span>}
        <h4 className="text-2xl font-bold text-center">{plan}</h4>
        <p className="text-center text-gray-500 mt-2 mb-4 h-12">{description}</p>
        <div className="text-center my-4">
            <p className="text-gray-400 line-through">Rp {originalPrice}</p>
            <span className="text-4xl font-extrabold">Rp {price}</span>
            {period && <span className="text-gray-500">{period}</span>}
        </div>
        <ul className="space-y-3 my-6 text-gray-600 flex-grow">
            {features.map((feature, index) => (
                <li key={index} className="flex items-start">
                    <span className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-1">•</span>
                    <span>{feature}</span>
                </li>
            ))}
        </ul>
        <button onClick={onClick} className={`w-full mt-6 py-3 px-4 font-bold rounded-lg transition-colors duration-300 ${isPopular ? 'bg-[#C89F74] text-white hover:bg-[#b98e65]' : 'bg-gray-200 text-[#3e4a4f] hover:bg-gray-300'}`}>
            Pilih Paket
        </button>
    </div>
);

export default function LandingPage() {
    const navigate = useNavigate();
    return (
        <div className="bg-[#FDFBF6] font-sans text-[#3e4a4f]">
            <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50">
                <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
                        <Stethoscope className="w-8 h-8 text-[#C89F74]" />
                        <h1 className="ml-3 text-xl font-bold">Kalkulator Dokter</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button onClick={() => navigate('/login')} className="px-6 py-2 bg-[#C89F74] text-white font-bold rounded-lg shadow-md hover:bg-[#b98e65] transition-colors duration-300">
                            Login
                        </button>
                        <button onClick={() => navigate('/register')} className="px-6 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg shadow-sm hover:bg-gray-200 transition-colors duration-300">
                            Register
                        </button>
                    </div>
                </nav>
            </header>
            <main>
                <section className="text-center py-20 px-6 bg-[#E0E7E1]">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-[#3e4a4f]">Fokus Pada Pasien, Biarkan Kami Urus Pajak Anda</h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                        Sebagai dokter spesialis, waktu Anda sangat berharga. Kalkulator Dokter hadir untuk membebaskan Anda dari kerumitan administrasi pajak, sehingga Anda bisa sepenuhnya mendedikasikan diri untuk hal terpenting: kesehatan pasien.
                    </p>
                    <button onClick={() => navigate('/login')} className="mt-8 px-8 py-3 bg-[#C89F74] text-white font-bold rounded-lg shadow-lg hover:bg-[#b98e65] transition-all duration-300 transform hover:scale-105 flex items-center justify-center mx-auto">
                        Mulai Kelola Pajak <ArrowRight className="ml-2 w-5 h-5" />
                    </button>
                </section>
                <section className="py-20 px-6">
                    <div className="container mx-auto">
                        <div className="text-center mb-12">
                            <h3 className="text-3xl font-bold">Solusi Cerdas untuk Profesional Medis Sibuk</h3>
                            <p className="text-gray-500 mt-2">Kami mengerti tantangan Anda. Inilah cara kami membantu.</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-10 text-center">
                            <FeatureCard icon={<BarChart2 />} title="Hemat Waktu Berharga Anda" description="Lupakan tumpukan dokumen dan perhitungan manual. Catat semua penghasilan Anda dalam hitungan menit, bukan jam." />
                            <FeatureCard icon={<FileText />} title="Akurasi dan Ketenangan Pikiran" description="Platform kami dirancang untuk meminimalkan risiko kesalahan hitung, memberikan Anda kepastian dan ketenangan saat musim pajak tiba." />
                            <FeatureCard icon={<User />} title="Data Aman dan Terorganisir" description="Semua data finansial Anda tersimpan dengan aman dalam satu dasbor pribadi, terorganisir rapi dan siap diakses kapan saja." />
                        </div>
                    </div>
                </section>
                <section className="py-20 px-6 bg-[#E0E7E1]">
                    <div className="container mx-auto">
                        <div className="text-center mb-12">
                            <h3 className="text-3xl font-bold">Investasi Terbaik untuk Praktik Anda</h3>
                            <p className="text-gray-500 mt-2">Pilih paket langganan yang paling sesuai untuk ketenangan finansial Anda.</p>
                        </div>
                        <div className="flex flex-col lg:flex-row justify-center items-stretch gap-8">
                            <PricingCard
                                plan="Starter"
                                description="Pilihan tepat untuk memulai manajemen pajak yang lebih baik."
                                price="200rb"
                                originalPrice="400rb"
                                period="/6 bulan"
                                features={["Akses 6 bulan", "Kalkulator PPh 21", "Dashboard visual", "Laporan bulanan", "Dukungan via email"]}
                                onClick={() => navigate('/register')}
                            />
                            <PricingCard
                                plan="Pro"
                                description="Nilai terbaik untuk manajemen pajak komprehensif sepanjang tahun."
                                price="300rb"
                                originalPrice="650rb"
                                period="/12 bulan"
                                features={["Akses 12 bulan", "Semua fitur Starter", "Laporan pajak tahunan (PDF)", "Konsultasi pajak prioritas", "Hemat lebih banyak!"]}
                                isPopular={true}
                                onClick={() => navigate('/register')}
                            />
                        </div>
                    </div>
                </section>
                <section className="py-20 px-6 text-center bg-white">
                    <div className="container mx-auto max-w-3xl">
                        <h3 className="text-3xl font-bold text-[#3e4a4f] mb-4">Siap Menyederhanakan Pajak Anda?</h3>
                        <p className="text-lg text-gray-600 mb-8">
                            Tim kami siap membantu menjawab pertanyaan Anda atau mendiskusikan kebutuhan khusus untuk praktik Anda. Jangan ragu untuk menghubungi kami.
                        </p>
                        <a
                            href="mailto:kontak@kalkulatordokter.com"
                            className="inline-flex items-center justify-center px-8 py-3 bg-[#C89F74] text-white font-bold rounded-lg shadow-lg hover:bg-[#b98e65] transition-all duration-300 transform hover:scale-105"
                        >
                            <Phone className="mr-2 w-5 h-5" /> Hubungi Kami
                        </a>
                    </div>
                </section>
            </main>
            <footer className="text-center text-gray-500 py-8 bg-white border-t border-gray-200">
                <p>&copy; 2025 Kalkulator Dokter. All rights reserved.</p>
            </footer>
        </div>
    );
}
