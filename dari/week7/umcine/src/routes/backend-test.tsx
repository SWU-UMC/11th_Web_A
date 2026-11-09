import { createFileRoute } from "@tanstack/react-router";
import { BackendApiTestPage } from "../pages/backend-api-test-page";

export const Route = createFileRoute("/backend-test")({
  component: BackendApiTestPage,
});