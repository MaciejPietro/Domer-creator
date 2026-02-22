import { useState } from 'react';
import { Button, Group, NumberInput, Text, rem } from '@mantine/core';
import { Upload, Photo, X, FileUpload } from 'tabler-icons-react';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { useStore } from '@/stores/EditorStore';
import { cleanNotifications, showNotification } from '@mantine/notifications';
import { Assets } from 'pixi.js';
import MeasurePlan from './MeasurePlan';
import { PlanSprite } from '@/2d/editor/objects/Plan/PlanSprite';
import { Tool } from '@/2d/editor/enums';

import { main } from '@/2d/EditorRoot';

interface AddPlanProps {
    onClose: () => void;
}

export default function AddPlan({ onClose }: AddPlanProps) {
    const [acceptedFiles, setAcceptedFiles] = useState<File[]>([]);
    const [rejectedFiles, setRejectedFiles] = useState<File[]>([]);
    const { plan, setPlan, setTool, setFocusedElement } = useStore();

    const [lengths, setLengths] = useState<any>({
        real: 0,
        plan: 0,
    });

    const handleDrop = (files: File[]) => {
        setAcceptedFiles(files);
        setRejectedFiles([]);
    };

    const handleReject = (files: File[]) => {
        setRejectedFiles(files);
        setAcceptedFiles([]);
    };

    const uploadFile = () => {
        cleanNotifications();
        showNotification({
            title: '✏️ Dodawanie planu',
            message: 'Plan został dodany.',
            color: 'green',
        });

        const reader = new FileReader();

        reader.onload = async (e: any) => {
            const imageSrc = e.target.result;

            // TODO take it from CanvasHTML div
            const width = 729;

            const scale = lengths.plan / lengths.real;

            const texture = await Assets.load(imageSrc);

            const planSprite = new PlanSprite(texture);

            const natW = planSprite.spriteRef.width;
            const natH = planSprite.spriteRef.height;
            planSprite.setScaleParams(lengths.real, lengths.plan, natW, natH);

            const sizeScale = natW / width;

            planSprite.setDimensions((natW * scale) / sizeScale, (natH * scale) / sizeScale);

            planSprite.x = main.center.x - planSprite.width / 2;
            planSprite.y = main.center.y - planSprite.height / 2;

            main.removeChildAt(0);
            main.addChildAt(planSprite, 0);

            setPlan(planSprite);

            setTool(Tool.Edit);
            planSprite.focus();
            setFocusedElement(planSprite);
        };

        reader.readAsDataURL(acceptedFiles[0]);

        onClose();
    };

    return (
        <div>
            <div>
                {/* {acceptedFiles.length > 0 && (
                    <Text className="text-green-400" mt="sm">
                        Dodano rzut
                    </Text>
                )} */}
                {acceptedFiles.length ? (
                    <MeasurePlan
                        fileUrl={URL.createObjectURL(acceptedFiles[0])}
                        lengths={lengths}
                        setLengths={setLengths}
                    />
                ) : null}
            </div>
            <div className="grid grid-cols-2 gap-8 mt-4">
                <div>
                    <Dropzone
                        onDrop={handleDrop}
                        // onReject={handleReject}
                        maxSize={5 * 1024 ** 2}
                        accept={IMAGE_MIME_TYPE}
                        maxFiles={1}
                    >
                        <Group justify="center" style={{ pointerEvents: 'none' }}>
                            <Dropzone.Accept>
                                <Upload
                                    style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)' }}
                                />
                            </Dropzone.Accept>
                            <Dropzone.Reject>
                                <X style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)' }} />
                            </Dropzone.Reject>
                            <Dropzone.Idle>
                                <Photo
                                    style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)' }}
                                />
                            </Dropzone.Idle>

                            <div>
                                <Text className="text-lg">Upuść zdjęcie planu swojego domu</Text>
                                <Text className="mt-2 text-xs">Załącz jeden plik, nie powinien przekraczać 5MB</Text>
                            </div>
                        </Group>
                    </Dropzone>
                    {rejectedFiles.length > 1 && (
                        <Text className="text-red-400 text-sm mt-4">
                            Możesz dodać maksymalnie 1 plik. Sprawdź rozmiar i typ pliku.
                        </Text>
                    )}
                </div>
                <div>
                    <div className="flex flex-col">
                        <p className="mt-0 mb-1">Zaznaczony odcinek ma:</p>{' '}
                        <div className="flex gap-2 items-center">
                            <NumberInput
                                className="w-44"
                                disabled={!lengths.real}
                                placeholder="Zaznacz odcinek na planie"
                                value={length ?? undefined}
                                hideControls
                                onChange={(value) => setLengths({ ...lengths, plan: value })}
                            />
                            <p>cm</p>
                        </div>
                    </div>

                    <Button
                        disabled={!acceptedFiles.length || !lengths.real || !lengths.plan}
                        onClick={uploadFile}
                        className="mt-6"
                        leftSection={<FileUpload size={20} />}
                    >
                        {plan ? 'Zamień plan' : 'Akceptuj plan'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
