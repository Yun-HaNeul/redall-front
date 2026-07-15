import {useEffect, useState} from "react";
import type {BloodCenter} from "../types/bloodCenter.ts";
import {getBloodCenter} from "../api/BloodCenter.ts";
import {useForm} from "@mantine/form";
import type {Donation, DonationRequest, DonationType} from "../types/donation.ts";
import {Autocomplete, Button, Modal, Select, Stack, Switch, Textarea, TextInput} from "@mantine/core";
import {createDonation, updateDonation} from "../api/donation.ts";

/**
 * 헌혈 기록 등록/수정 폼 (모달)
 * editing이 있으면 수정 모드
 */

interface Props {
    opened: boolean;
    onClose: () => void;
    onSuccess: () => void;
    editing?: Donation | null;      //   수정할 기록 (없으면 등록 모드)
}

const TYPE_OPTIONS = [
    {value: "WHOLE_BLOOD", label: "전혈"},
    {value: "PLASMA", label: "혈장"},
    {value: "PLATELET", label: "혈소판"},
    {value: "PLATELET_PLASMA", label: "혈소판혈장"},
];

function DonationForm({opened, onClose, onSuccess, editing}: Props) {
    const [centers, setCenters] = useState<BloodCenter[]>([]);
    const [useDirectInput, setUseDirectInput] = useState(false);
    const [loading, setLoading] = useState(false);

    const isEdit = !!editing;

    // 헌혈의 집 목록 가져오기
    useEffect(() => {
        if (opened) {
            getBloodCenter()
                .then((res) => setCenters(res.data))
                .catch(() => setCenters([]));
        }
    }, [opened]);

    const form = useForm({
        initialValues: {
            donationDate: "",
            donationType: "WHOLE_BLOOD" as DonationType,
            centerName: "",
            placeName: "",
            memo: "",
        },
        validate: {
            donationDate: (v) => (!v ? "헌혈일을 입력하세요." : null),
        },
    });

    useEffect(() => {
        if (editing && opened) {
            const isDirect = editing.bloodCenterId === null;
            setUseDirectInput(isDirect);
            form.setValues({
                donationDate: editing.donationDate,
                donationType: editing.donationType,
                centerName: isDirect ? "" : editing.placeName,
                placeName: isDirect ? editing.placeName : "",
                memo: editing.memo ?? "",
            });
        } else if (!editing && opened) {
            form.reset();
            setUseDirectInput(false);
        }
    }, [editing, opened]);

    const handleSubmit = async (values: typeof form.values) => {
        setLoading(true);
        try {
            // 헌혈의 집 선택 시 id 찾기
            const selected = centers.find((c) => c.name === values.centerName);

            const request: DonationRequest = {
                donationDate: values.donationDate,
                donationType: values.donationType,
                bloodCenterId: useDirectInput ? null : selected?.id ?? null,
                placeName: useDirectInput ? values.placeName : null,
                memo: values.memo || null,
            };

            if (isEdit && editing) {
                await updateDonation(editing.id, request)
            } else {
                await createDonation(request);
            }

            form.reset();
            onSuccess();
            onClose();
        } catch (err) {
            const error = err as { response?: { data?: { message?: string } } };
            alert(error.response?.data?.message ?? "등록에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal opened={opened} onClose={onClose} title={isEdit ? "헌혈 기록 수정" : "헌혈 기록 등록"} centered>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack>
                    <TextInput
                        label="헌혈일"
                        type="date"
                        {...form.getInputProps("donationDate")}
                    />

                    <Select
                        label="헌혈 종류"
                        data={TYPE_OPTIONS}
                        {...form.getInputProps("donationType")}
                    />

                    <Switch
                        label="장소 집적 입력 (헌혈버스 등)"
                        checked={useDirectInput}
                        onChange={(e) => setUseDirectInput(e.currentTarget.checked)}
                    />

                    {useDirectInput ? (
                        <TextInput
                            label="장소"
                            placeholder="예: oo대학교 헌혈버스"
                            {...form.getInputProps("placeName")}
                        />
                    ) : (
                        <Autocomplete
                            label="헌혈의 집"
                            placeholder="검색해서 선택"
                            data={centers.map((c) => c.name)}
                            limit={10}
                            {...form.getInputProps("centerName")}
                        />
                    )}

                    <Textarea
                        label="메모 (선택)"
                        placeholder="기념품, 컨디션 등"
                        {...form.getInputProps("memo")}
                    />

                    <Button type="submit" loading={loading} fullWidth>
                        {isEdit ? "수정" : "등록"}
                    </Button>
                </Stack>
            </form>
        </Modal>
    );
}

export default DonationForm;