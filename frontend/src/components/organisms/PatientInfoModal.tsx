import { FC, useEffect, useState } from "react";
import { Button, Modal, Spin, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { fetchAppointmentsAPI, fetchUserByIdAPI } from "../../services";
import { Appointment, User } from "../../types/shared";
import { ProfilePicDescription } from "./ProfilePicDescription";

const { Title } = Typography;

interface PatientInfoModalProps {
  isVisible: boolean;
  onClose: () => void;
  patientId: string | null;
}

export const PatientInfoModal: FC<PatientInfoModalProps> = ({
  isVisible,
  onClose,
  patientId,
}) => {
  const [patient, setPatient] = useState<User | null>(null);
  const [history, setHistory] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isVisible || !patientId) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const [patientData, appointmentsData] = await Promise.all([
          fetchUserByIdAPI(patientId),
          fetchAppointmentsAPI({ patient_id: patientId }),
        ]);
        setPatient(patientData);
        setHistory(appointmentsData);
      } catch (err) {
        console.error("Failed to fetch patient information:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isVisible, patientId]);

  const historyColumns: ColumnsType<Appointment> = [
    {
      title: "Appointment Time",
      dataIndex: "appointment_datetime",
      key: "appointment_datetime",
      width: 190,
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
    },
    {
      title: "Service",
      dataIndex: "service_name",
      key: "service_name",
    },
    {
      title: "Notes",
      dataIndex: "notes",
      key: "notes",
      render: (notes: string) => notes || "-",
    },
  ];

  return (
    <Modal
      open={isVisible}
      onCancel={onClose}
      title="Patient Information"
      width={720}
      centered
      destroyOnHidden
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="ok" type="primary" onClick={onClose}>
          OK
        </Button>,
      ]}
    >
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Spin tip="Loading patient info..." />
        </div>
      ) : patient ? (
        <div className="flex flex-col gap-6 py-2">
          <div className="flex items-center gap-6">
            <ProfilePicDescription user={patient} />
          </div>

          <div>
            <Title level={5} className="mb-3 text-gray-800">
              Appointment History
            </Title>
            <Table
              dataSource={history}
              columns={historyColumns}
              pagination={{ pageSize: 5 }}
              size="small"
              rowKey={(record: Appointment) =>
                record.id || `${record.appointment_datetime}-${record.clinic_id}`
              }
            />
          </div>
        </div>
      ) : (
        <div className="py-8 text-center text-gray-500">
          Patient information not found.
        </div>
      )}
    </Modal>
  );
};
