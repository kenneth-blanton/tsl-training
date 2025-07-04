import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'past-recipes/:line',
    renderMode: RenderMode.Server,
  },
  {
    path: 'recipes/add/:recipeId',
    renderMode: RenderMode.Server,
  },
];
