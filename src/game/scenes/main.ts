import {Engine, randomIntInRange, RentalPool, Scene, Timer, Vector} from 'excalibur';
import {StarField} from "@/game/entities/star-field";
import {BigStar} from '@/game/entities/big-star';
import {watch} from 'vue';
import {State} from '@/game/utils/state';
import {Comet} from '@/game/entities/comet';

// todo вытащить генерацию случайной точки, случайных точек с интервалом, генерацию с ограничением попыток и генерацию точек с дистанцией
export class Main extends Scene {
    protected static COMETS_INTERVAL: number = 2000;

    protected bigStars: BigStar[] = [];
    protected bigStarsPool: RentalPool<BigStar>|undefined;

    protected cometsTimer: Timer|undefined;
    protected cometsPool: RentalPool<Comet>|undefined;

    public onInitialize(engine: Engine) {
        this.makeStars();
        this.makeBigStars();
        this.updateCometsTimer();

        engine.screen.events.on('resize', () => this.onResize());

        watch(State, this.onUpdateState.bind(this));
    }

    protected makeStars() {
        this.add(new StarField().setZ(0));
    }

    protected makeBigStars() {
        this.bigStars.forEach(star => this.bigStarsPool?.return(star));
        this.bigStars = [];

        this.bigStarsPool ??= new RentalPool(
            () => new BigStar().setZ(1),
            used => used.randomize(),
        );

        const bigStarsCount = (this.engine.drawWidth * this.engine.drawHeight) / 60000;
        const uniqueCoordinates = new Set();
        const minInterval = 100;

        let attempts = 0;
        while(uniqueCoordinates.size < bigStarsCount && attempts < 50) {
            attempts++;

            const randomX = Math.floor(Math.floor(Math.random() * (this.engine.drawWidth + minInterval) / minInterval) * minInterval);
            const randomY = Math.floor(Math.floor(Math.random() * (this.engine.drawHeight + minInterval) / minInterval) * minInterval);

            const key = randomX + ',' + randomY;
            if (!uniqueCoordinates.has(key)) {
                attempts = 0;
                this.bigStars.push(this.bigStarsPool.rent(true).setPos(randomX, randomY));
                uniqueCoordinates.add(key);
            }
        }

        this.bigStars.forEach(star => this.add(star));
    }

    protected onUpdateState(): void {
        const visibleCount = Math.round(this.bigStars.length * State.starsCount);
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
        const from = new Vector(
            randomIntInRange(-10, this.engine.drawWidth + 10),
            randomIntInRange(-10, this.engine.drawHeight + 10),
        );

        const to = new Vector(
            randomIntInRange(-10, this.engine.drawWidth + 10),
            randomIntInRange(-10, this.engine.drawHeight + 10),
        );

        let distance = from.distance(to);

        while (distance < 50 && distance > 200) {
            to.x = randomIntInRange(-10, this.engine.drawWidth + 10);
            to.y = randomIntInRange(-10, this.engine.drawHeight + 10);

            distance = from.distance(to);
        }

        this.cometsPool ??= new RentalPool(
            () => new Comet().setZ(2),
            used => used.randomize(),
        )

        const comet = this.cometsPool.rent();
        this.add(comet);

        comet.fly(from, to).then(() => this.cometsPool!.return(comet));
    }
}
