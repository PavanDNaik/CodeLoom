def longestSubstring(s):
        n = len(s)
        maxLength = 0
        charMap = {}
        left = 0
        
        for right in range(n):
            if s[right] not in charMap or charMap[s[right]] < left:
                charMap[s[right]] = right
                maxLength = max(maxLength, right - left + 1)
            else:
                left = charMap[s[right]] + 1
                charMap[s[right]] = right
        
        return maxLength
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