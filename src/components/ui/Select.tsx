import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const Select = <T extends { id: string; name: string }>({
  options,
  value,
  onChange,
  multiple = false,
  searchable = false,
  placeholder = "Select",
}: {
  options: T[];
  value: string | string[];
  onChange: (val: string | string[]) => void;
  multiple?: boolean;
  searchable?: boolean;
  placeholder?: string;
}) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((option) =>
    option.name?.toLowerCase().includes(search.toLowerCase())
  );

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Display selected names
  const selectedNames = multiple
    ? options
        .filter((option) => (value as string[]).includes(option.id))
        .map((option) => option.name)
        .join(", ")
    : options.find((option) => option.id === value)?.name || "";

  const toggleOption = (id: string) => {
    if (!multiple) {
      onChange(id);
      setIsOpen(false);
    } else {
      if ((value as string[]).includes(id)) {
        onChange((value as string[]).filter((val) => val !== id));
      } else {
        onChange([...(value as string[]), id]);
      }
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <div
        className="col-span-3 flex flex-row justify-between items-center h-10 w-full rounded-md border border-gray-300 border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => setIsOpen((prev) => !prev)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen((prev) => !prev);
          }
        }}
      >
        <div className="flex flex-1">{selectedNames || placeholder}</div>
        <ChevronDown size={15} />
      </div>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 rounded bg-white shadow max-h-60 overflow-auto ">
          {searchable && (
            <div className="border-b border-gray-200 p-2">
              <input
                type="text"
                className="w-full  p-2 "
                placeholder={`Search ${placeholder.toLowerCase()}`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </div>
          )}

          <div>
            {filteredOptions.length > 0 ? (
              multiple ? (
                filteredOptions.map((option) => (
                  <label
                    key={option.id}
                    className="flex items-center p-2 cursor-pointer hover:bg-gray-100"
                  >
                    <input
                      type="checkbox"
                      value={option.id}
                      checked={(value as string[]).includes(option.id)}
                      onChange={() => toggleOption(option.id)}
                      className="mr-2"
                    />
                    {option.name}
                  </label>
                ))
              ) : (
                filteredOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`p-2 cursor-pointer hover:bg-gray-100 ${
                      value === option.id ? "bg-gray-200" : ""
                    }`}
                    onClick={() => toggleOption(option.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        toggleOption(option.id);
                      }
                    }}
                  >
                    {option.name}
                  </div>
                ))
              )
            ) : (
              <div className="p-2 text-gray-500">
                Nenhum {placeholder.toLowerCase()} encontrado
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
