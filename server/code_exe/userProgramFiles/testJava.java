import java.util.*;
class addNumbers{
    public int add(int num1,int num2){
        return num1;
    }
}
      public class testJava {

    public void testCode(){
        int[][] TestCases = {{1,2},{3,4},{5,-2}};
        int[] expected = {3, 7, 3};
        addNumbers myobj = new addNumbers();
        for(int i=0;i<TestCases.length;i++){
            int res = myobj.add(TestCases[i][0],TestCases[i][1]);
            if(res != expected[i]){
                System.out.println("CASE: "+TestCases[i][0]+", "+TestCases[i][1]);
                System.out.println("EXPECTED: "+expected[i]);
                System.out.println("RESULT: "+res);
                System.exit(0);
            }
        }
        System.out.println("True");
    }
    public static void main(String args[]){
        testJava t=new testJava();
        t.testCode();
    }
}