import {ActionsComponent, Circle, EmitterType, Engine, EntityOptions, GraphicsComponent, GraphicsGroup, GraphicsGrouping, randomInRange, randomIntInRange, TransformComponent, Vector} from 'excalibur';
import {toVector, VectorLike} from '@/game/utils/convert';
import {Color} from '@/game/utils/color';
import {Entity} from '@/game/entities/entity';
import {Colors} from '@/game/colors';
import {ParticleEmitter} from '@/game/extend/particle/particle-emitter';

// todo отрефакторить инициализацию, здесь и в отальных сущностях
export class Comet extends Entity<GraphicsComponent | TransformComponent | ActionsComponent> {
    protected circle: Circle|undefined;
    protected trailEmitter: ParticleEmitter|undefined;

    public constructor(options: Omit<EntityOptions<never>, 'components'> = {}) {
        super({
            ...options,
            components: [
                new TransformComponent(),
                new GraphicsComponent(),
                new ActionsComponent(),
            ],
        });
    }

    public onInitialize(_engine: Engine): void {
        this.makeGraphic();
        this.randomize();
    }

    public fly(from: VectorLike, to: VectorLike): Promise<void> {
        this.setOpacity(0).setPos(from);

        return this.actions
            .fade(1, 100)
            .callMethod(this.startEmiting.bind(this))
            .moveTo(toVector(to), randomIntInRange(150, 250))
            .callMethod(this.stopEmiting.bind(this))
            .fade(0, 100)
            .toPromise();
    }

    public randomize(): this {
        if (this.circle) {
            this.circle.radius = randomInRange(2, 2.5);
            this.circle.color = Color.lerp(Colors.starYellow, Colors.starBlue, Math.random());

            (this.getGraphic<GraphicsGroup>().members[0] as GraphicsGrouping).offset
                = new Vector(-this.circle.radius, -this.circle.radius);

            if (this.trailEmitter) {
                this.trailEmitter.particle.endColor = this.circle.color;
                this.trailEmitter.particle.beginColor = Color.lerp(Color.White, this.circle.color, 0.5);
            }
        }

        return this;
    }

    protected makeGraphic(): void {
        const point = new Circle({radius: 1, color: Color.White});
        const color = Color.lerp(Colors.starYellow, Colors.starBlue, Math.random());

        this.circle = new Circle({
            radius: randomInRange(2, 2.5),
            color: color,
        });

        this.setGraphic(new GraphicsGroup({
            useAnchor: false,
            members: [
                {offset: new Vector(-this.circle.radius, -this.circle.radius), graphic: this.circle},
                {offset: Vector.Zero, graphic: point},
            ],
        }));
    }

    protected startEmiting(): void {
        if (!this.trailEmitter) {
            this.trailEmitter = new ParticleEmitter({
                pos: new Vector(this.circle?.radius ?? 0, this.circle?.radius ?? 0),
                emitterType: EmitterType.Circle,
                isEmitting: false,
                emitRate: 50,
                particle: {
                    startSize: 1.2,
                    endSize: 1.2,
                    fade: true,
                    beginColor: Color.lerp(Color.White, this.circle?.color ?? Color.White, 0.5),
                    endColor: this.circle?.color,
                    life: 500,
                }
            });

            this.addChild(this.trailEmitter);
        }

        this.trailEmitter.isEmitting = true;
    }

    protected stopEmiting(): void {
        if (this.trailEmitter) this.trailEmitter.isEmitting = false;
    }
}
