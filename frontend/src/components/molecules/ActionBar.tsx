/**
 * This file is provided you as part of the interview kit.
 * Feel free to modify it as needed.
 * Do not remove this comment.
 */

import type { FC } from "react";
import { Search } from "./Search.tsx";
import { Dropdown } from "./Dropdown.tsx";

interface DropdownConfig {
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
  placeholder?: string;
  multiple?: boolean;
}

interface ActionBarProps {
  onSearch: (value: string) => void;
  dropdowns: DropdownConfig[];
}

export const ActionBar: FC<ActionBarProps> = ({ onSearch, dropdowns }) => {
  return (
    <div className="flex flex-col justify-center rounded-lg gap-2 pb-4">
      <Search onSearch={onSearch} />
      <div className="flex flex-row gap-1 w-[100%]">
        {dropdowns.map((dropdown, index) => (
          <Dropdown
            key={index}
            options={dropdown.options}
            onChange={dropdown.onChange}
            placeholder={dropdown.placeholder}
            multiple={dropdown.multiple}
          />
        ))}
      </div>
    </div>
  );
};
