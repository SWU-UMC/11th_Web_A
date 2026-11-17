import { createFileRoute } from "@tanstack/react-router";
import { ProfilePage } from "../../pages/profile/profile-page";

export const Route = createFileRoute("/(protected)/profile")({
  component: ProfilePage,
});
