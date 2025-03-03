import { useRef } from 'react';
import { Application } from 'pixi.js';

import { useStore } from '../stores/EditorStore';
import { COLOR_BACKGROUND, METER } from '@/Editor2d/editor/constants';
import { extensions } from '@pixi/core';
import { InteractionManager } from '@pixi/interaction';
import { Main } from './editor/Main';
import useMount from '@/Common/hooks/useMount';

extensions.remove(InteractionManager);

export let main: Main;

export default function EditorRoot() {
    const ref = useRef<HTMLDivElement>(null);
    const { setApp } = useStore();

    const init = async () => {
        const newApp = new Application();
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
    };

    useMount(() => {
        init();
    });

    return <div ref={ref} />;
}
