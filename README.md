Node Graph Visualization
========================
*This is still a **BETA** version*

How to Use
----------
To view a node representation, insert a valid **Array/JSON** string.
**JSON** strings must have *"Name"* and *"Children"* fields.
Use [jsonlint.com](http://jsonlint.com)+ for check **JSON** syntax.

## EXAMPLES ##
* ### String Array ###
	* ["Alpha",["Boniato","Colossus"]]
	* ["A",[["B","K",["1","2","3"]],"J"],"C",["1","2"],"E"]
* ### Number Array ###
	* [0,[0,0],[0,0,[0,0,0],0],0,[0,0],0,[0,0,0,0,0],0]
	* [[[[[0]]],[0,0]],[0,[0,0,0],0],[0,0],[0,[0,0,0],0],[[0,0],[0,0]]]
	* [0,[[0,0]]]
	* [0,[0,0]]
* ### JSON ###
	* {"Name": "Root","Children": [{"Name":"Child 1","Children": []},{"Name": "Child 2","Children": [{"Name":"Child 1","Children": []},{"Name": "Child 2","Children": []},{"Name":"Child 3","Children": []}]},{"Name": "Child 3","Children": []}]}
	
Demo
----
To view and test a Demo, you can go [here](http://nodegraph.icewer.net) and check it.