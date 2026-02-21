import {ActionsComponent, Circle, Engine, GraphicsComponent, randomIntInRange, TransformComponent} from 'excalibur';
import {toVector, VectorLike} from '@/game/utils/convert';
import {Color} from '@/game/utils/color';
import {Entity} from '@/game/entities/entity';

// todo добавить хвост
export class Comet extends Entity<GraphicsComponent | TransformComponent | ActionsComponent> {
    public constructor() {
        super([new GraphicsComponent(), new TransformComponent(), new ActionsComponent()]);
    }

    public onInitialize(_engine: Engine) {
        this.setGraphic(new Circle({
            radius: 1,
            color: Color.White,
        }));

        this.randomize();
    }

    public fly(from: VectorLike, to: VectorLike): Promise<void> {
        this.setOpacity(0).setPos(from);

        return this.actions
            .fade(1, 100)
            .moveTo(toVector(to), randomIntInRange(100, 200))
            .fade(0, 100)
            .toPromise();
    }

    public randomize(): this {
        //this.getGraphic<Circle>().tint = Color.lerp(Colors.starYellow, Colors.starBlue, randomInRange(0, 1));
        return this;
    }
}
