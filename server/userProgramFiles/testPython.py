
testCases = ["abcabcbb", "bbbbb", "pwwkew"]
expected = [3,1,3]
for i in range(len(testCases)):
    res = longestSubstring(testCases[i])
    if res != expected[i]:
        print("INPUT: ",testCases[i])
        print("EXPECTED: ",expected[i])
        print("RESULT: ",res)
        exit(0)
print("True")