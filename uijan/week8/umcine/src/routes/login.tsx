import { createFileRoute } from '@tanstack/react-router'
import { LoginPage } from "../pages/auth/login-page";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function RouteComponent() {
  return <div>Hello "/login"!</div>
}
