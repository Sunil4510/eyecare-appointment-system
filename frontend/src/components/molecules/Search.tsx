/**
 * This file is provided you as part of the interview kit.
 * Feel free to modify it as needed.
 * Do not remove this comment.
 */

import type { FC } from "react";
import { Input } from "antd";

interface SearchProps {
  onSearch: (value: string) => void;
}

export const Search: FC<SearchProps> = ({ onSearch }) => {
  return (
    <Input.Search
      placeholder="Search keywords..."
      allowClear
      onSearch={onSearch}
      onChange={(e) => onSearch(e.target.value)}
    />
  );
};
