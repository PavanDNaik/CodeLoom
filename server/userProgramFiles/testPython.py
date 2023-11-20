
testCases = [[1, 2],[3, 4], [5, -2]]
n = len(testCases)
expected = [3, 7, 3]
for i in range(n):
    res = addTwoNumers(testCases[i][0],testCases[i][1])
    if res != expected[i]:
        print("INPUT: ",testCases[i][0],",", testCases[i][1])
        print("EXPECTED: ",expected[i])
        print("RESULT: ",res)
        exit(0)
print(True)