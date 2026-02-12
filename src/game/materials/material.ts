import {Engine, Material as ExcaliburMaterial, MaterialOptions} from 'excalibur';

export class Material extends ExcaliburMaterial {
    public constructor(options: Omit<MaterialOptions, 'graphicsContext'>) {
        super({ ...options, graphicsContext: Engine.useEngine().graphicsContext });
    }
}
