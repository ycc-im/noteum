import { createFileRoute } from '@tanstack/react-router';
import Login from '../pages/Login';

export const Route = createFileRoute('/login')({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: (search.redirect as string) || undefined,
  }),
  component: Login,
});
