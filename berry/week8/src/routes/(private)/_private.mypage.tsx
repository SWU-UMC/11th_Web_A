import { createFileRoute } from "@tanstack/react-router";
import { MyPage } from "../../pages/mypage/my-page";

export const Route = createFileRoute("/(private)/_private/mypage")({
  component: MyPage,
});
