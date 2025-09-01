
import Navigation from "@/components/Navigation";

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center gap-4">
            <div className="relative w-48 h-48">
              <img 
                src="/logo-gestionmax-antibes.png" 
                alt="Logo GestionMax" 
                width={192} 
                height={192} 
                className="object-contain" 
              />
            </div>
          </div>
          <Navigation />
        </div>
      </div>
    </header>
  );
};

export default Header;
