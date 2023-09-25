import React, { Dispatch, SetStateAction } from "react";

const PatientsFilters = ({
  tags,
  setSelectedTags,
}: {
  tags: string[];
  setSelectedTags: Dispatch<SetStateAction<string[]>>;
}) => {
  return (
    <div className="my-4">
      <h3 className="font-bold mb-2">Filtrar por categoría</h3>
      {tags.map((tag) => (
        <div key={tag}>
          <input
            type="checkbox"
            id={tag}
            value={tag}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedTags((prev: string[]) => [...prev, e.target.value]);
              } else {
                setSelectedTags((prev: string[]) =>
                  prev.filter((t) => t !== e.target.value)
                );
              }
            }}
          />
          <label
            htmlFor={tag}
            className="ml-2"
          >
            {tag}
          </label>
        </div>
      ))}
    </div>
  );
};

export default PatientsFilters;
