import {ParticleEmitter as ExcaliburParticleEmitter, RentalPool} from 'excalibur';
import {Particle} from '@/game/extend/particle/particles';

//@ts-ignore
export class ParticleEmitter extends ExcaliburParticleEmitter {
    //@ts-ignore переопределяем чтобы использовать свои частицы
    private _particlePool = new RentalPool(
        () => new Particle({}),
        (p) => p,
        500
    );
}
