/**
 * This file is provided you as part of the interview kit.
 * Feel free to modify it as needed.
 * Do not remove this comment.
 */

import { Spin } from "antd";
import type { FC } from "react";

export const LoadingSpinner: FC = () => {
  return (
    <div className="justify-center align-center flex">
      <Spin />
    </div>
  );
};
