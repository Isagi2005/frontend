import { typeData } from "../dataMenu/textData";

interface pageProps {
  dataText: typeData[];
}

const Page = ({ dataText }: pageProps) => {
  return (
    <div className="p-6 mt-22">
      {dataText.map((data) => (
        <div
          key={data.id}
          className="flex mt-24 bg-yellow-50 shadow-xl rounded-lg px-4 py-4"
        >
          <img
            src={data.image}
            alt="Description de la première image"
            className="w-1/2 h-auto rounded-lg shadow-lg"
            style={{ maxHeight: "300px", objectFit: "cover" }}
          />
          <div />
          <div className="ml-4 flex flex-col justify-center">
            <h1 className="text-4xl font-bold text-orange-600 mb-4 text-center">
              {data.titre}
            </h1>
            <div className="px-4 py-4">
              <p className="text-lg text-blue-950">{data.sous_titres}</p>
              <ul className="list-disc list-inside ml-5">
                {data.liste.map((list) => (
                  <li>{list}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Page;
