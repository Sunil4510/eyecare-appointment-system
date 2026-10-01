/**
 * This component is provided you as part of the interview kit.
 * Feel free to modify it as needed.
 * Do not remove this comment.
 */

import { Table } from "antd";
import type { FC } from "react";
import type { ColumnsType } from "antd/es/table";
import { Appointment } from "../../types/shared.ts";

interface AppointmentTableProps {
  dataSource: Appointment[];
  pagination?: boolean;
  prependColumns?: ColumnsType<any>;
  additionalColumns?: ColumnsType<any>;
  loading?: boolean;
}

export const AppointmentTable: FC<AppointmentTableProps> = ({
  dataSource,
  pagination,
  prependColumns = [],
  additionalColumns = [],
  loading = false,
}) => {
  const baseColumns: ColumnsType<any> = [
    {
      title: "Appointment Time",
      dataIndex: "appointment_datetime",
      key: "appointment_datetime",
      width: 200,
      render: (val: string) => {
        if (!val) return "-";
        const d = new Date(val);
        if (isNaN(d.getTime())) return val;
        const month = d.getUTCMonth() + 1;
        const day = d.getUTCDate();
        const year = d.getUTCFullYear();
        const hours = d.getUTCHours();
        const minutes = String(d.getUTCMinutes()).padStart(2, "0");
        const period = hours >= 12 ? "PM" : "AM";
        const displayHours = hours % 12 === 0 ? 12 : hours % 12;
        return `${month}/${day}/${year} ${displayHours}:${minutes} ${period}`;
      },
    },
    {
      title: "Clinic",
      dataIndex: "clinic_name",
      key: "clinic_name",
      width: 220,
    },
    {
      title: "Service",
      dataIndex: "service_name",
      key: "service_name",
      width: 180,
    },
  ];

  const columns = [...prependColumns, ...baseColumns, ...additionalColumns];

  return (
    <Table
      loading={loading}
      dataSource={dataSource}
      columns={columns}
      pagination={pagination === false ? false : { pageSize: 10 }}
      rowKey={(record: Appointment) =>
        record.id || `${record.appointment_datetime}-${record.patient_id}`
      }
    />
  );
};
