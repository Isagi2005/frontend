import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
} from "@headlessui/react";
import { useState } from "react";
import { Controller, Control } from "react-hook-form";

interface Prof {
  id?: number;
  username: string;
  last_name: string;
  first_name: string;
}

interface Props {
  name: string;
  control: Control<any>;
  profs: Prof[];
}

const ProfCombobox = ({ name, control, profs }: Props) => {
  const [query, setQuery] = useState("");

  const filtered =
    query === ""
      ? profs
      : profs.filter((prof) =>
          `${prof.first_name} ${prof.last_name}`
            .toLowerCase()
            .includes(query.toLowerCase())
        );

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const selected = profs.find((p) => p.id === field.value);
        return (
          <Combobox value={field.value} onChange={field.onChange}>
            <div className="relative">
              <ComboboxInput
                placeholder="Professeur titulaire"
                onChange={(e) => setQuery(e.target.value)}
                displayValue={() =>
                  selected?.first_name || selected?.last_name || ""
                }
                className="w-full border px-2 py-1 rounded"
              />
              <ComboboxOptions className="absolute z-10 w-full bg-white border mt-1 rounded shadow-md max-h-60 overflow-y-auto">
                {filtered.map((prof) => (
                  <ComboboxOption
                    key={prof.id}
                    value={prof.id}
                    className={({ active }) =>
                      `px-4 py-2 cursor-pointer ${active ? "bg-blue-100" : ""}`
                    }
                  >
                    {prof.first_name} {prof.last_name}
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

export default ProfCombobox;
