#include <bits/stdc++.h>
using namespace std;
#define PADDING "______"
#define N 20001

class SpaceOptimizedMerkleTree
{
private:
    vector<string> nodes;
    string root;
    map<string, int> indexTable;
    int firstPadding = -1;
    bool staticTree = false;
    string hashFunction(string s)
    {
        int hashValue = 0;
        for (int i = 0; i < s.size(); i++)
        {
            hashValue += s[i];
        }
        hashValue = hashValue % 256;
        return to_string(hashValue);
        return s;
    }
    bool isPowerOfTwo(int n)
    {
        return (n > 0) && (n & (n - 1)) == 0;
    }
    int nextPowerOfTwo(int n)
    {
        if (isPowerOfTwo(n))
        {
            return n;
        }
        int count = 0;
        while (n != 0)
        {
            n >>= 1;
            count += 1;
        }
        return 1 << count;
    }
    int getParent(int n)
    {
        return n / 2;
    }
    int getSibling(int n)
    {
        if (n % 2 == 0)
        {
            return n + 1;
        }
        return n - 1;
    }
    void makePaddingTree(string data)
    {
        map<int, string> paddedNodes;
        paddedNodes[0] = data;
        for (int i = 1; i < tree[0].size(); i++)
        {
            paddedNodes[i] = PADDING;
        }
        for (int i = 0; i < paddedNodes.size(); i++)
        {
            paddedNodes[i] = hashFunction(paddedNodes[i]);
            nodes.push_back(paddedNodes[i]);
            indexTable[paddedNodes[i]] = tree[0].size() + i;
        }
        firstPadding = tree[0].size() + 1;
        if (firstPadding > 2 * tree[0].size())
        {
            firstPadding = -1;
        }
        vector<map<int, string>> newTree;
        newTree.push_back(paddedNodes);
        map<int, string> temp = paddedNodes;
        while (temp.size() > 1)
        {
            map<int, string> newTemp;
            int j = 0;
            for (int i = 0; i < temp.size(); i += 2)
            {
                string tohash = temp[i] + temp[i + 1];
                newTemp[j] = hashFunction(tohash);
                j++;
            }
            newTree.push_back(newTemp);
            temp = newTemp;
        }
    }
    void mergeTree(vector<map<int, string>> newTree)
    {
        string newRoot = hashFunction(tree[tree.size() - 1][0] + newTree[newTree.size() - 1][0]);
        for (int i = 0; i < newTree.size(); i++)
        {
            for (auto it : newTree[i])
            {
                tree[i][it.first] = it.second;
            }
        }
        map<int, string> singleMap;
        singleMap[0] = newRoot;
        tree.push_back(singleMap);
        root = newRoot;
    }
    // to reclaim space
    void deleteNode(int level, int index)
    {
        if (level == tree.size() - 1)
        {
            // cannot delete root;
            return;
        }
        tree[level].erase(index);
        int siblingIndex = getSibling(index);
        if (tree[level].find(siblingIndex) == tree[level].end())
        {
            // sibling is dead
            int parent = getParent(index);
            int parentSibling = getSibling(parent);
            deleteNode(level + 1, parentSibling);
        }
    }

public:
    vector<map<int, string>> tree;
    SpaceOptimizedMerkleTree(vector<string> &data)
    {
        nodes = data;
        int n = nodes.size();
        int nextPox = nextPowerOfTwo(n);
        if (nextPox > n)
        {
            for (int i = 0; i < nextPox - n; i++)
            {
                nodes.push_back(PADDING);
            }
            firstPadding = n;
        }
        n = nodes.size();
        map<int, string> temp;
        for (int i = 0; i < n; i++)
        {
            nodes[i] = hashFunction(nodes[i]);
            indexTable[nodes[i]] = i;
            temp[i] = nodes[i];
        }
        tree.push_back(temp);
        root = temp[0];
        while (temp.size() > 1)
        {
            map<int, string> newTemp;
            int j = 0;
            for (int i = 0; i < temp.size(); i += 2)
            {
                string tohash = temp[i] + temp[i + 1];
                newTemp[j] = hashFunction(tohash);
                j++;
            }
            tree.push_back(newTemp);
            temp = newTemp;
        }
    }
    string getRoot()
    {
        return root;
    }
    void printTree()
    {
        int height = tree.size();
        int currLevelSize = 1;
        for (int i = tree.size() - 1; i >= 0; i--)
        {
            for (int j = 0; j < currLevelSize; j++)
            {
                if (tree[i].find(j) == tree[i].end())
                {
                    cout << "_del_"
                         << " ";
                }
                else
                {
                    cout << tree[i][j] << " ";
                }
            }
            cout << endl;
            currLevelSize = currLevelSize * 2;
        }
    }
    bool verifyElement(string data, vector<string> path)
    {
        string hash = hashFunction(data);
        for (int i = 0; i < path.size(); i++)
        {
            hash += path[i];
            hash = hashFunction(hash);
        }
        return hash == root;
    }
    void addElement(string data)
    {
        if (firstPadding != -1)
        {
            nodes[firstPadding] = hashFunction(data);
            tree[0][firstPadding] = nodes[firstPadding];
            indexTable[nodes[firstPadding]] = firstPadding;
            int currentlevel = 0;
            int parentLevel = 1;
            int currentIndex = firstPadding;
            while (currentlevel < tree.size() - 1)
            {
                int sibling = getSibling(currentIndex);
                int parent = getParent(currentIndex);
                if (currentIndex % 2 == 0)
                {
                    tree[parentLevel][parent] = hashFunction(tree[currentlevel][currentIndex] + tree[currentlevel][sibling]);
                }
                else
                {
                    tree[parentLevel][parent] = hashFunction(tree[currentlevel][sibling] + tree[currentlevel][currentIndex]);
                }
                currentIndex = parent;
                currentlevel++;
                parentLevel++;
            }

            firstPadding += 1;
            if (firstPadding >= tree[0].size())
            {
                firstPadding = -1;
            }
            root = tree[tree.size() - 1][0];
        }
        else
        {
            makePaddingTree(data);
        }
    }
    void setStaticTree(bool value)
    {
        staticTree = value;
    }
    vector<string> getPath(string item)
    {
        item = hashFunction(item);
        auto it = indexTable.find(item);
        if (it == indexTable.end())
        {
            return {};
        }
        int index = it->second;
        int sibling = getSibling(index);
        vector<string> path;
        int currentLevel = 0;
        int currentIndex = index;
        while (currentLevel < tree.size() - 1)
        {
            int siblingIndex = getSibling(currentIndex);
            path.push_back(tree[currentLevel][siblingIndex]);
            currentIndex = getParent(currentIndex);
            currentLevel += 1;
        }
        deleteNode(0, sibling);
        return path;
    }
};

int main()
{
    vector<string> data = {"a", "b", "c", "d", "e", "f", "g", "h"};
    SpaceOptimizedMerkleTree tree(data);
    cout << "Tree after inerting" << endl;
    tree.printTree();
    cout << endl;
    cout << endl;
    tree.setStaticTree(true);
    cout << "Querying elements" << endl;
    cout << "Tree after querying a" << endl;
    tree.getPath("a");
    tree.printTree();
    cout << endl;
    cout << "Tree after querying b" << endl;
    tree.getPath("b");
    tree.printTree();
    cout << endl;
    cout << "Tree after querying d" << endl;
    tree.getPath("d");
    tree.printTree();
    cout << endl;
    cout << "Tree after querying e" << endl;
    tree.getPath("e");
    tree.printTree();
    cout << endl;
    return 1;
}