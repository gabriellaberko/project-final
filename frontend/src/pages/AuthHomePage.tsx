import { useEffect } from "react";
import { useTripStore } from "../stores/TripStore";
import { ExploreTripCard } from "../components/common/ExploreTripCard";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { LoadingState } from "../components/status/LoadingState";

export const AuthHomePage = () => {
  const {
    feedTrips,
    trendingTrips,
    fetchFeedTrips,
    fetchPublicTrips,
    loading,
    error
  } = useTripStore();

  const [emblaRef] = useEmblaCarousel(
    { loop: true },
    [AutoScroll({ speed: 0.6, stopOnInteraction: false })]
  );

  useEffect(() => {
    fetchFeedTrips();
    fetchPublicTrips("?sort=likes&limit=5", "trending");
  }, [fetchFeedTrips, fetchPublicTrips]);

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
      <LoadingState />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center">
        <p>Something went wrong.</p>
      </div>
    );
  }

  return (
    <div className="px-3 py-10">
      <div className="mx-auto w-full max-w-sm md:max-w-5xl space-y-20">

        {/* TRENDING CAROUSEL */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Trending trips
          </h2>
          <p className="text-sm mb-10">Find inspiration from the most popular trips in our community right now.</p>

          <div 
            className="overflow-hidden pb-2"
            ref={emblaRef}
          >
            <div className="flex">
              {trendingTrips?.map(trip => (
                <div
                  key={trip._id}
                  className="
                    flex-[0_0_75%]
                    md:flex-[0_0_30%]
                    min-w-0
                    pl-4
                  "
                >
                  <ExploreTripCard trip={trip} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEED */}
        <section className="pt-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Following Trips
          </h2>
          <p className="text-sm mb-10">See what the people you follow are planning most recently and get inspired for your next adventure.</p>

          {feedTrips && feedTrips.length > 0 ? (
            <div className="w-full flex flex-col gap-8">
              {/* <div className="w-full max-w-4xl flex flex-col gap-8"> */}
                {feedTrips.map(trip => (
                  <ExploreTripCard
                    key={trip._id}
                    trip={trip}
                    variant="horizontal"
                  />
                ))}
              {/* </div> */}
            </div>
          ) : (
            <div className="bg-gray-50 p-10 rounded-2xl text-center">
              <p className="text-gray-600">
                You're not following anyone yet.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};