public class HelloWorld {
    public static void main(String[] args) {
        int arr[]={23,43,90,33,42};
        int l=arr.length;
        int num=23;
        for(int i=0;i<l;i++){
            if(arr[i]==num){
                System.out.print("found it in index ");
                System.out.println(i);
                return;
            }
        }
        System.out.print(num);
        System.out.println(" NOT Found");

    }
}