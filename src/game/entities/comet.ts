import {EmitterType, Engine, GpuParticleEmitter, ImageSource, randomIntInRange, Sprite, Vector} from 'excalibur';
import {Colors} from '@/game/colors';

export class Comet extends GpuParticleEmitter {
    protected static img: ImageSource|undefined;

    protected static loadImg(): Promise<void|HTMLImageElement> {
        if (Comet.img) return new Promise((resolve) => resolve());

        const canvas = document.createElement('canvas');
        canvas.height = 1;
        canvas.width = 10;

        const ctx2d = canvas.getContext('2d');
        if (!ctx2d) throw new Error('Не удалось создать текстуру для комет!');

        const gradient = ctx2d.createLinearGradient(0, 0, 10, 0);
        gradient.addColorStop(0, Colors.starBlue.toHex());
        gradient.addColorStop(1, Colors.starYellow.toHex());

        ctx2d.fillStyle = gradient;
        ctx2d.fillRect(0, 0, 10, 1);

        Comet.img = new ImageSource(canvas.toDataURL('image/png'));
        return Comet.img.load();
    }

    constructor() {
        super({
            emitterType: EmitterType.Circle,
            radius: .5,
            isEmitting: false,
            emitRate: 50,
            particle: {
                startSize: .5,
                endSize: .5,
                fade: true,
                life: 500,
            },
        });
    }

    public onInitialize(_engine: Engine): void {
        Comet.loadImg().then(this.randomize.bind(this));
    }

    public fly(from: Vector, to: Vector, speed: number): Promise<void> {
        this.graphics.opacity = 0;
        this.pos = from;

        return this.actions
            .fade(1, 100)
            .callMethod(this.startEmiting.bind(this))
            .moveTo(to, speed)
            .callMethod(this.stopEmiting.bind(this))
            .fade(0, 100)
            .toPromise();
    }

    public randomize(): this {
        this.emitRate = randomIntInRange(50, 100);
        this.particle.life = randomIntInRange(300, 500);

        const color = randomIntInRange(0, 9);

        this.particle.graphic = new Sprite({
            image: Comet.img!,
            sourceView: {
                x: color,
                y: 0,
                width: color + 1,
                height: 1,
            },
        });

        return this;
    }

    protected startEmiting(): void {
        this.isEmitting = true;
    }

    protected stopEmiting(): void {
        this.isEmitting = false;
    }

    public setZ(newZ: number): this {
        this.z = newZ;
        return this;
    }
}
