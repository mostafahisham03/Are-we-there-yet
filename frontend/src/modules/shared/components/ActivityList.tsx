import { useEffect, useState } from 'react';

interface Activity {
  date: string;
  time: string;
  location: {
    name: string;
    latitude: number;
    longitude: number;
  };
  price: number;
  category: string;
  ratings: number;
  tags: {
    name: string;
    type: string;
    historical_period: string;
  }[];
  specialDiscounts: number;
  bookingOpen: boolean;
}

const formatText = (text: string) => {
  const maxLength = 5 * 3;
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

function useGetMyActivities() {
  // init the states
  const [data, setData] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // fetch the data
  useEffect(() => {
    const runner = async () => {
      // init the url
      const baseUrl = 'https://are-we-there-yet-mirror.onrender.com/api';
      const url = `${baseUrl}/activities/`;

      // main logic
      try {
        // fetch the data
        const response = await fetch(url, {
          method: 'GET',
        });

        // check if the response is ok
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        // parse the response
        const parsedData = await response.json();

        // format the data
        const tempData: Activity[] = await parsedData.data.map((item) => {
          const datetime = item.datetime ?? 'N/A';
          const date = new Date(datetime).toLocaleDateString();
          const time = new Date(datetime).toLocaleTimeString();

          const location = {
            name: item.location.name ?? 'N/A',
            latitude: item.location.latitude ?? 0,
            longitude: item.location.longitude ?? 0,
          };
          const price = item.price ?? -1;
          let category = item.category ?? 'N/A';
          category = category.name ?? 'N/A';

          let tags = item.tags ?? [];
          tags = tags.map((tag) => tag.name ?? 'N/A');

          const specialDiscounts = item.specialDiscounts ?? 0;
          const bookingOpen = item.bookingOpen ?? false;
          const ratings = Math.floor(Math.random() * 5) + 1; // TODO: Replace with actual ratings

          return {
            date,
            time,
            location,
            ratings,
            price,
            category,
            tags,
            specialDiscounts,
            bookingOpen,
          };
        });

        // sort on price
        tempData.sort((a, b) => a.price - b.price);

        // set the data
        setData(tempData);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    runner();
  }, []);

  return { data, loading, error };
}

function ActivityCard({ activity }: { activity: Activity }) {
  return (
    <div className="w-full h-fit border-black border-2 grid grid-cols-9 py-8 px-2">
      <div className="text-left">{activity.date}</div>
      <div className="text-left">{activity.time}</div>
      <div className="text-left">{activity.location.name}</div>
      <div className="text-left">{activity.price}</div>
      <div className="text-left">{activity.ratings}/5</div>
      <div className="text-left">{activity.category}</div>
      <div className="text-left">{activity.tags.map(formatText).join(', ')}</div>
      <div className="text-left">{activity.specialDiscounts}</div>
      <div className="text-left">{activity.bookingOpen ? 'Open' : 'Closed'}</div>
    </div>
  );
}

export function ActivityList() {
  // get the data
  const { data, loading, error } = useGetMyActivities();

  // handle the search and filter
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [budget, setBudget] = useState<number | null>(null);
  const [date, setDate] = useState<string>('');
  const [ratings, setRatings] = useState<number | null>(null);

  const [filteredData, setFilteredData] = useState<Activity[]>([]);

  useEffect(() => {
    setFilteredData(
      data.filter((item) => {
        // Check each filter criteria
        const matchesSearchQuery =
          searchQuery === '' ||
          item.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesBudget = budget === null || item.price <= budget;

        const matchesDate = date === '' || new Date(item.date) >= new Date(date);

        const matchesRatings = ratings === null || item.ratings >= ratings;

        // Return true if all conditions match
        return matchesSearchQuery && matchesBudget && matchesDate && matchesRatings;
      })
    );
  }, [searchQuery, budget, date, ratings, data]);

  return (
    <div className="flex flex-col gap-8 p-8">
      {/* tool bar */}
      <div className="p-4 grid grid-cols-4 gap-8">
        <input
          type="text"
          placeholder="Search"
          className="w-full h-full border-black border-2 p-4"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max Budget"
          className="w-full border-black border-2 p-4"
          value={budget ?? ''}
          onChange={(e) => setBudget(e.target.value ? parseInt(e.target.value) : null)}
        />
        <input
          type="date"
          className="w-full border-black border-2 p-4"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          type="number"
          placeholder="Min Ratings"
          className="w-full border-black border-2 p-4"
          value={ratings ?? ''}
          onChange={(e) => setRatings(e.target.value ? parseInt(e.target.value) : null)}
        />
      </div>
      {/* header */}
      <div className="w-full h-fit border-black border-2 grid grid-cols-9 py-4 px-2">
        <div className="text-left font-bold text-xl">Date</div>
        <div className="text-left font-bold text-xl">Time</div>
        <div className="text-left font-bold text-xl">Location</div>
        <div className="text-left font-bold text-xl">Price</div>
        <div className="text-left font-bold text-xl">Ratings</div>
        <div className="text-left font-bold text-xl">Category</div>
        <div className="text-left font-bold text-xl">Tags</div>
        <div className="text-left font-bold text-xl">Discount</div>
        <div className="text-left font-bold text-xl">Booking</div>
      </div>
      {/* body */}
      {loading && <div className="text-center text-2xl font-bold">Loading...</div>}
      {error && <div className="text-center text-2xl font-bold text-red-500">{error}</div>}
      {!loading && !error && filteredData.map((activity, index) => <ActivityCard key={index} activity={activity} />)}
    </div>
  );
}