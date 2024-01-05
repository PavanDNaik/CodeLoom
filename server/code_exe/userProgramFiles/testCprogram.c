#include <stdio.h>
int add(int num1,int num2){
    return num1;
}
      int main()
{
    int testCases[3][2] = {{1, 2},{3, 4},{5, -2}};
    int expected[3] = {3, 7, 3};
    for(int i=0;i<3;i++)
    {
        int res = add(testCases[i][0],testCases[i][1]);
        if(res != expected[i])
        {
            printf("INPUT: %d, %d",testCases[i][0], testCases[i][1]);
            printf("  EXPECTED: %d",expected[i]);
            printf("  RESULT: %d",res);
            return 0;
        }
    }
      printf("True");
}