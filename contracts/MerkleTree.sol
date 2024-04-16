// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// MERKLE TREE IMPLEMENTAION
contract MerkleTree {
    // padding data
    bytes32 private paddingString = "someOtherRandomStringForPadding";

    struct nodeIndex {
        uint index;
        bool exist;
    }
    
    // the tree
    struct merkle {
        int firstPadding;
        uint height;
        bytes32 root;
        bytes32[][] tree;
        mapping(bytes32 => nodeIndex) nodeToIndex;
    }

    // to allow multiple trees
    uint public treeCount = 0;
    mapping(uint => merkle) forest;

    // hash function
    function hashBytes32(
        bytes32 left,
        bytes32 right
    ) public pure returns (bytes32) {
        return sha256(abi.encodePacked(left, right));
    }

    // single hash
    function sha256Hash(bytes32 data) public pure returns (bytes32) {
        return sha256(abi.encodePacked(data));
    }

    // checks if the current number of nodes is a power of two
    function isPowerOfTwo(int x) public pure returns (bool) {
        return (x != 0) && ((x & (x - 1)) == 0);
    }
    // returns the next power of two to fill with padding data
    function nextPowerOfTwo(int x) public pure returns (int) {
        if (isPowerOfTwo(x)) {
            return x;
        }
        int power = 1;
        while (power < x) {
            power *= 2;
        }
        return power;
    }

    // to get the parent index of the current node
    function getParent(uint index) public pure returns (uint) {
        return index / 2;
    }

    // to get the sibling index of the current node
    function getSibling(uint index) public pure returns (uint) {
        if (index % 2 == 0) {
            return index + 1;
        } else {
            return index - 1;
        }
    }

    // initialise the tree, and get the tree ID
    function initTreeAndGetID() public returns (uint) {
        treeCount++;
        forest[treeCount].firstPadding = -1;
        return treeCount;
    }

    // called incase there are no padding elements in the current tree
    // makes a tree with same size as already existing tree , with one data
    // element that is provided, and remaining all padding data
    function makePaddingTree(uint _treeID, bytes32 data) public {
        merkle storage currTree = forest[_treeID];
        // make padding tree
        bytes32[][] memory newTree = new bytes32[][](currTree.height);
        newTree[0] = new bytes32[](currTree.tree[0].length);
        for (uint i = 0; i < newTree[0].length; i++) {
            if (i == 0) {
                newTree[0][i] = data;
            } else {
                newTree[0][i] = sha256Hash(paddingString);
            }
        }
        currTree.firstPadding = int(currTree.tree[0].length) + 1;

        uint currentLevel = 0;
        uint parentLevel = 1;

        while (currentLevel < currTree.height - 1) {
            newTree[parentLevel] = new bytes32[](
                newTree[currentLevel].length / 2
            );

            for (uint i = 0; i < newTree[currentLevel].length - 1; i += 2) {
                newTree[parentLevel][i / 2] = hashBytes32(
                    newTree[currentLevel][i],
                    newTree[currentLevel][i + 1]
                );
            }

            currentLevel++;
            parentLevel++;
        }
        mergeTreesAndUpdateRoot(_treeID, newTree);
    }

    // to merge the padding tree with the already existing tree
    // and update new root
    // the height of the tree is increased by 1
    function mergeTreesAndUpdateRoot(
        uint _treeID,
        bytes32[][] memory newTree
    ) public {
        merkle storage currTree = forest[_treeID];
        currTree.root = hashBytes32(
            currTree.tree[currTree.tree[0].length - 1][0],
            newTree[currTree.tree[0].length - 1][0]
        );
        for (uint i = 0; i < newTree.length; i++) {
            for (uint j = 0; j < newTree[i].length; j++) {
                currTree.tree[i].push(newTree[i][j]);
            }
        }
        currTree.tree.push([currTree.root]);
        currTree.height += 1;
    }

    // to add a element to the merkle tree
    function addElement(uint _treeID, bytes32 data) public {
        merkle storage currTree = forest[_treeID];
        data = sha256Hash(data);
        if (currTree.firstPadding == -1) {
            if (currTree.height == 0) {
                // check if tree is empty and initialise
                bytes32[] memory currentLevel = new bytes32[](2);
                currentLevel[0] = data;
                currentLevel[1] = sha256Hash(paddingString);
                currTree.tree.push(currentLevel);
                currTree.height++;
                currTree.firstPadding = 1;
                // updates the tree with the root
                currTree.tree.push(
                    [hashBytes32(currentLevel[0], currentLevel[1])]
                );
                // final height
                currTree.height++;
                // sets root
                currTree.root = hashBytes32(currentLevel[0], currentLevel[1]);
            } else {
                // the tree is full
                makePaddingTree(_treeID, data);
            }
        } else {
            // add element and reconstruct and update firstPadding
            uint fp = uint(currTree.firstPadding);

            currTree.tree[0][fp] = data;

            uint currLevel = 0;
            uint parentLevel = 1;
            uint currentIndex = fp;

            while (currLevel < currTree.tree.length - 1) {
                uint siblingIndex = getSibling(currentIndex);
                uint parentIndex = getParent(currentIndex);
                if (currentIndex % 2 == 0) {
                    currTree.tree[parentLevel][parentIndex] = hashBytes32(
                        currTree.tree[currLevel][currentIndex],
                        currTree.tree[currLevel][siblingIndex]
                    );
                } else {
                    currTree.tree[parentLevel][parentIndex] = hashBytes32(
                        currTree.tree[currLevel][siblingIndex],
                        currTree.tree[currLevel][currentIndex]
                    );
                }
                currentIndex = parentIndex;
                currLevel++;
                parentLevel++;
            }

            currTree.firstPadding++;
            if (currTree.firstPadding >= int(currTree.tree[0].length)) {
                currTree.firstPadding = -1;
            }
            currTree.root = currTree.tree[currTree.tree.length - 1][0];
        }
    }

    // get a element's path
    function getElementPath(
        uint _treeID,
        bytes32 leaf
    ) public view returns (bytes32[] memory, uint[] memory) {
        merkle storage currTree = forest[_treeID];
        bytes32[] memory path = new bytes32[](currTree.height - 1);
        uint[] memory hashOrder = new uint[](currTree.height - 1);
        int indexD = -1;
        uint index = 0;
        // to-do : implement a mapping from node data to index instead of linear search
        for (uint i = 0; i < currTree.tree[0].length; i++) {
            if (leaf == currTree.tree[0][i]) {
                indexD = int(i);
                break;
            }
        }
        if (indexD != -1) {
            index = uint(indexD);
            uint currLevel = 0;
            uint currentIndex = index;
            while (currLevel < currTree.height - 1) {
                uint siblingIndex = getSibling(currentIndex);
                path[currLevel] = currTree.tree[currLevel][siblingIndex];
                hashOrder[currLevel] = siblingIndex % 2;
                currLevel++;
                currentIndex = getParent(currentIndex);
            }
        }
        return (path, hashOrder);
    }

    function getRoot(uint _treeID) public view returns (bytes32) {
        return forest[_treeID].root;
    }

    function verifyPath(
        uint _treeID,
        bytes32[] memory path,
        uint[] memory hashOrder,
        bytes32 leaf
    ) public view returns (bool) {
        bytes32 hashString = leaf;
        for (uint i = 0; i < path.length; i++) {
            if (hashOrder[i] == 0) {
                hashString = hashBytes32(path[i], hashString);
            } else {
                hashString = hashBytes32(hashString, path[i]);
            }
        }
        return hashString == forest[_treeID].root;
    }

    function getTree(
        uint _treeID
    ) public view returns (bytes32[][] memory tree) {
        return forest[_treeID].tree;
    }
}
