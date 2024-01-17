def intToRom(n):
    return "III"
    
testCases = [3,58,1994]
expected = ["III","LVIII","MCMXCIV"]
for i in range(len(testCases)):
    res = intToRom(testCases[i])
    if res != expected[i]:
        print("INPUT: ",testCases[i])
        print("EXPECTED: ",expected[i])
        print("RESULT: ",res)
        exit(0)
print("True")