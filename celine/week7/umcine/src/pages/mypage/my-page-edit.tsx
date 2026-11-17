import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { ProfileAvatar } from "../../components/profile-avatar";
import { useAuthStore } from "../../stores/auth-store";
import "../auth/signup-page.css";
import "./my-page.css";

// 프로필 이미지는 최대 5MB
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
// localStorage 용량을 넘지 않도록 저장 전에 줄일 크기(px)
const SAVED_IMAGE_SIZE = 256;

// 이미지를 정사각형으로 잘라 작은 크기의 data URL로 변환
function resizeImage(file: File) {
  return new Promise<string>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      const side = Math.min(image.width, image.height);
      const canvas = document.createElement("canvas");
      canvas.width = SAVED_IMAGE_SIZE;
      canvas.height = SAVED_IMAGE_SIZE;
      canvas.getContext("2d")?.drawImage(
        image,
        (image.width - side) / 2, (image.height - side) / 2, side, side,
        0, 0, SAVED_IMAGE_SIZE, SAVED_IMAGE_SIZE,
      );
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("이미지를 읽지 못했어요."));
    };
    image.src = url;
  });
}

export function MyPageEdit() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const logout = useAuthStore((state) => state.logout);

  const [nickname, setNickname] = useState(user?.nickname ?? "");
  const [profileImage, setProfileImage] = useState(user?.profileImage);
  const [nicknameCheck, setNicknameCheck] = useState({ isChecking: false, isAvailable: false });

  if (!user) return null;

  const trimmedNickname = nickname.trim();
  const isNicknameValid = trimmedNickname.length >= 2 && trimmedNickname.length <= 12;
  const isNicknameChanged = trimmedNickname !== user.nickname;
  const isImageChanged = profileImage !== user.profileImage;
  // 바뀐 내용이 있어야 하고, 닉네임을 바꿨다면 중복 확인을 통과해야 저장 가능
  const canSave =
    isNicknameValid &&
    (isNicknameChanged || isImageChanged) &&
    (!isNicknameChanged || nicknameCheck.isAvailable);

  const nicknameError = nickname !== "" && !isNicknameValid ? "닉네임은 2~12자로 입력해 주세요." : null;

  function handleNicknameChange(event: ChangeEvent<HTMLInputElement>) {
    if (nicknameCheck.isChecking) return;
    setNickname(event.target.value);
    // 값이 바뀌면 다시 중복 확인해야 함
    setNicknameCheck({ isChecking: false, isAvailable: false });
  }

  async function handleCheckNickname() {
    if (!isNicknameValid || nicknameCheck.isChecking) return;
    setNicknameCheck({ isChecking: true, isAvailable: false });
    try {
      const { available } = await checkNicknameDuplicate(trimmedNickname);
      setNicknameCheck({ isChecking: false, isAvailable: available });
      alert(available ? "사용할 수 있는 닉네임이에요." : "이미 사용 중인 닉네임이에요.");
    } catch {
      setNicknameCheck({ isChecking: false, isAvailable: false });
      alert("중복 확인에 실패했어요. 다시 시도해 주세요.");
    }
  }

  async function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    // 같은 파일을 다시 고를 수 있도록 선택값 초기화
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 올릴 수 있어요.");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      alert("이미지는 최대 5MB까지 올릴 수 있어요.");
      return;
    }
    try {
      setProfileImage(await resizeImage(file));
    } catch {
      alert("이미지를 읽지 못했어요. 다른 이미지를 선택해 주세요.");
    }
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSave) return;
    updateUser({ nickname: trimmedNickname, profileImage });
    alert("변경사항을 저장했어요.");
    void navigate({ to: "/mypage" });
  }

  function handleWithdraw() {
    if (!confirm("정말 탈퇴할까요? 탈퇴하면 복구할 수 없어요.")) return;
    logout();
    void navigate({ to: "/" });
  }

  return (
    <main className="my-page">
      <form className="my-page__inner my-page-edit" onSubmit={handleSubmit} noValidate>
        <div className="my-page__heading my-page-edit__heading">
          <div>
            <h1>내 정보 수정</h1>
            <p className="my-page-edit__description">닉네임과 프로필 이미지만 변경할 수 있어요.</p>
          </div>
          <button className="my-page__primary-button" type="submit" disabled={!canSave}>변경사항 저장</button>
        </div>

        <div className="my-page-edit__body">
          <div className="my-page-edit__image">
            <label className="my-page-edit__image-picker" aria-label="프로필 이미지 변경">
              <ProfileAvatar src={profileImage} size={72} />
              <span className="my-page-edit__image-badge">
                <img src="/icons/movie-icons/movie-icons/edit.svg" alt="" />
              </span>
              <input type="file" accept="image/*" onChange={handleImageChange} />
            </label>
            <strong>프로필 이미지</strong>
            <span>선택 사항 · 최대 5MB</span>
          </div>

          <div className="my-page-edit__fields">
            <div className="signup-field">
              <label htmlFor="edit-nickname">닉네임</label>
              <div className="signup-input">
                <input id="edit-nickname" type="text" autoComplete="nickname" placeholder="2~12자"
                  value={nickname} onChange={handleNicknameChange} aria-invalid={Boolean(nicknameError)} />
                <button type="button" disabled={!isNicknameValid || !isNicknameChanged || nicknameCheck.isChecking} onClick={handleCheckNickname}>
                  {nicknameCheck.isChecking ? "확인 중" : "중복 확인"}
                </button>
              </div>
              {nicknameError && <p className="signup-message signup-message--error">{nicknameError}</p>}
            </div>

            <div className="signup-field">
              <label htmlFor="edit-email">이메일</label>
              <div className="signup-input">
                <input id="edit-email" type="email" value={user.email} readOnly />
              </div>
            </div>
          </div>
        </div>

        <section className="my-page-edit__danger" aria-labelledby="my-page-withdraw">
          <div>
            <h2 id="my-page-withdraw">회원 탈퇴</h2>
            <p>탈퇴하면 작성한 평점, 후기와 즐겨찾기가 모두 삭제되며 복구할 수 없습니다.</p>
          </div>
          <button type="button" onClick={handleWithdraw}>회원 탈퇴</button>
        </section>
      </form>
    </main>
  );
}
