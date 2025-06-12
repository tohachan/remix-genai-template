import type { MetaFunction } from '@remix-run/node';
import HomePage from '../pages/home/ui';

export const meta: MetaFunction = () => {
  return [
    { title: 'Remix + Gen AI Template' },
    { name: 'description', content: 'A comprehensive starter kit for building scalable Remix applications with Feature-Sliced Design and RTK Query' },
  ];
};

export default HomePage;
