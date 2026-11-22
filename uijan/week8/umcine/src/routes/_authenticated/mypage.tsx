import { createFileRoute } from "@tanstack/react-router";
import { MyPage } from "../../pages/auth/my-page";

export const Route = createFileRoute("/_authenticated/mypage")({
  component: MyPage,
});