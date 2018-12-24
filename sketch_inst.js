let s = function(sketch) {
    let numVerts = 49;
    let graph = "";
    let useN = 1;
    let useN2 = 0;
    let useN3 = 0;
    let useK3 = 0;
    let edgeDensityFactor = 0.5;




    sketch.setup = function() {
        sketch.createCanvas(800, 400);

        let numVertsSlider = document.getElementById('numVertsSlider');
        let numVertsLabel = document.getElementById('numVertsLabel');
        numVerts = numVertsSlider.value;
        numVertsLabel.innerText = numVerts;
        numVertsSlider.onchange = function () {
            sketch.updateVerts(this.value);
            numVertsLabel.innerText = this.value;
        };

        let edgeDensitySlider = document.getElementById('edgeDensity');
        let edgeDensityLabel = document.getElementById('edgeDensityLabel');
        edgeDensityFactor = edgeDensitySlider.value/100;
        edgeDensityLabel.innerText = edgeDensityFactor;
        edgeDensitySlider.onchange = function() {
            edgeDensityFactor = this.value / 100;
            edgeDensityLabel.innerText = edgeDensityFactor;
            graph = sketch.randGraph();
            sketch.draw();
        };

        let neighborsSwitch = document.getElementById('neighborsSwitch');
        useN = neighborsSwitch.checked ? 1 : 0;
        neighborsSwitch.onchange = function () {
            useN = this.checked ? 1 : 0;
            sketch.drawLabeledGraphGrid();
        };

        let neighbors2Switch = document.getElementById('neighbors2Switch');
        useN2 = neighbors2Switch.checked ? 1 : 0;
        neighbors2Switch.onchange = function () {
            useN2 = this.checked ? 1 : 0;
            sketch.drawLabeledGraphGrid();
        };

        let neighbors3Switch = document.getElementById('neighbors3Switch');
        useN3 = neighbors3Switch.checked ? 1 : 0;
        neighbors3Switch.onchange = function () {
            useN3 = this.checked ? 1 : 0;
            sketch.drawLabeledGraphGrid();
        };

        let k3sSwitch = document.getElementById('k3sSwitch');
        useK3 = k3sSwitch.checked ? 1 : 0;
        k3sSwitch.onchange = function () {
            useK3 = this.checked ? 1 : 0;
            sketch.drawLabeledGraphGrid();
        };
        let hardGraphNumVertsSelector = document.getElementById("hardGraphNumVertsSelector");
        let hardGraphSelector = document.getElementById("hardGraphSelector");
        let useHardGraphsSwitch = document.getElementById('useHardGraphs');
        if (useHardGraphsSwitch.checked) {
            numVertsSlider.disabled = useHardGraphsSwitch.checked;
            numVertsSlider.value = hardGraphNumVertsSelector.value;
            numVertsLabel.innerText = hardGraphNumVertsSelector.value;
            edgeDensitySlider.disabled = useHardGraphsSwitch.checked;
            edgeDensityLabel.innerText = "N/A";
        }


        useHardGraphsSwitch.onchange = function () {

              numVertsSlider.disabled = this.checked;
              edgeDensitySlider.disabled = this.checked;

              if(this.checked) {
                  edgeDensityLabel.innerText = "N/A";

                  let n = hardGraphNumVertsSelector.value;
                  numVertsLabel.innerText = n;
                  sketch.loadGraph(n, flatGet(hardGraphs[n], hardGraphSelector.selectedIndex));
              }else{
                  numVertsSlider.onchange();
                  edgeDensitySlider.onchange();
              }

        };

        graph = sketch.randGraph();


    };

    sketch.draw = function() {

        sketch.noLoop();
        sketch.background(220);
        sketch.drawBaseGraph();
        sketch.drawLabeledGraphGrid();


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

    };
    

    /*
        Expects 0 or 1 for whether to enable that labeling
     */
    sketch.drawLabeledGraphGrid = function() {
        sketch.push();
        sketch.fill(220);
        sketch.noStroke();
        sketch.rect(sketch.width/2, 0, sketch.width, sketch.height);
        let neighbors = sketch.normalize(sketch.getNeighbors(graph));
        let neighborsold = sketch.getNeighbors(graph);
        //console.log(neighbors);
        let neighbors2 = sketch.normalize(sketch.getNeighbors2(graph));
        let neighbors3 = sketch.normalize(sketch.getNeighbors3(graph));
        //console.log(neighbors2);
        let k3s = sketch.normalize(sketch.getK3s(graph));
        let notK3s = sketch.normalize(sketch.getNotK3s(graph));

        //console.log(k3s);
        //console.log(group(neighbors));
        //draw vertices
        let labels = [];
        for (let i = 0; i < numVerts; i++) {
            labels.push(new sketch.Label());
        }
        for (let i = 0; i < numVerts; i++) {
            labels[i].keys.push(neighbors[i]   * useN);
            labels[i].keys.push(neighbors2[i]  * useN2);
            labels[i].keys.push(neighbors3[i]  * useN3);
            labels[i].keys.push(k3s[i]         * useK3);
            labels[i].keys.push(notK3s[i]      * useK3);
        }
        let sortedVerts = [];
        let subRadius = 15;
        labels = sketch.Label.normalize(labels);
        let groups = sketch.group(labels);

        let sqSize = Math.ceil(Math.sqrt(groups.length));
        if (sqSize > 1) {
            sketch.translate(450, (sketch.height - 300) / 2);
            let sep = 300 / (sqSize - 1);
            for (let g in groups) {
                for (let n in groups[g]) {
                    //console.log(groups[g])
                    if (groups[g].length > 1) {
                        let angle2 = n * sketch.TWO_PI / groups[g].length;
                        sortedVerts[groups[g][n]] = [
                            sep * (g % sqSize) +
                            subRadius * sketch.cos(angle2),
                            sep * (Math.floor(g / sqSize)) +
                            subRadius * sketch.sin(angle2)
                        ];
                    } else {
                        sortedVerts[groups[g][n]] = [
                            sep * (g % sqSize),
                            sep * Math.floor(g / sqSize)
                        ];
                    }
                }
            }
            sketch.stroke(0, 50);
            for (let i = 0; i < numVerts - 1; i++) {
                for (let j = i + 1; j < numVerts; j++) {
                    if (sketch.getEdge(i, j, graph) === "1") {
                        sketch.line(
                            sortedVerts[i][0],
                            sortedVerts[i][1],
                            sortedVerts[j][0],
                            sortedVerts[j][1]
                        );
                    }
                }
            }
            sketch.fill(0);

            for (let v of sortedVerts) {
                sketch.ellipse(v[0], v[1], 6);
            }

            sketch.noFill();
            sketch.stroke(0, 200);
            for (let g in groups) {
                sketch.ellipse(
                    sep * (g % sqSize),
                    sep * Math.floor(g / sqSize),
                    40
                );
            }
        }else{
            sketch.push();
            sketch.translate(sketch.width/2, 0);
            sketch.drawBaseGraph();
            sketch.pop();
        }
        let comp = bigInt(1);
        let reducedComplexity = document.getElementById('reducedComplexity');
        for (g in groups) {
            if (neighborsold[groups[g][0]] > 0 && neighborsold[groups[g][0]] < numVerts - 1) {
                comp = comp.times(sketch.factorial(groups[g].length));

            }
        }
        reducedComplexity.innerText = comp.toString();

        sketch.pop();
    };

    sketch.Label = class {
        constructor() {
            this.keys = [];
        }
        eq(other) {
            for(let keyIndex in this.keys) {
                if (this.keys[keyIndex] != other.keys[keyIndex]) {
                    return false;
                }
            }
            return true;
        }

        static normalize(labels) {
            let out = [];
            for(let i in labels) {
                out.push(labels.length);
            }
            let current = 0;
            for (let i in labels) {
                let used = false;
                for (let j in labels) {
                    if (out[j] == labels.length && labels[j].eq(labels[i])) {
                        out[j] = current;
                        used = true;
                    }
                }
                if (used) {
                    current += 1;
                }
            }
            return out;
        }
    };



    sketch.drawBaseGraph = function() {
        sketch.push();
        sketch.translate(sketch.width / 4, sketch.height / 2);
        sketch.stroke(20);
        sketch.fill(20);
        let radius = 150;
        let vertices = [];
        for (let i = 0; i < numVerts; i++) {
            vertices.push([
                radius * sketch.cos(i * sketch.TWO_PI / numVerts),
                radius * sketch.sin(i * sketch.TWO_PI / numVerts)
            ]);
        }
        //draw edges
        sketch.stroke(0, 50);
        for (let i = 0; i < numVerts - 1; i++) {
            for (let j = i + 1; j < numVerts; j++) {
                if (sketch.getEdge(i, j, graph) === "1") {
                    sketch.line(vertices[i][0], vertices[i][1], vertices[j][0], vertices[j][1]);
                }
            }
        }
        for (let v of vertices) {
            sketch.ellipse(v[0], v[1], 6);
        }
        sketch.pop();
        let rawComplexity = document.getElementById('rawComplexity');
        rawComplexity.innerText = sketch.factorial(numVerts).toString();
    };

    sketch.factorial = function(n) {
        let ans = bigInt(1);
        for(let i = bigInt(2); i.leq(bigInt(n)); i = i.next()) {
            //console.log(i);
            ans = ans.times(i);
        }
        return ans;
    };

    sketch.loadGraph = function(newNumVerts, newGraph) {
        numVerts = newNumVerts;
        graph = newGraph;
        sketch.draw();
    };
    sketch.updateVerts = function(val) {
        numVerts = val;
        graph = sketch.randGraph();
        sketch.draw();
    };

    sketch.group = function(labels) {
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
    };

    sketch.normalize = function(labels) {
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
    };

    sketch.randGraph = function() {
        let out = "";
        let edges = numVerts * (numVerts - 1) / 2;
        for (let i = 0; i < edges; i++) {
            if (Math.random() < edgeDensityFactor) {
                out += "1";
            } else {
                out += "2";
            }
        }
        return out;
    };

    sketch.getEdge = function(n, m, edges) {
        let a = sketch.min(n, m);
        let b = sketch.max(n, m);
        return edges.charAt((b * b - b) / 2 + a);
    };

    sketch.getNeighbors = function(edges) {
        let total = [];
        for (let n = 0; n < numVerts; n++) {
            let temp = 0;
            for (let i = 0; i < numVerts; i++) {
                if (i != n) {
                    if (sketch.getEdge(i, n, edges) === "1") {
                        temp += 1;
                    }
                }
            }
            total.push(temp);
        }
        return total;
    };

    sketch.getNeighbors2 = function(edges) {
        let neighbors = sketch.getNeighbors(edges);
        let total = [];
        for (let n = 0; n < numVerts; n++) {
            let temp = 0;
            for (let i = 0; i < numVerts; i++) {
                if (n != i) {
                    if (sketch.getEdge(i, n, edges) === "1") {
                        temp += neighbors[i];
                    }
                }
            }
            total.push(temp);
        }
        return total;
    };

    sketch.getNeighbors3 = function(edges) {
        let neighbors2 = sketch.getNeighbors2(edges);
        let total = [];
        for (let n = 0; n < numVerts; n++) {
            let temp = 0;
            for (let i = 0; i < numVerts; i++) {
                if (n != i) {
                    if (sketch.getEdge(i, n, edges) === "1") {
                        temp += neighbors2[i];
                    }
                }
            }
            total.push(temp);
        }
        return total;
    };

    sketch.getK3s = function(edges) {
        let total = [];
        for (let n = 0; n < numVerts; n++) {
            let temp = 0;
            for (let i = 0; i < numVerts - 1; i++) {
                if (n != i && sketch.getEdge(n, i, edges) == "1") {
                    for (let j = i + 1; j < numVerts; j++) {
                        if (j != n && j != i) {
                            if (sketch.getEdge(n, j, edges) == "1" && sketch.getEdge(i, j, edges) == "1") {
                                temp += 1;
                            }
                        }
                    }
                }
            }
            total.push(temp);
        }
        return total;
    };

    sketch.getNotK3s = function(edges) {
        let total = [];
        for (let n = 0; n < numVerts; n++) {
            let temp = 0;
            for (let i = 0; i < numVerts - 1; i++) {
                if (n != i && sketch.getEdge(n, i, edges) != "1") {
                    for (let j = i + 1; j < numVerts; j++) {
                        if (j != n && j != i) {
                            if (sketch.getEdge(n, j, edges) != "1" && sketch.getEdge(i, j, edges) != "1") {
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
};



