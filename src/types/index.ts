export type ServiceCategory =
  | "manicure"
  | "pedicure"
  | "gel"
  | "acrylic"
  | "dip"
  | "nail-art"
  | "waxing"
  | "eyelash"
  | "spa";

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  price: number;
  priceLabel?: string;
  description?: string;
}

export interface Technician {
  id: string;
  name: string;
  title: string;
  specialties: string[];
  image?: string;
  active: boolean;
}

export interface Booking {
  id: string;
  serviceId: string;
  serviceName: string;
  serviceIds?: string[];
  serviceNames?: string[];
  technicianId: string;
  technicianName: string;
  date: string;
  time: string;
  duration: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  notes?: string;
  status: "confirmed" | "cancelled" | "completed";
  createdAt: string;
  updatedAt: string;
}

export interface BlockedSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  technicianId?: string;
  reason?: string;
}

export type StaffRole = "administrator" | "technician";

export interface StaffAccount {
  id: string;
  username: string;
  passwordHash: string;
  role: StaffRole;
  technicianId?: string;
  technicianName?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export type PublicStaffAccount = Omit<StaffAccount, "passwordHash">;

export interface Testimonial {
  id: string;
  name: string;
  rating: number;
  text: string;
  service?: string;
  date: string;
}

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  category: "nails" | "spa" | "clients" | "interior";
  span?: "tall" | "wide";
}
