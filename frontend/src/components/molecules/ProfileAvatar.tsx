/**
 * This file is provided you as part of the interview kit.
 * Feel free to modify it as needed.
 * Do not remove this comment.
 */

import { Avatar } from "antd";
import type { FC } from "react";

type ProfileAvatarProps = {
  text: string;
};

export const ProfileAvatar: FC<ProfileAvatarProps> = ({ text }) => {
  return (
    <Avatar
      src="https://test123.com"
      size={150}
      style={{
        margin: "16px auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        fontSize: "24px",
      }}
    >
      {text.toUpperCase()}
    </Avatar>
  );
};
