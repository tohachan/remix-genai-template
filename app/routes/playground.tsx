import type { MetaFunction } from '@remix-run/node';
import PlaygroundPage from '~/pages/playground/ui';

export const meta: MetaFunction = () => {
  return [
    { title: 'Code Playground | Remix GenAI Template' },
    { name: 'description', content: 'Interactive code playground with Monaco Editor and rule runner' },
  ];
};

export default function Playground() {
  return <PlaygroundPage />;
}
