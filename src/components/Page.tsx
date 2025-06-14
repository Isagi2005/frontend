import { typeData } from "../dataMenu/textData";

interface PageProps {
  dataText: typeData[];
}

const Page = ({ dataText }: PageProps) => {
  return (
    <div className="mt-20 container mx-auto px-6 py-12 space-y-16">
      {dataText.map((data, index) => (
        <div
          key={data.id}
          className={`flex flex-col lg:flex-row items-center gap-8 shadow-lg rounded-lg overflow-hidden p-6 bg-white ${
            index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
          }`}
        >
          {/* Image */}
          <div className="w-full lg:w-1/2">
            <img
              src={data.image}
              alt="Illustration"
              className="w-full h-80 object-cover rounded-lg shadow-md"
            />
          </div>

          {/* Texte */}
          <div className="w-full lg:w-1/2 ">
            <h1 className="text-3xl font-bold text-orange-600 mb-4">
              {data.titre}
            </h1>
            <p className="text-lg text-gray-700 italic mb-4">
              {data.sous_titres}
            </p>
            <ul className=" list-inside text-gray-800 space-y-2">
              {data.liste.map((list, i) => (
                <li key={i} className="pl-10">
                  {list}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Page;
