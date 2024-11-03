A brief walkthrough on how to set up Vite (TypeScript Template), Vitest, and React Testing Library.

[Article](https://johnsmilga.com/articles/2024/10/15)

## Vitest

In your command line, create a new Vite project and choose the React with TypeScript option.

```bash
npm create vite@latest
```

Next, open up the integrated terminal and install Vitest.

```bash
npm install vitest --save-dev
```

Add the test script to your package.json:

```json
"scripts": {
    "test": "vitest"
  },
```

Create a test file, e.g., random.test.ts, in your project. Make sure you add the suffix "test" — in my case, I will do it in the src directory.

```ts
import { describe, it, expect } from 'vitest';

describe('basic arithmetic checks', () => {
  it('1 + 1 equals 2', () => {
    expect(1 + 1).toBe(2);
  });

  it('2 * 2 equals 4', () => {
    expect(2 * 2).toBe(4);
  });
});
```

Run the test:

```bash
npm run test
```

If everything is correct, your test should pass. You should not see any errors in your terminal, and everything should be green 😀. Since I want to focus on the setup in this article, we won’t spend time on the actual commands. The plan is to cover testing code in one of the later articles.

## React Testing Library

Since we want to test our React components, we need to install React Testing Library and other dependencies. Stop the test by pressing Ctrl + C and install the following dependencies:

```bash
# Core testing utilities for React components
npm install @testing-library/react @testing-library/jest-dom --save-dev
```

```bash
# Simulates a browser-like environment for tests to run in Node.js
npm install jsdom --save-dev
```

```bash
# Simulates user interactions (clicks, typing, etc.) in tests
npm install @testing-library/user-event --save-dev
```

Add the test object to vite.config.ts:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
  },
});
```

If you have red squiggly lines in your vite.config.ts file, no worries — it’s because we are using TypeScript, and we will fix it very soon.

After that, we want to create a setup file. In the root directory, create vitest.setup.ts and add the following code:

src/vitest.setup.ts

```ts
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

afterEach(() => {
  cleanup();
});
```

Make some changes in the vite.config.ts file:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/vitest.setup.ts',
  },
});
```

Lastly, to fix the TypeScript errors, we need to change the import in our vite.config.ts file. Now we need to import defineConfig from vitest/config:

```ts
import { defineConfig } from 'vitest/config';
```

We also need to add the following code to our tsconfig.app.json file, which allows us to use Vitest's global functions like describe, it, and expect without needing to import them explicitly. If you’re wondering about the @testing-library/jest-dom, it’s because we want to use the custom matchers provided by the library globally as well.

tsconfig.app.json

```json
{
  "compilerOptions": {
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  }
}
```

Now we are ready to test our React components with React Testing Library and Vitest. Create a new file, e.g., Random.tsx, in your project and add the following code:

src/Random.tsx

```tsx
const Random = () => {
  return <div>Random Component</div>;
};
export default Random;
```

After that, create a tests directory in the src folder and add a Random.test.tsx file with the following code:

src/**tests**/Random.test.tsx

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Random from '../Random';

describe('Random Component', () => {
  it('renders correctly', () => {
    render(<Random />);
    screen.debug(); // Logs the DOM structure
    const element = screen.getByText('Random Component');
    expect(element).toBeInTheDocument();
  });
});
```

That's it for the setup. Now you can run the test by typing npm run test in your terminal. If everything is correct, you should see the following output:

```bash

  <body>
  <div>
    <div>
      Random Component
    </div>
  </div>
</body>

 ✓ src/random.test.ts (2)
 ✓ src/__tests__/Random.test.tsx (1)

 Test Files  2 passed (2)
      Tests  3 passed (3)
   Start at  15:17:47
   Duration  334ms (transform 22ms, setup 128ms, collect 14ms, tests 14ms, environment 281ms, prepare 53ms)


 PASS  Waiting for file changes...
       press h to show help, press q to quit
```

## HTTP Requests

Let's create a component that fetches data from an API and displays it. After that we will learn how to mock the API calls with MSW.

- first install axios

```bash
npm i axios
```

- create a types.ts file in the src directory

```ts
export type Tour = {
  id: string;
  name: string;
  info: string;
  image: string;
  price: string;
};
```

- create a useFetch.ts file in the src directory

```ts
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Tour } from './types';
export const url = 'https://www.course-api.com/react-tours-project';

export const useFetch = () => {
  const [loading, setLoading] = useState(false);
  const [tours, setTours] = useState<Tour[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchTours = async () => {
    setLoading(true);
    try {
      const response = await axios.get<Tour[]>(url);
      setTours(response.data);
    } catch (error) {
      let message =
        error instanceof Error ? error.message : 'error fetching tours';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);
  return { loading, tours, error };
};
```

- create a src/tours/Tours.tsx file
- render the Tours component in the App.tsx file

```tsx
import { useFetch } from './useFetch';

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
```

- render the Tours component in the App.tsx file

```tsx
import Tours from './tours/Tours';

function App() {
  return (
    <div className='p-8'>
      <h1 className='font-bold text-2xl'>React Testing Library</h1>
      <p className='mt-4 text-gray-700'>
        React Testing Library and Vitest work together to provide a robust
        testing environment.
      </p>
      <Tours />
    </div>
  );
}
export default App;
```

## Mock API Calls

When testing components that make API calls, it's generally better to mock these requests rather than making real API calls. Mocking API requests makes your tests more reliable, faster, and predictable by eliminating external dependencies. Real API calls can fail due to network issues, rate limits, or server downtime, making your tests flaky. Additionally, mocking allows you to easily test different scenarios like error states or loading conditions without waiting for actual network responses. This approach also prevents unnecessary load on your backend services during testing.

### Key Benefits:

- Faster, reliable, and predictable tests
- No external dependencies or server load
- Eliminates network issues and rate limits

### Testing Capabilities:

- Simulate errors and loading states
- Control response data
- Test edge cases easily

### Best Practices:

- Mock at network request level
- Test both success and failure cases
- Keep mock data realistic and maintained

### Mocking API Calls with MSW

MSW (Mock Service Worker) is a powerful library for mocking API calls in your tests. It allows you to intercept and mock network requests, providing a flexible and efficient way to simulate server responses.

[MSW Documentation](https://mswjs.io/docs/)

### Setting Up MSW

```bash
npm install msw --save-dev
```

- create a src/mocks directory
- create a handlers.ts file in the src/mocks directory
- create a server.ts file in the src/mocks directory

```ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

- add the following code to the vitest.setup.ts file

```ts
import { server } from './mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

- setup the handlers

```ts
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
```

- add the following code to the Tours.test.tsx file

```tsx
import { render, screen } from '@testing-library/react';
import Tours from './Tours';
import { server } from '../mocks/server';
import { errorGetTours } from '../mocks/handlers';
describe('Tours', () => {
  test('shows loading state initially', () => {
    render(<Tours />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
  });

  test('displays tours data after loading', async () => {
    render(<Tours />);
    const tours = await screen.findAllByRole('article');
    expect(tours).toHaveLength(2);
    const title = await screen.findByText(/best of paris/i);
    expect(title).toBeInTheDocument();
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });

  test('shows error state when fetch fails', async () => {
    server.use(...errorGetTours);
    render(<Tours />);
    expect(await screen.findByText(/error/i)).toBeInTheDocument();
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });
});
```

Happy testing! 🎉
