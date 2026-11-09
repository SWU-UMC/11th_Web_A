import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Header } from "../components/layout/header";

export const Route = createRootRoute({
  component: () => (
    <>
      <Header />
      <Outlet />
      <footer
        aria-label="크레딧"
        className="flex flex-col items-center gap-3 bg-gray-100 px-6 py-8 text-center text-sm text-gray-700"
      >
        <a href="https://www.themoviedb.org" aria-label="The Movie Database">
          <img
            src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg"
            alt="TMDB"
            className="h-8 w-auto"
          />
        </a>
        <p>
          This product uses the TMDB API but is not endorsed or certified by
          TMDB.
        </p>
      </footer>
    </>
  ),
  notFoundComponent: () => <main>영화를 찾을 수 없어요.</main>,
});
