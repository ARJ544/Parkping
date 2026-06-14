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
    <div className="min-h-screen bg-zinc-50 text-slate-900 dark:bg-zinc-950 dark:text-slate-50 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 py-2">

        {/* Header Section */}
        <div className="flex flex-col justify-around md:flex-row md:items-center md:justify-between border-b border-zinc-200 dark:border-zinc-500 mb-4 gap-4 pb-2">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
              <Heart className="w-8 h-8 text-red-500 fill-current animate-pulse" />
              Our Supporters
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
              Every contribution helps sustain our servers, power features, and keep the platform alive.
            </p>
          </div>

          {/* Total Supporters Stats Badge */}
          <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-4 self-start md:self-auto">
            <div className="p-2.5 bg-emerald-500 text-white rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Total Supporters</span>
              <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">{totalDonors}</span>
            </div>
          </div>
        </div>

        {renderPagination()}

        {/* Donors Content / Grid */}
        {donations.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900">
            <p className="text-zinc-500 dark:text-zinc-400 font-medium">No donations recorded yet. Be the first to support!</p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
              {donations.map((donation) => (
                <div
                  key={donation.id}
                  className="flex flex-col justify-between border border-zinc-100 dark:border-zinc-500 rounded-2xl p-5 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md hover:border-zinc-200 dark:hover:border-zinc-700 transition duration-200"
                >
                  <div>
                    {/* Top row: Donor Name & Amount */}
                    <div className="flex justify-between items-start gap-4 mb-3">
                      <h3 className="font-bold text-base tracking-tight text-zinc-800 dark:text-zinc-100 truncate max-w-[70%]">
                        {donation.donor_name || "Anonymous Donor"}
                      </h3>
                      <span className="inline-flex items-center gap-0.5 px-3 py-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-500/20 rounded-full text-sm font-bold text-amber-600 dark:text-amber-400">
                        <DollarSign className="w-3.5 h-3.5 -mr-0.5" />
                        {donation.amount_usd}
                      </span>
                    </div>

                    {/* Donor Custom Message */}
                    {donation.message && (
                      <ExpandableMessage message={donation.message} />
                    )}
                  </div>

                  {/* Bottom row: Time stamp */}
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-400 dark:text-zinc-500 mt-auto border-t border-zinc-50 dark:border-zinc-800/50 pt-3">
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
          </>
        )}
      </div>

      {renderPagination()}
    </div>
  );
}