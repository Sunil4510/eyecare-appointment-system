/**
 * This file is provided you as part of the interview kit.
 * Feel free to modify it as needed.
 * Do not remove this comment.
 */

import { Descriptions } from "antd";
import { FC } from "react";
import { User } from "../../types/shared";
import { ProfileAvatar } from "../molecules/ProfileAvatar";

type ProfilePicDescriptionProps = {
  user: User;
};

export const ProfilePicDescription: FC<ProfilePicDescriptionProps> = ({
  user,
}) => {
  return (
    <>
      <div>
        <ProfileAvatar
          text={`${user?.first_name.charAt(0)}${user?.last_name.charAt(0)}`}
        />
      </div>
      <div className="w-[60%] gap-5 flex flex-col justify-content">
        <div style={{ fontSize: "30px", fontWeight: "bold" }}>
          {user?.first_name} {user?.last_name}
        </div>
        <div>
          <Descriptions
            bordered
            column={1}
            size="small"
            styles={{ label: { width: "10%" } }}
          >
            <Descriptions.Item label="Email">{user?.email}</Descriptions.Item>
            <Descriptions.Item label="Phone">
              {user?.phone_number}
            </Descriptions.Item>
            <Descriptions.Item label="Birthday">
              {user?.birthday &&
                new Date(user?.birthday).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
            </Descriptions.Item>
          </Descriptions>
        </div>
      </div>
    </>
  );
};
