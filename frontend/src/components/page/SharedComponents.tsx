/**
 * This file is provided you as part of the interview kit.
 * Feel free to modify it as needed.
 * Do not remove this comment.
 */

import { FC, useState } from "react";
import { ActionBar } from "../molecules/ActionBar";
import { ExpandableText } from "../molecules/ExpandableText";
import { LoadingSpinner } from "../molecules/LoadingSpinner";
import { ProfileAvatar } from "../molecules/ProfileAvatar";
import { Search } from "../molecules/Search";
import { ViewModal } from "../molecules/ViewModal";
import { AppointmentConfirmed } from "../organisms/AppointmentConfirmed";
import { AppointmentTable } from "../organisms/AppointmentTable";
import { ProfilePicDescription } from "../organisms/ProfilePicDescription";
import { UserRole } from "../../types/shared";
import { Dropdown } from "../molecules/Dropdown";

export const SharedComponents: FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Shared Components</h1>
        <p className="text-gray-600">
          This page showcases shared components used across the application.
          These base components are readily prepared for you to use in your
          implementation tasks. There is no obligation to use them, but they can
          help speed up your development process.
        </p>
      </div>

      {/* Molecules Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 pb-2 border-b-2 border-blue-500">
          Molecules
        </h2>

        <div className="space-y-8">
          {/* ActionBar */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              Action Bar
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Combined search and dropdown actions
            </p>
            <ActionBar onSearch={() => {}} dropdowns={[]} />
          </div>

          {/* Search */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Search</h3>
            <p className="text-sm text-gray-600 mb-4">Search input component</p>
            <Search onSearch={() => {}} />
          </div>

          {/* Dropdown */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              Dropdown
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Show list of options in menu
            </p>
            <Dropdown
              options={[
                { label: "Option 1", value: "1" },
                { label: "Option 2", value: "2" },
              ]}
              onChange={() => {}}
            />
          </div>

          {/* ExpandableText */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              Expandable Text
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Text that can be expanded to show more content
            </p>
            <ExpandableText text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris." />
          </div>

          {/* LoadingSpinner */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              Loading Spinner
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Loading state indicator
            </p>
            <LoadingSpinner />
          </div>

          {/* ProfileAvatar */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              Profile Avatar
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              User avatar with initials
            </p>
            <ProfileAvatar text="Jane Doe" />
          </div>

          {/* ViewModal */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              View Modal
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Modal dialog with custom content
            </p>
            <ViewModal
              title="Sample Modal"
              isVisible={isOpen}
              onClose={() => setIsOpen(false)}
              children={<div>Sample Modal Content</div>}
              buttonText="Open Modal"
              onButtonClick={() => setIsOpen(true)}
            />
          </div>
        </div>
      </section>

      {/* Organisms Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 pb-2 border-b-2 border-green-500">
          Organisms
        </h2>

        <div className="space-y-8">
          {/* AppointmentConfirmed */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              Appointment Confirmed
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Confirmation display for appointment bookings
            </p>
            <AppointmentConfirmed
              bookingDetails={{
                service: "Eye Examination",
                clinic: "Downtown Eye Clinic",
                optician: "Dr. Smith",
                date: "2025-12-01",
                time: "10:00 AM",
                notes: "Please bring your previous prescription",
                emailConfirmation: "john.doe@example.com",
              }}
            />
          </div>

          {/* AppointmentTable */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              Appointment Table
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Table displaying appointment data
            </p>
            <AppointmentTable dataSource={[]} />
          </div>

          {/* ProfilePicDescription */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              Profile Picture Description
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              User profile display with avatar and information
            </p>
            <ProfilePicDescription
              user={{
                id: "1",
                email: "jane.doe@example.com",
                password: "",
                role: UserRole.Patient,
                first_name: "Jane",
                last_name: "Doe",
                phone_number: "+1234567890",
                birthday: "1990-01-01",
              }}
            />
          </div>
        </div>
      </section>
    </div>
  );
};
