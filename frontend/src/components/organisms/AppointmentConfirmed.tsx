/**
 * This file is provided you as part of the interview kit.
 * Feel free to modify it as needed.
 * Do not remove this comment.
 */

import { Button, Card, Descriptions, Result } from "antd";
import { FC } from "react";
import { BookingDetails } from "../../types";

type AppointmentConfirmedProps = {
  bookingDetails: BookingDetails;
  onClickCallback?: () => void;
};

export const AppointmentConfirmed: FC<AppointmentConfirmedProps> = ({
  bookingDetails,
  onClickCallback,
}) => {
  return (
    <Card className="w-full">
      <Result
        status="success"
        title="Appointment Booked Successfully!"
        subTitle="Your appointment has been confirmed. You will receive an email confirmation shortly."
        extra={[
          <div key="booking-summary" style={{ marginBottom: 24 }}>
            <Descriptions
              title="Booking Summary"
              column={1}
              bordered
              size="small"
              styles={{ label: { width: "30%" } }}
            >
              <Descriptions.Item label="Service">
                {bookingDetails.service}
              </Descriptions.Item>
              <Descriptions.Item label="Clinic">
                {bookingDetails.clinic}
              </Descriptions.Item>
              <Descriptions.Item label="Optician">
                {bookingDetails.optician}
              </Descriptions.Item>
              <Descriptions.Item label="Date">
                {bookingDetails.date}
              </Descriptions.Item>
              <Descriptions.Item label="Time">
                {bookingDetails.time}
              </Descriptions.Item>
              <Descriptions.Item label="Remarks">
                {bookingDetails.notes}
              </Descriptions.Item>
              <Descriptions.Item label="Email Confirmation">
                {bookingDetails.emailConfirmation}
              </Descriptions.Item>
            </Descriptions>
          </div>,
          <Button
            key="home"
            type="primary"
            size="large"
            onClick={onClickCallback}
            block
          >
            Back to Home
          </Button>,
        ]}
      />
    </Card>
  );
};
