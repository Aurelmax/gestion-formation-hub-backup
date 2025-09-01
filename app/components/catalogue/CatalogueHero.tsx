
const CatalogueHero = () => {
  return (
    <section className="relative">
      <div className="absolute inset-0 z-0">
        <img 
          src="/formation-wordpress-antibes.webp" 
          alt="Formation WordPress Antibes" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-blue-900/70"></div>
      </div>
      <div className="relative z-10 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Catalogue de Formations WordPress
          </h2>
          <p className="text-xl max-w-3xl mx-auto">
            Découvrez nos formations professionnelles adaptées à tous les niveaux. 
            Certifiées Qualiopi et éligibles CPF.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CatalogueHero;
