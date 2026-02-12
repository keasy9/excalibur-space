import {Engine, Scene} from "excalibur";
import {Background} from "@/game/entities/background";

export class Main extends Scene {
    public onInitialize(_engine: Engine) {
        this.add(new Background());
    }
}
