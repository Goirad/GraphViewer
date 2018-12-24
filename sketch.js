let numVerts = 49;
let graph;
let useN = 1;
let useN2 = 0;
let useK3 = 0;
let edgeDensityFactor = 0.5;


function setup() {
    createCanvas(800, 400);
    graph = randGraph(numVerts);

    let numVertsSlider = document.getElementById('numVertsSlider');
    let numVertsLabel = document.getElementById('numVertsLabel');
    numVerts = numVertsSlider.value;
    numVertsLabel.innerText = numVerts;
    numVertsSlider.onchange = function () {
        updateVerts(this.value);
        numVertsLabel.innerText = this.value;
    }

    let edgeDensitySlider = document.getElementById('edgeDensity');
    let edgeDensityLabel = document.getElementById('edgeDensityLabel');
    edgeDensityFactor = edgeDensitySlider.value/100;
    edgeDensityLabel.innerText = edgeDensityFactor;
    edgeDensitySlider.onchange = function() {
        edgeDensityFactor = this.value / 100;
        edgeDensityLabel.innerText = edgeDensityFactor;
        graph = randGraph(numVerts);
        draw();
    }
    let neighborsSwitch = document.getElementById('neighborsSwitch');
    useN = neighborsSwitch.checked ? 1 : 0;
    neighborsSwitch.onchange = function () {
        useN = this.checked ? 1 : 0;
        drawLabeledGraphGrid();
    }

    let neighbors2Switch = document.getElementById('neighbors2Switch');
    useN2 = neighbors2Switch.checked ? 1 : 0;
    neighbors2Switch.onchange = function () {
        useN2 = this.checked ? 1 : 0;
        drawLabeledGraphGrid();
    }

    let k3sSwitch = document.getElementById('k3sSwitch');
    useK3 = k3sSwitch.checked ? 1 : 0;
    k3sSwitch.onchange = function () {
        useK3 = this.checked ? 1 : 0;
        drawLabeledGraphGrid();

    }

}

function draw() {

    noLoop();
    background(220);
    drawBaseGraph();
    drawLabeledGraphGrid();


    /*
    for (let g in groups) {
      for (let n in groups[g]) {
        //console.log(groups[g])
        if (groups[g].length > 1) {
          let angle1 = g * TWO_PI / groups.length;
          let angle2 = n * TWO_PI / groups[g].length;
          sortedVerts[groups[g][n]] = [
            radius * cos(angle1) +
              subRadius * cos(angle2 + angle1),
            radius * sin(angle1) +
              subRadius * sin(angle2 + angle1)
          ];
        } else {
          sortedVerts[groups[g][n]] = [
            radius * cos(g * TWO_PI / groups.length),
            radius * sin(g * TWO_PI / groups.length)
          ];
        }
      }
    }

    for (let g in groups) {
      ellipse(
        radius * cos(g * TWO_PI / groups.length),
        radius * sin(g * TWO_PI / groups.length),
        45
      );
    }
    */

}

/*
    Expects 0 or 1 for whether to enable that labeling
 */
function drawLabeledGraphGrid() {
    push();
    fill(220);
    noStroke();
    rect(width/2, 0, width, height);
    translate(450, (height - 300) / 2);
    let neighbors = normalize(getNeighbors(graph));
    let neighborsold = getNeighbors(graph);
    //console.log(neighbors);
    let neighbors2 = normalize(getNeighbors2(graph));
    //console.log(neighbors2);
    let k3s = normalize(getK3s(graph));
    //console.log(k3s);
    //console.log(group(neighbors));
    //draw vertices
    let label = [];
    for (i in neighbors) {
        label.push(neighbors[i] * useN * 4096 + neighbors2[i] * useN2 * 64 + k3s[i] * useK3);
    }

    let sortedVerts = [];
    let subRadius = 15;
    label = normalize(label);
    let groups = group(label);

    let sqSize = Math.ceil(Math.sqrt(groups.length));
    let sep = 300 / (sqSize - 1);
    for (let g in groups) {
        for (let n in groups[g]) {
            //console.log(groups[g])
            if (groups[g].length > 1) {
                let angle2 = n * TWO_PI / groups[g].length;
                sortedVerts[groups[g][n]] = [
                    sep * (g % sqSize) +
                    subRadius * cos(angle2),
                    sep * (Math.floor(g / sqSize)) +
                    subRadius * sin(angle2)
                ];
            } else {
                sortedVerts[groups[g][n]] = [
                    sep * (g % sqSize),
                    sep * Math.floor(g / sqSize)
                ];
            }
        }
    }
    //translate(width / 4, -width / 4 + 50);

    stroke(0, 50);
    for (let i = 0; i < numVerts - 1; i++) {
        for (let j = i + 1; j < numVerts; j++) {
            if (getEdge(i, j, graph) === "1") {
                line(
                    sortedVerts[i][0],
                    sortedVerts[i][1],
                    sortedVerts[j][0],
                    sortedVerts[j][1]
                );
            }
        }
    }
    fill(0);

    for (let v of sortedVerts) {
        ellipse(v[0], v[1], 6);
    }

    noFill();
    stroke(0, 200);
    for (let g in groups) {
        ellipse(
            sep * (g % sqSize),
            sep * Math.floor(g / sqSize),
            40
        );
    }

    let comp = bigInt(1);
    let reducedComplexity = document.getElementById('reducedComplexity');
    for (g in groups) {
        if (neighborsold[groups[g][0]] > 0 && neighborsold[groups[g][0]] < numVerts - 1) {
            comp = comp.times(factorial(groups[g].length));

        }
    }
    reducedComplexity.innerText = comp.toString();

    pop();
}


function drawBaseGraph() {
    push();
    translate(width / 4, height / 2);
    stroke(20);
    fill(20);
    let radius = 150;
    let vertices = [];
    for (let i = 0; i < numVerts; i++) {
        vertices.push([
            radius * cos(i * TWO_PI / numVerts),
            radius * sin(i * TWO_PI / numVerts)
        ]);
    }
    //draw edges
    stroke(0, 50);
    for (let i = 0; i < numVerts - 1; i++) {
        for (let j = i + 1; j < numVerts; j++) {
            if (getEdge(i, j, graph) === "1") {
                line(vertices[i][0], vertices[i][1], vertices[j][0], vertices[j][1]);
            }
        }
    }
    for (let v of vertices) {
        ellipse(v[0], v[1], 6);
    }
    pop();
    let rawComplexity = document.getElementById('rawComplexity');
    rawComplexity.innerText = factorial(numVerts).toString();
}

function factorial(n) {
    let ans = bigInt(1);
    for(let i = bigInt(2); i.leq(bigInt(n)); i = i.next()) {
        //console.log(i);
        ans = ans.times(i);
    }
    return ans;
}

function updateVerts(val) {
    numVerts = val;
    graph = randGraph(numVerts);
    draw();
}

function group(labels) {
    let groups = [];
    for (let i in labels) {
        let temp = [];
        for (let j = 0; j < labels.length; j++) {
            if (labels[j] == i) {
                temp.push(j);
            }
        }
        if (temp.length > 0) {
            groups.push(temp);
        }
    }
    return groups;
}

function normalize(labels) {
    //console.log(labels)
    //make sure no collisions
    for (let x in labels) {
        labels[x] += labels.length;
    }
    let old = labels.slice();
    let current = 0;
    for (let i in old) {
        let used = false;
        for (let j in labels) {
            if (labels[j] == old[i]) {
                labels[j] = current;
                used = true;
            }
        }
        if (used) {
            current += 1;
        }
    }
    return labels;
    //console.log(labels)
}

function randGraph(n) {
    let out = "";
    let edges = n * (n - 1) / 2;
    for (let i = 0; i < edges; i++) {
        if (Math.random() < edgeDensityFactor) {
            out += "1";
        } else {
            out += "2";
        }
    }
    return out;
}

function getEdge(n, m, edges) {
    let a = min(n, m);
    let b = max(n, m);
    return edges.charAt((b * b - b) / 2 + a);
}

function getNeighbors(edges) {
    let total = [];
    for (let n = 0; n < numVerts; n++) {
        let temp = 0;
        for (let i = 0; i < numVerts; i++) {
            if (i != n) {
                if (getEdge(i, n, edges) === "1") {
                    temp += 1;
                }
            }
        }
        total.push(temp);
    }
    return total;
}

function getNeighbors2(edges) {
    let neighbors = getNeighbors(edges);
    let total = [];
    for (let n = 0; n < numVerts; n++) {
        let temp = 0;
        for (let i = 0; i < numVerts; i++) {
            if (n != i) {
                if (getEdge(i, n, edges) === "1") {
                    temp += neighbors[i];
                }
            }
        }
        total.push(temp);
    }
    return total;
}

function getK3s(edges) {
    let total = [];
    for (let n = 0; n < numVerts; n++) {
        let temp = 0;
        for (let i = 0; i < numVerts - 1; i++) {
            if (n != i && getEdge(n, i, edges) === "1") {
                for (let j = i + 1; j < numVerts; j++) {
                    if (j != n && j != i) {
                        if (getEdge(n, j, edges) === "1" && getEdge(i, j, edges) === "1") {
                            temp += 1;
                        }
                    }
                }
            }
        }
        total.push(temp);
    }
    return total;
}
