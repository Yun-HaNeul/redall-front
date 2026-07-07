import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Text,
  Container,
  Alert,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { login } from "../api/auth";
import type { LoginRequest, OAuthProvider } from "../types/auth";
import SocialLoginButtons from "../components/SocialLoginButtons";
import {saveTokens} from "../utils/auth.ts";

function LoginPage() {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const form = useForm<LoginRequest>({
    initialValues: {
      username: "",
      password: "",
    },
    validate: {
      username: (v) => (v.trim().length === 0 ? "아이디를 입력하세요." : null),
      password: (v) => (v.trim().length === 0 ? "비밀번호를 입력하세요." : null),
    },
  });

  const handleSubmit = async (values: LoginRequest) => {
    setErrorMsg("");
    setLoading(true);
    try {
      const res = await login(values);
      saveTokens(res.data.accessToken, res.data.refreshToken);

      if (res.data.mustChangePassword) {
        alert("임시 비밀번호로 로그인했습니다. 비밀번호를 변경해 주세요.");
      }

      alert("로그인 성공! (다음 단계에서 메인 화면으로 연결됩니다)");
      void navigate;
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setErrorMsg(error.response?.data?.message ?? "로그인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} my={60}>
      <Title order={2} ta="center">
        로그인
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        redall 헌혈 플랫폼
      </Text>

      <Paper withBorder shadow="sm" p={30} mt={30} radius="md">
        {errorMsg && (
          <Alert color="red" mb="md">
            {errorMsg}
          </Alert>
        )}

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="아이디"
            placeholder="아이디"
            {...form.getInputProps("username")}
          />
          <PasswordInput
            label="비밀번호"
            placeholder="비밀번호"
            mt="md"
            {...form.getInputProps("password")}
          />
          <Button type="submit" fullWidth mt="xl" loading={loading}>
            로그인
          </Button>
        </form>

        <SocialLoginButtons />
      </Paper>

      <Text ta="center" mt="md">
        계정이 없으신가요? <Link to="/signup">회원가입</Link>
      </Text>
    </Container>
  );
}

export default LoginPage;