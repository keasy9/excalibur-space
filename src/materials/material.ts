import {Material as ExcaliburMaterial, MaterialOptions} from "excalibur";
import {game} from "@/main";

export class Material extends ExcaliburMaterial {
    public constructor(options: Omit<MaterialOptions, 'graphicsContext'>) {
        super({ ...options, graphicsContext: game.graphicsContext });
    }
}
