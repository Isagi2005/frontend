import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
} from "@headlessui/react";
import { useState } from "react";
import { Controller, Control } from "react-hook-form";
import { AnneeProfile } from "../../../api/anneeApi";

interface Props {
  name: string;
  control: Control<any>;
  annees: AnneeProfile[];
  onCreate?: (newAnnee: string) => void;
}

const AnneeCombobox = ({ name, control, annees, onCreate }: Props) => {
  const [query, setQuery] = useState("");

  const filtered =
    query === ""
      ? annees
      : annees.filter((a) =>
          a.anneeScolaire.toLowerCase().includes(query.toLowerCase())
        );

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const selected = annees.find((a) => a.id === field.value);
        return (
          <Combobox value={field.value} onChange={field.onChange}>
            <div className="relative">
              <ComboboxInput
                placeholder="Annee scolaire"
                onChange={(e) => setQuery(e.target.value)}
                displayValue={() => selected?.anneeScolaire || ""}
                className="w-full border px-2 py-1 rounded"
              />
              <ComboboxOptions className="absolute z-10 w-full bg-white border mt-1 rounded shadow-md max-h-60 overflow-y-auto">
                {filtered.map((a) => (
                  <ComboboxOption
                    key={a.id}
                    value={a.id}
                    className={({ active }) =>
                      `px-4 py-2 cursor-pointer ${active ? "bg-blue-100" : ""}`
                    }
                  >
                    {a.anneeScolaire}
                  </ComboboxOption>
                ))}
                {filtered.length === 0 && query !== "" && (
                  <div
                    onClick={() => {
                      onCreate?.(query);
                      setQuery("");
                    }}
                    className="px-4 py-2 text-blue-600 cursor-pointer hover:bg-blue-50"
                  >
                    + Créer "{query}"
                  </div>
                )}
              </ComboboxOptions>
            </div>
          </Combobox>
        );
      }}
    />
  );
};

export default AnneeCombobox;
