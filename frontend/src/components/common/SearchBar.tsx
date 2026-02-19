import { useState } from "react";


interface SearchBarProps {
  onSearch: (value?: string) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [value, setValue] = useState("");

  return (
    <div className="flex justify-center px-4">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          onSearch(value.trim() || undefined);
        }}
        className="relative w-full max-w-md md:max-w-lg lg:max-w-xl">
        <label htmlFor="search-input" className="sr-only">
          Search by destination
        </label>

        <button
          type="submit"
          aria-label="Search destination"
          className="absolute left-4 top-1/2 -translate-y-1/2"
        >
          {/* Add SVG here instead*/}
          🔍
        </button>
        <input
          id="search-input"
          type="search"
          value={value}
          onChange={(e) => {
            const newValue = e.target.value;
            setValue(newValue);

            if (newValue.trim() === "") {
              onSearch(undefined);
            }
          }}
          placeholder="Search destination"
          className="
             w-full
            bg-white
            border border-gray-200
            shadow-sm
            hover:shadow-md
            focus:shadow-md
            focus:border-blue-400
            focus:ring-2 focus:ring-blue-200
            rounded-full
            pl-12 pr-4 py-3
            outline-none
            transition-all duration-200"
        />
      </form>
    </div>
  );
};