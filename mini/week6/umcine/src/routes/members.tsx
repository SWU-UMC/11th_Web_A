import { createFileRoute } from "@tanstack/react-router";
import { MembersApiPage } from "../pages/movies/members-api-page";

export const Route = createFileRoute("/members")({
  component: MembersApiPage,
});