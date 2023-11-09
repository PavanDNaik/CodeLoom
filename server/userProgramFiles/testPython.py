def longestSubstring(s):
    left = 0
    seen = {}
    output = 0
    
    for right, curr in enumerate(s):
        if curr in seen:
            left = max(left, seen[curr] + 1)
        output = max(output, right - left + 1)
        seen[curr] = right

    return output
testCases = ["abcabcbb", "bbbbb", "pwwkew"]
expected = [3,1,3]
for i in range(len(testCases)):
    res = longestSubstring(testCases[i])
    if res != expected[i]:
        print("INPUT: ",testCases[i])
        print("EXPECTED: ",expected[i])
        print("RESULT: ",res)
        exit(0)
print("true")