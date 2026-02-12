import {Entity} from "@/entities/entity";
import {Engine, EntityOptions, GraphicsComponent, Rectangle, TransformComponent} from "excalibur";
import {Material} from "@/materials/material";
import exampleMaterialSource from '@/materials/sources/example.glsl?raw';

export class Background extends Entity<TransformComponent | GraphicsComponent> {
    constructor(options: Omit<EntityOptions<never>, 'components'>) {
        super({
            ...options,
            components: [
                new TransformComponent(),
                new GraphicsComponent(),
            ],
        });
    }

    public onInitialize(_engine: Engine) {
        this.setPos(200,200);

        this.graphics.use(new Rectangle({
            width: 200,
            height: 200,
        }));

        this.graphics.material = new Material({
            name: 'example',
            fragmentSource: exampleMaterialSource,
        });
    }
}
