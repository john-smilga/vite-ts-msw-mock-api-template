import { http, HttpResponse } from 'msw';
import { url } from '../useFetch';
import { Tour } from '../types';

const mockTours: Tour[] = [
  {
    id: 'rec6d6T3q5EBIdCfD',
    name: 'Best of Paris in 7 Days Tour',
    info: 'Experience the magic of Paris with guided visits to the Louvre, Notre-Dame Cathedral, and Palace of Versailles. Immerse yourself in French culture, cuisine and art in the City of Light.',
    image: 'https://images.pexels.com/photos/699466/pexels-photo-699466.jpeg',
    price: '1,995',
  },
  {
    id: 'rec3jeKnhInKHJuz2',
    name: 'Best of Rome in 7 Days Tour',
    info: "Our Rome tour takes you to the most iconic sites including the Colosseum, Vatican Museums, Sistine Chapel and St. Peter's Basilica. Experience authentic Italian culture, cuisine and history.",
    image: 'https://images.pexels.com/photos/532263/pexels-photo-532263.jpeg',
    price: '2,095',
  },
];

export const handlers = [
  http.get(url, () => {
    return HttpResponse.json(mockTours);
  }),
];

export const errorGetTours = [
  http.get(url, () => {
    return HttpResponse.json(
      {
        message: 'Failed to fetch tours. ',
      },
      { status: 500 }
    );
  }),
];
