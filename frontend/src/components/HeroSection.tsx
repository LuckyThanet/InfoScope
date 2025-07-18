
const HeroSection = () => {
    return (
        <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white py-20">
            <div className="max-w-6xl mx-auto px-6 text-center">
                <h1 className="text-5xl font-bold text-blue-400 mb-6">InfoScope</h1>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                    A comprehensive platform for gathering and utilizing various OSINT (Open
                    Source Intelligence) tools. Streamline your intelligence gathering process
                    with our integrated suite of professional-grade tools.
                </p>
                <div className="flex justify-center gap-6 mt-8">
                    <span className="px-4 py-2 bg-gray-700 rounded-full text-sm">Secure</span>
                    <span className="px-4 py-2 bg-gray-700 rounded-full text-sm">Professional</span>
                    <span className="px-4 py-2 bg-gray-700 rounded-full text-sm">Comprehensive</span>
                </div>
            </div>
        </div>
    );

}

export default HeroSection;