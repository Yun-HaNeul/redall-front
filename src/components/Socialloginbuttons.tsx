import { Button, Stack, Divider } from "@mantine/core";
import type { OAuthProvider } from "../types/auth";
import { KAKAO_AUTH_URL, GOOGLE_AUTH_URL, NAVER_AUTH_URL } from "../resource/oauth";

/**
 * 소셜 로그인 버튼 묶음.
 * 카카오는 실제 카카오 로그인 페이지로 이동한다.
 * 구글/네이버는 아직 준비 중 (같은 패턴으로 추후 연결).
 */

interface SocialLoginButtonsProps {
  onSocialLogin?: (provider: OAuthProvider) => void;
}

function SocialLoginButtons({ onSocialLogin }: SocialLoginButtonsProps) {

  return (
    <Stack gap="sm">
      <Divider label="또는" labelPosition="center" my="sm" />

      {/* 카카오: 브랜드 노란색 + 검은 글씨 */}
      <Button
        fullWidth
        onClick={() => (window.location.href = KAKAO_AUTH_URL)}
        styles={{ root: { backgroundColor: "#FEE500", color: "#000000" } }}
      >
        카카오로 시작하기
      </Button>

      {/* 네이버: 브랜드 초록색 + 흰 글씨 */}
      <Button
        fullWidth
        onClick={() => (window.location.href = NAVER_AUTH_URL)}
        styles={{ root: { backgroundColor: "#03C75A", color: "#FFFFFF" } }}
      >
        네이버로 시작하기
      </Button>

      {/* 구글: 흰 배경 + 테두리 + 검은 글씨 */}
      <Button
        fullWidth
        variant="default"
        onClick={() => (window.location.href = GOOGLE_AUTH_URL)}
      >
        Google로 시작하기
      </Button>
    </Stack>
  );
}

export default SocialLoginButtons;