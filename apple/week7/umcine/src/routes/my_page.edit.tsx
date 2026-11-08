import { createFileRoute } from "@tanstack/react-router";
import { MyPageEdit } from "@/pages/my-page/my-page-edit";
import { requireAuth } from "@/utils/require-auth";

export const Route = createFileRoute("/my_page/edit")({
  beforeLoad: requireAuth,
  component: MyPageEdit,
});
