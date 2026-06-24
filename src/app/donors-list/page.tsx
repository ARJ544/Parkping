import Link from "next/link";
import { Heart, Calendar, DollarSign, Users, ArrowRightCircle, ArrowLeftCircle } from 'lucide-react';
import { getDonors } from '@/lib/donations/get-donors';
import ExpandableMessage from '@/components/donations/ExpandableMessage';
import { redirect } from "next/navigation";

export default async function DonorsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
  }>;
}) {
  const params = await searchParams;

  const currentPage = Math.max(
    1,
    Number(params.page ?? 1)
  );

  const {
    totalDonors,
    totalPages,
    donations,
  } = await getDonors(currentPage);

  if (currentPage > totalPages && totalPages > 0) {
    redirect(`/donors-list?page=${totalPages}`);
  }

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    return (
      <div className="flex justify-center items-center gap-4 mt-2">
        <Link
          href={`/donors-list?page=${currentPage - 1}`}
          className={`px-4 py-2 rounded-xl border ${currentPage <= 1 ? "pointer-events-none opacity-50" : ""
            }`}
        >
          <ArrowLeftCircle className="w-5 h-5" />
        </Link>

        <span className="text-sm font-medium">
          Page {currentPage} of {totalPages}
        </span>

        <Link
          href={`/donors-list?page=${currentPage + 1}`}
          className={`px-4 py-2 rounded-xl border ${currentPage >= totalPages ? "pointer-events-none opacity-50" : ""
            }`}
        >
          <ArrowRightCircle className="w-5 h-5" />
        </Link>
      </div>
    );
  };

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-50 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 py-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-[#e0d5b8] dark:border-[#1e2a4a] mb-6 gap-4 pb-5">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-[#e8edf8] flex items-center gap-3">
              <Heart className="w-7 h-7 text-[#d85a30] fill-current animate-pulse" />
              Our Supporters
            </h1>
            <p className="text-sm text-[#8a7a5a] dark:text-[#89aee6] mt-2">
              Every contribution helps sustain our servers, power features, and keep the platform alive.
            </p>
          </div>

          {/* Total Supporters Badge */}
          <div className="flex items-center gap-3 rounded-2xl p-4 self-start md:self-auto
            border border-[#e8dfc4] dark:border-[#1e2a4a]
            bg-[#fef9ed] dark:bg-[#0d1b33]">
            <div className="p-2.5 bg-[#d85a30] text-white rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[10px] text-[#8a7a5a] dark:text-[#4a6fa5] uppercase font-bold tracking-wider">
                Total Supporters
              </span>
              <span className="text-xl font-black text-[#d85a30]">
                {totalDonors}
              </span>
            </div>
          </div>
        </div>

        {renderPagination()}

        {/* Donors Grid */}
        {donations.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-[#e8dfc4] dark:border-[#1e2a4a] rounded-2xl bg-[#fef9ed] dark:bg-[#0d1b33]">
            <p className="text-[#8a7a5a] dark:text-[#89aee6] font-medium">
              No donations recorded yet. Be the first to support!
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {donations.map((donation) => (
              <div
                key={donation.id}
                className="flex flex-col justify-between rounded-2xl p-5
                  border border-[#e8dfc4] dark:border-[#1e2a4a]
                  bg-[#fef9ed] dark:bg-[#0d1b33]
                  shadow-sm hover:shadow-md hover:-translate-y-1
                  hover:border-[#d85a30]/40 dark:hover:border-[#d85a30]/60
                  transition-all duration-300 group relative overflow-hidden"
              >
                {/* Hover glow */}
                <div className="absolute inset-0 bg-linear-to-br from-[#d85a30]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="relative z-10">
                  {/* Top row: Name & Amount */}
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <h3 className="font-bold text-base tracking-tight text-slate-900 dark:text-[#e8edf8] truncate max-w-[65%] group-hover:text-[#d85a30] dark:group-hover:text-[#d85a30] transition-colors duration-200">
                      {donation.donor_name || "Anonymous Donor"}
                    </h3>
                    <span className="inline-flex items-center gap-0.5 px-3 py-1
                      bg-orange-50 dark:bg-[#d85a30]/10
                      border border-[#d85a30]/20 dark:border-[#d85a30]/30
                      rounded-full text-sm font-bold text-[#d85a30]">
                      <DollarSign className="w-3.5 h-3.5 -mr-0.5" />
                      {donation.amount_usd}
                    </span>
                  </div>

                  {/* Message */}
                  {donation.message && (
                    <ExpandableMessage message={donation.message} />
                  )}
                </div>

                {/* Timestamp */}
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#8a7a5a] dark:text-[#4a6fa5] mt-auto border-t border-[#e8dfc4] dark:border-[#1e2a4a] pt-3 relative z-10">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {new Date(donation.donated_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {renderPagination()}
    </div>
  );
}