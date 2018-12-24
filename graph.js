class Graph {
    constructor(x, y, numVerts) {
        this.x = x;
        this.y = y;
        this.numVerts = numVerts;
        this.graph = Graph.randGraph(numVerts);
        this.selected = null;
        this.perm = [];
        for (let i = 0; i < numVerts; i++) {
            this.perm.push(i);
        }
    }

    clone() {
        let g = new Graph(this.x, this.y, this.numVerts);
        g.graph = this.graph;
        shuffle(g.perm);
        return g;
    }
    static randGraph(numVerts) {
        let out = "";
        let edges = numVerts * (numVerts - 1) / 2;
        for (let i = 0; i < edges; i++) {
            if (Math.random() < 0.5) {
                out += "1";
            } else {
                out += "2";
            }
        }
        return out;
    }

    isoTo(other) {
        for(let i = 0; i < this.numVerts; i++) {
            for(let j = 0; j < this.numVerts; j++) {
                if (i != j && this.getEdge(this.perm[i], this.perm[j]) !== other.getEdge(other.perm[i], other.perm[j])) {
                    return false;
                }
            }
        }
        return true;
    }

    isVertex(x, y) {
        for (let i = 0; i < this.numVerts; i++) {
            let deltax = x - (this.x + Math.cos(2 * i * Math.PI / this.numVerts) * 150);
            let deltay = y - (this.y + Math.sin(2 * i * Math.PI / this.numVerts) * 150);
            if (Math.sqrt(deltax * deltax + deltay * deltay) < 20) {
                return i;
            }
        }
    }

    getEdge(n, m) {
        let a = Math.min(n, m);
        let b = Math.max(n, m);
        return this.graph.charAt((b * b - b) / 2 + a);
    }

    draw(context) {
        context.push();
        context.translate(this.x, this.y);
        context.stroke(20);
        context.fill(20);
        let radius = 150;
        let vertices = []; 

        context.fill(150);
        context.noStroke();
        for (let i = 0; i < this.numVerts; i++) {
            let x = radius * Math.cos(2 * i * Math.PI / this.numVerts);
            let y = radius * Math.sin(2 * i * Math.PI / this.numVerts);
            context.ellipse(x, y, 20);
        }
        for (let i = 0; i < this.numVerts; i++) {
            if(i != this.selected) {
                vertices.push([
                    radius * Math.cos(2 * i * Math.PI / this.numVerts),
                    radius * Math.sin(2 * i * Math.PI / this.numVerts)
                ]);
            }else{
                vertices.push([context.mouseX - this.x, context.mouseY - this.y]);
            }
        }

        //draw edges
        context.stroke(0, 50);
        for (let i = 0; i < this.numVerts - 1; i++) {
            for (let j = i + 1; j < this.numVerts; j++) {
                if (this.getEdge(this.perm[i], this.perm[j]) === "1") {
                    context.line(vertices[i][0], vertices[i][1], vertices[j][0], vertices[j][1]);
                }
            }

        }
        context.fill(0);
        for (let v in vertices) {
            context.ellipse(vertices[v][0], vertices[v][1], 6);
        }
        context.pop();
    }
}