#include <stdio.h>
int smallesEven(int n){
    return n%2?n*2:n;
}int main()
{
    int testCases[3] = {5,6,7};
    int expected[3] = {10,6,14};
    for(int i=0;i<3;i++)
    {
        int res = smallesEven(testCases[i]);
        if(res != expected[i])
        {
            printf("INPUT: %d, %d",testCases[i]);
            printf("  EXPECTED: %d",expected[i]);
            printf("  RESULT: %d",res);
            return 0;
        }
    }
      printf("True");
}