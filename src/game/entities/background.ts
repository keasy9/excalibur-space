import {Entity} from "@/game/entities/entity";
import {Engine, EntityOptions, GraphicsComponent, Rectangle, TransformComponent, Vector} from 'excalibur';
import {Material} from "@/game/materials/material";
import exampleMaterialSource from '@/game/materials/sources/example.glsl?raw';

export class Background extends Entity<TransformComponent | GraphicsComponent> {
    constructor(options: Omit<EntityOptions<never>, 'components'> = {}) {
        super({
            ...options,
            components: [
                new TransformComponent(),
                new GraphicsComponent(),
            ],
        });
    }

    public onInitialize(engine: Engine) {
        this.setPos(0, 0);

        const rect = new Rectangle({
            width: engine.drawWidth,
            height: engine.drawHeight,
        });

        this.graphics.use(rect);

        this.graphics.anchor = Vector.Zero;

        this.graphics.material = new Material({
            name: 'example',
            fragmentSource: exampleMaterialSource,
        });

        engine.screen.events.on('resize', () => {
            rect.width = engine.drawWidth;
            rect.height = engine.drawHeight;

            this.setPos(engine.screenToWorldCoordinates(new Vector(0, 0)));
        });
    }

    public onPreUpdate(engine: Engine, _elapsed: number) {
        this.graphics.material?.update(shader => shader.trySetUniformFloat('u_time', engine.clock.now()));
    }
}
