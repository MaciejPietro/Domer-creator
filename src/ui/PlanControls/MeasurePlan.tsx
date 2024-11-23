import { useEffect, useRef, useState } from 'react';
import { Button, Group, NumberInput, Text, rem } from '@mantine/core';
import { Upload, Photo, X, Plus, FileUpload } from 'tabler-icons-react';
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { useStore } from '@/stores/EditorStore';
import { cleanNotifications, showNotification } from '@mantine/notifications';
import { Main } from '@/2d/editor/Main';

import backgroundPattern from '../../assets/pattern.svg';
import { Application, FederatedPointerEvent, Sprite, Texture, TilingSprite } from 'pixi.js';

import { Preview } from '@/2d/editor/actions/MeasureToolManager';
import { METER } from '@/2d/editor/constants';
import { IViewportOptions, PluginManager, Viewport } from 'pixi-viewport';

export default function MeasurePlan({ fileUrl, lengths, setLengths }: any) {
    const ref = useRef<HTMLDivElement>(null);

    const [app, setApp] = useState<any>(null);

    useEffect(() => {
        const app = new Application();

        (async () => {
            const width = ref.current?.offsetWidth!;
            const height = width;

            await app.init({
                autoDensity: true,
                antialias: true,
                backgroundAlpha: 0.3,
                width,
                height,
            });

            app.canvas.oncontextmenu = (e) => {
                e.preventDefault();
            };

            const viewportSettings = {
                screenWidth: width,
                screenHeight: height,
                worldWidth: 50 * METER,
                worldHeight: 50 * METER,
                events: app.renderer.events,
                eventMode: 'static',
            };

            const measureMain = new MeasureMain(viewportSettings);

            measureMain.onSetLength = (length: number) => {
                setLengths({ ...lengths, real: length });
            };

            ref.current!.appendChild(app.canvas);
            app.start();

            app.stage.addChild(measureMain);

            setApp(app);
        })();

        return () => {
            app.destroy(true, true);
        };
    }, []);

    return (
        <div>
            <div className="mt-4 rounded border border-dashed border-green-400 overflow-hidden">
                <div className="relative aspect-square">
                    {fileUrl ? <img className="w-full object-cover" src={fileUrl} alt="" /> : null}
                    <div className="absolute top-0 left-0 w-full h-full" ref={ref} />
                </div>
            </div>
        </div>
    );
}

export class MeasureMain extends Viewport {
    public static viewportPluginManager: PluginManager;
    public static app: Application;
    public preview: Preview;
    public onSetLength: (length: number) => void;

    constructor(options: IViewportOptions) {
        super(options);

        this.preview = new Preview({ color: 'red', showSizeLabel: false });
        this.addChild(this.preview.getReference());

        this.preview;

        this.setup();
    }

    private async setup() {
        Main.viewportPluginManager = this.plugins;

        this.on('click', this.onPointerDown);
        this.on('pointermove', this.onPointerMove);
    }

    private onPointerDown(ev: FederatedPointerEvent) {
        ev.stopPropagation();

        const { pointA, endPoint } = this.preview;

        if (pointA && !endPoint) {
            this.setPointB(ev);
        }

        if (!pointA) {
            this.setPointA(ev);
        }

        if (pointA && endPoint) {
            this.preview.setB(undefined);
            this.setPointA(ev);
        }
    }
    private setPointA(ev: FederatedPointerEvent) {
        const point = { x: ev.global.x, y: ev.global.y };

        this.preview.setA(point);
    }

    private setPointB(ev: FederatedPointerEvent) {
        const point = { x: ev.global.x, y: ev.global.y };

        this.preview.setB(point);

        this.onSetLength(this.preview.length);
    }

    private onPointerMove(ev: FederatedPointerEvent) {
        const point = { x: ev.global.x, y: ev.global.y };

        this.preview.updateByPoint(point);
    }
}
