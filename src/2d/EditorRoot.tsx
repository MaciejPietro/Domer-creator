import { useRef, useEffect } from 'react';
import { Application } from 'pixi.js';

import { useStore } from '../stores/EditorStore';
import { extensions } from '@pixi/core';
import { InteractionManager } from '@pixi/interaction';
import { Main } from './editor/Main';
import { COLOR_BACKGROUND, WORLD_HEIGHT, WORLD_WIDTH } from './constants/appConstants';

extensions.remove(InteractionManager);

export let main: Main;

export function EditorRoot() {
    const ref = useRef<HTMLDivElement>(null);
    const { setApp } = useStore();

    useEffect(() => {
        const app = new Application();

        (async () => {
            await app.init({
                view: document.getElementById('pixi-canvas') as HTMLCanvasElement,
                resolution: window.devicePixelRatio || 1,
                autoDensity: true,
                backgroundColor: COLOR_BACKGROUND,
                antialias: true,
                resizeTo: window,
            });

            app.canvas.oncontextmenu = (e) => {
                e.preventDefault();
            };

            const viewportSettings = {
                screenWidth: app.screen.width,
                screenHeight: app.screen.height,
                worldWidth: WORLD_WIDTH,
                worldHeight: WORLD_HEIGHT,
                events: app.renderer.events,
                eventMode: 'static',
            };

            main = new Main(viewportSettings);

            ref.current!.appendChild(app.canvas);
            app.start();

            app.stage.addChild(main);

            setApp(app);
        })();
    }, []);

    return <div ref={ref} />;
}
