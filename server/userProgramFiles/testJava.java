class smallesEvenMul{
    public int smallesEven(int num){
        return (num%2==0)?num:num*2;
    }
}public class testJava {

    public void testCode(){
        int[] TestCases = {5,6,7};
        int[] expected = {10, 6, 14};
        smallesEvenMul myobj = new smallesEvenMul();
        for(int i=0;i<TestCases.length;i++){
            int res = myobj.smallesEven(TestCases[i]);
            if(res != expected[i]){
                System.out.println("CASE: "+TestCases[i]);
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