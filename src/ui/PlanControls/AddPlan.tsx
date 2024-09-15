import { useState } from 'react';
import { Button, Group, Text, rem } from '@mantine/core';
import { Upload, Photo, X, Plus, FileUpload } from 'tabler-icons-react';
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { useStore } from '@/stores/EditorStore';
import { cleanNotifications, showNotification } from '@mantine/notifications';
import { Main } from '@/2d/editor/Main';
import backgroundPattern from '../../assets/pattern.svg';
import { Assets, Container, Sprite, Texture, TilingSprite } from 'pixi.js';
import MeasurePlan from './MeasurePlan';

import { main } from '@/2d/EditorRoot';

export default function AddPlan({ onClose }: any) {
    const [acceptedFiles, setAcceptedFiles] = useState<File[]>([]);
    const [rejectedFiles, setRejectedFiles] = useState<File[]>([]);
    const { setPlan, plan } = useStore();

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
        // setPlan(acceptedFiles[0]);
        const file = acceptedFiles[0];

        cleanNotifications();
        showNotification({
            title: '✏️ Dodawanie planu',
            message: 'Plan został dodany.',
            color: 'green',
        });

        const reader = new FileReader();

        reader.onload = async (e: any) => {
            const imageSrc = e.target.result;

            const image = new Image();

            image.src = imageSrc;

            // TODO take it from CanvasHTML div
            const width = 538;

            const scale = lengths.plan / lengths.real;

            const texture = await Assets.load(imageSrc);

            const sprite = new Sprite(texture);

            const sizeScale = sprite.width / width;

            sprite.width = (sprite.width * scale) / sizeScale;
            sprite.height = (sprite.height * scale) / sizeScale;

            sprite.x = main.center.x - sprite.width / 2;
            sprite.y = main.center.y - sprite.height / 2;

            main.removeChildAt(0);

            main.addChildAt(sprite, 0);

            setPlan(sprite);

            return;
        };

        reader.readAsDataURL(acceptedFiles[0]);

        onClose();
    };

    return (
        <div>
            <div className="max-h-[80vh] overflow-y-auto">
                <Dropzone
                    onDrop={handleDrop}
                    // onReject={handleReject}
                    maxSize={5 * 1024 ** 2}
                    accept={IMAGE_MIME_TYPE}
                    maxFiles={1}
                >
                    <Group justify="center" gap="xl" mih={80} style={{ pointerEvents: 'none' }}>
                        <Dropzone.Accept>
                            <Upload style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)' }} />
                        </Dropzone.Accept>
                        <Dropzone.Reject>
                            <X style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)' }} />
                        </Dropzone.Reject>
                        <Dropzone.Idle>
                            <Photo style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)' }} />
                        </Dropzone.Idle>

                        <div>
                            <Text className="text-lg">Upuść zdjęcie planu swojego domu</Text>
                            <Text className="mt-2 text-xs">Załącz jeden plik, nie powinien przekraczać 5MB</Text>
                        </div>
                    </Group>
                </Dropzone>

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
            {rejectedFiles.length > 1 && (
                <Text className="text-red-400 text-sm mt-4">
                    Możesz dodać maksymalnie 1 plik. Sprawdź rozmiar i typ pliku.
                </Text>
            )}

            <Button
                // disabled={!acceptedFiles.length || !lengths.real || !lengths.plan}
                onClick={uploadFile}
                className="mt-6"
                leftSection={<FileUpload size={20} />}
            >
                Akceptuj plan
            </Button>
        </div>
    );
}
