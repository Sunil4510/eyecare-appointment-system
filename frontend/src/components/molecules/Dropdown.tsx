/**
 * This file is provided you as part of the interview kit.
 * Feel free to modify it as needed.
 * Do not remove this comment.
 */

import type { FC } from "react";
import { Select } from "antd";

interface DropdownProps {
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
  placeholder?: string;
  multiple?: boolean;
}

export const Dropdown: FC<DropdownProps> = ({
  options,
  onChange,
  placeholder = "Select an option",
  multiple,
}) => {
  return (
    <Select
      placeholder={placeholder}
      onChange={onChange}
      style={{ width: "100%" }}
      options={options}
      allowClear
      mode={multiple ? "multiple" : undefined}
      maxTagCount="responsive"
    />
  );
};
