/**
 * This file is provided you as part of the interview kit.
 * Feel free to modify it as needed.
 * Do not remove this comment.
 */

import type { FC } from "react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CatalogueRow } from "../../types";
import { ServiceTable } from "../organisms/ServiceTable";
import { ActionBar } from "../molecules/ActionBar";
import { BookingModal } from "../organisms/BookingModal";
import { fetchCatalogueTableAPI } from "../../services";
import { useAuth } from "../../context/AuthContext";

const Catalogue: FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [catalogueContent, setCatalogueContent] = useState<CatalogueRow[]>([]);
  const [loading, setLoading] = useState(true);

  // Search and filter states
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedClinic, setSelectedClinic] = useState<string | null>(null);
  const [selectedOptician, setSelectedOptician] = useState<string | null>(null);

  // Booking modal state
  const [bookingRow, setBookingRow] = useState<CatalogueRow | null>(null);

  useEffect(() => {
    const fetchServicesFn = async () => {
      setLoading(true);
      try {
        const contentData = await fetchCatalogueTableAPI();
        setCatalogueContent(contentData);
      } catch (error) {
        console.error(`Error fetching catalogue: ${error}`);
      } finally {
        setLoading(false);
      }
    };

    fetchServicesFn();
  }, []);

  // Compute unique dropdown options from catalogue content
  const serviceOptions = useMemo(() => {
    const map = new Map<string, string>();
    catalogueContent.forEach((row) => {
      if (row.service?.name) {
        map.set(row.service.name, row.service.name);
      }
    });
    return Array.from(map.values())
      .sort()
      .map((name) => ({ label: name, value: name }));
  }, [catalogueContent]);

  const clinicOptions = useMemo(() => {
    const map = new Map<string, string>();
    catalogueContent.forEach((row) => {
      if (row.clinic?.name) {
        map.set(row.clinic.name, row.clinic.name);
      }
    });
    return Array.from(map.values())
      .sort()
      .map((name) => ({ label: name, value: name }));
  }, [catalogueContent]);

  const opticianOptions = useMemo(() => {
    const map = new Map<string, string>();
    catalogueContent.forEach((row) => {
      row.clinic?.opticians?.forEach((opt) => {
        if (opt.name) {
          map.set(opt.name, opt.name);
        }
      });
    });
    return Array.from(map.values())
      .sort()
      .map((name) => ({ label: name, value: name }));
  }, [catalogueContent]);

  // Filter catalogue content based on search and dropdown selections
  const filteredData = useMemo(() => {
    return catalogueContent.filter((row) => {
      const serviceName = row.service?.name?.toLowerCase() || "";
      const clinicName = row.clinic?.name?.toLowerCase() || "";
      const opticianNames =
        row.clinic?.opticians?.map((o) => o.name.toLowerCase()).join(" ") || "";

      // Keyword search
      if (searchKeyword.trim()) {
        const kw = searchKeyword.trim().toLowerCase();
        const matchesKeyword =
          serviceName.includes(kw) ||
          clinicName.includes(kw) ||
          opticianNames.includes(kw);
        if (!matchesKeyword) return false;
      }

      // Dropdown filters
      if (selectedService && row.service?.name !== selectedService) {
        return false;
      }

      if (selectedClinic && row.clinic?.name !== selectedClinic) {
        return false;
      }

      if (
        selectedOptician &&
        !row.clinic?.opticians?.some((o) => o.name === selectedOptician)
      ) {
        return false;
      }

      return true;
    });
  }, [
    catalogueContent,
    searchKeyword,
    selectedService,
    selectedClinic,
    selectedOptician,
  ]);

  const dropdownConfigs = [
    {
      options: serviceOptions,
      onChange: (value: string) => setSelectedService(value || null),
      placeholder: "Filter by Service",
    },
    {
      options: clinicOptions,
      onChange: (value: string) => setSelectedClinic(value || null),
      placeholder: "Filter by Clinic",
    },
    {
      options: opticianOptions,
      onChange: (value: string) => setSelectedOptician(value || null),
      placeholder: "Filter by Optician",
    },
  ];

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <ActionBar
          onSearch={(val) => setSearchKeyword(val)}
          dropdowns={dropdownConfigs}
        />
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <ServiceTable
          dataSource={filteredData}
          loading={loading}
          onCheckAvailability={(record) => setBookingRow(record)}
        />
      </div>

      {bookingRow && (
        <BookingModal
          isVisible={!!bookingRow}
          onClose={() => setBookingRow(null)}
          catalogueRow={bookingRow}
          user={user}
          onBookingComplete={() => {
            setBookingRow(null);
            navigate("/home");
          }}
        />
      )}
    </div>
  );
};

export default Catalogue;

