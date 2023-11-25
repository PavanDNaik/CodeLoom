def smallesEven(n):
    if n%2==0:
        return n
    else:
        return n*2
testCases = [5,6,7]
expected = [10,6,14]
for i in range(len(testCases)):
    res = smallesEven(testCases[i])
    if res != expected[i]:
        print("INPUT: ",testCases[i])
        print("EXPECTED: ",expected[i])
        print("RESULT: ",res)
        exit(0)
print("True")