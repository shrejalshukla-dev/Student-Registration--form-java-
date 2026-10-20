import java.util.Scanner;

public class SumRecursion {

    static int sum(int n) {
        if (n == 1) {
            return 1;      // Base case
        }
        return n + sum(n - 1);   // Recursive call
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("Enter n: ");
        int n = sc.nextInt();

        System.out.println("Sum = " + sum(n));

        sc.close();
    }
}