/**
 * This file is provided you as part of the interview kit.
 * Feel free to modify it as needed.
 * Do not remove this comment.
 */

import type { TablePaginationConfig } from "antd";
import { Button, Table } from "antd";
import type { FC } from "react";
import { CatalogueRow } from "../../types";

interface ServiceTableProps {
  dataSource: CatalogueRow[];
  pagination?: TablePaginationConfig;
  onCheckAvailability?: (record: CatalogueRow) => void;
  loading?: boolean;
}

export const ServiceTable: FC<ServiceTableProps> = ({
  dataSource,
  pagination = { pageSize: 10 },
  onCheckAvailability,
  loading = false,
}) => {
  const columns = [
    {
      title: "Service",
      dataIndex: ["service", "name"],
      key: "serviceName",
    },
    {
      title: "Clinic",
      dataIndex: ["clinic", "name"],
      key: "clinicName",
    },
    {
      title: "Optician",
      dataIndex: ["clinic", "opticians"],
      key: "opticians",
      render: (opticians: { id: string; name: string }[]) =>
        opticians?.map((optician) => optician.name).join(", ") || "-",
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: CatalogueRow) => (
        <Button
          type="default"
          onClick={() => onCheckAvailability?.(record)}
        >
          Check Availability
        </Button>
      ),
    },
  ];

  return (
    <Table
      loading={loading}
      dataSource={dataSource}
      columns={columns}
      pagination={pagination}
      rowKey={(record: CatalogueRow) =>
        `${record.service.id}-${record.clinic.id}`
      }
    />
  );
};

