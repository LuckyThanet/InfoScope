import { Shield } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-[60vh] bg-gradient-hero flex items-center justify-center overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJoc2woMTk5IDg5JSA0OCUgLyAwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>

      <div className="container relative z-10 text-center px-4">
        <div className="flex items-center justify-center mb-6">
          <Shield className="w-16 h-16 text-primary mr-4 drop-shadow-glow-primary" />
          <h1 className="text-6xl font-bold bg-gradient-cyber bg-clip-text text-transparent">
            InfoScope
          </h1>
        </div>

        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          A comprehensive platform for gathering and utilizing various OSINT (Open Source Intelligence) tools.
          Streamline your intelligence gathering process with our integrated suite of professional-grade tools.
        </p>

        <div className="mt-8 flex items-center justify-center space-x-8 text-sm text-muted-foreground">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></div>
            Secure
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></div>
            Professional
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></div>
            Comprehensive
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;