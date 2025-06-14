import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
} from "@headlessui/react";
import { useState } from "react";
import { Controller } from "react-hook-form";
import { SubjectProfile } from "../../../api/subjectApi";

interface Props {
  name: string;
  control: any;
  matiere: SubjectProfile[];
}

const MatiereCombobox = ({ name, control, matiere }: Props) => {
  const [query, setQuery] = useState("");

  const filtered =
    query === ""
      ? matiere
      : matiere.filter((a) =>
          a.titre.toLowerCase().includes(query.toLowerCase())
        );

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const selected = matiere.find((a) => a.id === field.value);
        return (
          <Combobox value={field.value} onChange={field.onChange}>
            <div className="relative">
              <ComboboxInput
                placeholder="Matiere"
                onChange={(e) => setQuery(e.target.value)}
                displayValue={() => selected?.titre || ""}
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
                    {a.titre}
                  </ComboboxOption>
                ))}
              </ComboboxOptions>
            </div>
          </Combobox>
        );
      }}
    />
  );
};

export default MatiereCombobox;
