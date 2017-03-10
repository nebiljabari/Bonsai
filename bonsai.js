class Tree {
	constructor(rawData) {
  	this.data  = [];
    this.depth = 0;
    this.transform(rawData);
    this.nodeLevel();
  }

  transform(str) {
  	// we filter in 2 times.
    // 1- Spliting by return and excluding the header;
    let tmp = str.split('\n'); tmp.shift();

    tmp.forEach(row => {
      // 2- Cleaning the data by ";" to retreive only the numbers
      let tmp2 = row.split(';');
      // we use the "+" operator to transform the string as num
      // we create a new key to store the number of children a node have
      this.data.push({ id: +tmp2[0], parent: +tmp2[1], weight: +tmp2[2], child: 0 });
    });
  }

  nodeLevel() {
  	// function to determine the nodes positions and the number of levels of the tree
  	let step = 1, up = 1, childNbr = 1, mainParentID = null;
    let _tmpDepth = [], _tmpDepth2 = [];

    /* *** ***  TREE DEPTH  *** *** */

    // The depth of the tree can be known by filtering the parent id
    this.data.filter(obj => _tmpDepth.push(obj.parent) );
    // To do so, we use 2 arrays and a gap of 1 to compare both arrays
    // and retaining the parent id value "only" once
    _tmpDepth2[1] = _tmpDepth[1];

		for (let i=0; i < this.data.length; i++) {
    	if (_tmpDepth2[i] != _tmpDepth[i] ) _tmpDepth2.push(_tmpDepth[i]);
    }
    // .shift() the index we used as gap to obtain the correct depth
    // length of the array = depth of the tree
    _tmpDepth2.shift();
    this.depth = _tmpDepth2.length;

    /* *** ***  CHILD NODES  *** *** */

    // We determine the number of children for a node
    // allowing us after to compute the subweights
    for (let i=0; i < this.data.length; i++) {
    	for (let j=0; j < this.data.length; j++) {
      	if (this.data[i].id == this.data[j].parent)
        	this.data[i].child += childNbr;
      }
      childNbr = 1;
    }

    // Comparing the parent and child info allow us to know the node level
  	for (let i=0; i < this.data.length; i++) {
    	if (this.data[i].parent == 0) {
      	this.data[i].level = step;
      }
      else this.data[i].level = 'undefined';
    }

    step += up;

    for (let i=0; i < this.data.length; i++) {
    	if (this.data[i].level < step) { mainParentID = this.data[i].id; continue; }

      for (let j=0; j < this.data.length; j++) {
      	if (this.data[i].child || this.data[i].parent == mainParentID) {
        	this.data[i].level = step;
        }
      }

      // if still "undefined" it means it's the deepest node level
      if (this.data[i].level == 'undefined') {
      	this.data[i].level = step + up;
        //this.depth = this.data[i].level;
      }
    }

    //console.log('>> FROM NODE LEVEL:', this.data);
  }

  computeSubWeight() {
    let step = 1;

    // We use the node level as filter to compute the subweights
    for (let i=0; i < this.data.length; i++) {
      if (this.data[i].level == step) {
      	let _subW = null;
        for (let j=0; j < this.data.length; j++) _subW += this.data[j].weight;
        this.data[i].subweight = (_subW - this.data[i].weight);
      }
      // If the node level equal the max depth
      // subweight = 0 because it have no child
      else if (this.data[i].level == this.depth) {
      	this.data[i].subweight = 0;
        // But at this step we also have to find which node is it's parent
        for (let j=0; j < this.data.length; j++) {
        	if (this.data[j].id == this.data[i].parent)
          	this.data[j].subweight = this.data[i].weight;
        }
      }
      // No child = no subweight (no matter the node level)
      else if (!this.data[i].child) this.data[i].subweight = 0;
   	}
    this.orderedByLevel();
  }

  orderedByLevel() {
  	this.data.sort((obj1, obj2) => { return obj1.level > obj2.level });
    console.log('>> Compute SubWeight and Ordered by Level:', this.data);
  }
}

const rawData = `id;parent;weight
5;10;20
10;0;2
30;10;6
20;5;10`

let tree = new Tree(rawData);
tree.computeSubWeight();
