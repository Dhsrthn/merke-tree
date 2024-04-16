#include <bits/stdc++.h>
#include <time.h>
using namespace std;
#define PADDING "______"
#define N 20001

class MerkleTree
{
private:
    vector<string> nodes;
    string root;
    map<string, int> indexTable;
    int firstPadding = -1;
    string hashFunction(string s)
    {
        int hashValue = 0;
        // for (int i = 0; i < s.size(); i++)
        // {
        //     hashValue += s[i];
        // }
        // hashValue = hashValue % 256;
        // return to_string(hashValue);
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
        vector<string> paddedNodes;
        paddedNodes.push_back(data);
        for (int i = 1; i < tree[0].size(); i++)
        {
            paddedNodes.push_back(PADDING);
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

        vector<vector<string>> newTree;
        vector<string> currentLevel;
        currentLevel = paddedNodes;
        newTree.push_back(currentLevel);
        while (currentLevel.size() > 1)
        {
            vector<string> nextLevel;
            for (int i = 0; i < currentLevel.size(); i += 2)
            {
                string toHash = currentLevel[i] + currentLevel[i + 1];
                nextLevel.push_back(hashFunction(toHash));
            }
            newTree.push_back(nextLevel);
            currentLevel = nextLevel;
        }
        mergeTree(newTree);
    }
    void mergeTree(vector<vector<string>> &newTree)
    {
        string newRoot = hashFunction(tree[tree.size() - 1][0] + newTree[newTree.size() - 1][0]);
        for (int i = 0; i < newTree.size(); i++)
        {
            tree[i].insert(tree[i].end(), newTree[i].begin(), newTree[i].end());
        };
        tree.push_back({newRoot});
        root = newRoot;
    }

public:
    vector<vector<string>> tree;
    MerkleTree(vector<string> &data)
    {
        nodes = data;
        int n = nodes.size();
        int nextPow = nextPowerOfTwo(n);
        if (nextPow > n)
        {
            firstPadding = n;
        }
        for (int i = n; i < nextPow; i++)
        {
            nodes.push_back(PADDING);
        };
        int m = nodes.size();
        for (int i = 0; i < m; i++)
        {
            nodes[i] = hashFunction(nodes[i]);
            indexTable[nodes[i]] = i;
        }

        tree.push_back(nodes);
        vector<string> currentLevel = nodes;

        while (currentLevel.size() > 1)
        {
            vector<string> nextLevel;
            for (int i = 0; i < currentLevel.size(); i += 2)
            {
                string toHash = currentLevel[i] + currentLevel[i + 1];
                nextLevel.push_back(hashFunction(toHash));
            }
            tree.push_back(nextLevel);
            currentLevel = nextLevel;
        }
        root = currentLevel[0];
    }
    string getRoot()
    {
        return root;
    }
    void printTree()
    {
        for (int i = tree.size() - 1; i >= 0; i--)
        {
            for (int j = 0; j < tree[i].size(); j++)
            {
                cout << tree[i][j] << " ";
            }
            cout << endl;
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
    vector<string> getPath(string item)
    {
        item = hashFunction(item);
        auto it = indexTable.find(item);
        if (it == indexTable.end())
        {
            return {};
        }
        int index = it->second;
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
        return path;
    }
    void addElement(string data)
    {
        if (firstPadding != -1)
        {
            nodes[firstPadding] = data;
            nodes[firstPadding] = hashFunction(nodes[firstPadding]);
            tree[0][firstPadding] = nodes[firstPadding];
            indexTable[nodes[firstPadding]] = firstPadding;
            int currentLevel = 0;
            int parentLevel = 1;
            int currentIndex = firstPadding;
            while (currentLevel < tree.size() - 1)
            {
                int siblingIndex = getSibling(currentIndex);
                int parentIndex = getParent(currentIndex);
                if (currentIndex % 2 == 0)
                {
                    tree[parentLevel][parentIndex] = hashFunction(tree[currentLevel][currentIndex] + tree[currentLevel][siblingIndex]);
                }
                else
                {
                    tree[parentLevel][parentIndex] = hashFunction(tree[currentLevel][siblingIndex] + tree[currentLevel][currentIndex]);
                }
                currentIndex = parentIndex;
                currentLevel += 1;
                parentLevel += 1;
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
};

void addElement(string array[], string data, int &p)
{
    array[p] = data;
    p++;
}

bool lookForElement(string array[], string data, int size)
{
    for (int i = 0; i < size; i++)
    {
        if (array[i] == data)
        {
            return true;
        }
    }
    return false;
}

int main()
{
    // to compare time taken
    clock_t start, end;
    double cpu_time_used;

    string array[N] = {""};
    int p = 0;
    vector<string> toAddElements(N);
    for (int i = 0; i < N; ++i)
    {
        toAddElements[i] = to_string(i + 1);
    }
    start = clock();
    MerkleTree merkle(toAddElements);
    end = clock();
    // merkle.printTree();
    printf("Time taken by the function: %ld cycles\n", end - start);

    start = clock();
    for (int i = 0; i < toAddElements.size(); i++)
    {
        addElement(array, toAddElements[i], p);
    }
    end = clock();
    printf("Time taken by the function: %ld cycles\n", end - start);

    // index of element to verify
    vector<int> toVerify = {11000, 12000, 13000, 14000, 15000, 1600, 17000, 18000, 19000, 20000};

    vector<string> path;
    for (int i = 0; i < toVerify.size(); i++)
    {
        path = merkle.getPath(toAddElements[toVerify[i]]);
        start = clock();
        merkle.verifyElement(toAddElements[toVerify[i]], path);
        end = clock();
        printf("Merkle Time taken by the function: %ld cycles\n", end - start);
    }

    for (int i = 0; i < toVerify.size(); i++)
    {
        start = clock();
        lookForElement(array, toAddElements[toVerify[i]], p);
        end = clock();
        printf("ArrayTime taken by the function: %ld cycles\n", end - start);
    }

    int oneMerkleElement = sizeof(merkle.tree[0][0]);
    int oneArrayElement = sizeof(array[0]);
    cout << "Array storage" << oneArrayElement * N << endl;
    int total = 0;
    for (int i = 0; i < merkle.tree.size(); i++)
    {
        total += merkle.tree[i].size() * oneMerkleElement;
    }
    cout << "Merkle tree storage " << total << endl;

    // element that is not there

    return 0;
}