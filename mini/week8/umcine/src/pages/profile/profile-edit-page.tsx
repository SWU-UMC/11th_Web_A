import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { previewProfile } from "./preview-profile";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const fieldClassName = "h-[49px] w-full rounded-lg border border-[#e3e6eb] bg-white text-[14px]";

export function ProfileEditPage() {
  const withdrawDialog = useRef<HTMLDialogElement>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imageError, setImageError] = useState("");

  useEffect(() => {
    if (imageUrl) return () => URL.revokeObjectURL(imageUrl);
  }, [imageUrl]);

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/") || file.size > MAX_IMAGE_SIZE) {
      setImageError("5MB 이하의 이미지 파일을 선택해 주세요.");
      return;
    }

    setImageError("");
    setImageUrl(URL.createObjectURL(file));
  }

  return (
    <main className="flex flex-col px-4 pb-7 pt-6 text-[#17191e] md:px-10 xl:px-20">
      <div className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col">
        <div className="flex min-h-[69px] flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-[31px] font-bold leading-[37px] tracking-[-1.24px]">내 정보 수정</h1>
            <p className="mt-[9px] text-[14px] leading-[22.4px] text-[#606774]">
              닉네임과 프로필 이미지만 변경할 수 있어요.
            </p>
          </div>
          {/* TODO: 계정 정보 수정 API를 연결하면 저장과 닉네임 중복 확인을 활성화해요. */}
          <button type="button" disabled className="h-[42px] rounded-lg border border-white bg-[#2563eb] px-4 text-[14px] font-bold text-white">
            변경사항 저장
          </button>
        </div>

        <form className="mt-8 grid items-center gap-6 md:grid-cols-2 md:gap-0" onSubmit={(event) => event.preventDefault()}>
          <div className="flex min-h-[133px] flex-col items-center justify-center gap-1">
            <label className="relative flex size-[82px] cursor-pointer items-center justify-center rounded-full bg-[#e3e6eb] focus-within:outline-2 focus-within:outline-[#2563eb]">
              <input type="file" accept="image/*" aria-label="프로필 이미지 선택" aria-describedby="profile-image-hint" className="sr-only" onChange={handleImageChange} />
              {imageUrl ? (
                <img src={imageUrl} alt="선택한 프로필 이미지" className="size-full rounded-full object-cover" />
              ) : (
                <img src="/icons/person.svg" alt="" className="size-12" />
              )}
              <span className="absolute bottom-0 right-0 size-6 rounded-full bg-[#f6f7f9]">
                <img src="/icons/edit.svg" alt="" className="size-full" />
              </span>
            </label>
            <p className="text-[15px] font-bold leading-[18px]">프로필 이미지</p>
            <p id="profile-image-hint" className="text-[11px] leading-[13px] text-[#969da8]">선택 사항 · 최대 5MB</p>
            {imageError && <p role="alert" className="text-xs text-[#d92d20]">{imageError}</p>}
          </div>

          <div className="grid gap-[17px]">
            <div className="grid gap-2">
              <label htmlFor="profile-nickname" className="text-[13px] font-bold leading-4">닉네임</label>
              <div className={fieldClassName + " flex items-center focus-within:border-[#2563eb]"}>
                <input id="profile-nickname" defaultValue={previewProfile.nickname} className="h-full min-w-0 flex-1 px-[15px] outline-none" />
                <button type="button" disabled className="shrink-0 px-[13px] text-[12px] font-extrabold text-[#2563eb]">중복 확인</button>
              </div>
            </div>
            <div className="grid gap-2">
              <label htmlFor="profile-email" className="text-[13px] font-bold leading-4">이메일</label>
              <input id="profile-email" type="email" readOnly value={previewProfile.email} className={fieldClassName + " px-[15px]"} />
            </div>
          </div>
        </form>

        <section aria-labelledby="withdraw-heading" className="mt-auto pt-8">
          <div className="flex min-h-[84px] flex-wrap items-center justify-between gap-3 rounded-[10px] border border-[#d92d20] bg-[#d92d20]/10 p-5 text-[#d92d20]">
            <div>
              <h2 id="withdraw-heading" className="text-[14px] font-bold leading-[17px]">회원 탈퇴</h2>
              <p className="mt-1 text-[11px] leading-[16.5px]">
                탈퇴하면 작성한 평점, 후기와 즐겨찾기가 모두 삭제되며 복구할 수 없습니다.
              </p>
            </div>
            <button type="button" onClick={() => withdrawDialog.current?.showModal()} className="h-[42px] rounded-lg border border-[#d92d20] bg-white px-4 text-[14px] font-extrabold">
              회원 탈퇴
            </button>
          </div>
        </section>

        <dialog ref={withdrawDialog} aria-labelledby="withdraw-dialog-title" aria-describedby="withdraw-dialog-description" className="m-auto w-[calc(100%-2rem)] max-w-[420px] rounded-[10px] bg-white p-6 text-[#17191e] backdrop:bg-black/40">
          <h2 id="withdraw-dialog-title" className="text-lg font-bold">회원 탈퇴할까요?</h2>
          <p id="withdraw-dialog-description" className="mt-2 text-sm text-[#606774]">
            탈퇴하면 작성한 평점, 후기와 즐겨찾기가 모두 삭제되며 복구할 수 없습니다.
          </p>
          <form method="dialog" className="mt-6 flex justify-end gap-2">
            <button autoFocus className="rounded-lg border border-[#e3e6eb] px-4 py-2 text-sm font-bold">취소</button>
            {/* TODO: 최종 확인 버튼에 회원 탈퇴 API를 연결해요. */}
            <button type="button" disabled className="rounded-lg bg-[#d92d20] px-4 py-2 text-sm font-bold text-white disabled:opacity-50">
              회원 탈퇴
            </button>
          </form>
        </dialog>
      </div>
    </main>
  );
}
