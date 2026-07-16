import {useState} from "react";
import type {BloodType, RhType} from "../types/bloodType.ts";
import {updateBloodType} from "../api/bloodType.ts";
import {Button, Group, Modal, SegmentedControl, Stack, Text} from "@mantine/core";

interface Props {
    opened: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

function BloodTypeModal({opened, onClose, onSuccess}: Props) {
    const [bloodType, setBloodType] = useState<BloodType>("A");
    const [rhType, setRhType] = useState<RhType>("POSITIVE");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await updateBloodType(bloodType, rhType);
            onClose();
            onSuccess();
        } catch(err) {
            console.error("혈액형 등록 에러:", err);
            alert("등록에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal opened={opened} onClose={onClose} title="혈액형을 등록해주세요👏" centered>
            <Stack>
                <Text size="sm" c="dimmed">
                    혈액형을 등록하면 나에게 맞는 헌혈 정보와 인사이트를 받을 수 있어요.
                </Text>

                <div>
                    <Text size="sm" fw={500} mb={6}>
                        혈액형
                    </Text>
                    <SegmentedControl
                        fullWidth
                        value={bloodType}
                        onChange={(v) => setBloodType(v as BloodType)}
                        data={[
                            {label: "A형", value: "A"},
                            {label: "B형", value: "B"},
                            {label: "O형", value: "O"},
                            {label: "AB형", value: "AB"},
                        ]}
                    />
                </div>

                <div>
                    <Text size="sm" fw={500} mb={6}>
                        RH 타입
                    </Text>
                    <SegmentedControl
                        fullWidth
                        value={rhType}
                        onChange={(v) => setRhType(v as RhType)}
                        data={[
                            {label: "RH+", value: "POSITIVE"},
                            {label: "RH-", value: "NEGATIVE"},
                        ]}
                    />
                </div>

                <Group justify="flex-end" mt="md">
                    <Button variant="subtle" color="gray" onClick={onClose}>
                        나중에 하기
                    </Button>
                    <Button color="red" onClick={handleSubmit} loading={loading}>
                        등록
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
}
export default BloodTypeModal;