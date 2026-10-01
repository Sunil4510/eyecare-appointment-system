import { FC, useEffect, useState } from "react";
import {
  Alert,
  Button,
  Calendar,
  Form,
  Input,
  Modal,
  Spin,
  Typography,
} from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { ALL_TIMESLOT_VALUES, Timeslot } from "../../constants/timeslots";
import { checkAvailabilityAPI, createAppointmentAPI } from "../../services";
import { CatalogueRow } from "../../types";
import { User } from "../../types/shared";
import { AppointmentConfirmed } from "./AppointmentConfirmed";

const { Text, Title } = Typography;

interface BookingModalProps {
  isVisible: boolean;
  onClose: () => void;
  catalogueRow: CatalogueRow | null;
  user: User | null;
  onBookingComplete?: () => void;
}

export const BookingModal: FC<BookingModalProps> = ({
  isVisible,
  onClose,
  catalogueRow,
  user,
  onBookingComplete,
}) => {
  const [step, setStep] = useState<"slots" | "confirm" | "success">("slots");
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [selectedTime, setSelectedTime] = useState<Timeslot | null>(null);
  const [remarks, setRemarks] = useState<string>("");

  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [conflictReason, setConflictReason] = useState<string | null>(null);

  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const clinic = catalogueRow?.clinic;
  const service = catalogueRow?.service;
  const optician = clinic?.opticians?.[0];

  // Reset modal state when opened/closed
  useEffect(() => {
    if (isVisible) {
      setStep("slots");
      setSelectedDate(dayjs());
      setSelectedTime(null);
      setRemarks("");
      setBookingError(null);
    }
  }, [isVisible, catalogueRow]);

  // Fetch availability when date, clinic, or optician changes
  useEffect(() => {
    if (!isVisible || !clinic?.id || !selectedDate) return;

    const fetchAvailability = async () => {
      setLoadingAvailability(true);
      setConflictReason(null);
      try {
        const dateStr = selectedDate.format("YYYY-MM-DD");
        const opticianId = optician?.id || "";
        const data = await checkAvailabilityAPI(clinic.id, opticianId, dateStr);

        if (data.conflict) {
          setConflictReason(data.conflict_reason || "Optician is unavailable on this date.");
          setBookedSlots(data.all_slots);
        } else {
          setBookedSlots(data.booked_slots || []);
        }
      } catch (err) {
        console.error("Failed to fetch availability:", err);
      } finally {
        setLoadingAvailability(false);
      }
    };

    fetchAvailability();
  }, [isVisible, clinic?.id, optician?.id, selectedDate]);

  const handleDateChange = (newDate: Dayjs) => {
    setSelectedDate(newDate);
    setSelectedTime(null);
  };

  const handleProceedToConfirm = () => {
    if (selectedTime) {
      setStep("confirm");
    }
  };

  const handleBookAppointment = async () => {
    if (!user || !clinic || !service || !selectedTime) return;

    setBookingLoading(true);
    setBookingError(null);

    try {
      const dateStr = selectedDate.format("YYYY-MM-DD");
      const timeSlotMap: Record<string, string> = {
        "09:00 AM": "09:00:00",
        "10:00 AM": "10:00:00",
        "11:00 AM": "11:00:00",
        "01:00 PM": "13:00:00",
        "02:00 PM": "14:00:00",
        "03:00 PM": "15:00:00",
        "04:00 PM": "16:00:00",
        "05:00 PM": "17:00:00",
      };
      const timeIsoPart = timeSlotMap[selectedTime] || "09:00:00";
      const appointmentDatetime = `${dateStr}T${timeIsoPart}Z`;

      await createAppointmentAPI({
        patient_id: user.id,
        clinic_id: clinic.id,
        service_id: service.id,
        optician_id: optician?.id,
        appointment_datetime: appointmentDatetime,
        notes: remarks.trim(),
      });

      setStep("success");
    } catch (err: any) {
      const msg =
        err?.response?.data?.error || "Failed to book appointment. Please try again.";
      setBookingError(msg);
    } finally {
      setBookingLoading(false);
    }
  };

  const handleSuccessBack = () => {
    onClose();
    if (onBookingComplete) {
      onBookingComplete();
    }
  };

  if (!catalogueRow) return null;

  return (
    <Modal
      open={isVisible}
      onCancel={onClose}
      footer={null}
      width={step === "success" ? 750 : 680}
      centered
      destroyOnHidden
      styles={{
        body: { padding: "20px 24px" },
      }}
    >
      {step === "slots" && (
        <div className="flex flex-col gap-4">
          <div>
            <Title level={4} style={{ marginBottom: 4 }}>
              Available Slots
            </Title>
            <div className="text-sm text-gray-600 space-y-0.5">
              <div>
                <span className="font-semibold text-gray-700">Service: </span>
                {service?.name}
              </div>
              <div>
                <span className="font-semibold text-gray-700">Clinic: </span>
                {clinic?.name}
              </div>
              <div>
                <span className="font-semibold text-gray-700">Optician: </span>
                {optician?.name || "Assigned Optician"}
              </div>
            </div>
          </div>

          {/* Calendar */}
          <div className="border border-gray-200 rounded-lg p-2 bg-white">
            <Calendar
              fullscreen={false}
              value={selectedDate}
              onChange={handleDateChange}
              disabledDate={(current) =>
                current && current < dayjs().startOf("day")
              }
            />
          </div>

          {/* Conflict notice if any */}
          {conflictReason && (
            <Alert message={conflictReason} type="warning" showIcon />
          )}

          {/* Timeslots */}
          <div>
            <div className="text-sm font-semibold text-gray-800 mb-2">
              Available Timeslots for {selectedDate.format("YYYY-MM-DD")}
            </div>

            {loadingAvailability ? (
              <div className="flex justify-center p-6">
                <Spin tip="Checking availability..." />
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2">
                {ALL_TIMESLOT_VALUES.map((slot) => {
                  const isBooked = bookedSlots.includes(slot);
                  const isSelected = selectedTime === slot;

                  return (
                    <Button
                      key={slot}
                      type={isSelected ? "primary" : isBooked ? "default" : "default"}
                      disabled={isBooked}
                      onClick={() => setSelectedTime(slot)}
                      className={`text-xs h-9 ${
                        isSelected
                          ? "bg-blue-600 text-white font-semibold"
                          : isBooked
                          ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                          : "border-blue-400 text-blue-600 hover:bg-blue-50"
                      }`}
                    >
                      {slot}
                    </Button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Selection summary & Proceed */}
          <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-2">
            <div className="text-xs text-gray-700">
              <div>
                <span className="font-medium">Selected Date: </span>
                {selectedDate.format("YYYY-MM-DD")}
              </div>
              <div>
                <span className="font-medium">Selected Time: </span>
                {selectedTime || "None selected"}
              </div>
            </div>

            <Button
              type="primary"
              disabled={!selectedTime}
              onClick={handleProceedToConfirm}
              className="bg-blue-600 hover:bg-blue-700 px-6"
            >
              Proceed
            </Button>
          </div>
        </div>
      )}

      {step === "confirm" && (
        <div className="flex flex-col gap-4">
          <div className="text-center pb-2 border-b border-gray-100">
            <Title level={4} style={{ marginBottom: 2 }}>
              Confirm Your Appointment
            </Title>
            <Text type="secondary" className="text-xs">
              Review details and add remarks before confirming
            </Text>
          </div>

          {bookingError && (
            <Alert message={bookingError} type="error" showIcon closable />
          )}

          <Form layout="vertical" className="space-y-2">
            <Form.Item label="Service" className="mb-2">
              <Input value={service?.name} disabled />
            </Form.Item>

            <Form.Item label="Clinic" className="mb-2">
              <Input value={clinic?.name} disabled />
            </Form.Item>

            <Form.Item label="Optician" className="mb-2">
              <Input value={optician?.name || "Assigned Optician"} disabled />
            </Form.Item>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 mb-2">
              <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Booking Information
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Selected Date: </span>
                  <span className="font-semibold text-gray-800">
                    {selectedDate.format("D MMMM YYYY")}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Selected Time: </span>
                  <span className="font-semibold text-gray-800">
                    {selectedTime}
                  </span>
                </div>
              </div>
            </div>

            <Form.Item label="Remarks" className="mb-4">
              <Input.TextArea
                rows={3}
                placeholder="Remarks (e.g. symptoms, notes)"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </Form.Item>

            <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
              <Button onClick={() => setStep("slots")} disabled={bookingLoading}>
                Back
              </Button>
              <Button
                type="primary"
                onClick={handleBookAppointment}
                loading={bookingLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Book appointment
              </Button>
            </div>
          </Form>
        </div>
      )}

      {step === "success" && (
        <div className="flex justify-center p-2">
          <AppointmentConfirmed
            bookingDetails={{
              service: service?.name || "",
              clinic: clinic?.name || "",
              optician: optician?.name || "",
              date: selectedDate.format("D MMMM YYYY"),
              time: selectedTime || "",
              notes: remarks || "None",
              emailConfirmation: user?.email || "",
            }}
            onClickCallback={handleSuccessBack}
          />
        </div>
      )}
    </Modal>
  );
};
