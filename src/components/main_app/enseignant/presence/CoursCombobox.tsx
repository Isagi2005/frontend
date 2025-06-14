import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
} from "@headlessui/react";
import { useState } from "react";
import { Controller } from "react-hook-form";
import { coursProfile } from "../../../../api/presenceApi";

interface Props {
  name: string;
  control: any;
  cours: coursProfile[];
}

const CoursCombobox = ({ name, control, cours }: Props) => {
  const [query, setQuery] = useState("");

  const filtered =
    query === ""
      ? cours
      : cours.filter((cour) =>
          `${cour.matiere} ${cour.enseignant} ${cour.classe} ${cour.date}`
            .toLowerCase()
            .includes(query.toLowerCase())
        );

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const selected = cours.find((p) => p.id === field.value);
        return (
          <Combobox value={field.value} onChange={field.onChange}>
            <div className="relative">
              <ComboboxInput
                placeholder="Cours "
                onChange={(e) => setQuery(e.target.value)}
                displayValue={() => selected?.matiere || selected?.date || ""}
                className="w-full border px-2 py-1 rounded"
              />
              <ComboboxOptions className="absolute z-10 w-full bg-white border mt-1 rounded shadow-md max-h-60 overflow-y-auto">
                {filtered.map((cour) => (
                  <ComboboxOption
                    key={cour.id}
                    value={cour.id}
                    className={({ active }) =>
                      `px-4 py-2 cursor-pointer ${active ? "bg-blue-100" : ""}`
                    }
                  >
                    {cour.matiere} {cour.date}
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

export default CoursCombobox;
