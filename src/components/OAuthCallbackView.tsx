import {JSX} from "react";
import {Alert, Center, Container, Loader, Stack, Text} from "@mantine/core";

/**
 * 소셜 로그인 콜백 공통 화면
 * 처리 중이면 로딩, 실패하면 에러 보여줌
 */

interface Props {
    errorMsg: string;
}

function OAuthCallbackView({ errorMsg }: Props){
    return (
        <Container size={420} my={80}>
      {errorMsg ? (
        <Alert color="red" title="로그인 실패">
          {errorMsg}
          <Text size="sm" mt="sm" c="dimmed">
            잠시 후 다시 시도해 주세요.
          </Text>
        </Alert>
      ) : (
        <Center>
          <Stack align="center" gap="md">
            <Loader />
            <Text c="dimmed">소셜 로그인 처리 중...</Text>
          </Stack>
        </Center>
      )}
    </Container>
    )
}

export default OAuthCallbackView;