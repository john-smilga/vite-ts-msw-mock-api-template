import { useFetch } from '../useFetch';

const Tours = () => {
  const { loading, tours, error } = useFetch();

  if (loading) {
    return <h1>Loading...</h1>;
  }
  if (error) {
    return <h1>{error}</h1>;
  }

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-16'>
      {tours.map((tour) => (
        <article
          key={tour.id}
          className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow'
        >
          <img
            src={tour.image}
            alt={tour.name}
            className='w-full h-48 object-cover'
          />
          <div className='p-4'>
            <h3 className='text-xl font-semibold mb-2'>{tour.name}</h3>
            <p className='text-gray-600 mb-4 line-clamp-2'>{tour.info}</p>
            <div className='flex justify-between items-center mt-4'>
              <span className='text-lg font-bold text-teal-500'>
                ${tour.price}
              </span>
              <button className='bg-teal-700 text-white px-3 py-1 rounded hover:bg-teal-800 transition-colors text-sm'>
                Book Now
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};
export default Tours;
