import type { PresentationType } from "../api/siteApi";

interface PageProps {
  presentations: PresentationType[];
}

const Page2 = ({ presentations }: PageProps) => {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24 bg-gradient-to-b from-slate-50 to-slate-100 min-h-screen">
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-slate-800">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-orange-400">
          Concernant RAITRA Kidz
        </span>
      </h2>

      <div className="space-y-24">
        {presentations.map((data, index) => (
          <div
            key={data.id}
            className={`group relative flex flex-col ${
              index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
            } gap-8 rounded-xl overflow-hidden transition-all duration-300 hover:translate-y-[-4px]`}
          >
            {/* Decorative elements */}
            <div
              className={`absolute inset-0 ${
                index % 2 === 0
                  ? "bg-gradient-to-br from-white to-orange-50"
                  : "bg-gradient-to-br from-slate-100 to-slate-200"
              } rounded-xl shadow-lg`}
            ></div>

            {/* Content container */}
            <div className="relative flex flex-col lg:flex-row items-center gap-8 p-8">
              {/* Image with enhanced styling */}
              <div className="w-full lg:w-1/2 transition-all duration-300 group-hover:scale-[1.02]">
                <div className="relative overflow-hidden rounded-xl shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10"></div>
                  <img
                    src={data.image || "/placeholder.svg"}
                    alt={data.titrePresentation}
                    className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute bottom-4 left-4 z-20 bg-orange-600/90 text-white px-4 py-1 rounded-full text-sm font-medium">
                    {data.section}
                  </div>
                </div>
              </div>

              {/* Text content with improved typography */}
              <div className="w-full lg:w-1/2 space-y-6">
                <h3 className="text-3xl md:text-4xl font-bold text-orange-600 leading-tight">
                  {data.titrePresentation}
                </h3>

                <div className="space-y-4">
                  <div className="flex items-start space-x-2">
                    <span className="flex-shrink-0 mt-1 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider px-2 py-1 rounded">
                      Objectifs
                    </span>
                    <p className="text-slate-700 leading-relaxed">
                      {data.objectifs}
                    </p>
                  </div>

                  <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-slate-200 shadow-sm">
                    <p className="text-slate-700 leading-relaxed italic">
                      {data.textePresentation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page2;
