import { ManageBooking } from "@/components/booking/ManageBooking";

export const metadata = {
  title: "Manage Appointment",
  description: "Find, reschedule, or cancel your K&K Nails and Spa appointment.",
};

export default function ManagePage() {
  return (
    <div className="bg-pink-blush/60 pt-28 pb-20 dark:bg-background">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="section-label">Appointment Lookup</p>
          <h1 className="section-title">Manage Your Appointment</h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
            Enter the full confirmation ID from your email to reschedule or cancel.
          </p>
        </div>

        <div className="mt-12">
          <ManageBooking />
        </div>
      </div>
    </div>
  );
}
