import { createFileRoute } from "@tanstack/react-router";
import { MyPageEdit } from "../../pages/mypage/my-edit-page";

export const Route = createFileRoute("/(private)/_private/mypage_/edit")({
  component: MyPageEdit,
});
