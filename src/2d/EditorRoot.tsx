import { useRef, useEffect } from 'react';
import { Application, Container } from 'pixi.js';

import { IViewportOptions, Viewport } from 'pixi-viewport';
import { useStore } from '../stores/EditorStore';
import { COLOR_BACKGROUND, METER } from '@/2d/editor/constants';
import { extensions } from '@pixi/core';
import { EventSystem } from '@pixi/events';
import { InteractionManager } from '@pixi/interaction';
import { Main } from './editor/Main';

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
                worldWidth: 50 * METER,
                worldHeight: 80 * METER,
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
