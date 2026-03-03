import { useEffect } from "react";
import { useTripStore } from "../stores/TripStore";
import { ExploreTripCard } from "../components/common/ExploreTripCard";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";

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
      <div className="p-10 text-center">
        <p>Loading trips...</p>
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
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">

      {/* 🔥 TRENDING CAROUSEL */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">
          Trending trips
        </h2>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {trendingTrips?.map(trip => (
              <div
                key={trip._id}
                className="flex-[0_0_90%] sm:flex-[0_0_60%] lg:flex-[0_0_32%] px-3"
              >
                <ExploreTripCard trip={trip} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🧑‍🤝‍🧑 FEED */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">
          Following
        </h2>

        {feedTrips && feedTrips.length > 0 ? (
          <div className="w-full flex justify-center">
            <div className="w-full max-w-4xl flex flex-col gap-8">
              {feedTrips.map(trip => (
                <ExploreTripCard
                  key={trip._id}
                  trip={trip}
                  variant="horizontal"
                />
              ))}
            </div>
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
  );
};