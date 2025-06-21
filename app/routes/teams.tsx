import type { MetaFunction } from '@remix-run/node';
import TeamManagementPage from '~/features/team-management/ui/team-management.page';

export const meta: MetaFunction = () => {
  return [
    { title: 'Team Management | Remix App' },
    { name: 'description', content: 'Manage your teams, invite members, and configure team settings' },
  ];
};

export default function TeamsRoute() {
  return <TeamManagementPage />;
}
