export class Player {
    id: string;
    idInRoom?: number;
    name: string;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }
}
