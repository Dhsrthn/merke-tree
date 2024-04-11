#include <bits/stdc++.h>
using namespace std;

int sampleBadHashFunction(string c)
{
    int hash = 0;
    for (int i = 0; i < c.size(); i++)
    {
        hash += c[i];
    }
    hash = hash % 256;
    return hash;
}

int main()
{
    bool running = true;
    cout << "Enter 'exit' to exit the program" << endl;
    while (running)
    {
        string c;
        cout << "Enter a string: " << endl;
        cin >> c;
        if (c == "exit")
        {
            running = false;
            break;
        }
        cout << "Hash: " << sampleBadHashFunction(c) << endl;
    }
}