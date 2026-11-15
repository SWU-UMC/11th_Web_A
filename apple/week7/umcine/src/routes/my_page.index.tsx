import { createFileRoute } from "@tanstack/react-router";
import { MyPage } from "@/pages/my-page/my-page";
import { requireAuth } from "@/utils/require-auth";

export const Route = createFileRoute("/my_page/")({
  beforeLoad: requireAuth,
  component: MyPage,
});
