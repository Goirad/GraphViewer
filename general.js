let hardGraphs = [
    [], [], [], [], [], [], [], [], [],
    //9 verts
    [
        [
            "212112211222222222221222221222222211",
            "212212122221222221122222212222222121",
        ],
        [
            "111111112222111111211121111221211111",
            "212112211211111111111111112211111221"
        ]
    ],
    [

    ],
    //11 verts
    [
        ["2122121122221121111221111122211222121221212212122112211",
            "2121122112112222212121211112122122121222111212111211222",
            "2121122112112121122222221221211122111212111222211112122"],
        ["2122121122221121111221122111221111111111112221111112222",
            "2122121122221121111222112111122111111111112221111112222",
            "2111121122221121222111112112211111122221111121111221221"],
    ],
    //12 verts
    [
        [
            "211112121221212211211122111211121112112111211121112112221112111221",
            "211112121221211121212212121111111122111122112211211111212211111212"
        ],
        [
            "211112121221211111122222212111122122122112212221221211222212111211",
            "211112121221212211211222112221212211211212211121221112212212122121",
            "212112211211212222121222122112111212111211212211212212212221211121"
        ],
        [
            "211112121221211112112121121221221211221221112221112221111222122111",
            "212212112222111111111111212211212221121122221221221211121211122211",
            "212212112222112111212112121112111222211121221221111121211221121212"
        ]
    ],
    //13 verts
    [
        [
            "211112121221211112222221212212122212211211121222122111212212122121212211112212",
            "212112122122221211221211212212221112212122111211121122211121221222121122221112"
        ],
        [
            "211112121221211112222221212212122212211211121222122111212212122121212211112212",
            "212112122122221211221211212212221112212122111211121122211121221222121122221112"
        ],
        [
            "212212111111112222212112222122122111211212121122122112212212112211211122211212",
            "211112222222221112211111212112212121221111221121211222221112122121212112122112",
            "212212112222112211222112111112212112121212221211122122112111122221212211121122"
        ],
        [
            "212112111112122122212212221112112212211221111221121212221221211221212121221211",
            "212212122221122112112121121112111122212121212112212222121121112221221112221112",
            "212112122122221211221111122212121222211221211111121122221211112122222211111122"
        ]
    ],
    //14 verts
    [
        [
            "2121122112112121122221212221211122112221212212212112121112112122111222111221222122111222121",
            "2111121122111222212211111122122121222221121122121121212222211122111212122212122121212211221",
            "2122121122221121112121121212211222211212212112111212222221111121222122112211121221222112112",
            "2121122112111111121222221212121222122212221111222111122212212211112112121222121121222122211"
        ],
        [
            "2121122112111111122212211122121222111221122212112121221212212111121111222122112221211111122",
            "2121121111121221222122122211211222122211211122112112112222111121111111222111221121211112222",
            "2111121122221121212222122121112121212111221121222111112211211121222221111221111211112121222"
        ]
    ]

];


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', afterLoaded);
} else {
    afterLoaded();
}
let myp5;
let introp5;

function afterLoaded() {
    myp5 = new p5(s, 'sketch');
    introp5 = new p5(s2, 'sketch2');
    console.log("done spawning p5");

    let hardGraphNumVertsSelector = document.getElementById("hardGraphNumVertsSelector");

    for (let group in hardGraphs) {
        if (hardGraphs[group].length > 0) {
            let option = document.createElement('option');
            option.text = group;
            hardGraphNumVertsSelector.add(option);
        }
    }

    let hardGraphSelector = document.getElementById("hardGraphSelector");
    let numVertsSlider = document.getElementById('numVertsSlider');
    let numVertsLabel = document.getElementById('numVertsLabel');
    hardGraphNumVertsSelector.onchange = function () {
        updateSelect(hardGraphSelector, hardGraphs[this.value]);
        numVertsLabel.innerText = this.value;
        numVertsSlider.value = this.value;
    };
    updateSelect(hardGraphSelector, hardGraphs[hardGraphNumVertsSelector.value]);

    hardGraphSelector.onchange = function () {
        let n = hardGraphNumVertsSelector.value;
        myp5.loadGraph(n, flatGet(hardGraphs[n], hardGraphSelector.selectedIndex));
    }
}

function arraysEqual(arr1, arr2) {
    if (arr1.length != arr2.length) {
        return false;
    }else{
        for (let i in arr1) {
            if (arr1[i] !== arr2[i]) {
                return false;
            }
        }
    }
    return true;
}

//from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array/25984542
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function flatGet(arr, index) {
    let total = index;
    for (let subarr of arr) {
        if (total < subarr.length) {
            return subarr[total];
        } else {
            total -= subarr.length;
        }

    }
}

function updateSelect(selector, newItems) {
    for (let i = selector.options.length - 1; i >= 0; i--) {
        selector.remove(i);
    }
    for (let i in newItems) {
        for (let j in newItems[i]) {
            let option = document.createElement('option');
            option.innerText = "Group " + i + ", Graph " + j;
            selector.add(option);
        }
    }
}


