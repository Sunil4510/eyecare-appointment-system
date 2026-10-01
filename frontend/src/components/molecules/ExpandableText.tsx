/**
 * This file is provided you as part of the interview kit.
 * Feel free to modify it as needed.
 * Do not remove this comment.
 */

import type { FC } from "react";
import { Typography } from "antd";

const { Paragraph } = Typography;

interface ExpandableTextProps {
  text: string;
  rows?: number;
}

export const ExpandableText: FC<ExpandableTextProps> = ({ text, rows = 1 }) => {
  return (
    <Paragraph
      ellipsis={{
        rows,
        expandable: "collapsible",
        symbol: (expanded: boolean) => (expanded ? "Hide" : "More"),
      }}
      style={{ margin: 0 }}
    >
      {text}
    </Paragraph>
  );
};
