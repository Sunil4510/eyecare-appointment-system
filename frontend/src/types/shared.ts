/**
 * This file is provided you as part of the interview kit.
 * Feel free to modify it as needed.
 * Do not remove this comment.
 */

export type Appointment = {
  id: string;
  patient_id: string;
  appointment_datetime: string;
  clinic_id: string;
  service_id: string;
  notes: string;
  optician_id?: string;
  clinic_name?: string;
  service_name?: string;
  optician_name?: string;
  patient_name?: string;
};
export type Service = {
  id: string;
  name: string;
  description: string;
};

export type Clinic = {
  id: string;
  name: string;
  description: string;
  address: string;
  opticians: string[];
  contact: string;
};

export type Optician = {
  id: string;
  name: string;
  intro: string;
  services_id: string[];
};

export enum UserRole {
  Patient = "patient",
  Optician = "optician",
}

export type User = {
  id: string;
  email: string;
  password?: string;
  role: UserRole;
  first_name: string;
  last_name: string;
  phone_number: string;
  birthday: string;
  optician_id?: string;
};
