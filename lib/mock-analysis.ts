import type { AnalysisResult } from "@/components/results-panel";

const MOCK_RESULTS: Record<string, AnalysisResult> = {
  java: {
    bugs: [
      {
        line: 5,
        severity: "error",
        message:
          'Array index out of bounds: loop condition uses `i <= numbers.length` instead of `i < numbers.length`, causing an ArrayIndexOutOfBoundsException.',
      },
      {
        line: 10,
        severity: "error",
        message:
          "Null pointer dereference: calling `.length()` on a null String reference will throw a NullPointerException.",
      },
      {
        line: 3,
        severity: "warning",
        message:
          "Hardcoded array: consider accepting input as a parameter for better reusability.",
      },
    ],
    explanation:
      "Your code has two critical bugs. First, the for-loop iterates one index too far because it uses <= instead of <, which means it tries to access an element beyond the array boundary. This will crash your program at runtime. Second, you set a String variable to null and then try to call a method on it, which causes a NullPointerException. Always check for null before calling methods on objects that could be uninitialized.",
    optimizedCode: `public class Main {
    public static void main(String[] args) {
        int[] numbers = {1, 2, 3, 4, 5};
        int sum = 0;
        for (int i = 0; i < numbers.length; i++) {
            sum += numbers[i];
        }
        System.out.println("Sum: " + sum);

        String name = null;
        if (name != null) {
            System.out.println(name.length());
        } else {
            System.out.println("Name is null");
        }
    }
}`,
  },
  python: {
    bugs: [
      {
        line: 3,
        severity: "error",
        message:
          "IndexError: `range(len(numbers) + 1)` iterates one past the last valid index, causing an IndexError on the final iteration.",
      },
      {
        line: 11,
        severity: "error",
        message:
          'KeyError: accessing `my_dict["missing_key"]` when the key does not exist will raise a KeyError.',
      },
      {
        line: 4,
        severity: "warning",
        message:
          "Division by zero risk: if an empty list is passed, `len(numbers)` will be 0 and division will fail.",
      },
    ],
    explanation:
      "There are two main issues. The range in your loop goes one step too far because of the + 1, causing Python to try accessing an index that doesn't exist. Additionally, you're trying to access a dictionary key that was never set, which raises a KeyError. A safe approach is to use `dict.get()` with a default value. Also, always guard against dividing by zero when computing averages.",
    optimizedCode: `def calculate_average(numbers):
    if not numbers:
        return 0
    total = 0
    for i in range(len(numbers)):
        total += numbers[i]
    return total / len(numbers)

result = calculate_average([10, 20, 30])
print(f"Average: {result}")

my_dict = {"key": "value"}
print(my_dict.get("missing_key", "default_value"))`,
  },
  cpp: {
    bugs: [
      {
        line: 8,
        severity: "error",
        message:
          "Out-of-bounds access: loop condition `i <= nums.size()` reads one past the end of the vector, causing undefined behavior.",
      },
      {
        line: 14,
        severity: "error",
        message:
          "Null pointer dereference: dereferencing `nullptr` causes a segmentation fault and undefined behavior.",
      },
      {
        line: 8,
        severity: "warning",
        message:
          "Type mismatch: comparing `int i` with `nums.size()` (which returns `size_t`) may produce a signed/unsigned comparison warning.",
      },
    ],
    explanation:
      "Your C++ code has two critical problems. The for-loop goes one element past the end of the vector because of the <= operator, which leads to undefined behavior and potential crashes. Additionally, you're dereferencing a null pointer, which causes a segmentation fault. In C++, always use < for loop bounds and check pointers before dereferencing them. Using `size_t` instead of `int` also avoids signed/unsigned mismatch warnings.",
    optimizedCode: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> nums = {1, 2, 3, 4, 5};
    int sum = 0;
    for (size_t i = 0; i < nums.size(); i++) {
        sum += nums[i];
    }
    cout << "Sum: " << sum << endl;

    int* ptr = nullptr;
    if (ptr != nullptr) {
        cout << *ptr << endl;
    } else {
        cout << "Pointer is null" << endl;
    }
    return 0;
}`,
  },
};

export function getMockAnalysis(language: string): Promise<AnalysisResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_RESULTS[language] || MOCK_RESULTS.java);
    }, 1800);
  });
}
