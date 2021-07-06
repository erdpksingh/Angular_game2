export class GameLanguage {
    id: number;
    game_id: number;
    game_name?: string;
    language_id: string;
    label?: string;
    status?: GameLanguageStatus;
    base_language: string;
    is_base_language?: boolean;
}

export enum GameLanguageStatus {
    Default,
    Submitted
}