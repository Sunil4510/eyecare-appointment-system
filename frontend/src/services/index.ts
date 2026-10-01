/**
 * This file is provided you as part of the interview kit.
 * Feel free to modify it as needed.
 * Do not remove this comment.
 */

import axios from "axios";
import { CatalogueRow } from "../types/index.ts";
import type {
  Appointment,
  Clinic,
  Optician,
  Service,
  User,
} from "../types/shared.ts";
import { getConfig } from "./configService.ts";

/**
 * Below are some of the service functions to call backend APIs.
 * You can add more service functions as needed.
 * Each function handles API calls for different entities like Appointments, Clinics, Services, Opticians, and Users.
 * Make sure to handle errors appropriately in a real-world application.
 * You can also modify the provided functions based on your application's requirements.
 */

/************************ Auth APIs ********************************/

export const loginAPI = async (email: string, password: string) => {
  const { backendURL } = getConfig();
  try {
    const response = await axios.post<{ message: string; user: User }>(
      `${backendURL}/login`,
      { email, password }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/************************ Fetch Appointment APIs ************************/

export const fetchAppointmentsAPI = async (params?: {
  patient_id?: string;
  optician_id?: string;
  clinic_id?: string;
  date?: string;
}) => {
  const { backendURL } = getConfig();
  try {
    const response = await axios.get<Appointment[]>(`${backendURL}/appointments`, {
      params,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const checkAvailabilityAPI = async (
  clinicId: string,
  opticianId: string,
  date: string
) => {
  const { backendURL } = getConfig();
  try {
    const response = await axios.get<{
      date: string;
      clinic_id: string;
      optician_id: string;
      all_slots: string[];
      booked_slots: string[];
      available_slots: string[];
      conflict?: boolean;
      conflict_reason?: string;
    }>(`${backendURL}/appointments/availability`, {
      params: { clinic_id: clinicId, optician_id: opticianId, date },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createAppointmentAPI = async (
  appointmentData: Partial<Appointment>
) => {
  const { backendURL } = getConfig();
  try {
    const response = await axios.post<{ message: string; data: Appointment }>(
      `${backendURL}/appointment`,
      appointmentData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/************************ Fetch Clinic APIs *************************/

export const fetchClinicsAPI = async () => {
  const { backendURL } = getConfig();
  try {
    const response = await axios.get<Clinic[]>(`${backendURL}/clinics`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/************************ Fetch Services APIs ************************/

export const fetchServicesAPI = async () => {
  const { backendURL } = getConfig();
  try {
    const response = await axios.get<Service[]>(`${backendURL}/services`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/************************ Fetch Catalogue Table APIs ************************/

export const fetchCatalogueTableAPI = async () => {
  const { backendURL } = getConfig();
  try {
    const response = await axios.get<CatalogueRow[]>(`${backendURL}/catalogue-table`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/************************ Fetch Optician APIs ************************/

export const fetchOpticiansAPI = async () => {
  const { backendURL } = getConfig();
  try {
    const response = await axios.get<Optician[]>(`${backendURL}/opticians`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/************************ Fetch User APIs ***************************/

export const fetchUsersAPI = async () => {
  const { backendURL } = getConfig();
  try {
    const response = await axios.get<User[]>(`${backendURL}/users`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchUserByIdAPI = async (id: string) => {
  const { backendURL } = getConfig();
  try {
    const response = await axios.get<User>(`${backendURL}/user/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

