/**
 * This file is provided you as part of the interview kit.
 * Feel free to modify it as needed.
 * Do not remove this comment.
 */

import { FC, useEffect, useMemo, useState } from "react";
import { Button, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { fetchAppointmentsAPI } from "../../services";
import { Appointment, UserRole } from "../../types/shared";
import { AppointmentTable } from "../organisms/AppointmentTable";
import { PatientInfoModal } from "../organisms/PatientInfoModal";

const { Title } = Typography;

const Home: FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  const isOptician = user?.role === UserRole.Optician;

  useEffect(() => {
    const loadAppointments = async () => {
      setLoading(true);
      try {
        let data: Appointment[] = [];
        if (isOptician && user?.optician_id) {
          data = await fetchAppointmentsAPI({ optician_id: user.optician_id });
        } else if (user?.id) {
          data = await fetchAppointmentsAPI({ patient_id: user.id });
        } else {
          data = await fetchAppointmentsAPI();
        }
        setAppointments(data);
      } catch (err) {
        console.error("Failed to load appointments:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, [user?.id, user?.optician_id, isOptician]);

  const pageTitle = useMemo(() => {
    if (isOptician && user?.first_name) {
      return `${user.first_name}'s Upcoming Appointment`;
    }
    return "Upcoming Appointments";
  }, [isOptician, user?.first_name]);

  const prependColumns = useMemo(() => {
    if (!isOptician) return [];
    return [
      {
        title: "No.",
        key: "index",
        width: 60,
        render: (_: any, __: any, index: number) => index + 1,
      },
    ];
  }, [isOptician]);

  const additionalColumns = useMemo(() => {
    if (isOptician) {
      return [
        {
          title: "Notes",
          dataIndex: "notes",
          key: "notes",
          render: (notes: string) => notes || "-",
        },
        {
          title: "Patient",
          dataIndex: "patient_name",
          key: "patient_name",
          render: (patientName: string, record: Appointment) => (
            <Button
              type="link"
              className="p-0 text-blue-600 font-semibold hover:underline"
              onClick={() => setSelectedPatientId(record.patient_id)}
            >
              {patientName || "Patient"}
            </Button>
          ),
        },
      ];
    }

    return [
      {
        title: "Optician",
        dataIndex: "optician_name",
        key: "optician_name",
        render: (name: string) => name || "-",
      },
      {
        title: "Notes",
        dataIndex: "notes",
        key: "notes",
        render: (notes: string) => notes || "-",
      },
    ];
  }, [isOptician]);

  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="flex justify-between items-center bg-white p-5 rounded-xl shadow-sm border border-gray-200">
        <div>
          <Title level={3} style={{ marginBottom: 0 }}>
            {pageTitle}
          </Title>
        </div>

        {!isOptician && (
          <Button
            type="primary"
            size="large"
            onClick={() => navigate("/catalogue")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Book New Appointment
          </Button>
        )}
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
        <AppointmentTable
          dataSource={appointments}
          loading={loading}
          prependColumns={prependColumns}
          additionalColumns={additionalColumns}
        />
      </div>

      <PatientInfoModal
        isVisible={!!selectedPatientId}
        patientId={selectedPatientId}
        onClose={() => setSelectedPatientId(null)}
      />
    </div>
  );
};

export default Home;
