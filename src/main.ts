import { Engine } from "excalibur";
import {Config} from "@/config";

export const game = new Engine(Config);

game.start('main');
