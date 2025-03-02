import { useRef, useEffect } from 'react';
import { Application, Container } from 'pixi.js';

import { IViewportOptions, Viewport } from 'pixi-viewport';
import { useStore } from '../stores/EditorStore';
import { COLOR_BACKGROUND, METER } from '@/Editor2d/editor/constants';
import { extensions } from '@pixi/core';
import { EventSystem } from '@pixi/events';
import { InteractionManager } from '@pixi/interaction';
import { Main } from './editor/Main';
import useMount from '@/Common/hooks/useMount';

extensions.remove(InteractionManager);

export let main: Main;

export function EditorRoot() {
    const ref = useRef<HTMLDivElement>(null);
    const { setApp } = useStore();

    useMount(() => {
        const newApp = new Application();

        (async () => {
            await newApp.init({
                view: document.getElementById('pixi-canvas') as HTMLCanvasElement,
                resolution: window.devicePixelRatio || 1,
                autoDensity: true,
                backgroundColor: COLOR_BACKGROUND,
                antialias: true,
                resizeTo: window,
            });

            newApp.canvas.oncontextmenu = (e) => {
                e.preventDefault();
            };

            const viewportSettings = {
                screenWidth: newApp.screen.width,
                screenHeight: newApp.screen.height,
                worldWidth: 50 * METER,
                worldHeight: 25 * METER,
                events: newApp.renderer.events,
                eventMode: 'static',
            };

            main = new Main(viewportSettings);

            ref.current!.appendChild(newApp.canvas);
            newApp.start();

            newApp.stage.addChild(main);

            setApp(newApp);
        })();
    });

    return <div ref={ref} />;
}
