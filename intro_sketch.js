let s2 = function(sketch) {
    let numVerts = 7;
    let graph1;
    let graph2;
    let isIso = false;

    sketch.setup = function() {
        sketch.createCanvas(800, 400);
        graph1 = new Graph(sketch.width/4, sketch.height/2, numVerts);
        graph2 = graph1.clone();
        graph2.x += sketch.width/2;
    };

    sketch.draw = function() {
        sketch.background(220);
        graph1.draw(sketch);
        graph2.draw(sketch);
        if(isIso) {
            sketch.fill(10, 200, 10);
        } else{
            sketch.fill(200, 10, 10);
        }
        sketch.ellipse(sketch.width/2, 30, 30);
    };


    sketch.mousePressed = function() {
        let v = graph1.isVertex(sketch.mouseX, sketch.mouseY);
        if (v != null) {
            graph1.selected = v;
        }
    };

    sketch.mouseReleased = function() {
        let v = graph1.isVertex(sketch.mouseX, sketch.mouseY);
        if (v != null && v != graph1.selected && graph1.selected != null) {
            let t = graph1.perm[v];
            graph1.perm[v] = graph1.perm[graph1.selected];
            graph1.perm[graph1.selected] = t;
        }
        graph1.selected = null;
        isIso = graph1.isoTo(graph2);

    };
};

