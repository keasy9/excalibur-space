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

        this.graphics.use(new Rectangle({
            width: engine.drawWidth,
            height: engine.drawHeight,
        }));

        this.graphics.anchor = Vector.Zero;

        this.graphics.material = new Material({
            name: 'example',
            fragmentSource: exampleMaterialSource,
        });
    }
}
