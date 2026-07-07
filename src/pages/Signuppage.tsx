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
import { signup } from "../api/auth";
import type { SignupRequest } from "../types/auth";
import SocialLoginButtons from "../components/SocialLoginButtons";

function SignupPage() {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const form = useForm<SignupRequest>({
    initialValues: {
      username: "",
      password: "",
      email: "",
      name: "",
    },
    validate: {
      username: (v) =>
        v.length < 4 || v.length > 20 ? "아이디는 4~20자여야 합니다." : null,
      password: (v) =>
        v.length < 8 || v.length > 30 ? "비밀번호는 8~30자여야 합니다." : null,
      email: (v) => (/^\S+@\S+$/.test(v) ? null : "이메일 형식이 올바르지 않습니다."),
      name: (v) => (v.trim().length === 0 ? "이름은 필수입니다." : null),
    },
  });

  const handleSubmit = async (values: SignupRequest) => {
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);
    try {
      await signup(values);
      setSuccessMsg("회원가입이 완료되었습니다. 이메일 인증 후 로그인해 주세요.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setErrorMsg(error.response?.data?.message ?? "회원가입에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} my={60}>
      <Title order={2} ta="center">
        회원가입
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        redall 헌혈 플랫폼에 오신 것을 환영합니다
      </Text>

      <Paper withBorder shadow="sm" p={30} mt={30} radius="md">
        {errorMsg && (
          <Alert color="red" mb="md">
            {errorMsg}
          </Alert>
        )}
        {successMsg && (
          <Alert color="green" mb="md">
            {successMsg}
          </Alert>
        )}

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="아이디"
            placeholder="4~20자"
            {...form.getInputProps("username")}
          />
          <PasswordInput
            label="비밀번호"
            placeholder="8~30자"
            mt="md"
            {...form.getInputProps("password")}
          />
          <TextInput
            label="이메일"
            placeholder="you@example.com"
            mt="md"
            {...form.getInputProps("email")}
          />
          <TextInput
            label="이름"
            placeholder="홍길동"
            mt="md"
            {...form.getInputProps("name")}
          />
          <Button type="submit" fullWidth mt="xl" loading={loading}>
            가입하기
          </Button>
        </form>

        <SocialLoginButtons />
      </Paper>

      <Text ta="center" mt="md">
        이미 계정이 있으신가요? <Link to="/login">로그인</Link>
      </Text>
    </Container>
  );
}

export default SignupPage;