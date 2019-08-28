
export class Vertex
{
    static LADDER_HARDNESS = 10;

    // z is floor index (from 0 to 5)
    constructor(public x: number, public y: number, public z: number, public tags: string = "") {
    }

    adjacent: Vertex[] = [];

    dist: number = Number.MAX_VALUE;
    prev: any;
    isStable = false;

    distTo(other:Vertex): number {

        if (this.x !== other.x)
            return Math.abs(this.x - other.x);
        if (this.y !== other.y)
            return Math.abs(this.y - other.y);
        return Math.abs(this.z - other.z) * Vertex.LADDER_HARDNESS;
    }

}

