import {BoundingBox, Engine, randomIntInRange, RentalPool, Scene, Timer} from 'excalibur';
import {Stars} from "@/game/entities/stars";
import {BigStar} from '@/game/entities/big-star';
import {watch} from 'vue';
import {FPS, State} from '@/state';
import {Comet} from '@/game/entities/comet';
import {Dust} from '@/game/entities/dust';
import {randomVectors} from '@/game/utils/random';

// todo вытащить генерацию случайной точки, случайных точек с интервалом, генерацию с ограничением попыток и генерацию точек с дистанцией
export class Main extends Scene {
    protected static COMETS_INTERVAL: number = 1000;

    protected bigStars: BigStar[] = [];
    protected bigStarsPool: RentalPool<BigStar>|undefined;

    protected cometsTimer: Timer|undefined;
    protected cometsPool: RentalPool<Comet>|undefined;

    public onInitialize(engine: Engine) {
        this.makeBigStars();
        this.add(new Dust().setZ(2));
        this.add(new Stars().setZ(3));

        this.onUpdateState();

        engine.screen.events.on('resize', () => this.onResize());

        watch(State, this.onUpdateState.bind(this));

        FPS.value = (1000/this.engine.currentFrameElapsedMs).toFixed(0);

        const fpsTimer = new Timer({
            interval: 500,
            repeats: true,
            action: () => FPS.value = (1000/this.engine.currentFrameElapsedMs).toFixed(0),
        });
        this.add(fpsTimer);
        fpsTimer.start();
    }

    protected makeBigStars() {
        this.bigStars.forEach(star => this.bigStarsPool?.return(star));
        this.bigStars =  [];

        this.bigStarsPool ??= new RentalPool(
            () => new BigStar().setZ(1),
            used => used.randomize(),
        );

        const bigStarsCount = (this.engine.drawWidth * this.engine.drawHeight) / 30000;
        randomVectors(bigStarsCount, this.getSpawnBox(), 100).forEach(vec => {
            const star = this.bigStarsPool!.rent(true).setPos(vec);

            this.bigStars.push(star);
            this.add(star);
        });
    }

    protected onUpdateState(): void {
        const visibleCount = Math.round(this.bigStars.length * State.starsAmount);
        this.bigStars.forEach((star, index) => {
            if (index + 1 < visibleCount) this.add(star);
            else this.remove(star);
        })

        this.updateCometsTimer();
    }

    protected onResize(): void {
        this.makeBigStars();
    }

    protected updateCometsTimer(): void {
        if (!this.cometsTimer) {
            this.cometsTimer = new Timer({
                interval: Main.COMETS_INTERVAL,
                action: this.makeComet.bind(this),
                repeats: true,
            });
            this.add(this.cometsTimer);
        }

        if (State.cometsInterval < 0.1) {
            this.cometsTimer.stop();
        } else {
            this.cometsTimer.interval = Math.round(Main.COMETS_INTERVAL / State.cometsInterval);
            this.cometsTimer.start();
        }
    }

    protected makeComet(): void {
        const [from, to] = randomVectors(2, this.getSpawnBox(), 50, 200);

        this.cometsPool ??= new RentalPool(
            () => new Comet().setZ(2),
            used => used.randomize(),
        )

        const comet = this.cometsPool.rent();
        this.add(comet);

        comet.fly(from, to, randomIntInRange(150, 250)).then(() => this.cometsPool!.return(comet));

        if (this.cometsTimer) {
            this.cometsTimer.reset(Math.round((Main.COMETS_INTERVAL / State.cometsInterval + 500 * Math.random())));
            this.cometsTimer.start();
        }
    }

    protected getSpawnBox(offset: number = 10): BoundingBox {
        const box = this.engine.screen.getWorldBounds().clone();

        box.top -= offset;
        box.left -= offset;
        box.bottom += offset;
        box.right += offset;

        return box;
    }
}
