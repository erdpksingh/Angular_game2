import { GameLanguage } from './game-language';
import { Language } from './language';

export class Game {
    id: number;
    name: string;
    languages: GameLanguage[];
    availableLanguages?: Language[];
    base_language: string;
}