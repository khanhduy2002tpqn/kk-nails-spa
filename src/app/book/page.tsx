import { BookingForm } from "@/components/booking/BookingForm";
import { ManageBooking } from "@/components/booking/ManageBooking";

export const metadata = {
  title: "Book Appointment",
  description: "Schedule your nail and spa appointment at K&K Nails and Spa in Folcroft, PA.",
};

export default function BookPage() {
  return (
    <div className="bg-pink-blush/60 pt-28 pb-20 dark:bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="section-label">Online Booking</p>
          <h1 className="section-title">Reserve Your Appointment</h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
            Select your service, choose your artist, and pick a time — we&apos;ll send a
            confirmation to your email instantly.
          </p>
        </div>

        <div className="mt-12">
          <BookingForm />
        </div>

        <div className="mt-16">
          <ManageBooking redirectOnLookup />
        </div>
      </div>
    </div>
  );
}
