import {ColliderComponent, Particle as ExcaliburParticle, ParticleConfig} from 'excalibur';

export class Particle extends ExcaliburParticle {
    constructor(options: ParticleConfig) {
        super(options);

        this.addComponent(new ColliderComponent()); // без ColliderComponent на github pages сущности не рисуются почему-то...
    }
}
