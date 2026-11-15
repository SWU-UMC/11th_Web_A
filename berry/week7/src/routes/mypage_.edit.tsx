import { createFileRoute } from "@tanstack/react-router";
import { MyPageEdit } from "../pages/mypage/my-edit-page";

export const Route = createFileRoute("/mypage_/edit")({ component: MyPageEdit });
