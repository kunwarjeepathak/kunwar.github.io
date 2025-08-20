declare module 'mermaid';
export interface SubItemData {
question: string;
answerMd: string;
}

export interface QACardData {
category: string;
title: string;
subItems: SubItemData[];
}

const data: QACardData[] = [
{
category: 'java',
title: 'Multithreading',
subItems: [
{
      question: 'Explain Java Thread Lifecycle in depth',
      answerMd: `
# Detailed Java Thread Lifecycle

## 👥 Core States & Their Roles

| State         | Description                                                   |
|---------------|---------------------------------------------------------------|
| New           | Thread instance created but \`start()\` not invoked           |
| Runnable      | Ready to run; queued for CPU scheduling                       |
| Running       | Actively executing on a CPU core                              |
| Blocked       | Waiting to acquire a monitor lock                             |
| Waiting       | Waiting indefinitely (\`wait()\`, \`join()\`, \`park()\`)     |
| Timed Waiting | Waiting with timeout (\`sleep()\`, \`wait(timeout)\`, \`join(timeout)\`) |
| Terminated    | Completed execution or stopped due to an uncaught exception   |

---

## 🗂️ State Details & Actions

1. **New**  
   - Occurs when \`new Thread()\` is called.  
   - No system resources allocated until \`start()\`.

2. **Runnable**  
   - After \`start()\`, thread is eligible; OS scheduler may dispatch it.  
   - Represents both ready and running states at JVM level.

3. **Running**  
   - Thread is executing instructions on a CPU.  
   - Moves back to Runnable when time slice ends or on \`yield()\`.

4. **Blocked**  
   - Attempting to enter a synchronized block held by another thread.  
   - Transitions back to Runnable once the lock is released.

5. **Waiting**  
   - Invoked via \`Object.wait()\`, \`Thread.join()\` without timeout, or \`LockSupport.park()\`.  
   - Returns to Runnable on \`notify()/notifyAll()\` or thread interruption.

6. **Timed Waiting**  
   - Methods: \`sleep()\`, \`wait(timeout)\`, \`join(timeout)\`, \`parkNanos()\`.  
   - Automatically returns to Runnable after timeout expiry.

7. **Terminated**  
   - Occurs when \`run()\` completes normally or an uncaught exception is thrown.  
   - Thread cannot be restarted once terminated.

---

## 🔄 State Transitions

| From          | To             | Trigger                                         |
|---------------|----------------|-------------------------------------------------|
| New           | Runnable       | \`start()\`                                     |
| Runnable      | Running        | OS scheduler dispatch                           |
| Running       | Runnable       | Time slice end or \`yield()\`                    |
| Running       | Blocked        | Contention on a synchronized lock               |
| Running       | Waiting        | \`wait()\`, \`join()\`, \`park()\`               |
| Running       | Timed Waiting  | \`sleep()\`, \`wait(timeout)\`, \`join(timeout)\` |
| Blocked       | Runnable       | Lock becomes available                          |
| Waiting       | Runnable       | \`notify()/notifyAll()\` or interrupt            |
| Timed Waiting | Runnable       | Timeout expiration                              |
| Running       | Terminated     | \`run()\` finishes or uncaught exception       |

---

## 🗺️ Lifecycle Diagram (ASCII)

\`\`\`plaintext
    New
     |
     v
  Runnable <--> Running --> Terminated
      |           |
      |           +--> Blocked --> Runnable
      |           |
      |           +--> Waiting --> Runnable
      |           |
      |           +--> Timed Waiting --> Runnable
\`\`\`

---

## 🚀 Practical Considerations & Pitfalls

| Aspect            | Pitfall                                            | Best Practice                                     |
|-------------------|----------------------------------------------------|---------------------------------------------------|
| Thread.start()    | IllegalThreadStateException if started twice       | Use a fresh Thread instance for each start        |
| Synchronization   | Deadlocks, contention                             | Minimize lock scope; apply consistent lock ordering |
| wait/notify       | Missed notifications, spurious wakeups             | Always call \`wait()\` inside a loop checking condition |
| sleep()           | InterruptedException                               | Catch and restore interrupt status                |
| join()            | Potential indefinite wait                          | Use timed join and handle \`InterruptedException\` |
| Thread priorities | Platform-dependent, may be ignored                 | Avoid relying on priorities for correctness       |

---

## 💻 Example Code

\`\`\`java
public class ThreadLifecycleDemo {
    public static void main(String[] args) throws InterruptedException {
        Thread t = new Thread(() -> {
            System.out.println("State: " + Thread.currentThread().getState());
            try {
                Thread.sleep(100);
                synchronized (ThreadLifecycleDemo.class) {
                    ThreadLifecycleDemo.class.wait(50);
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
            System.out.println("Completed");
        });

        System.out.println("State before start: " + t.getState()); // NEW
        t.start();
        System.out.println("State after start: " + t.getState()); // RUNNABLE/RUNNING
        t.join();
        System.out.println("State after join: " + t.getState()); // TERMINATED
    }
}
\`\`\`

---

## 🚀 Beyond the Basics

- Thread pools (\`ExecutorService\`) for efficient thread reuse  
- Fork/Join framework for divide-and-conquer parallelism  
- Virtual threads (Project Loom) for lightweight, scalable concurrency  
- ThreadLocal for thread-confined state without synchronization  
- Reactive, non-blocking paradigms (\`CompletableFuture\`, reactive streams\`)
`
    },
// Find the “Multithreading” topic in your src/qa-data.ts and append this entry
{
question: "Why Executor Framework came into picture? What problem was there in JDK 4 which it solved?",
answerMd: `
### Why Executor Framework Came Into Picture

#### 🚫 Problems in JDK 4 (Before Executor)
- Manual thread creation: \`new Thread(r).start()\` used everywhere
- No pooling: Threads were not reused, causing overhead
- Complex coordination: Developers had to manage queues & lifecycle manually
- Error handling issues: No standard way to capture task exceptions
- No tuning or monitoring: Threads couldn’t be controlled or inspected easily

#### ✅ What Executor Framework Solved (JDK 5+)
It decouples task submission from execution, allowing better scalability and control.

| Pain Point            | Executor Solution                         |
|-----------------------|-------------------------------------------|
| Thread explosion      | Thread reuse via pooling                  |
| Manual thread control | ExecutorService abstracts lifecycle       |
| Complex shutdown      | \`shutdown()\`, \`awaitTermination()\`     |
| No queuing            | Built-in task queues (e.g. BlockingQueue) |
| No error visibility   | Future captures exceptions                |
| No scalability        | Flexible pool sizing & scheduling         |

#### 🎯 Code Comparison

~~~java
// Before (JDK 4):
Thread t = new Thread(() -> {
// Task logic
});
t.start();

// After (JDK 5+):
ExecutorService pool = Executors.newFixedThreadPool(4);
pool.submit(() -> {
// Task logic
});
pool.shutdown();
~~~

### Why CompletableFuture Came Into Picture

#### 🚫 Limitations in Executor Framework
- Blocking with Future: Needed \`.get()\` to retrieve result (synchronously)
- No fluent chaining: Couldn’t link multiple tasks together
- Poor error handling: Had to use try/catch blocks externally
- No pipeline creation: No way to compose multiple async stages

#### ✅ How CompletableFuture Solves It
Introduced in Java 8, CompletableFuture lets you build non-blocking asynchronous pipelines with fluent APIs. It’s built on top of the Executor framework—but adds composition and exception handling.

| Component       | Purpose                          | Example                                               |
|-----------------|----------------------------------|-------------------------------------------------------|
| supplyAsync()   | Start task that returns a result | \`CompletableFuture.supplyAsync(() -> getData())\`   |
| thenApply()     | Transform result                 | \`.thenApply(data => process(data))\`                |
| thenCompose()   | Flat-map chained async calls     | \`.thenCompose(this::fetchMore)\`                    |
| exceptionally() | Graceful error handling          | \`.exceptionally(ex => fallback())\`                 |
| allOf()/anyOf() | Combine multiple futures         | \`CompletableFuture.allOf(f1, f2)\`                  |

#### 📈 Async Pipeline Flow

~~~text
[start]
|
v
[supplyAsync()] ---> [thenApply()] ---> [thenCompose()]
|                     |                     |
v                     v                     v
[exceptionally()] --> [handle()] --> [complete()]
~~~

#### 🔧 Sample Comparison

~~~java
// Executor + Future:
Future<Integer> f = pool.submit(() -> fetch());
int result = f.get(); // blocks

// CompletableFuture:
CompletableFuture.supplyAsync(() -> fetch())
.thenApply(data -> transform(data))
.exceptionally(ex -> fallback())
.thenAccept(System.out::println);
~~~
`
},
{
question: 'What’s new in CompletableFuture?',
answerMd: `
CompletableFuture in Java 8+ supports building async pipelines: \`thenApplyAsync\`, \`thenCombine\`, \`exceptionally\`, \`allOf\`/ \`anyOf\`, etc.
`
},
{
question: 'How do you handle thread safety?',
answerMd: `
Use synchronized blocks, locks (\`ReentrantLock\`), concurrent collections, or atomic classes (\`AtomicInteger\`, \`AtomicReference\`) to coordinate access.
`
}
]
}, {
  category: 'java',
  title: 'Java 17: Why These Features Came into the Market',
  subItems: [
    {
  question: 'What are the main features of Java 17 and why were they introduced?',
  answerMd: `
# Java 17: Why These Features Came into the Market

Imagine you work in a fast-moving software team in Bengaluru. Over time, you hit these pain points:
- Developers accidentally use hidden JDK APIs and break upgrades.
- Simple data classes need too much boilerplate.
- Switch statements scatter \`instanceof\` checks and casts everywhere.
- \`java.util.Random\` feels dated and sometimes biased.
- Calling native C code via JNI is verbose and error-prone.
- Heavy numeric loops run too slowly.
- Floating-point results differ slightly across machines, causing subtle bugs.

To address these, Java 17 introduced seven key improvements.

---

## 🗺️ ASCII Timeline & Feature Map

\`\`\`
Java 8 (2014) ---> Java 9 (2017) ---> Java 11 (2018) ---> Java 17 (2021 LTS)
                                                    |
                                                    v
                +---------------------------------------------+
                |                 Java 17                    |
                +---------------------------------------------+
                | JEP 396: Strong Encapsulation               |
                | JEP 409: Sealed Classes & Interfaces        |
                | JEP 406: Pattern Matching for switch (prev) |
                | JEP 356: Enhanced Pseudo-Random Generators   |
                | JEP 412: Foreign Function & Memory API      |
                | JEP 418: Vector API                         |
                | JEP 398: Always-Strict Floating-Point Rules |
                +---------------------------------------------+
\`\`\`

---

## 1. Strong Encapsulation (JEP 396)

Why:
- Teams accidentally relied on internal JDK classes.
- Upgrades broke code without warning.

What:
- All non-exported packages in modules are now sealed.
- You only see what you explicitly export in \`module-info.java\`.

\`\`\`java
// module-info.java
module my.app {
    requires java.base;   // only java.base is visible
    exports com.my.app.api;
}
\`\`\`

---

## 2. Sealed Classes & Interfaces (JEP 409)

Why:
- Public type hierarchies ballooned uncontrolled, risking invariants.

What:
- Let library authors list exactly which subclasses or implementors are allowed.

\`\`\`java
public sealed interface Shape permits Circle, Rectangle {
    double area();
}
public final class Circle implements Shape { /*…*/ }
public final class Rectangle implements Shape { /*…*/ }
\`\`\`

---

## 3. Pattern Matching for switch (JEP 406, Preview)

Why:
- \`instanceof\` + cast combos cluttered switch statements.

What:
- Switch can now test type and bind a variable in one step.

\`\`\`java
static String describe(Object o) {
    return switch (o) {
        case Integer i -> "Integer: " + i;
        case String  s -> "String: "  + s;
        default        -> "Other";
    };
}
\`\`\`

---

## 4. Enhanced PRNG API (JEP 356)

Why:
- \`java.util.Random\` algorithms were dated and inconsistent.

What:
- New \`RandomGenerator\` factory offers modern, high-quality options (Xoroshiro, L64X128Mix, etc.).

\`\`\`java
var rng = RandomGenerator.of("L64X128MixRandom");
int roll = rng.nextInt(1, 7);  // 1..6
\`\`\`

---

## 5. Foreign Function & Memory API (JEP 412, Incubator)

Why:
- JNI is verbose and easy to mismanage, leading to memory leaks.

What:
- Safe, high-performance native calls via \`MemorySegment\` and \`Linker\`, no JNI boilerplate.

\`\`\`java
// pseudo-code for calling C's printf
var linker = CLinker.systemCLinker();
var lookup = SymbolLookup.loaderLookup();
var printf = linker.downcallHandle(
    lookup.lookup("printf").get(),
    MethodType.methodType(int.class, MemoryAddress.class),
    FunctionDescriptor.of(CLinker.C_INT, CLinker.C_POINTER)
);
// later: printf.invokeExact(addrOf("Hello, world!"));
\`\`\`

---

## 6. Vector API (JEP 418, Incubator)

Why:
- Numeric loops (image processing, ML) need SIMD speedups.

What:
- Expose hardware-accelerated vector lanes in pure Java.

\`\`\`java
VectorSpecies<Float> SPECIES = FloatVector.SPECIES_PREFERRED;
var v1 = FloatVector.fromArray(SPECIES, a, 0);
var v2 = FloatVector.fromArray(SPECIES, b, 0);
v1.add(v2).intoArray(result, 0);
\`\`\`

---

## 7. Always-Strict Floating-Point Semantics (JEP 398)

Why:
- Tiny FP discrepancies on different platforms led to hard-to-find bugs.

What:
- Enforce IEEE-754 strict mode by default so results match everywhere.

---

With these seven enhancements, Java 17 makes your code safer, more concise, and faster—helping teams across India and beyond upgrade with confidence.
`
    },{
  question: 'What are the main features of Java 8 and why were they introduced?',
  answerMd: `
# Java 8: Why These Features Came into the Market

Imagine you’re maintaining a sprawling enterprise system across Bangalore and beyond. Before Java 8, you struggled with:
- Anonymous inner classes everywhere for callbacks, leading to verbose boilerplate.  
- Manual loops for every collection transformation, with no easy parallelism.  
- Interfaces you couldn’t evolve without breaking existing implementations.  
- java.util.Date and Calendar APIs that were mutable, timezone-confusing, and bug-prone.  
- NullPointerExceptions lurking at each unchecked reference.  
- Clumsy asynchronous workflows built atop threads, Future callbacks or third-party libs.  
- Embedding JavaScript via the slow Rhino engine.

To tackle these pain points, Java 8 shipped eight foundational improvements.

---

## 🗺️ ASCII Timeline & Feature Map

\`\`\`
Java 6 (2011) ---> Java 7 (2011) ---> Java 8 (2014)
                                      |
                                      v
         +------------------------------------------------+
         |                   Java 8                      |
         +------------------------------------------------+
         | 1. Lambda & Functional Interfaces             |
         | 2. Method References                          |
         | 3. Stream API                                 |
         | 4. Default & Static Methods in Interfaces     |
         | 5. New Date/Time API (JSR-310)                |
         | 6. Optional<T>                                |
         | 7. CompletableFuture & Parallel Streams        |
         | 8. Nashorn JavaScript Engine                  |
         +------------------------------------------------+
\`\`\`

---

## 1. Lambda & Functional Interfaces

Why  
- Anonymous inner classes for single-method callbacks clutter code.  
- Teams wanted to treat behavior as first-class data.

What  
- Introduce \`()->\` syntax for inline functions.  
- Use \`@FunctionalInterface\` to mark interfaces with exactly one abstract method.

\`\`\`java
Runnable r  = () -> System.out.println("Hello, Java 8!");
Function<String,Integer> parse = s -> Integer.parseInt(s);
\`\`\`

---

## 2. Method References

Why  
- Even simple lambdas like \`x -> x.method()\` felt verbose.

What  
- \`ClassName::staticMethod\`, \`instance::instanceMethod\`, \`Type::new\` let you point directly at methods or constructors.

\`\`\`java
List<String> names = List.of("Alice", "Bob", "Carol");
names.forEach(System.out::println);
\`\`\`

---

## 3. Stream API

Why  
- Manual loops for filtering, mapping, reducing data clutter business logic.  
- Parallelism required manual ForkJoin boilerplate.

What  
- Fluent \`.stream()\` pipelines with \`.filter()\`, \`.map()\`, \`.reduce()\`.  
- One-liner \`.parallelStream()\` to leverage multicore cores.

\`\`\`java
List<Integer> evens = numbers.stream()
    .filter(n -> n % 2 == 0)
    .collect(Collectors.toList());
\`\`\`

---

## 4. Default & Static Methods in Interfaces

Why  
- Adding a method to an interface broke every existing implementation.

What  
- \`default\` methods supply an in-interface implementation.  
- \`static\` methods bundle utilities alongside the interface.

\`\`\`java
public interface Logger {
    default void log(String msg) { System.out.println(msg); }
    static Logger getGlobal() { return new ConsoleLogger(); }
}
\`\`\`

---

## 5. New Date/Time API (JSR-310)

Why  
- \`java.util.Date\` and \`Calendar\` were mutable, poorly designed, and thread-unsafe.

What  
- \`java.time\` package with immutable types: \`LocalDate\`, \`LocalDateTime\`, \`Instant\`, \`Duration\`, \`Period\`.

\`\`\`java
LocalDate today     = LocalDate.now();
LocalDate birthday  = LocalDate.of(1990, Month.JANUARY, 1);
Period    age       = Period.between(birthday, today);
\`\`\`

---

## 6. Optional<T>

Why  
- NullPointerExceptions everywhere; no expressive way to model “maybe missing” values.

What  
- \`Optional<T>\` wraps a value that may be absent.  
- Methods like \`.ifPresent()\`, \`.orElse()\` enforce explicit unwrapping.

\`\`\`java
Optional<String> nameOpt = Optional.ofNullable(findUserName());
nameOpt.ifPresent(n -> System.out.println("User: " + n));
\`\`\`

---

## 7. CompletableFuture & Parallel Streams

Why  
- \`Future\` and callbacks led to nested, hard-to-compose logic.  
- Parallel loops still required explicit ForkJoin coding.

What  
- \`CompletableFuture\` for non-blocking, composable async flows.  
- Streams gain \`.parallel()\`, powered by the common ForkJoinPool.

\`\`\`java
CompletableFuture.supplyAsync(() -> fetchData())
    .thenApplyAsync(this::process)
    .thenAcceptAsync(System.out::println);
\`\`\`

---

## 8. Nashorn JavaScript Engine

Why  
- Server-side JS embedding used the slow, outdated Rhino engine.

What  
- Nashorn delivers a high-performance ECMAScript 5.1 engine on the JVM.

\`\`\`java
ScriptEngine engine = new ScriptEngineManager()
    .getEngineByName("nashorn");
engine.eval("print('Hello from Nashorn!');");
\`\`\`

---

With these eight breakthroughs, Java 8 transformed the language into a modern, expressive, and parallel-ready platform—helping teams across India and the world write cleaner, safer, and faster code.
`
}
  ]
},
{
category: 'java',
title: 'String Based Questions',
subItems: [
// To add under your desired Topic’s `subQuestions` array in src/qa-data.ts:
{
question: "How do you print all words that appear more than once using only basic for loops (no maps/collections)?",
answerMd: `
### Explanation

We detect duplicates by:

1. Normalizing the input (convert to lowercase).
2. Splitting into words with \`String#split("\\\\s+")\`.
3. For each word at index *i*:
- Skip it if it already appeared in any index \< *i* (to avoid repeats).
- Count how many times it occurs in the full array.
- If count > 1, print it.

This uses only primitive arrays and loops—no Maps or Collections.

---

### Code

~~~java
public class SimpleRepeatFinder {
public static void main(String[] args) {
String input = "hi hello hello hi i am doing fine";
// Normalize and split by whitespace
        String[] words = input.toLowerCase().split("\\s+");

System.out.println("Repeated words:");

for (int i = 0; i < words.length; i++) {
// Skip if this word already appeared before index i
            boolean alreadySeen = false;
for (int k = 0; k < i; k++) {
if (words[i].equals(words[k])) {
alreadySeen = true;
break;
}
}
if (alreadySeen) continue;

// Count occurrences of words[i]
            int count = 0;
for (int j = 0; j < words.length; j++) {
if (words[i].equals(words[j])) {
count++;
}
}

if (count > 1) {
System.out.println(words[i]);
}
}
}
}
~~~

---

### Output

~~~text
Repeated words:
hi
hello
~~~
`
},// Add this under the “String Based Questions” card’s subItems array
{
question: "How do you print all words that appear more than once using Java Streams?",
answerMd: `
### Explanation

We take the input string, split it into words, normalize to lowercase, then use Streams to:

1. Group words and count occurrences with \`Collectors.groupingBy(..., Collectors.counting())\`.
2. Filter entries whose count is greater than 1.
3. Collect the result into a Map of duplicates.

---

### Code

\`\`\`java
import java.util.*;
import java.util.function.Function;
import java.util.stream.*;

public class DuplicateWordCounter {
public static void main(String[] args) {
String text = "hi hello hello hi i am doing fine";

Map<String, Long> duplicates = Arrays.stream(text.split("\\\\s+"))
.map(String::toLowerCase)
.collect(Collectors.groupingBy(
Function.identity(),
Collectors.counting()
))
.entrySet().stream()
.filter(e -> e.getValue() > 1)
.collect(Collectors.toMap(
Map.Entry::getKey,
Map.Entry::getValue
));

System.out.println("Words occurring more than once: " + duplicates);
}
}
\`\`\`

---

### Output

\`\`\`
Words occurring more than once: {hi=2, hello=2}
\`\`\`
`
},// Add this under the “String Based Questions” card’s subItems array

{
question: "How do you print all circular substrings of a word (e.g. “abc” → a, ab, bc, ca, bca, cab) using simple loops and Java Streams?",
answerMd: `
### Explanation

We treat the input as a circular string by appending it to itself.
Then for each start index \(i\) in \[0…N-1\] and each length \(len\) in \[1…N\], we extract the substring of length \(len\) starting at \(i\).
Using a Set removes duplicates and preserves insertion order.

---

### Simple For Loops

\`\`\`java
import java.util.*;

public class CircularSubstrings {
public static void main(String[] args) {
String s = "abc";
int n = s.length();
String circular = s + s;              // "abcabc"
        Set<String> results = new LinkedHashSet<>();

for (int i = 0; i < n; i++) {
for (int len = 1; len <= n; len++) {
results.add(circular.substring(i, i + len));
}
}

// Print in insertion order
        results.forEach(System.out::println);
}
}
\`\`\`

---

### Java Streams

\`\`\`java
import java.util.*;
import java.util.stream.*;

public class CircularSubstringsStream {
public static void main(String[] args) {
String s = "abc";
int n = s.length();
String circular = s + s;

List<String> results = IntStream.range(0, n)
.boxed()
.flatMap(i -> IntStream.rangeClosed(1, n)
.mapToObj(len -> circular.substring(i, i + len)))
.distinct()
.collect(Collectors.toList());

results.forEach(System.out::println);
}
}
\`\`\`

---

### Output

\`\`\`
a
ab
abc
b
bc
bca
c
ca
cab
\`\`\`
`
},// To add under your desired Topic’s `subItems` array in src/qa-data.ts:
{
question: "How do you find the 2nd largest number in an array using simple loops and Java Streams?",
answerMd: `

### Explanation

We want the second highest distinct value in the array.

---

### Simple For Loops

\`\`\`java
public class SecondLargest {
public static int findSecondLargest(int[] arr) {
if (arr == null || arr.length < 2) {
throw new IllegalArgumentException("Array must contain at least two elements");
}
int first = Integer.MIN_VALUE;
int second = Integer.MIN_VALUE;
for (int num : arr) {
if (num > first) {
second = first;
first = num;
} else if (num > second && num < first) {
second = num;
}
}
if (second == Integer.MIN_VALUE) {
throw new NoSuchElementException("No second largest element");
}
return second;
}

public static void main(String[] args) {
int[] arr = {5, 1, 4, 2, 3};
System.out.println(findSecondLargest(arr)); // 4
    }
}
\`\`\`

---

### Java Streams

\`\`\`java
import java.util.*;
import java.util.stream.*;

public class SecondLargestStream {
public static int findSecondLargest(int[] arr) {
return Arrays.stream(arr)
.distinct()
.boxed()
.sorted(Comparator.reverseOrder())
.skip(1)
.findFirst()
.orElseThrow(() -> new NoSuchElementException("No second largest element"));
}

public static void main(String[] args) {
int[] arr = {5, 1, 4, 2, 3};
System.out.println(findSecondLargest(arr)); // 4
    }
}
\`\`\`

---

### Complexity

- Simple loops: O(n) time, O(1) extra space
- Streams: O(n log n) time due to sorting, extra space for boxing and distinct
`
},// To add under your desired Topic’s `subItems` array in src/qa-data.ts:
{
question: "How do you find the next immediate bigger number by reordering digits (e.g. i/p: 1234 → o/p: 1243) using simple loops and Java Streams?",
answerMd: `

### Explanation

We want the next lexicographical permutation of the digits.
1. Scan from right to left to find the first index \`i\` where \`digits[i] < digits[i+1]\` (the pivot).
2. Scan from the end to find the smallest digit greater than \`digits[i]\`, call its index \`j\`.
3. Swap \`digits[i]\` and \`digits[j]\`.
4. Reverse the subarray to the right of index \`i\` to get the next permutation.

---

### Simple For Loops

\`\`\`java
import java.util.Arrays;

public class NextPermutation {
public static int[] nextBigger(int[] arr) {
int n = arr.length;
// 1. Find pivot
        int i = n - 2;
while (i >= 0 && arr[i] >= arr[i + 1]) {
i--;
}
if (i < 0) {
// Highest permutation; no bigger number
            return arr;
}
// 2. Find rightmost successor
        int j = n - 1;
while (arr[j] <= arr[i]) {
j--;
}
// 3. Swap pivot with successor
        swap(arr, i, j);
// 4. Reverse suffix
        reverse(arr, i + 1, n - 1);
return arr;
}

private static void swap(int[] a, int i, int j) {
int t = a[i];
a[i] = a[j];
a[j] = t;
}

private static void reverse(int[] a, int lo, int hi) {
while (lo < hi) {
swap(a, lo++, hi--);
}
}

public static void main(String[] args) {
int[] digits = {1, 2, 3, 4};
int[] next = nextBigger(digits);
System.out.println(Arrays.toString(next)); // [1, 2, 4, 3]
    }
}
\`\`\`

---

### Java Streams (Generate & Filter)

Here we generate all permutations via recursion in a Stream, then pick the smallest one greater than the input.

\`\`\`java
import java.util.Comparator;
import java.util.stream.*;

public class NextPermutationStream {
// Generate all permutations of s as Stream<String>
    static Stream<String> permutations(String s) {
if (s.isEmpty()) {
return Stream.of("");
}
return IntStream.range(0, s.length())
.boxed()
.flatMap(i -> {
char ch = s.charAt(i);
String rem = s.substring(0, i) + s.substring(i + 1);
return permutations(rem)
.map(p -> ch + p);
});
}

public static String nextBigger(String s) {
return permutations(s)
.distinct()
.filter(p -> p.compareTo(s) > 0)
.min(Comparator.naturalOrder())
.orElse("No bigger permutation");
}

public static void main(String[] args) {
String input = "1234";
String next = nextBigger(input);
System.out.println(next); // 1243
    }
}
\`\`\`

---

### Example Output

\`\`\`
[1, 2, 4, 3]
1243
\`\`\`
`
},// To add under your desired Topic’s `subItems` array in src/qa-data.ts:
{
question: "Given a String \"Kunwar jee Pathak\", print output as \"Kunwr j Pthk\" by removing all characters that occur more than once (spaces preserved).",
answerMd: `

### Explanation

We want to remove every character (except spaces) that appears more than once in the entire string.
1. First pass: count frequencies of non-space characters.
2. Second pass: build the result by including a character if it is a space or its frequency is exactly one.

---

### Simple For Loops

\`\`\`java
import java.util.*;

public class UniqueCharFilter {
public static String removeDuplicates(String input) {
// 1. Count frequencies (ignore spaces)
        Map<Character, Integer> freq = new HashMap<>();
for (char c : input.toCharArray()) {
if (c != ' ') {
freq.put(c, freq.getOrDefault(c, 0) + 1);
}
}

// 2. Build output, keeping spaces and chars with freq == 1
        StringBuilder sb = new StringBuilder();
for (char c : input.toCharArray()) {
if (c == ' ' || freq.getOrDefault(c, 0) == 1) {
sb.append(c);
}
}
return sb.toString();
}

public static void main(String[] args) {
String s = "Kunwar jee Pathak";
System.out.println(removeDuplicates(s));  // Kunwr j Pthk
    }
}
\`\`\`

---

### Java Streams

\`\`\`java
import java.util.*;
import java.util.function.Function;
import java.util.stream.*;

public class UniqueCharFilterStream {
public static String removeDuplicates(String input) {
// 1. Build frequency map of non-space chars
        Map<Integer, Long> freq = input.chars()
.filter(ch -> ch != ' ')
.boxed()
.collect(Collectors.groupingBy(
Function.identity(),
Collectors.counting()
));

// 2. Reconstruct string, keeping spaces or chars with freq == 1
        return input.chars()
.filter(ch -> ch == ' ' || freq.getOrDefault(ch, 0L) == 1L)
.mapToObj(c -> String.valueOf((char)c))
.collect(Collectors.joining());
}

public static void main(String[] args) {
String s = "Kunwar jee Pathak";
System.out.println(removeDuplicates(s));  // Kunwr j Pthk
    }
}
\`\`\`

---

### Output

\`\`\`
Kunwr j Pthk
\`\`\`
`
},
{
question: 'What’s the difference between StringBuilder and StringBuffer?',
answerMd: `
StringBuffer is synchronized (thread-safe) but slower. StringBuilder is unsynchronized and faster for single-thread use.
`
},
{
question: 'How do you reverse a String?',
answerMd: `
Use \`new StringBuilder(str).reverse().toString()\` or write a loop swapping characters in a \`char[]\`.
`
}
]
},// Add this as the third card in your src/qa-data.ts

{
category: 'java',
title: 'Java Streams',
subItems: [
{
question: 'How do you filter, map, and collect elements from a List using Streams?',
answerMd: `
### Explanation

We start from a List, convert it to a Stream, then apply:
1. \`filter\` to drop unwanted elements.
2. \`map\` to transform each element.
3. \`collect\` to gather the results back into a new List.

---

### Code

\`\`\`java
import java.util.*;
import java.util.stream.*;

public class FilterMapCollect {
public static void main(String[] args) {
List<String> names = Arrays.asList("Alice", "Bob", "Charlie", "David");

List<String> result = names.stream()
.filter(s -> s.length() <= 4)       // keep names of length ≤ 4
            .map(String::toUpperCase)           // uppercase each name
            .collect(Collectors.toList());      // collect into a List

System.out.println(result);          // [ALICE, BOB]
    }
}
\`\`\`

---

### Output

\`\`\`
[ALICE, BOB]
\`\`\`
`
},
{
question: 'How do you flatMap a List of Lists into a single Stream?',
answerMd: `
### Explanation

A nested List (List<List<T>>) can be flattened by:
1. Calling \`stream()\` on the outer List.
2. \`flatMap\` each inner List’s stream into one continuous Stream.
3. Continue processing or collect.

---

### Code

\`\`\`java
import java.util.*;
import java.util.stream.*;

public class FlatMapExample {
public static void main(String[] args) {
List<List<Integer>> matrix = List.of(
List.of(1, 2),
List.of(3, 4, 5),
List.of(6)
);

List<Integer> flat = matrix.stream()
.flatMap(Collection::stream)        // flatten nested lists
            .collect(Collectors.toList());

System.out.println(flat);            // [1, 2, 3, 4, 5, 6]
    }
}
\`\`\`

---

### Output

\`\`\`
[1, 2, 3, 4, 5, 6]
\`\`\`
`
},
{
question: 'How do you group elements by a property using \`Collectors.groupingBy\`?',
answerMd: `
### Explanation

\`groupingBy\` partitions elements into a Map where:
- Key = result of a classifier function.
- Value = List (or another downstream collection) of elements sharing that key.

---

### Code

\`\`\`java
import java.util.*;
import java.util.stream.*;

public class GroupingByExample {
public static void main(String[] args) {
List<String> words = List.of("apple", "ant", "banana", "bat", "carrot");

Map<Character, List<String>> byInitial = words.stream()
.collect(Collectors.groupingBy(s -> s.charAt(0)));

System.out.println(byInitial);
// {a=[apple, ant], b=[banana, bat], c=[carrot]}
    }
}
\`\`\`

---

### Output

\`\`\`
{a=[apple, ant], b=[banana, bat], c=[carrot]}
\`\`\`
`
},
{
question: 'How do you partition elements into two groups with \`Collectors.partitioningBy\`?',
answerMd: `
### Explanation

\`partitioningBy\` splits elements into a \`Map<Boolean, List<T>>\`:
- \`true\` key holds elements matching the predicate.
- \`false\` key holds the rest.

---

### Code

\`\`\`java
import java.util.*;
import java.util.stream.*;

public class PartitioningExample {
public static void main(String[] args) {
List<Integer> nums = List.of(1, 2, 3, 4, 5, 6);

Map<Boolean, List<Integer>> parts = nums.stream()
.collect(Collectors.partitioningBy(n -> n % 2 == 0));

System.out.println("Even: " + parts.get(true));   // [2, 4, 6]
        System.out.println("Odd: "  + parts.get(false));  // [1, 3, 5]
    }
}
\`\`\`

---

### Output

\`\`\`
Even: [2, 4, 6]
Odd: [1, 3, 5]
\`\`\`
`
},
{
question: 'How do you summarize numeric data (count, sum, avg, min, max)?',
answerMd: `
### Explanation

\`Collectors.summarizingInt/Long/Double\` produces an \`IntSummaryStatistics\` (or equivalent) with count, sum, min, max, and average.

---

### Code

\`\`\`java
import java.util.*;
import java.util.stream.*;

public class SummarizingExample {
public static void main(String[] args) {
List<Integer> nums = List.of(2, 4, 6, 8, 10);

IntSummaryStatistics stats = nums.stream()
.collect(Collectors.summarizingInt(Integer::intValue));

System.out.println("Count: " + stats.getCount());
System.out.println("Sum:   " + stats.getSum());
System.out.println("Avg:   " + stats.getAverage());
System.out.println("Min:   " + stats.getMin());
System.out.println("Max:   " + stats.getMax());
}
}
\`\`\`

---

### Output

\`\`\`
Count: 5
Sum:   30
Avg:   6.0
Min:   2
Max:   10
\`\`\`
`
},
{
question: 'How do you create and limit an infinite Stream?',
answerMd: `
### Explanation

Use \`Stream.iterate\` or \`Stream.generate\` to build infinite streams, then apply \`limit(n)\` to cap size.

---

### Code

\`\`\`java
import java.util.stream.*;

public class InfiniteStreamExample {
public static void main(String[] args) {
List<Long> firstTen = Stream.iterate(1L, n -> n + 1)
.limit(10)                         // take first 10 values
            .collect(Collectors.toList());

System.out.println(firstTen);        // [1, 2, …, 10]
    }
}
\`\`\`

---

### Output

\`\`\`
[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
\`\`\`
`
},
{
question: 'How do you collect into a Map with custom merge behavior?',
answerMd: `
### Explanation

When keys collide, supply a merge function to define how values combine.

---

### Code

\`\`\`java
import java.util.*;
import java.util.stream.*;

public class ToMapMergeExample {
public static void main(String[] args) {
String[] data = {"a=1", "b=2", "a=3"};

Map<String, Integer> map = Arrays.stream(data)
.map(s -> s.split("="))
.collect(Collectors.toMap(
arr -> arr[0],                       // key
                arr -> Integer.parseInt(arr[1]),     // value
                Integer::sum                         // merge 1 + 3 = 4
            ));

System.out.println(map);                 // {a=4, b=2}
    }
}
\`\`\`

---

### Output

\`\`\`
{a=4, b=2}
\`\`\`
`
},
{
question: 'When should you use parallel streams and what are the caveats?',
answerMd: `
### Explanation

Parallel streams split the workload across threads. Use when:
- Large data sets.
- Stateless, side-effect-free operations.
- You have enough CPU cores.

**Caveats**
- Overhead of thread management can outweigh gains on small data.
- Must avoid mutable shared state.
- Order of results may differ (use \`forEachOrdered\` if needed).

---

### Code

\`\`\`java
import java.util.*;
import java.util.stream.*;

public class ParallelStreamExample {
public static void main(String[] args) {
List<Integer> nums = IntStream.rangeClosed(1, 1_000_000)
.boxed()
.collect(Collectors.toList());

long sum = nums.parallelStream()
.mapToLong(Integer::longValue)
.sum();

System.out.println("Sum: " + sum);
}
}
\`\`\`
`
}
]
},// Add this as the fourth card in your src/qa-data.ts, right after the “Java Streams” card

{
category: 'java',
title: 'JVM Memory Model',
subItems: [
   {
      question: 'Explain the JVM architectural model in depth',
      answerMd: `
# Detailed JVM Architecture

## 👥 Core Components & Their Roles

| Component                   | Role                                                                 |
|-----------------------------|----------------------------------------------------------------------|
| ClassLoader Subsystem       | Loads, links, and initializes Java classes and interfaces            |
| Bytecode Verifier           | Validates bytecode for security, type safety, and correctness        |
| Runtime Data Areas          | In-memory regions: Method Area, Heap, JVM Stacks, PC Registers, Native Stacks |
| Execution Engine            | Interprets bytecode and hands off hot methods to the JIT compiler    |
| Just-In-Time (JIT) Compiler | Translates frequently executed bytecode into optimized native code    |
| Native Method Interface     | Provides bridge between Java and native libraries via JNI            |
| Operating System & Hardware | Supplies threads, memory management, and CPU execution resources     |

---

## 🗂️ ClassLoader Subsystem

1. **Loading**  
   - Bootstrap Loader reads core classes from \`<java.home>/lib/rt.jar\`.  
   - Extension Loader picks up optional libraries.  
   - Application Loader handles user classes on the classpath.

2. **Linking**  
   - **Verification:** Sanity-check bytecode format and references.  
   - **Preparation:** Allocate and zero-out static fields in the Method Area.  
   - **Resolution:** Replace symbolic references with direct memory pointers.

3. **Initialization**  
   - Execute static initializers (\`<clinit>\`) in dependency order.  
   - Populate constant pool entries and finalize class metadata.

---

## ✅ Bytecode Verifier

- **Pass 1: File Format Check**  
  Ensures the class file conforms to JVM spec (magic number, version).

- **Pass 2: Semantic Analysis**  
  Checks constant pool entries, inheritance hierarchy, and access modifiers.

- **Pass 3: Control-Flow & Data-Flow Analysis**  
  - Validates operand stack consistency.  
  - Enforces type safety for fields and method calls.

- **Outcome**  
  Rejects malformed or malicious bytecode before execution.

---

## 🏗 Runtime Data Areas

| Area                | Contents                                   | Thread-Local? | Purpose                                       |
|---------------------|--------------------------------------------|---------------|-----------------------------------------------|
| Method Area         | Class metadata, static variables, constant pool | Shared        | Holds class definitions and bytecode          |
| Heap                | All Java objects and arrays                | Shared        | Dynamic memory allocation                     |
| JVM Stacks          | Frames (local variables, operand stack)    | Per thread    | Manages method calls and returns              |
| PC Registers        | Address of current instruction             | Per thread    | Tracks execution point within bytecode        |
| Native Method Stacks| Native function calls                      | Per thread    | Supports JNI method frames                    |

### Heap Generations

- **Young Generation**  
  - **Eden Space:** New object allocation.  
  - **Survivor Spaces:** Objects that survive minor GCs.

- **Old (Tenured) Generation**  
  Holds long-lived objects; subject to major GCs.

---

## 🚀 Execution Engine & JIT Compiler

- **Interpreter**  
  Reads bytecodes instruction by instruction via a switch-dispatch loop.

- **JIT Compilation Pipeline**  
  1. **Profiling:** Interpreter counts method invocations and branch frequency.  
  2. **Compilation:** Hot methods are compiled into native code in the Code Cache.  
  3. **Optimization Tiers:**  
     - *C1 (Client):* Fast compilation, moderate optimizations.  
     - *C2 (Server):* Slower, high-throughput native code.

- **Code Cache**  
  Stores generated native code linked back to Java call sites.

---

## 🔗 Java Native Interface (JNI)

- **Declaration**  
  Java methods marked \`native\`, body implemented in C/C++.

- **Linking & Invocation**  
  - Load libraries via \`System.loadLibrary()\`.  
  - JNI wrappers convert between Java and native types.

- **Native Stacks**  
  Each thread has a separate C/C++ call stack.

---

## 🖥 OS & Hardware Integration

- **Threads Mapping**  
  Each Java \`Thread\` maps 1:1 to an OS-level thread.

- **Memory Mapping**  
  JVM reserves virtual memory for Heap and Code Cache; OS commits pages on demand.

- **Safepoints & Signals**  
  JVM uses OS signals (e.g., \`SIGTRAP\`) to trigger safepoints for GC and deoptimization.

---

## 🗺️ Architectural Diagram

\`\`\`plaintext
+----------------------+   +----------------------+   +--------------------+
| ClassLoader Subsystem|-->| Bytecode Verifier    |-->| Runtime Data Areas |
| (Bootstrap, Ext, App)|   |                      |   | (Method, Heap,     |
+----------+-----------+   +----------+-----------+   |  Stacks, PCReg)    |
           |                          |                 +-------+------------+
           v                          v                         |
      Execution Engine        JIT Compiler            Native Method Interface
      (Interpreter)              (C1, C2)                   (JNI, Native Stacks)
           |                          |                         |
           +-----------+--------------+-------------------------+
                       |
                 OS & Hardware
         (Threads, Memory, CPU Cores)
\`\`\`
`
    },
{
question: 'What are the key changes to JVM memory regions in Java 8 versus Java 7?',
answerMd: `
### Memory Area Changes

Java 8 removed the permanent generation (PermGen) and introduced Metaspace:

- PermGen (Java 7):
- Fixed‐size heap region for class metadata, interned Strings, static variables
- Often led to \`java.lang.OutOfMemoryError: PermGen space\`
- Metaspace (Java 8):
- Class metadata moved to native (off‐heap) memory
- Grows dynamically (bounded only by \`-XX:MaxMetaspaceSize\`)
- Reduces GC overhead and fragmentation

---

#### Configuration Comparison

| Configuration Flag            | Java 7 (PermGen)           | Java 8 (Metaspace)              |
|-------------------------------|----------------------------|---------------------------------|
| Initial size                  | \`-XX:PermSize\`           | \`-XX:MetaspaceSize\`           |
| Maximum size                  | \`-XX:MaxPermSize\`        | \`-XX:MaxMetaspaceSize\`        |
| Out-of-memory error           | PermGen space exhaustion   | Metaspace exhaustion            |
`
},
{
question: 'How did garbage collection improve in Java 8?',
answerMd: `
### GC Enhancements

Java 8 delivered multiple GC‐level improvements over Java 7:

- G1 Enhancements
- Graduated from experimental to production‐quality
- Improved pause predictability and throughput
- **String Deduplication** (since 8u20): dedups duplicate \`char[]\` in heap to shrink footprint
- CMS & Parallel Full GC
- \`-XX:+CMSParallelRemarkEnabled\` for faster remark phase
- Better adaptive sizing across collectors
- Escape Analysis & Stack Allocation
- \`-XX:+DoEscapeAnalysis\` enables scalar replacement of short‐lived objects
- Further reduces heap allocation pressure

---

#### Tuning Tips

- Switch to G1 by default: \`-XX:+UseG1GC\`
- Enable String dedup: \`-XX:+UseStringDeduplication\`
- Monitor Metaspace: use \`-verbose:gc\`, \`jcmd GC.class_histogram\`
`
},
{
question: 'Did the Java Memory Model (JMM) spec change in Java 8?',
answerMd: `
### JMM Specification

The core JMM (JSR-133) remains unchanged from Java 5 through Java 8:

- **Happens‐before** rules for \`volatile\`, \`synchronized\`, and \`java.util.concurrent\` still apply
- No semantic changes in visibility or ordering guarantees

What did evolve are JVM optimizations (escape analysis, biased‐lock improvements, lock coarsening), which accelerate code under the **same** JMM semantics.
`
}
]
},// Add this card to your src/qa-data.ts

{
category: 'java',
title: 'HashMap Internals & Java 8 Improvements',
subItems: [
{
      question: 'Explain Java HashMap internals in depth',
      answerMd: `
# Detailed Java HashMap Internals

## 👥 Core Components & Their Roles

| Component               | Role                                                                       |
|-------------------------|----------------------------------------------------------------------------|
| table (Node<K,V>[] )    | Internal array of buckets holding linked lists or tree nodes               |
| Node<K,V>               | Entry object storing key, value, hash, and pointer to next node            |
| TreeNode<K,V>           | Red-black tree node for bins with high collision, ensures balanced trees    |
| hash                    | Integer hash of the key, spread to reduce collisions                       |
| loadFactor              | Threshold ratio (default 0.75) to trigger resizing                         |
| threshold               | Maximum number of entries before resizing (capacity * loadFactor)          |
| size                    | Current count of key-value mappings                                        |
| modCount                | Modification count for fail-fast iterators                                  |
| TREEIFY_THRESHOLD       | Bin length above which to convert list to tree (default 8)                 |
| MIN_TREEIFY_CAPACITY    | Minimum capacity before treeification (default 64)                         |

---

## 🗂️ Data Structures & Layout

1. **Bucket Array**  
   - \`Node<K,V>[] table\` initialized to \`DEFAULT_INITIAL_CAPACITY\` (16).  
   - Each index holds either \`null\`, a single \`Node\`, a linked list of \`Node\`, or a \`TreeNode\` root.

2. **Node Structure**  
   - Fields: \`final int hash\`, \`final K key\`, \`V value\`, \`Node<K,V> next\`.  
   - Forms the linked list for buckets with collisions.

3. **TreeNode Structure**  
   - Extends \`Node\` with parent, left, right pointers and a color bit.  
   - Implements red-black tree invariants for O(log n) access.

---

## ✅ Hashing & Index Calculation

1. **Hash Computation**  
   - Original hash: \`int h = key.hashCode();\`  
   - Spread: \`h ^ (h >>> 16)\` to incorporate higher bits into lower ones.

2. **Index Determination**  
   - Compute bucket index: \`(n - 1) & h\` where \`n\` is table length (power of two).  
   - Ensures even distribution and fast bitwise modulo.

---

## 🔄 Collision Handling

- **Linked List**  
  - Until chain length \< \`TREEIFY_THRESHOLD\`, new nodes appended.  
  - \`putVal\` traverses list; replaces value if key matches existing one.

- **Treeification**  
  - When chain length ≥ \`TREEIFY_THRESHOLD\` and table size ≥ \`MIN_TREEIFY_CAPACITY\`, bin transforms into red-black tree.  
  - Ensures O(log n) operations under high collision.

- **Untreeification**  
  - During resizing or removal, if tree shrinks below \`UNTREEIFY_THRESHOLD\`, converts back to linked list.

---

## 🏗 Resizing Mechanism

1. **Resize Trigger**  
   - On \`put\`, if \`size > threshold\`, call \`resize()\`.

2. **Capacity Doubling**  
   - New capacity = old capacity × 2.  
   - New \`threshold = newCapacity * loadFactor\`.

3. **Rehash & Transfer**  
   - Iterate old table; for each non-null bucket:  
     - Single node → place in new table at new index.  
     - Linked list → split nodes into low/high lists based on \`hash & oldCapacity\`.  
     - Tree → split into two trees or lists accordingly.

4. **Lazy Initialization**  
   - If table is uninitialized, first \`put\` triggers allocation to \`DEFAULT_INITIAL_CAPACITY\`.

---

## 🗺️ Architectural Diagram

\`\`\`plaintext
   +-----------------------------+
   | Node<K,V>[] table           |
   | (buckets, length = power of 2) |
   +---------+---------+---------+
             |         |        
  bucket[3]  v         v bucket[5]
  [A:Node]  → [B:Node]            null
             |
         treeified
             v
     [TreeNode Root]
        /       \
    [TreeNode][TreeNode]
\`\`\`

---

## 🚀 Performance Characteristics & Pitfalls

| Aspect               | Benefit                             | Pitfall                                    | Best Practice                           |
|----------------------|-------------------------------------|--------------------------------------------|-----------------------------------------|
| Load Factor (0.75)   | Balances space-time tradeoff        | High memory usage if too low               | Tune based on memory and access patterns|
| Resizing             | Maintains O(1) amortized access     | Expensive O(n) during resize               | Pre-size via constructor if size known  |
| Collisions           | Simple fallback to linked list      | Degraded to O(n) lookup in worst case      | Use tree bins; use good hash functions  |
| Treeification        | Ensures O(log n) under collision    | Overhead for small bins                    | Only treeify when chain ≥ 8 and capacity sufficient |
| Key Immutability     | Stable hash codes                   | Changing key fields breaks invariants      | Use immutable keys (String, Integer)    |

---

## 💻 Code Snippets

### 1. Hash & Index Function
\`\`\`java
static final int hash(Object key) {
    int h;
    return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
}

static int indexFor(int hash, int length) {
    return hash & (length - 1);
}
\`\`\`

### 2. Simplified putVal Logic
\`\`\`java
final V putVal(int hash, K key, V value, boolean onlyIfAbsent, boolean evict) {
    Node<K,V>[] tab; Node<K,V> p; int n, i;
    if ((tab = table) == null || (n = tab.length) == 0)
        n = (tab = resize()).length;
    if ((p = tab[i = (n - 1) & hash]) == null)
        tab[i] = newNode(hash, key, value, null);
    else {
        Node<K,V> e; K k;
        if (p.hash == hash && ((k = p.key) == key || key.equals(k)))
            e = p;
        else if (p instanceof TreeNode)
            e = ((TreeNode<K,V>)p).putTreeVal(this, tab, hash, key, value);
        else {
            for (int binCount = 0; ; ++binCount) {
                if ((e = p.next) == null) {
                    p.next = newNode(hash, key, value, null);
                    if (binCount >= TREEIFY_THRESHOLD - 1)
                        treeifyBin(tab, i);
                    break;
                }
                if (e.hash == hash && ((k = e.key) == key || key.equals(k)))
                    break;
                p = e;
            }
        }
        if (e != null) {
            V oldValue = e.value;
            if (!onlyIfAbsent)
                e.value = value;
            return oldValue;
        }
    }
    ++modCount;
    if (++size > threshold)
        resize();
    return null;
}
\`\`\`

---

## 🚀 Beyond the Basics

- Explore ConcurrentHashMap internals for thread-safe operations.  
- Investigate Guava’s ImmutableMap for fixed-size, memory-efficient maps.  
- Consider alternative collision strategies like Cuckoo or hopscotch hashing.  
`
    },
{
question: 'What are the key improvements to HashMap in Java 8?',
answerMd: `
# 🌟 Java 8 HashMap Improvements — Story-Driven Guide

## 👥 Main Participants & Their Roles

| Participant       | Role                                                              |
|-------------------|-------------------------------------------------------------------|
| HashMap<K,V>      | The main map container, now enhanced for heavy hash collisions    |
| Node<K,V>         | Linked-list bucket entry                                         |
| TreeNode<K,V>     | Red-black tree node for buckets with many entries                |
| spread()          | Improved hash mixer to better distribute keys                    |
| computeIfAbsent() | Lazily computes and inserts a value if key is missing            |
| merge()           | Atomically combines a new value with an existing one             |
| forEach()         | Lambda-friendly iteration over entries                           |
| remove(key, val)  | Conditional removal only if key maps to specified value          |

---

## 📖 Narrative

In the **Hashland Library**, every book (entry) goes to a shelf slot (bucket) based on its Dewey code (hash). In Java 8, if too many books crowd one slot, the librarian rebuilds that shelf into a mini index (red-black tree) so lookups stay fast. Librarians also get new tools: they can summon a missing book on demand (\`computeIfAbsent\`), merge two volumes into one (\`merge\`), and stroll through every aisle with a single command (\`forEach\`).

---

## 🎯 Goals & Guarantees

| Goal                          | Detail                                                         |
|-------------------------------|----------------------------------------------------------------|
| ⚡ Maintain O(1) get/put       | Treeify at threshold to bound worst-case to O(log n)           |
| 🔀 Better Collision Spread    | Use \`h ^ (h >>> 16)\` mixer for high-bit mixing                |
| 🔄 Atomic Bulk Operations     | \`computeIfAbsent\`, \`computeIfPresent\`, \`merge\` reduce races|
| 🧩 Functional Iteration       | \`forEach\`, \`replaceAll\` let you apply lambdas safely        |
| 🚫 Conditional Removal        | \`remove(key, value)\` enforces precise entry deletion         |

---

## 🗺️ Architecture at a Glance (ASCII)

\`\`\`
Buckets[] (length = power-of-2)

[i] → Node(A) → Node(C) → Node(F)
[j] → TreeNode(B) ──▶ red-black links ──▶ TreeNode(D)
[k] → null

On collisions ≥ TREEIFY_THRESHOLD (default 8), linked Nodes transform to TreeNodes
\`\`\`

---

## 🔄 Core Patterns & Pitfalls

| Pattern                 | Problem Solved                                    | What to Verify                   | Fix / Best Practice                                    |
|-------------------------|---------------------------------------------------|----------------------------------|--------------------------------------------------------|
| Tree Bins               | Long linked lists degrade to O(n) lookups         | Chain length, table size        | Rely on default threshold (8) and MIN_TREEIFY_CAPACITY (64) |
| Improved Hash Mixing   | Poor dispersion of \`hashCode()\` bits            | High collision rate             | Use \`spread(int h)\` that xors high bits before index  |
| Lazy Computation        | Boilerplate checks for absent keys                | Null checks and concurrency     | Use \`computeIfAbsent\` with side-effect-free remapping function |
| Atomic Merge            | Race conditions updating existing entries         | Inconsistent map state          | Use \`merge(key, value, BiFunction)\` for thread-safe combines |
| Lambda Iteration        | Verbose loops                                      | Concurrent modifications         | Use \`forEach\`, \`replaceAll\`, \`compute\` safely     |
| Conditional Removal     | Unintentional deletions with \`remove(key)\`       | Key-value mismatch              | Use \`remove(key, value)\` to guard against stale values |

---

## 🛠️ Step-by-Step Usage Guide

1. Leverage tree bins automatically
- Rely on default thresholds; no code changes needed.

2. Use computeIfAbsent
- \`map.computeIfAbsent(key, k -> createDefault())\`

3. Merge entries atomically
- \`map.merge(key, newValue, (oldV, newV) -> combine(oldV, newV))\`

4. Iterate with lambdas
- \`map.forEach((k, v) -> System.out.println(k +": "+ v));\`

5. Conditional removal
- \`map.remove(someKey, expectedValue);\`

6. Bulk replace
- \`map.replaceAll((k, v) -> transform(v));\`

---

## 💻 Code Examples

### 1. computeIfAbsent for caching
\`\`\`java
Map<String, List<String>> index = new HashMap<>();
List<String> authors = index.computeIfAbsent(isbn, key -> new ArrayList<>());
authors.add("New Author");
\`\`\`

### 2. merge to sum counts
\`\`\`java
Map<String, Integer> counts = new HashMap<>();
counts.merge("apple", 1, Integer::sum);
counts.merge("apple", 1, Integer::sum);  // apple → 2
\`\`\`

### 3. forEach and replaceAll
\`\`\`java
map.forEach((k, v) -> System.out.println(k + " = " + v));
map.replaceAll((k, v) -> v.toUpperCase());
\`\`\`

### 4. Conditional removal
\`\`\`java
boolean removed = map.remove("tempKey", "tempValue");
\`\`\`

---

## 🚀 Beyond the Basics

- Explore \`computeIfPresent\` for updating existing entries.
- Tune \`loadFactor\` and initial capacity to reduce resizing.
- For multi-threaded contexts, consider \`ConcurrentHashMap\`’s Java 8 optimizations.
- Investigate alternative hash schemes (Cuckoo, Hopscotch) for special workloads.
- Profile collision rates and tweak custom \`hashCode()\` implementations.
`
}
]
},// Add this card to your src/qa-data.ts

{
category: 'java',
title: 'Java OOPs Concepts: Core Principles & Examples',
subItems: [
{
question: 'What is Encapsulation in Java and how is it implemented?',
answerMd: `
Encapsulation is the principle of bundling data (fields) and behavior (methods) into a single unit while restricting direct access to some of an object’s components.

Key points:
- Use private fields to hide internal state
- Provide public getters/setters to control and validate access
- Improves maintainability and enforces invariants

Example:
\`\`\`java
public class BankAccount {
private double balance;  // hidden state

    public double getBalance() {
return balance;
}

public void deposit(double amount) {
if (amount > 0) {
balance += amount;
}
}

public void withdraw(double amount) {
if (amount > 0 && amount <= balance) {
balance -= amount;
}
}
}
\`\`\`
`
},
{
question: 'What is Inheritance in Java and how do you use it?',
answerMd: `
Inheritance allows a new class (subclass) to reuse fields and methods of an existing class (superclass), promoting code reuse and a clear type hierarchy.

Key points:
- Use the \`extends\` keyword for classes
- Subclass can override superclass methods to alter behavior
- Java supports single inheritance for classes

Example:
\`\`\`java
// Superclass
public class Vehicle {
public void start() {
System.out.println("Vehicle started");
}
}

// Subclass
public class Car extends Vehicle {
@Override
public void start() {
System.out.println("Car engine started");
}
}
\`\`\`
`
},
{
question: 'How does compile-time polymorphism (method overloading) work in Java?',
answerMd: `
Compile-time polymorphism, or method overloading, happens when multiple methods share the same name but differ in parameter lists. The compiler resolves which method to call based on argument types.

Key points:
- Same method name, different signatures
- Resolved at compile time
- Enhances readability and API usability

Example:
\`\`\`java
public class MathUtils {
public int add(int a, int b) {
return a + b;
}

public double add(double a, double b) {
return a + b;
}

public int add(int a, int b, int c) {
return a + b + c;
}
}
\`\`\`
`
},
{
question: 'How does runtime polymorphism (method overriding) work in Java?',
answerMd: `
Runtime polymorphism, or method overriding, occurs when a subclass provides its own implementation of a method declared in its superclass. The JVM decides which method to invoke at runtime.

Key points:
- Same method signature in subclass
- Resolved at runtime via dynamic dispatch
- Enables flexible and extensible designs

Example:
\`\`\`java
public class Animal {
public void speak() {
System.out.println("Animal makes a sound");
}
}

public class Dog extends Animal {
@Override
public void speak() {
System.out.println("Dog barks");
}
}

// Usage
Animal myPet = new Dog();
myPet.speak();  // prints "Dog barks"
\`\`\`
`
},
{
question: 'What is Abstraction in Java and how do you implement it?',
answerMd: `
Abstraction focuses on exposing only the essential features of an object while hiding implementation details.

Key points:
- Achieved with abstract classes and interfaces
- Abstract classes can have both abstract and concrete methods
- Interfaces define a contract; since Java 8 they can include default and static methods

Abstract class example:
\`\`\`java
public abstract class Shape {
public abstract double area();
public void display() {
System.out.println("Shape displayed");
}
}

public class Circle extends Shape {
private double radius;
public Circle(double radius) {
this.radius = radius;
}
@Override
public double area() {
return Math.PI * radius * radius;
}
}
\`\`\`

Interface example:
\`\`\`java
public interface Flyable {
void fly();
}

public class Bird implements Flyable {
@Override
public void fly() {
System.out.println("Bird is flying");
}
}
\`\`\`
`
}
]
},// Add this as the next card in your src/qa-data.ts

{
category: 'springBoot',
title: 'Spring & Spring Boot Deep Dive',
subItems: [
{
question: 'Explain Spring and Spring Boot key concepts in minute details',
answerMd: `
# Detailed Spring & Spring Boot Key Concepts

## 👥 Core Modules & Their Roles

| Module                         | Role                                                         |
|--------------------------------|--------------------------------------------------------------|
| Spring Core (IoC Container)    | Manages bean creation, wiring, scopes, lifecycle             |
| Spring AOP                     | Implements cross-cutting concerns via proxies or weaving     |
| Spring Data                    | Simplifies data access with repositories and templates       |
| Spring MVC                     | Handles web requests via DispatcherServlet, controllers, views |
| Spring Security                | Offers authentication, authorization, and security filters   |
| Spring Test                    | Provides testing support (MockMvc, TestContext)              |
| Spring Boot Auto-Configuration | Automatically configures beans based on classpath settings   |
| Spring Boot Starters           | Aggregated dependencies for rapid development                |
| Spring Boot Actuator           | Exposes operational endpoints (metrics, health, tracing)     |
| Spring Boot CLI & DevTools     | Tools for rapid development and auto-restart                 |

---

## 🏗 IoC Container & Bean Lifecycle

1. **Bean Definition & Metadata**
- Defined via annotations (\`@Component\`, \`@Service\`, \`@Repository\`, \`@Configuration\`/\`@Bean\`) or XML.
- Metadata stored in \`BeanDefinition\`.

2. **Bean Creation Phases**
- **Instantiation:** Create bean instance via constructor or factory method.
- **Populate Properties:** Inject dependencies via constructor, setter, or field injection.
- **BeanPostProcessors (pre):** \`postProcessBeforeInitialization\`.
- **InitializingBean & \`@PostConstruct\`:** Custom init callbacks.
- **BeanPostProcessors (post):** \`postProcessAfterInitialization\`.
- **Destruction:** \`DisposableBean\` & \`@PreDestroy\` on context close.

3. **Scopes**
- **Singleton (default):** One shared instance per \`ApplicationContext\`.
- **Prototype:** New instance for each injection.
- **Web scopes:** \`request\`, \`session\`, \`application\` in web environments.
- **Custom scopes:** Via the \`Scope\` interface.

---

## ⚙️ Dependency Injection & Configuration

- **Annotation-Based**
- \`@Autowired\`, \`@Inject\`, \`@Resource\`.
- Constructor vs setter vs field injection.
- Optional dependencies with \`@Nullable\` or \`@Autowired(required=false)\`.

- **Java Configuration**
- \`@Configuration\` classes define \`@Bean\` methods.
- \`@ComponentScan\` to auto-detect components.
- \`@Import\`, \`@PropertySource\`, \`@Profile\` to conditionally load beans.

- **Externalized Configuration**
- \`application.properties\` / \`application.yml\`.
- \`@Value\`, \`@ConfigurationProperties\` for relaxed binding.
- Profiles: \`application-{profile}.properties\`.
- \`Environment\` and \`EnvironmentPostProcessor\` for custom sources.

---

## 🔄 Spring Boot Auto-Configuration

- **Mechanism**
- \`spring.factories\` loads auto-configuration classes.
- \`@ConditionalOnClass\`, \`@ConditionalOnMissingBean\`, \`@ConditionalOnProperty\` control activation.
- Beans auto-configured for DataSource, JPA, MVC, Security, etc.

- **Starters**
- Aggregated POMs: \`spring-boot-starter-web\`, \`spring-boot-starter-data-jpa\`, \`spring-boot-starter-security\`, etc.
- Simplify dependency management.

- **Custom Auto-Configuration**
- Define \`@Configuration\` and register via \`spring.factories\`.
- Order with \`@AutoConfigureBefore\` / \`@AutoConfigureAfter\`.

---

## 📦 Packaging & Deployment

| Packaging Model    | Description                                                         |
|--------------------|---------------------------------------------------------------------|
| Jar (Executable)   | Embedded servlet container; \`java -jar app.jar\`                   |
| War (Traditional)  | Deploy to external container; use \`spring-boot-starter-tomcat\`    |
| Layered Jar        | Multi-layer jar optimized for Docker image layering                 |

- **Build Plugins:** Maven (\`spring-boot-maven-plugin\`), Gradle (\`spring-boot-gradle-plugin\`).
- **Repackaging:** Fat-jar with nested dependencies using \`JarLauncher\`.

---

## 🔍 Actuator & Observability

| Endpoint             | Description                                  |
|----------------------|----------------------------------------------|
| /actuator/health     | Application health status                    |
| /actuator/metrics    | Numeric metrics (memory, CPU, custom)        |
| /actuator/info       | App info from \`build-info.properties\`      |
| /actuator/httptrace  | HTTP request traces                          |
| /actuator/env        | Environment properties                       |
| /actuator/loggers    | Dynamic log level configuration              |
| /actuator/threaddump | Thread dump                                  |
| /actuator/prometheus | Prometheus-formatted metrics                 |

- **Customize Exposure:** \`management.endpoints.web.exposure.include\`.
- **Metrics Backend:** Micrometer with Prometheus, Datadog, New Relic.
- **Distributed Tracing:** Spring Cloud Sleuth / OpenTelemetry integration.

---

## 🔒 Security

- **Core Concepts**
- Filter chain managed by \`SecurityFilterChain\`.
- \`AuthenticationProvider\`, \`UserDetailsService\`, \`SecurityContextHolder\`.

- **Configuration Styles**
- Legacy: extend \`WebSecurityConfigurerAdapter\`.
- Modern: declare \`@Bean SecurityFilterChain\`.
- Method security: \`@EnableMethodSecurity\`, \`@PreAuthorize\`.

- **OAuth2 & JWT**
- Use \`spring-boot-starter-oauth2-client\` / \`resource-server\`.
- Customize \`JwtAuthenticationConverter\`.

---

## 🧪 Testing

- **Test Slices**
- \`@WebMvcTest\`, \`@DataJpaTest\`, \`@JdbcTest\`, \`@WebFluxTest\`.
- Load limited context for fast execution.

- **Mocking & Simulation**
- \`@MockBean\` replaces beans in context.
- \`MockMvc\` and \`WebTestClient\` for HTTP layer.

- **Integration Tests**
- \`@SpringBootTest\` with \`webEnvironment\`.
- \`TestRestTemplate\` or \`WebTestClient\`.

---

## 🗺️ Architectural Diagram

\`\`\`plaintext
[ Client ]
│
▼
[ Embedded Server (Tomcat/Jetty/Undertow) ]
│
▼
[ DispatcherServlet ] ─→ HandlerMapping → Controller → ViewResolver → View
│
├─ FilterChain (Security, CORS, etc.)
└─ HandlerInterceptors

[ ApplicationContext (IoC Container) ]
│
├─ BeanFactoryPostProcessors → modify definitions
├─ BeanPostProcessors → wrap beans (AOP proxies)
├─ Beans (Controllers, Services, Repositories, Configs)
└─ Environment & PropertySources

spring-boot auto-configuration ↔ conditional beans based on classpath & properties
\`\`\`

---

## 🚀 Advanced Topics & Pitfalls

- Customizing auto-configuration with \`@Conditional\`.
- Managing complex configuration with \`@ConfigurationProperties\` validation.
- Performance tuning: caching (\`@Cacheable\`), async (\`@Async\`), thread pools.
- Reactive stack: Spring WebFlux, Reactor, functional endpoints.
- Cloud-native: Spring Cloud Config, Gateway, Circuit Breaker (Resilience4j), Kubernetes probes.
- Common pitfalls: circular dependencies, bean overriding, classpath conflicts, file locking on Windows.

---

## 💻 Code Example Snippets

### 1. @ConfigurationProperties with Validation
\`\`\`java
@Configuration
@ConfigurationProperties(prefix = "app")
@Validated
public class AppProperties {
@NotNull
private String name;
private DatasourceProperties datasource;
// getters/setters
}
\`\`\`

### 2. Custom Auto-Configuration
\`\`\`java
@Configuration
@ConditionalOnClass(DataSource.class)
@EnableConfigurationProperties(AppProperties.class)
public class MyAutoConfiguration {
@Bean
@ConditionalOnMissingBean
public MyService myService(AppProperties props) {
return new MyService(props.getName());
}
}
\`\`\`

### 3. SecurityFilterChain Bean (Spring Security 5.7+)
\`\`\`java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
http.authorizeHttpRequests(auth -> auth.anyRequest().authenticated())
.oauth2Login(Customizer.withDefaults());
return http.build();
}
\`\`\`

---

## 🚀 Beyond the Basics

- GraalVM native-image with Spring AOT.
- Spring Cloud ecosystem: Config, Netflix OSS, Kubernetes integration.
- Service mesh: Istio, Linkerd with Spring Cloud Gateway.
- CI/CD and Docker multi-stage builds for Spring Boot apps.
- Advanced observability: distributed tracing, log correlation with Sleuth and Zipkin.
`
},{
question: 'How do you configure multiple data sources (MySQL, Oracle, NoSQL) in Spring Boot?',
answerMd: `
# 🗂️ Multi–Data Source in Spring Boot — Story-Driven Guide

## 👥 Main Participants & Their Roles

| Participant              | Role                                                                          |
|--------------------------|-------------------------------------------------------------------------------|
| Spring Boot App          | Orchestrates business logic and data access                                   |
| MySQL DataSource Config  | Bean that provides connections, entity manager and transaction manager for MySQL |
| Oracle DataSource Config | Bean that provides connections, entity manager and transaction manager for Oracle|
| NoSQL Config             | Bean/config for MongoDB (or other NoSQL) template and repositories            |
| EntityManagerFactory     | Creates JPA context per RDBMS, bound to its DataSource                       |
| TransactionManager       | Manages transactions per database                                            |
| Repositories & Templates | Injected with @Qualifier to target the correct DataSource                    |
| Monitoring & Actuator    | Tracks connection pool metrics for each DataSource                           |

---

## 📖 Narrative

In **PolyBase City**, you’re the **Data Architect** building a Spring Boot service that reads orders from MySQL, audits them in Oracle, and streams events to a NoSQL store. You create separate **DataSource** beans for each backend, wire up distinct **EntityManagerFactories** and **TransactionManagers**, and annotate your repositories with qualifiers. At runtime, each repository speaks only to its designated database, ensuring clarity, resilience, and maintainability.

---

## 🎯 Goals & Guarantees

| Goal                             | Detail                                                                                 |
|----------------------------------|----------------------------------------------------------------------------------------|
| 🔗 Clear Separation              | Isolate MySQL, Oracle, and NoSQL contexts to avoid misrouted queries                   |
| 🔄 Independent Transactions       | Each DataSource has its own transaction boundary                                       |
| ⚙️ Config-Driven                  | Externalize connection properties in \`application.yml\` for env-specific overrides    |
| 📊 Observability                 | Expose HikariCP metrics and DataSource health via Spring Boot Actuator                 |
| 🔐 Secure Credentials            | Store passwords and credentials in encrypted secrets or vault                           |

---

## 🗺️ Architecture at a Glance (ASCII)

\`\`\`
+----------------+
| Spring Boot App|
+--------+-------+
│
┌───────────────┼────────────────┬─────────────────┐
│               │                │                 │
▼               ▼                ▼                 ▼
MySQLDS        OracleDS         MongoTemplate   Actuator
(EntityMgr,    (EntityMgr,       & Repos         & Metrics
TxMgr)        TxMgr)

│               │                │
▼               ▼                ▼
MySQL DB       Oracle DB      NoSQL DB (Mongo)
\`\`\`

---

## 🔄 Core Patterns & Pitfalls

| Pattern                  | Problem Solved                              | Pitfall                                         | Fix / Best Practice                                              |
|--------------------------|---------------------------------------------|-------------------------------------------------|------------------------------------------------------------------|
| Qualifier Injection      | Ensures correct bean injection              | NoUniqueBeanDefinitionException                 | Use \`@Primary\` or \`@Qualifier("mysqlDataSource")\`            |
| Multiple EMF/TxMgr       | Separate JPA contexts per RDBMS             | TransactionManager routing mix-up               | Reference correct \`transactionManagerRef\` in \`@EnableJpaRepositories\` |
| Externalized Config      | Environment-specific endpoints and creds    | Credentials hard-coded                          | Use \`@ConfigurationProperties\` and encrypted vault integration |
| NoSQL vs JPA Context     | Different programming model (document vs ORM)| Attempting JPA on NoSQL                         | Use Spring Data Mongo repositories or \`MongoTemplate\`         |
| Cross-DB Transactions    | Maintain consistency across RDBMS & NoSQL     | No native XA support; partial rollback          | Use a saga pattern or Spring Cloud Transaction / JTA            |

---

## 🛠️ Step-by-Step Implementation Guide

1. **Add Dependencies**
- \`spring-boot-starter-data-jpa\`
- \`mysql-connector-java\`, \`ojdbc-driver\`
- \`spring-boot-starter-data-mongodb\` (or other NoSQL starter)

2. **application.yml**
\`\`\`yaml
spring:
datasource:
mysql:
jdbc-url: jdbc:mysql://mysql-host:3306/orderdb
         username: order_user
password: \${MYSQL_PASSWORD}
hikari:
pool-name: MySQLPool
oracle:
jdbc-url: jdbc:oracle:thin:@//oracle-host:1521/auditsvc
         username: audit_user
password: \${ORACLE_PASSWORD}
hikari:
pool-name: OraclePool

data:
mongodb:
uri: mongodb://mongo-host:27017/eventsdb
   \`\`\`

3. **MySQL Configuration**
\`\`\`java
@Configuration
@EnableJpaRepositories(
basePackages = "com.acme.orders.repo",
entityManagerFactoryRef = "mysqlEmf",
transactionManagerRef = "mysqlTxMgr"
)
@ConfigurationProperties(prefix = "spring.datasource.mysql")
public class MySQLConfig {
@Bean @Primary
public DataSource mysqlDataSource() {
return DataSourceBuilder.create().type(HikariDataSource.class).build();
}

@Bean
public LocalContainerEntityManagerFactoryBean mysqlEmf(
EntityManagerFactoryBuilder builder) {
return builder
.dataSource(mysqlDataSource())
.packages("com.acme.orders.model")
.persistenceUnit("mysqlPU")
.build();
}

@Bean
public PlatformTransactionManager mysqlTxMgr(
@Qualifier("mysqlEmf") EntityManagerFactory emf) {
return new JpaTransactionManager(emf);
}
}
\`\`\`

4. **Oracle Configuration**
\`\`\`java
@Configuration
@EnableJpaRepositories(
basePackages = "com.acme.audit.repo",
entityManagerFactoryRef = "oracleEmf",
transactionManagerRef = "oracleTxMgr"
)
@ConfigurationProperties(prefix = "spring.datasource.oracle")
public class OracleConfig {
@Bean
public DataSource oracleDataSource() {
return DataSourceBuilder.create().type(HikariDataSource.class).build();
}

@Bean
public LocalContainerEntityManagerFactoryBean oracleEmf(
EntityManagerFactoryBuilder builder) {
return builder
.dataSource(oracleDataSource())
.packages("com.acme.audit.model")
.persistenceUnit("oraclePU")
.build();
}

@Bean
public PlatformTransactionManager oracleTxMgr(
@Qualifier("oracleEmf") EntityManagerFactory emf) {
return new JpaTransactionManager(emf);
}
}
\`\`\`

5. **NoSQL (MongoDB) Configuration**
\`\`\`java
@Configuration
@EnableMongoRepositories(
basePackages = "com.acme.events.repo",
mongoTemplateRef = "mongoTemplate"
)
public class MongoConfig {
@Bean
public MongoClient mongoClient(
@Value("\${spring.data.mongodb.uri}") String uri) {
return MongoClients.create(uri);
}

@Bean
public MongoTemplate mongoTemplate(MongoClient client) {
return new MongoTemplate(client, "eventsdb");
}
}
\`\`\`

6. **Repository & Service Usage**
\`\`\`java
@Service
public class OrderService {
private final OrderRepository orders;
private final AuditRepository audits;
private final EventRepository events;

public OrderService(
OrderRepository orders,
AuditRepository audits,
EventRepository events) {
this.orders = orders;
this.audits = audits;
this.events = events;
}

@Transactional("mysqlTxMgr")
public Order placeOrder(Order o) {
Order saved = orders.save(o);
saveAudit(saved);
publishEvent(saved);
return saved;
}
}
\`\`\`

7. **Monitoring & Actuator**
- Expose pools: \`management.metrics.binders.db.enabled=true\`.
- View Hikari metrics under \`/actuator/metrics\`.

---

## 🚀 Beyond the Basics

- **Dynamic Routing**: Use \`AbstractRoutingDataSource\` for multi-tenant routing.
- **Cross-DB Transactions**: Integrate Atomikos or Narayana for XA transactions.
- **Schema Migrations**: Manage MySQL/Oracle migrations with Flyway; Mongo with Mongock.
- **Reactive NoSQL**: Use Spring WebFlux + ReactiveMongoTemplate for non-blocking IO.
- **Credentials Vaulting**: Integrate Spring Cloud Vault or AWS Secrets Manager.
`
},
{
question: 'How does Spring Boot Auto-Configuration actually find and apply beans?',
answerMd: `
### Under-the-Hood of Auto-Configuration

1. **spring.factories**
- Spring Boot scans all JARs on the classpath for \`META-INF/spring.factories\`.
- Each \`EnableAutoConfiguration\` entry lists one @Configuration class.

2. **Conditional Annotations**
- \`@ConditionalOnClass\`, \`@ConditionalOnMissingBean\`, \`@ConditionalOnProperty\`, etc.
- Conditions evaluated at startup; only matching configurations are registered.

3. **Ordering & Overrides**
- User-defined \`@Configuration\` beans (in your code) are processed *before* auto-configurations.
- You can override any auto bean simply by declaring your own.

---

**Tip:** To inspect which auto-configs ran, enable
\`--debug\` or set \`logging.level.org.springframework.boot.autoconfigure=TRACE\`.
`
},
{
question: 'Explain how Spring AOP creates proxies and when it uses CGLIB vs JDK proxies.',
answerMd: `
### Proxy Mechanism

- **JDK Dynamic Proxies**
- Used if target bean implements at least one interface.
- Creates a lightweight proxy implementing those interfaces.

- **CGLIB Proxies**
- Used if no interfaces or if \`proxyTargetClass=true\`.
- Subclasses the target class at runtime.

**Lifecycle:**
1. Spring finds all \`@Aspect\` beans and builds advisors.
2. An \`AutoProxyCreator\` intercepts bean creation.
3. Wraps matching beans in a proxy object.

---

**Caveat:**
- Final classes & methods cannot be proxied with CGLIB.
- Avoid stateful advice or shared mutable state inside aspects.
`
},
{
question: 'What is the role of BeanPostProcessor and how can you use it?',
answerMd: `
### BeanPostProcessor Overview

- Invoked **after** bean instantiation & dependency injection but **before** your init-methods.
- Two callbacks:
- \`postProcessBeforeInitialization(Object bean, String name)\`
- \`postProcessAfterInitialization(Object bean, String name)\`

### Use Cases

- Custom annotation handling.
- Wrapping beans in proxies (e.g., for metrics, tracing).
- Injecting dynamic behavior or validating bean properties.

---

\`\`\`java
@Component
public class AuditingProcessor implements BeanPostProcessor {
@Override
public Object postProcessBeforeInitialization(Object bean, String name) {
// inspect or wrap bean
    return bean;
}
}
\`\`\`
`
},
{
question: 'How does Spring’s @Transactional actually work under the covers?',
answerMd: `
### Behind the Scenes of @Transactional

1. **Proxy Creation**
- Spring wraps \`@Transactional\` beans in a proxy (AOP).
2. **TransactionInterceptor**
- Intercepts method calls.
- Begins a transaction before the method, commits/rolls back afterward.

3. **PlatformTransactionManager**
- Delegates to specific implementations (DataSourceTransactionManager, JtaTransactionManager).
- Applies propagation and isolation semantics.

---

**Note:**
- Only public methods called via the Spring proxy will participate.
- Self-invocation (this.someTransactional()) bypasses the proxy.
`
},
{
question: 'What are key differences between Spring Profiles and @Conditional?',
answerMd: `
### Spring Profiles vs @Conditional

| Aspect               | @Profile                    | @Conditional                |
|----------------------|-----------------------------|-----------------------------|
| Activation           | \`spring.profiles.active\`  | No global switch — eval’d per condition |
| Use Case             | Coarse-grained environment configs (dev/prod) | Fine-grained bean registration rules |
| Annotations          | \`@Profile("dev")\`         | \`@ConditionalOnBean\`, \`@ConditionalOnProperty\`, etc. |
| Bean Visibility      | Exclude entire config classes in inactive profiles | Skip individual beans or configurations based on custom logic |

---

**Combine Both:**
You can annotate a @Configuration with @Profile and its beans with more granular @Conditional annotations.
`
},
{
question: 'How do Spring Boot Actuator endpoints get exposed and secured by default?',
answerMd: `
### Actuator Exposure & Security

1. **Endpoints**
- Built-in: \`/actuator/health\`, \`/metrics\`, \`/info\`, etc.
- Enabled when you add \`spring-boot-starter-actuator\`.

2. **Exposure**
- Default: only \`health\` and \`info\` over HTTP.
- Customize via \`management.endpoints.web.exposure.include=\`.

3. **Security**
- Spring Boot 2+ secures all endpoints by default (basic auth).
- Use \`management.endpoints.web.exposure\` and standard Spring Security config to open or protect endpoints.

---

**Example:**
\`\`\`
management.endpoints.web.exposure.include=health,metrics
management.endpoint.health.show-details=always
\`\`\`
`
},
{
question: 'What’s the difference between @RestController and @Controller?',
answerMd: `
### Controller Stereotypes

- **@Controller**
- Marks a Spring MVC controller.
- Methods typically return a view name; data must be placed in a \`Model\`.

- **@RestController**
- Shortcut for \`@Controller + @ResponseBody\`.
- Methods return JSON/XML directly, serialized by HttpMessageConverters.

---

**Example:**

\`\`\`java
@RestController
public class UserApi {
@GetMapping("/user/{id}")
public User getUser(@PathVariable Long id) {
return userService.findById(id);
}
}
\`\`\`
`
}
]
},// Add this as the next card in your src/qa-data.ts

{
category: 'springBoot',
title: 'Spring Bean Scopes: Use Cases & Examples',
subItems: [
{
question: 'What are the six built-in Spring bean scopes and their lifecycles?',
answerMd: `
Spring defines six scopes to control bean instantiation, sharing, and destruction:

| Scope      | Lifecycle                                       |
|------------|-------------------------------------------------|
| singleton  | One instance per Spring container               |
| prototype  | New instance on each lookup/injection           |
| request    | One instance per HTTP request                   |
| session    | One instance per HTTP session                   |
| application| One instance per ServletContext (global web app)|
| websocket  | One instance per WebSocket session              |

Choosing the right scope helps you manage resources, state, and thread-safety in your applications.
`
},
{
question: 'When should I use singleton scope?',
answerMd: `
Singleton is the default. Spring creates one instance at startup (or lazily on first use) and shares it across the entire container.

Use cases:
- Stateless services (business logic, DAOs)
- Shared caches or connection pools

Example:
\`\`\`java
@Service
public class UserService {
public User findById(Long id) { … }
}
\`\`\`

Ensure thread-safety if you hold mutable state.
`
},
{
question: 'When should I use prototype scope?',
answerMd: `
Prototype beans produce a new instance every time you request or inject them.

Use cases:
- Objects carrying temporary or user-specific state
- Heavy-init resources you want fresh each time

Example:
\`\`\`java
@Component
@Scope("prototype")
public class ReportGenerator {
private UUID sessionId = UUID.randomUUID();
}
\`\`\`

Note: Spring does not manage destruction for prototype beans—you must clean up manually if needed.
`
},
{
question: 'When should I use request scope?',
answerMd: `
Request-scoped beans live for a single HTTP request and are destroyed at its end.

Use cases:
- Capturing per-request data (e.g., search criteria, filters)
- Avoiding ThreadLocal for request parameters

Example:
\`\`\`java
@Component
@Scope(value = "request", proxyMode = ScopedProxyMode.TARGET_CLASS)
public class SearchCriteria {
private String query;
}
\`\`\`

Requires a web-aware ApplicationContext.
`
},
{
question: 'When should I use session scope?',
answerMd: `
Session-scoped beans persist for the lifetime of an HTTP session.

Use cases:
- Shopping carts, multi-step workflows
- User preferences maintained across requests

Example:
\`\`\`java
@Component
@Scope(value = "session", proxyMode = ScopedProxyMode.INTERFACES)
public class ShoppingCart {
private List<Item> items = new ArrayList<>();
}
\`\`\`

Always inject via a proxy when mixing with singletons.
`
},
{
question: 'When should I use application scope?',
answerMd: `
Application-scoped beans live for the entire ServletContext—one instance per web app.

Use cases:
- Global caches or lookup tables
- Shared counters or stats collectors

Example:
\`\`\`java
@Component
@Scope(value = "application", proxyMode = ScopedProxyMode.TARGET_CLASS)
public class GlobalCache {
private Map<String, Object> cache = new ConcurrentHashMap<>();
}
\`\`\`

Often singleton suffices outside web contexts.
`
},
{
question: 'When should I use websocket scope?',
answerMd: `
WebSocket-scoped beans are created per WebSocket session.

Use cases:
- Real-time chat handlers
- Collaborative editing state per connection

Example:
\`\`\`java
@Component
@Scope(value = "websocket", proxyMode = ScopedProxyMode.TARGET_CLASS)
public class ChatSessionHandler {
private String username;
}
\`\`\`

Requires Spring’s WebSocket support and proxy injection.
`
}
]
},// Add this card to your src/qa-data.ts

{
category: 'springBoot',
title: 'Spring Security: Use Cases & Examples',
subItems: [
{
question: 'How does the Spring Security filter chain process incoming requests?',
answerMd: `
### Security Filter Chain

- Spring Security installs a chain of \`Filter\`s that each inspect or modify the request/response.
- Modern style registers one or more \`SecurityFilterChain\` beans instead of extending WebSecurityConfigurerAdapter.
- Each filter does part of authentication or authorization before handing off to the next.

\`\`\`java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
http
.authorizeHttpRequests(auth -> auth
.requestMatchers("/admin/**").hasRole("ADMIN")
.anyRequest().authenticated()
)
.formLogin().and()
.httpBasic();
return http.build();
}
\`\`\`

This single bean wires up all necessary filters in the correct order.
`
},
{
question: 'What’s the difference between form-based login and HTTP Basic auth?',
answerMd: `
### Form Login vs HTTP Basic

- **Form Login**
- Presents a custom HTML login page.
- Session-based, states authenticated user in \`HttpSession\`.
- **HTTP Basic**
- Browser pops up a credentials dialog.
- Credentials sent on every request in \`Authorization: Basic <token>\`.

\`\`\`java
http
.formLogin(form -> form
.loginPage("/login").permitAll()
)
.httpBasic();
\`\`\`

Use form login for interactive UIs; basic auth for simple REST clients.
`
},
{
question: 'How do you hook up a custom UserDetailsService and password encoder?',
answerMd: `
### Custom UserDetailsService

1. Implement \`UserDetailsService\` to load user data (roles, password hash) from your store.
2. Define a \`PasswordEncoder\` bean (e.g., BCrypt).

\`\`\`java
@Service
public class MyUserDetailsService implements UserDetailsService {
@Autowired UserRepository repo;
@Override
public UserDetails loadUserByUsername(String username) {
return repo.findByUsername(username)
.orElseThrow(() -> new UsernameNotFoundException(username));
}
}

@Bean
public PasswordEncoder passwordEncoder() {
return new BCryptPasswordEncoder();
}
\`\`\`
`
},
{
question: 'How can you secure a REST API using JWT for stateless authentication?',
answerMd: `
### JWT-Based Stateless Auth

- On login, generate a signed JWT containing username and roles.
- Client sends JWT in \`Authorization: Bearer <token>\`.
- Use a filter to parse and validate JWT, then populate \`SecurityContext\`.

\`\`\`java
String jwt = Jwts.builder()
.setSubject(user.getUsername())
.claim("roles", roles)
.signWith(key)
.compact();
\`\`\`

Then in a custom filter:
\`\`\`java
var auth = new UsernamePasswordAuthenticationToken(user, null, authorities);
SecurityContextHolder.getContext().setAuthentication(auth);
\`\`\`
`
},
{
question: 'How do you set up OAuth2 login with Google (or another provider)?',
answerMd: `
### OAuth2 Client Login

1. Add \`spring-boot-starter-oauth2-client\`.
2. Configure \`spring.security.oauth2.client.registration.google\` in \`application.yml\`.
3. Enable OAuth2 login in \`SecurityFilterChain\`.

\`\`\`java
http
.oauth2Login(oauth2 -> oauth2
.loginPage("/oauth2/authorization/google")
);
\`\`\`

Spring handles the redirect, token exchange, and maps user info to a \`OAuth2User\`.
`
},
{
question: 'How do you secure APIs as an OAuth2 Resource Server (JWT bearer tokens)?',
answerMd: `
### OAuth2 Resource Server

- Add \`spring-boot-starter-oauth2-resource-server\`.
- Configure issuer URI or JWK set URI.
- Enable JWT support in your filter chain.

\`\`\`java
http
.authorizeHttpRequests(auth -> auth.anyRequest().authenticated())
.oauth2ResourceServer(oauth2 -> oauth2.jwt());
\`\`\`

Spring will validate incoming Bearer tokens against the configured JWK set.
`
},
{
question: 'When and how should I enable or disable CSRF protection?',
answerMd: `
### CSRF Protection

- Enabled by default to guard state-changing requests in web apps.
- For stateless REST APIs (JWT or Basic), you typically disable it.

\`\`\`java
http
.csrf(csrf -> csrf.disable());
\`\`\`

If you keep it on, ensure your forms or XHR clients include the CSRF token on each POST/PUT/DELETE.
`
},
{
question: 'How can I enforce method-level security with annotations?',
answerMd: `
### Method Security

1. Add \`@EnableMethodSecurity\` (or \`@EnableGlobalMethodSecurity\`).
2. Annotate service methods with \`@PreAuthorize\`, \`@PostAuthorize\`, or \`@Secured\`.

\`\`\`java
@PreAuthorize("hasRole('ADMIN')")
public void deleteUser(Long id) { … }

@Secured("ROLE_USER")
public void viewProfile() { … }
\`\`\`

Spring evaluates expressions against the current \`Authentication\` in \`SecurityContextHolder\`.
`
},
{
question: 'How do you configure CORS in Spring Security to allow cross-origin requests?',
answerMd: `
### CORS Configuration

- Define a \`CorsConfigurationSource\` bean with allowed origins & methods.
- Enable it in your security chain with \`.cors()\`.

\`\`\`java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
var config = new CorsConfiguration();
config.setAllowedOrigins(List.of("http://localhost:3000"));
config.setAllowedMethods(List.of("GET","POST","PUT","DELETE"));
var source = new UrlBasedCorsConfigurationSource();
source.registerCorsConfiguration("/**", config);
return source;
}

http.cors();
\`\`\`
`
}
]
},// Add this card to your src/qa-data.ts

{
category: 'springBoot',
title: 'Spring Bean & Context Lifecycle: Use Cases & Examples',
subItems: [
{
question: 'What are the main phases in a Spring bean’s lifecycle?',
answerMd: `
Spring manages each bean through these phases:

1. Instantiation
2. Populate properties (DI)
3. Aware callbacks (\`BeanNameAware\`, \`BeanFactoryAware\`)
4. \`BeanPostProcessor.postProcessBeforeInitialization\`
5. Initialization
- \`@PostConstruct\`
- \`InitializingBean.afterPropertiesSet()\`
- Custom \`init-method\`
6. \`BeanPostProcessor.postProcessAfterInitialization\`
7. Usage by application
8. Destruction
- \`@PreDestroy\`
- \`DisposableBean.destroy()\`
- Custom \`destroy-method\`

Understanding these phases helps you hook into exactly the right moment to configure, validate, or tear down resources.
`
},
{
question: 'How do you add custom initialization logic to a bean?',
answerMd: `
You can run setup code right after Spring injects dependencies:

1. \`@PostConstruct\` on a method
2. Implement \`InitializingBean.afterPropertiesSet()\`
3. Specify a custom \`init-method\` in XML or \`@Bean(initMethod="…")\`

Example using \`@PostConstruct\`:
\`\`\`java
@Component
public class CacheLoader {
private Map<String,Data> cache;

@PostConstruct
public void loadCache() {
// populate heavy in-memory cache from DB
    this.cache = someRepo.findAll().stream()
.collect(toMap(Data::getKey, identity()));
}
}
\`\`\`
This ensures your cache is ready before any other bean uses it.
`
},
{
question: 'How do you perform cleanup when a bean is destroyed?',
answerMd: `
Release resources right before the container removes the bean:

1. \`@PreDestroy\` on a method
2. Implement \`DisposableBean.destroy()\`
3. Specify a custom \`destroy-method\`

Example releasing a file handle:
\`\`\`java
@Component
public class FileProcessor {
private BufferedWriter writer = new BufferedWriter(new FileWriter("out.log"));

@PreDestroy
public void closeWriter() throws IOException {
writer.flush();
writer.close();
}
}
\`\`\`
This guarantees log output is flushed and the file handle is closed.
`
},
{
question: 'What can you do with BeanPostProcessor before and after initialization?',
answerMd: `
\`BeanPostProcessor\` lets you intercept every bean:

- postProcessBeforeInitialization: modify fields, wrap proxies
- postProcessAfterInitialization: wrap with AOP, add metrics

Use case—timing method calls:
\`\`\`java
@Component
public class TimingPostProcessor implements BeanPostProcessor {
@Override
public Object postProcessAfterInitialization(Object bean, String name) {
if (bean instanceof Service) {
return Proxy.newProxyInstance(
bean.getClass().getClassLoader(),
bean.getClass().getInterfaces(),
(proxy, method, args) -> {
long start = System.nanoTime();
Object result = method.invoke(bean, args);
log.info("{} took {} ns", method, System.nanoTime() - start);
return result;
});
}
return bean;
}
}
\`\`\`
This wraps all \`Service\` beans to log execution time.
`
},
{
question: 'How can you listen to ApplicationContext lifecycle events?',
answerMd: `
Spring publishes events at context startup and shutdown:

- \`ContextRefreshedEvent\` (after \`.refresh()\`)
- \`ContextStartedEvent\`, \`ContextStoppedEvent\`
- \`ContextClosedEvent\`

Example listener:
\`\`\`java
@Component
public class StartupListener implements ApplicationListener<ContextRefreshedEvent> {
@Override
public void onApplicationEvent(ContextRefreshedEvent ev) {
System.out.println("Context initialized, can start background jobs");
}
}
\`\`\`
Use these to trigger tasks only after all beans are ready.
`
},
{
question: 'What is lazy initialization and when should you use it?',
answerMd: `
By default, singleton beans are created on context startup. With \`@Lazy\`, Spring delays instantiation until first request.

Use cases:
- Heavy beans you rarely use
- Conditional components in large application contexts

Example:
\`\`\`java
@Configuration
public class ReportingConfig {
@Bean
@Lazy
public ReportService reportService() {
return new ReportService(); // expensive setup
  }
}
\`\`\`
This speeds up startup and only builds \`ReportService\` if a controller or service actually needs it.
`
},
{
question: 'How does destruction differ for prototype-scoped beans?',
answerMd: `
Prototype beans skip Spring-managed destroy callbacks. You get a fresh instance each lookup, but:

- \`@PreDestroy\`, \`DisposableBean\` and \`destroy-method\` are not called.
- You must clean up prototypes manually.

Example manual cleanup:
\`\`\`java
ReportGenerator gen = ctx.getBean(ReportGenerator.class);
// use gen...
gen.close(); // your custom cleanup
\`\`\`
Remember: prototype = your responsibility for full lifecycle.
`
}
]
},// src/qa-data.ts
{
category: 'kafka',
title: 'Apache Kafka: Common Code‐Level Questions',
subItems: [
{
question: 'What is Apache Kafka and how do you send messages with the Java Producer API?',
answerMd: `
### Explanation

Apache Kafka is a distributed event streaming platform. Producers publish records to named **topics**, which are partitioned for scalability.

---

### Code

\`\`\`java
import org.apache.kafka.clients.producer.*;
import java.util.Properties;

public class SimpleProducer {
public static void main(String[] args) {
Properties props = new Properties();
props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringSerializer");
props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringSerializer");

try (KafkaProducer<String, String> producer = new KafkaProducer<>(props)) {
for (int i = 0; i < 5; i++) {
ProducerRecord<String, String> record =
new ProducerRecord<>("my-topic", "key" + i, "message-" + i);
producer.send(record, (metadata, exception) -> {
if (exception != null) {
exception.printStackTrace();
} else {
System.out.printf(
"Sent to topic=%s partition=%d offset=%d%n",
metadata.topic(), metadata.partition(), metadata.offset());
}
});
}
}
}
}
\`\`\`

---

### Key Points

- \`BOOTSTRAP_SERVERS_CONFIG\`: Kafka brokers’ addresses
- \`ProducerRecord\`: encapsulates topic, key, and value
- Callback gives you partition and offset info
`
},
{
question: 'How do you configure and implement a Kafka consumer in Java?',
answerMd: `
### Explanation

Consumers subscribe to topics, pull records, and manage offsets. They belong to a **consumer group** for parallelism and fault tolerance.

---

### Code

\`\`\`java
import org.apache.kafka.clients.consumer.*;
import org.apache.kafka.common.serialization.StringDeserializer;
import java.time.Duration;
import java.util.*;

public class SimpleConsumer {
public static void main(String[] args) {
Properties props = new Properties();
props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
props.put(ConsumerConfig.GROUP_ID_CONFIG, "my-group");
props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
props.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, "false");

try (KafkaConsumer<String, String> consumer = new KafkaConsumer<>(props)) {
consumer.subscribe(Collections.singletonList("my-topic"));
while (true) {
ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(100));
for (ConsumerRecord<String, String> rec : records) {
System.out.printf("Received key=%s value=%s offset=%d partition=%d%n",
rec.key(), rec.value(), rec.offset(), rec.partition());
}
consumer.commitSync();
}
}
}
}
\`\`\`

---

### Key Points

- \`group.id\`: identifies consumer group
- \`subscribe\` vs \`assign\`: dynamic rebalancing vs fixed partitions
- \`auto.offset.reset\`: where to start if no committed offset
- Manual vs auto offset commit
`
},
{
question: 'How do you serialize and deserialize custom objects in Kafka?',
answerMd: `
### Explanation

Kafka uses serializers and deserializers (SerDes) to convert objects to/from byte arrays. For custom types, implement \`Serializer<T>\` and \`Deserializer<T>\`.

---

### Code

\`\`\`java
// 1. Define your POJO
public class User {
public String id;
public String name;
// constructors, getters/setters omitted
}

// 2. JSON SerDe using Jackson
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.kafka.common.serialization.*;

public class JsonSerializer<T> implements Serializer<T> {
private final ObjectMapper mapper = new ObjectMapper();
@Override
public byte[] serialize(String topic, T data) {
try {
return mapper.writeValueAsBytes(data);
} catch (Exception e) {
throw new SerializationException(e);
}
}
}

public class JsonDeserializer<T> implements Deserializer<T> {
private final ObjectMapper mapper = new ObjectMapper();
private Class<T> cls;
public JsonDeserializer(Class<T> cls) { this.cls = cls; }
@Override
public T deserialize(String topic, byte[] bytes) {
try {
return mapper.readValue(bytes, cls);
} catch (Exception e) {
throw new SerializationException(e);
}
}
}

// 3. Configure producer/consumer
props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class.getName());
props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class.getName());
props.put("json.deserializer.class", User.class.getName());
\`\`\`

---

### Key Points

- Always match key and value SerDe on both producer and consumer
- Can use Avro, Protobuf SerDes for schema evolution
`
},
{
question: 'What is a consumer group and how does offset management work?',
answerMd: `
### Explanation

- **Consumer Group**
- A set of consumers sharing the same \`group.id\`
- Partitions are evenly assigned across the group
- Provides horizontal scalability and fault tolerance

- **Offset Management**
- Each consumer tracks its position (offset) per partition
- Offsets committed to Kafka’s \`__consumer_offsets\` topic
- On restart, consumer resumes from last committed offset

---

### Code Snippet

\`\`\`java
// Auto commit:
props.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, "true");
props.put(ConsumerConfig.AUTO_COMMIT_INTERVAL_MS_CONFIG, "1000");

// Manual commit:
consumer.commitSync();   // synchronous
consumer.commitAsync();  // asynchronous
\`\`\`

---

### Key Points

- Use manual commit for at-least-once processing semantics
- RocksDB-backed offsets in Kafka Streams
`
},
{
question: 'How do you achieve exactly-once semantics (EOS) in Kafka Producers and Streams?',
answerMd: `
### Explanation

Exactly-once delivery means each message is processed and stored once, even in failures. Kafka supports EOS at producer and Streams layers.

---

### Producer with Transactions

\`\`\`java
props.put(ProducerConfig.ENABLE_IDEMPOTENCE_CONFIG, "true");
props.put(ProducerConfig.TRANSACTIONAL_ID_CONFIG, "txn-01");

KafkaProducer<String, String> producer = new KafkaProducer<>(props);
producer.initTransactions();

try {
producer.beginTransaction();
producer.send(new ProducerRecord<>("topicA", "k", "v1"));
producer.send(new ProducerRecord<>("topicB", "k", "v2"));
producer.commitTransaction();
} catch (Exception e) {
producer.abortTransaction();
}
\`\`\`

---

### Kafka Streams

\`\`\`java
StreamsBuilder builder = new StreamsBuilder();
builder.stream("input-topic")
.mapValues(v -> v.toUpperCase())
.to("output-topic");

Properties props = new Properties();
props.put(StreamsConfig.PROCESSING_GUARANTEE_CONFIG, StreamsConfig.EXACTLY_ONCE_V2);

KafkaStreams streams = new KafkaStreams(builder.build(), props);
streams.start();
\`\`\`

---

### Key Points

- Idempotence prevents duplicates on retry
- Transactions group multi-topic writes
- \`EXACTLY_ONCE_V2\` is the recommended Streams setting
`
},
{
question: 'How do you programmatically create topics with the AdminClient?',
answerMd: `
### Explanation

Kafka’s \`AdminClient\` API lets you manage topics and broker configuration.

---

### Code

\`\`\`java
import org.apache.kafka.clients.admin.*;
import java.util.*;

public class TopicCreator {
public static void main(String[] args) throws Exception {
Properties props = Map.of(
AdminClientConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092"
);
try (AdminClient admin = AdminClient.create(props)) {
NewTopic topic = new NewTopic("new-topic", 3, (short)1);
CreateTopicsResult result = admin.createTopics(Collections.singleton(topic));
result.all().get();  // wait for creation
      System.out.println("Topic created");
}
}
}
\`\`\`

---

### Key Points

- Specify partitions and replication factor
- Check for \`TopicExistsException\` before creating
`
},
{
question: 'How do you use the Kafka Streams API for real-time processing?',
answerMd: `
### Explanation

Kafka Streams is a client library for processing and transforming data in Kafka topics.

---

### Code

\`\`\`java
import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.streams.*;
import org.apache.kafka.streams.kstream.*;
import java.util.Properties;

public class WordCountStream {
public static void main(String[] args) {
StreamsBuilder builder = new StreamsBuilder();
KStream<String, String> textLines = builder.stream("text-input");

KTable<String, Long> wordCounts = textLines
.flatMapValues(line -> List.of(line.toLowerCase().split("\\W+")))
.groupBy((key, word) -> word)
.count(Materialized.as("Counts"));

wordCounts.toStream().to("word-count-output", Produced.with(Serdes.String(), Serdes.Long()));

Properties props = new Properties();
props.put(StreamsConfig.APPLICATION_ID_CONFIG, "wordcount-app");
props.put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
props.put(StreamsConfig.DEFAULT_KEY_SERDE_CLASS_CONFIG, Serdes.String().getClass());
props.put(StreamsConfig.DEFAULT_VALUE_SERDE_CLASS_CONFIG, Serdes.String().getClass());

KafkaStreams streams = new KafkaStreams(builder.build(), props);
streams.start();
}
}
\`\`\`

---

### Key Points

- DSL vs Processor API
- Stateful operations: joins, windows, aggregations
- Interactive queries on state stores
`
},
{
question: 'How do you handle retries, back-off, and dead-letter queues in Kafka consumers?',
answerMd: `
### Explanation

When a consumer fails to process a record, you can retry processing or route the record to a Dead-Letter Queue (DLQ) topic. This prevents poisoning the main pipeline.

---

### Code

\`\`\`java
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.producer.*;

public class RetryableConsumer {
private static final String DLQ_TOPIC = "my-topic-DLQ";

public static void processRecord(ConsumerRecord<String, String> rec,
KafkaProducer<String, String> dlqProducer) {
int attempts = 0, maxRetries = 3;
while (attempts++ < maxRetries) {
try {
if (rec.value().contains("BAD")) {
throw new RuntimeException("Bad data encountered");
}
System.out.println("Processed: " + rec.value());
return;
} catch (Exception e) {
System.err.printf("Attempt %d failed for offset %d%n", attempts, rec.offset());
try { Thread.sleep(1000 * attempts); } catch (InterruptedException ignored) {}
}
}
ProducerRecord<String, String> dlqRec =
new ProducerRecord<>(DLQ_TOPIC, rec.key(), rec.value());
dlqProducer.send(dlqRec, (m, ex) -> {
if (ex != null) ex.printStackTrace();
else System.out.println("Routed to DLQ: " + m.offset());
});
}
}
\`\`\`

---

### Key Points

- Exponential back-off to avoid tight retry loops
- After \`maxRetries\`, produce to a DLQ topic
- Keep a separate producer instance for DLQ routing
`
},
{
question: 'How do you implement a custom partitioner in Kafka Producer?',
answerMd: `
### Explanation

A custom partitioner lets you control which partition each message lands in, based on your own logic.

---

### Code

\`\`\`java
import org.apache.kafka.clients.producer.Partitioner;
import org.apache.kafka.common.Cluster;
import java.util.Map;

public class EvenOddPartitioner implements Partitioner {
@Override
public void configure(Map<String, ?> configs) { }

@Override
public int partition(String topic, Object keyObj, byte[] keyBytes,
Object value, byte[] valueBytes, Cluster cluster) {
String key = (String) keyObj;
int numPartitions = cluster.partitionsForTopic(topic).size();
int bucket = Integer.parseInt(key) % 2;
return bucket % numPartitions;
}

@Override
public void close() { }
}
\`\`\`

\`\`\`java
// Configure your producer
Properties props = new Properties();
props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringSerializer");
props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringSerializer");
props.put(ProducerConfig.PARTITIONER_CLASS_CONFIG, EvenOddPartitioner.class.getName());
\`\`\`

---

### Key Points

- \`partition()\` gets access to topic metadata
- Always mod by \`numPartitions\` to avoid out-of-range errors
- Partitioner must be stateless or thread-safe
`
},
{
question: 'How do you integrate Kafka with Schema Registry using Avro?',
answerMd: `
### Explanation

Using Confluent’s Schema Registry with Avro ensures producers and consumers agree on your data schema and evolve safely.

---

### Code

\`\`\`java
Properties props = new Properties();
props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
props.put("schema.registry.url", "http://localhost:8081");
props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, "io.confluent.kafka.serializers.KafkaAvroSerializer");
props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, "io.confluent.kafka.serializers.KafkaAvroSerializer");

KafkaProducer<String, GenericRecord> producer = new KafkaProducer<>(props);

// build an Avro record
Schema schema = new Schema.Parser().parse(new File("user.avsc"));
GenericRecord user = new GenericData.Record(schema);
user.put("id", 123);
user.put("name", "Alice");

ProducerRecord<String, GenericRecord> record =
new ProducerRecord<>("avro-topic", "user-123", user);
producer.send(record).get();
\`\`\`

---

### Key Points

- Use \`KafkaAvroSerializer\` and \`KafkaAvroDeserializer\` on both ends
- \`schema.registry.url\` points to your Schema Registry service
- Avro schemas evolve via backwards/forwards compatibility rules
`
},
{
question: 'How do you programmatically manage Kafka Connect connectors via REST API?',
answerMd: `
### Explanation

Kafka Connect exposes a REST interface for creating, pausing, resuming, and deleting connectors.

---

### Code

\`\`\`java
import java.net.http.*;
import java.net.URI;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Map;

public class ConnectManager {
private static final HttpClient client = HttpClient.newHttpClient();
private static final ObjectMapper mapper = new ObjectMapper();
private static final String CONNECT_URL = "http://localhost:8083/connectors";

public static void createConnector(String name, Map<String,Object> config) throws Exception {
Map<String,Object> body = Map.of(
"name", name,
"config", config
);
String json = mapper.writeValueAsString(body);
HttpRequest req = HttpRequest.newBuilder()
.uri(URI.create(CONNECT_URL))
.header("Content-Type", "application/json")
.POST(HttpRequest.BodyPublishers.ofString(json))
.build();
HttpResponse<String> resp = client.send(req, HttpResponse.BodyHandlers.ofString());
System.out.println("Response: " + resp.statusCode() + " " + resp.body());
}
}
\`\`\`

---

### Key Points

- Connect REST API runs on port 8083 by default
- Provide full \`config\` map including \`connector.class\` and connector-specific props
- Use GET/\`/{name}\` to fetch status, DELETE to remove connectors
`
},
{
question: 'How do you monitor Kafka broker and client metrics via JMX in Java?',
answerMd: `
### Explanation

Kafka exposes hundreds of metrics through JMX MBeans. You can connect to the broker’s JMX port or fetch client-side metrics.

---

### Code

\`\`\`java
import javax.management.*;
import javax.management.remote.*;
import java.util.Set;

public class JmxMetricsReader {
public static void main(String[] args) throws Exception {
JMXServiceURL url =
new JMXServiceURL("service:jmx:rmi:///jndi/rmi://localhost:9999/jmxrmi");
JMXConnector jmxc = JMXConnectorFactory.connect(url);
MBeanServerConnection mbsc = jmxc.getMBeanServerConnection();

ObjectName name = new ObjectName("kafka.server:type=BrokerTopicMetrics,name=MessagesInPerSec");
Object attr = mbsc.getAttribute(name, "OneMinuteRate");
System.out.println("MessagesInPerSec (1m rate): " + attr);

jmxc.close();
}
}
\`\`\`

---

### Key Points

- Broker JMX port configured via \`KAFKA_JMX_OPTS\` env var
- Query any MBean with pattern \`kafka.*\` or client-side metrics under \`kafka.producer\`
- Useful for custom dashboards or alerts
`
}
]
},// Add this as the AWS Lambda card in your src/qa-data.ts

{
category: 'aws',
title: 'AWS Lambda Functions',
subItems: [
{
question: 'What is AWS Lambda and when should you use it?',
answerMd: `
### What Is AWS Lambda?

\`\`\`mermaid
flowchart LR
ES[Event Source] --> L[Lambda Function]
L --> C[Container Init]
C --> H[Handler Execution]
H --> R[Return Response]
\`\`\`

AWS Lambda is a serverless compute service that runs your code in response to events without provisioning servers. It automatically scales based on the volume of events.

\`\`\`js
// Example: simple Node.js handler
exports.handler = async (event) => {
console.log("Received event:", JSON.stringify(event));
return { statusCode: 200, body: "Hello from Lambda!" };
};
\`\`\`
`
},
{
question: 'How does AWS Lambda pricing work?',
answerMd: `
### Lambda Pricing Model

\`\`\`mermaid
pie
title Cost Components
"Requests" : 20
"Compute Duration (GB-s)" : 80
\`\`\`

1. **Request Charges**
\$0.20 per 1M requests (after free tier).

2. **Compute Duration**
Billed in GB-seconds:
\`Cost = Memory(GB) × Duration(s) × \$0.0000166667\`

3. **Free Tier**
1M free requests + 400 000 GB-s per month.

\`\`\`math
Cost = Requests × \$0.0000002 + (Memory_{GB} × Duration_{s} × 0.0000166667)
\`\`\`
`
},
{
question: 'What event sources can trigger a Lambda function?',
answerMd: `
### Supported Event Sources

\`\`\`mermaid
flowchart TB
subgraph Push Sources
APIG[API Gateway]
SNS[SNS Topic]
S3[S3 Object Event]
EB[EventBridge]
end
subgraph Pull Sources
SQS[SQS Queue]
KDS[Kinesis Stream]
DBS[DynamoDB Stream]
end
APIG & SNS & S3 & EB --> L[Lambda]
SQS & KDS & DBS --> L
\`\`\`

You can also invoke Lambda directly via SDK, CLI, or Function URLs.
`
},
{
question: 'How do you package and deploy a Lambda function?',
answerMd: `
### Packaging & Deployment

\`\`\`mermaid
sequenceDiagram
participant Dev as Developer
participant ZIP as ZIP Archive
participant S3 as S3 (opt)
participant AWS as AWS Lambda
Dev->>ZIP: zip code & deps
ZIP->>S3: upload to S3       %% optional
Dev->>AWS: update-function-code
AWS-->>Dev: confirmation
\`\`\`

**ZIP Deployment (CLI)**
\`\`\`bash
zip -r function.zip index.js node_modules/
aws lambda update-function-code \
--function-name MyFunc \
--zip-file fileb://function.zip
\`\`\`

**Container Image Deployment**
\`\`\`bash
docker build -t repo/myfunc:latest .
docker push repo/myfunc:latest
aws lambda update-function-code \
--function-name MyFunc \
--image-uri repo/myfunc:latest
\`\`\`
`
},
{
question: 'What are cold starts in Lambda and how can you mitigate them?',
answerMd: `
### Cold Start Lifecycle

\`\`\`mermaid
stateDiagram-v2
[*] --> ColdInit
ColdInit --> HandlerInit
HandlerInit --> Running
Running --> [*]
\`\`\`

A cold start happens when AWS provisions a new container. To mitigate:

- **Provisioned Concurrency**
Keep pre-initialized containers warm.
- **Smaller Packages**
Exclude unused dependencies; use Lambda Layers.
- **Lazy Init**
Move heavy code into the handler instead of global scope.
`
},
{
question: 'How do Lambda Versions and Aliases work?',
answerMd: `
### Versions & Aliases Flow

\`\`\`mermaid
flowchart LR
Dev[Developer] --> |PublishVersion| V1[v1]
Dev --> |PublishVersion| V2[v2]
AliasProd[Alias: “prod”] --> V1
AliasDev[Alias: “dev”] --> V2
\`\`\`

- **Versions** are immutable snapshots of code + config.
- **Aliases** point to versions and support weighted traffic for blue/green shifts.

\`\`\`bash
# Publish a new version
aws lambda publish-version --function-name MyFunc
# Update alias to new version
aws lambda update-alias \
--function-name MyFunc \
--name prod \
--function-version 2
\`\`\`
`
},
{
question: 'What are Lambda Layers and how do you use them?',
answerMd: `
### Layer Packaging

\`\`\`mermaid
classDiagram
class Function {
+handler()
+layers[]
}
class Layer {
-nodejs/
-python/
}
Function <|.. Layer
\`\`\`

**Create & Publish**
\`\`\`bash
zip -r layer.zip nodejs/
aws lambda publish-layer-version \
--layer-name SharedLibs \
--zip-file fileb://layer.zip \
  --compatible-runtimes nodejs14.x
\`\`\`

**Attach to Function**
\`\`\`bash
aws lambda update-function-configuration \
--function-name MyFunc \
--layers arn:aws:lambda:us-east-1:123456789012:layer:SharedLibs:1
\`\`\`
`
},
{
question: 'How do you configure environment variables and timeouts?',
answerMd: `
### Configuration Settings

\`\`\`mermaid
flowchart LR
UI[Console/CLI] --> CFG[Function Config]
CFG --> Env[Environment Variables]
CFG --> Timeout[Timeout (s)]
\`\`\`

Configure via AWS CLI:

\`\`\`bash
aws lambda update-function-configuration \
--function-name MyFunc \
--environment Variables="{STAGE=prod,LOG_LEVEL=info}" \
--timeout 30
\`\`\`

- **Environment Variables** are available in \`process.env\` (Node.js) or \`os.environ\` (Python).
- **Timeout** max is 900 seconds (15 minutes).
`
}
]
},// Add these cards after your AWS Lambda card in src/qa-data.ts

{
category: 'aws',
title: 'AWS Core Services: Networking & Security',
subItems: [
{
question: 'What is AWS VPC and how it is structured?',
answerMd: `
# 🌐 AWS VPC Architecture & Structure — Story-Driven Guide

## 👥 Main Participants & Their Roles

| Participant         | Role                                                        |
|---------------------|-------------------------------------------------------------|
| AWS Account         | Owner of VPCs and networking resources                      |
| VPC                 | Logical isolated network container                          |
| Subnet              | CIDR-based segment of a VPC (public or private)             |
| Internet Gateway    | Bidirectional link between VPC and the Internet             |
| NAT Gateway         | Outbound Internet access for resources in private subnets   |
| Route Table         | Collection of routing rules associated with subnets         |
| Security Group      | Stateful, instance-level firewall                           |
| Network ACL (NACL)  | Stateless, subnet-level firewall                            |
| VPC Endpoint        | Private connectivity to AWS services (S3, DynamoDB, etc.)   |
| Bastion Host        | Secure jump server into private subnets                     |
| VPC Flow Logs       | Captures IP traffic metadata for monitoring & troubleshooting |

---

## 📖 Narrative

Picture **Cloud Village**, a gated community. You, the **Network Architect**, draw its walls (the VPC) and carve out neighborhoods (subnets). The **Village Gate** (Internet Gateway) lets guests in and out of public areas. Private lanes rely on a **NAT Guard** to sneak out for supplies. Every road’s signpost is a **Route Table**, while neighborhood watch teams (Security Groups and NACLs) keep unwanted traffic at bay. Observers log every car’s journey with **Flow Logs**.

---

## 🎯 Goals & Guarantees

| Goal                        | Detail                                                      |
|-----------------------------|-------------------------------------------------------------|
| 🔒 Isolation                | Separate workloads into their own VPCs and subnets         |
| 🌍 Controlled Access        | Expose only public subnets to the Internet                  |
| 🚦 Traffic Management       | Route public vs private traffic through correct gateways    |
| 🛡 Security                | Enforce fine-grained firewall rules at instance and subnet levels |
| 🔍 Observability            | Capture and analyze network flow with VPC Flow Logs         |
| 🔗 Service Integration      | Connect privately to AWS services via VPC Endpoints         |

---

## 🗺️ Architecture at a Glance (ASCII)

\`\`\`
Internet
▲
IGW│
▼
+----------------------------------+
|              VPC                 |
|  CIDR: 10.0.0.0/16               |
|                                  |
|  +--------+   +----------------+ |
|  |Public  |   |  Private       | |
|  |SubnetA |   |  SubnetA       | |
|  |10.0.1.0/24 |10.0.2.0/24    | |
|  +---+----+   +----+----------+ |
|      │             │            |
|      ▼             ▼            |
|     IGW          NAT GW         |
|                                  |
+----------------------------------+
\`\`\`

---

## 🔄 Core Patterns & Pitfalls

| Pattern                 | Problem Solved                                 | What to Verify                              | Fix                                                     |
|-------------------------|------------------------------------------------|---------------------------------------------|---------------------------------------------------------|
| Public vs Private Subnet| Exposing sensitive resources to the Internet   | Route table associations                    | Ensure private subnets route 0.0.0.0/0 via NAT Gateway  |
| NAT Gateway             | Private hosts can’t reach Internet             | Single-AZ single point of failure           | Provision NAT per Availability Zone                    |
| Security Group vs NACL  | Overlapping firewall rules                     | Stateful vs. stateless behavior             | Use SGs for instance rules; NACLs for coarse subnet ACL |
| VPC Endpoints           | Data egress through Internet cost and latency  | Endpoint policy and type (interface vs gateway) | Create gateway endpoints for S3/DynamoDB; lock down policies |
| Overlapping CIDRs       | Peering/VPN connectivity failures              | Unique CIDR blocks across VPCs              | Plan non-overlapping IP ranges                          |

---

## 🛠️ Step-by-Step Implementation Guide

1. **Create the VPC**
- Navigate to VPC console or use AWS CLI:
\`\`\`bash
aws ec2 create-vpc --cidr-block 10.0.0.0/16
\`\`\`
- Tag it and enable DNS hostnames.

2. **Provision Subnets**
- Create public (e.g., 10.0.1.0/24) and private (e.g., 10.0.2.0/24) subnets in each AZ.
- Enable auto-assign IPv4 public IP for public subnets.

3. **Attach an Internet Gateway**
- Create and attach IGW to your VPC:
\`\`\`bash
aws ec2 create-internet-gateway
aws ec2 attach-internet-gateway --vpc-id vpc-1234abcd --internet-gateway-id igw-5678efgh
\`\`\`

4. **Configure Route Tables**
- Public RT: default route to IGW.
- Private RT: default route to NAT Gateway (create NAT in each AZ).

5. **Deploy NAT Gateways**
- In each public subnet:
\`\`\`bash
aws ec2 create-nat-gateway --subnet-id subnet-1a2b3c4d --allocation-id eipalloc-12345678
\`\`\`

6. **Setup Security Groups & NACLs**
- SG: allow inbound SSH from Bastion, app ports.
- NACL: deny known bad IP ranges, allow ephemeral ports.

7. **Add VPC Endpoints**
- Gateway endpoints for S3/DynamoDB:
\`\`\`bash
aws ec2 create-vpc-endpoint --vpc-id vpc-1234abcd --service-name com.amazonaws.us-east-1.s3 --route-table-ids rtb-1111aaaa
\`\`\`

8. **Enable VPC Flow Logs**
- Capture to CloudWatch or S3:
\`\`\`bash
aws ec2 create-flow-logs --resource-type VPC --resource-ids vpc-1234abcd --traffic-type ALL --log-group-name VPCFlowLogs
\`\`\`

9. **Harden & Monitor**
- Review SG/NACL overlap.
- Alert on unusual traffic via CloudWatch Alarms.
- Rotate NAT Elastic IPs if needed.

---

## 💻 Code Examples

### 1. CloudFormation Snippet (VPC + Subnets)
\`\`\`yaml
AWSTemplateFormatVersion: '2010-09-09'
Resources:
MyVPC:
Type: AWS::EC2::VPC
Properties:
CidrBlock: 10.0.0.0/16
EnableDnsSupport: true
EnableDnsHostnames: true
PublicSubnetA:
Type: AWS::EC2::Subnet
Properties:
VpcId: !Ref MyVPC
CidrBlock: 10.0.1.0/24
AvailabilityZone: us-east-1a
MapPublicIpOnLaunch: true
PrivateSubnetA:
Type: AWS::EC2::Subnet
Properties:
VpcId: !Ref MyVPC
CidrBlock: 10.0.2.0/24
AvailabilityZone: us-east-1a
\`\`\`

### 2. Terraform HCL (Route & IGW)
\`\`\`hcl
resource "aws_internet_gateway" "igw" {
vpc_id = aws_vpc.main.id
}
resource "aws_route_table" "public" {
vpc_id = aws_vpc.main.id
route {
cidr_block = "0.0.0.0/0"
gateway_id = aws_internet_gateway.igw.id
}
}
resource "aws_route_table_association" "pub_assoc" {
subnet_id      = aws_subnet.public.id
route_table_id = aws_route_table.public.id
}
\`\`\`

---

## 🚀 Beyond the Basics

- VPC Peering vs Transit Gateway for multi-VPC connectivity.
- AWS PrivateLink for secure service-to-service calls.
- Hybrid connectivity: Site-to-Site VPN & Direct Connect.
- IPv6 addressing and dual-stack deployments.
- Service Mesh (App Mesh) within your VPC.
- Automated drift detection with AWS Config rules.
- Multi-account VPC design using AWS Organizations.

`
},
{
question: 'How do IAM users, roles, and policies work together?',
answerMd: `
# 🔐 AWS IAM: Users, Roles & Policies — Story-Driven Guide

## 👥 Main Participants & Their Roles

| Participant               | Role                                                                             |
|---------------------------|----------------------------------------------------------------------------------|
| IAM User                  | A person or service account with long-term credentials                           |
| IAM Group                 | A collection of IAM users for easier policy assignment                           |
| IAM Role                  | An identity you can assume to obtain temporary credentials                       |
| IAM Policy                | A JSON document defining allowed/denied actions                                  |
| AWS STS (Security Token Service) | Issues temporary security tokens when roles are assumed                 |
| Resource-Based Policy     | Permissions attached directly to AWS resources (S3 buckets, SQS queues, etc.)    |
| Identity Provider (IdP)   | External SAML/OIDC provider for federated access                                 |
| Permissions Boundary      | Maximum permissions an IAM principal can ever have                               |

---

## 📖 Narrative

Imagine **Castle Cloud**. Your **Citizens** (IAM Users) have badges (passwords/keys) giving them basic access. To perform special tasks—like commanding the **Armory** or inspecting the **Treasury**—they don a **Costume** (IAM Role) that grants elevated rights for a short time. The rules of every costume and badge are written on **Scrolls** (IAM Policies). When a Citizen dresses up, the castle’s **Guard** (STS) issues a temporary pass (token) and enforces those scrolls. Once their mission ends, the costume is returned and the temporary pass expires.

---

## 🎯 Goals & Guarantees

| Goal                              | Detail                                                               |
|-----------------------------------|----------------------------------------------------------------------|
| 🔒 Least Privilege                | Grant only the permissions required for each actor                   |
| 🕒 Temporary Credentials          | Use short-lived tokens for elevated access                           |
| 🔁 Reusable Policy Definitions    | Write policies once and attach to users, groups, or roles           |
| 🔗 Separation of Duties           | Use roles to isolate high-risk operations from daily tasks          |
| 🔍 Auditable Access               | Central logs of who assumed which role and when                      |
| 🌐 Federated Access               | Let external identities assume roles without creating IAM users      |

---

## 🗺️ Architecture at a Glance (ASCII)

\`\`\`
+-------------+                     +-----------------------+
| IAM User    |                     | Identity Provider     |
| (or AWS svc)|                     | (SAML/OIDC)           |
+------+------+                     +----------+------------+
|                                     |
| 1. Present creds / federated token  |
v                                     v
+---+-------------+                +------+-----------+
| Assume Role     |--(STS Validate)->| Trust Policy    |
+---+-------------+                +-----------------+
|
| 2. STS issues temporary creds
v
+---+-------------+
| Call AWS API    |
+-----------------+
|
| 3. Enforce Permissions
v
+-----------------+
| IAM Policy Eval |
+-----------------+
\`\`\`

---

## 🔄 Core Patterns & Pitfalls

| Pattern                  | Problem Solved                                    | What to Verify                          | Fix / Best Practice                                        |
|--------------------------|---------------------------------------------------|-----------------------------------------|------------------------------------------------------------|
| User & Group Policies    | Managing dozens of user-level permissions         | Overly permissive wildcards             | Scope actions and resources; use AWS managed policies      |
| Role Assumption          | Granting temporary privilege without long-term keys| Missing trust relationship              | Define least-privilege trust policy with \`sts:AssumeRole\`|
| Resource-Based Policies  | Letting other accounts or services access a resource| Unrestricted principals                | Constrain with \`Principal\`, \`Condition\`, SourceArn     |
| Permissions Boundaries   | Prevent IAM principal from escalating rights       | Boundary not enforced                   | Attach boundary to User/Role; test with policy simulator   |
| Inline vs Managed Policy | Fragmented permissions or policy sprawl            | Hard to audit inline policies           | Favor reusable customer-managed policies                   |

---

## 🛠️ Step-by-Step Implementation Guide

1. Create an IAM User
\`\`\`bash
aws iam create-user --user-name app-developer
\`\`\`

2. Create a Group and Attach a Policy
\`\`\`bash
aws iam create-group --group-name Developers
aws iam attach-group-policy --group-name Developers \
--policy-arn arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess
\`\`\`

3. Add User to Group
\`\`\`bash
aws iam add-user-to-group --user-name app-developer --group-name Developers
\`\`\`

4. Write a Custom Policy (policy.json)
\`\`\`json
{
"Version": "2012-10-17",
"Statement": [{
"Effect": "Allow",
"Action": ["dynamodb:Query","dynamodb:UpdateItem"],
"Resource": "arn:aws:dynamodb:us-east-1:123456789012:table/Orders"
}]
}
\`\`\`

5. Create and Attach IAM Role with Trust Policy (trust.json)
\`\`\`json
{
"Version": "2012-10-17",
"Statement": [{
"Effect": "Allow",
"Principal": { "Service": "ec2.amazonaws.com" },
"Action": "sts:AssumeRole"
}]
}
\`\`\`
\`\`\`bash
aws iam create-role --role-name EC2DynamoRole --assume-role-policy-document file://trust.json
   aws iam attach-role-policy --role-name EC2DynamoRole \
--policy-arn arn:aws:iam::123456789012:policy/YourCustomPolicy
\`\`\`

6. EC2 Instance Assumes Role
- Assign \`EC2DynamoRole\` to your instance profile.
- SDK/CLI calls automatically use temporary creds.

7. (Optional) Set a Permissions Boundary
\`\`\`bash
aws iam put-user-permissions-boundary \
--user-name app-developer \
--permissions-boundary arn:aws:iam::123456789012:policy/BoundaryPolicy
\`\`\`

8. Audit and Monitor
- Enable CloudTrail to log all IAM actions.
- Use IAM Access Advisor and AWS Config rules.

---

## 🚀 Beyond the Basics

- Attribute-Based Access Control (ABAC) with tags and \`aws:RequestTag\`.
- AWS Organizations Service Control Policies (SCPs) for account-wide guardrails.
- Cross-account roles for secure resource sharing.
- SAML/OIDC federation for single sign-on (SSO).
- IAM Access Analyzer to detect public/external access.
- Policy Simulator to test and validate permission sets.
- Session policies and tags for fine-grained temporary controls.
`
}
]
},

{
category: 'aws',
title: 'AWS Messaging Services: SQS & SNS',
subItems: [
{
question: 'How does Amazon SQS work and when should you use it?',
answerMd: `
### Amazon SQS Architecture

\`\`\`mermaid
sequenceDiagram
Producer->>SQS: SendMessage
Note right of SQS: Messages stored durably
Consumer->>SQS: ReceiveMessage / DeleteMessage
\`\`\`

- **Standard Queues**: at-least-once delivery, best-effort ordering.
- **FIFO Queues**: exactly-once processing, strict ordering.
- **Dead-Letter Queues**: isolate messages that exceed max retries.

\`\`\`js
// Node.js v3 example: send & receive
import { SQSClient, SendMessageCommand, ReceiveMessageCommand, DeleteMessageCommand } from "@aws-sdk/client-sqs";
const client = new SQSClient({ region: "us-east-1" });
await client.send(new SendMessageCommand({ QueueUrl, MessageBody: "Hello" }));
const msgs = await client.send(new ReceiveMessageCommand({ QueueUrl, MaxNumberOfMessages: 1 }));
if (msgs.Messages) {
await client.send(new DeleteMessageCommand({ QueueUrl, ReceiptHandle: msgs.Messages[0].ReceiptHandle! }));
}
\`\`\`
`
},
{
question: 'How does Amazon SNS work and when should you use it?',
answerMd: `
### Amazon SNS Fan-out

\`\`\`mermaid
flowchart TB
Publisher -->|Publish| SNS[Topic]
SNS -->|HTTP| Endpoint1[HTTP/S Endpoint]
SNS -->|Email| Endpoint2[Email]
SNS -->|SQS| Endpoint3[Queue]
\`\`\`

- **Topics** broadcast notifications to multiple subscribers.
- Supports HTTP/S, email, SMS, SQS, Lambda endpoints.
- Use SNS for push-based, real-time fan-out.

\`\`\`js
// Node.js v3: publish a message
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
const sns = new SNSClient({ region: "us-east-1" });
await sns.send(new PublishCommand({ TopicArn, Message: "Alert: job completed" }));
\`\`\`
`
}
]
},

{
category: 'aws',
title: 'AWS ETL & Analytics: Glue',
subItems: [
{
question: 'What is AWS Glue and what components does it have?',
answerMd: `
### AWS Glue Components

\`\`\`mermaid
flowchart LR
S3_Raw[S3 Raw Data] --> Crawler[Crawler] --> DataCatalog[Data Catalog]
DataCatalog --> Job[Glue ETL Job] --> S3_Cleaned[S3 Cleaned Data]
Job -->|Logs| CloudWatch[CloudWatch Logs]
\`\`\`

- **Glue Data Catalog**: unified metadata repository.
- **Crawlers**: infer schemas and populate the catalog.
- **ETL Jobs**: Spark-based scripts (Python/Scala) transform data.
- **Triggers**: schedule or event-driven job runs.

`
},
{
question: 'How do you author and run an AWS Glue job?',
answerMd: `
### Glue Job Example (Python)

\`\`\`python
import sys
from awsglue.transforms import *
from awsglue.utils import getResolvedOptions
from awsglue.context import GlueContext
from pyspark.context import SparkContext

args = getResolvedOptions(sys.argv, ["JOB_NAME"])
sc = SparkContext()
glueContext = GlueContext(sc)
spark = glueContext.spark_session

# Read from catalog
datasource = glueContext.create_dynamic_frame.from_catalog(
database="raw_db", table_name="events"
)

# Transform
mapped = ApplyMapping.apply(
frame=datasource,
mappings=[("userId", "string", "user_id", "string"),
("timestamp", "long", "ts", "timestamp")]
)

# Write back to S3 in Parquet
glueContext.write_dynamic_frame.from_options(
frame=mapped,
connection_type="s3",
connection_options={"path": "s3://cleaned-bucket/"},
format="parquet"
)

job.commit()
\`\`\`

**CLI to start job**
\`\`\`bash
aws glue start-job-run --job-name my-glue-job
\`\`\`
`
}
]
},
{
category: 'react',
title: 'Banking Finance App React',
subItems: [
{
question: 'How do I build a “Banking Finance App” React app from scratch covering every core React concept, using an Indian storytelling format — with diagrams?',
answerMd: `
# 🏦 Banking Finance App — An Indian Tale in React (with Visual Maps)

## 👥 Main Participants & Their Roles

| Participant | Role in the App |
|-------------|-----------------|
| **Arjun (Developer)** | The visionary banker turning needs into code |
| **Villagers & Merchants (Users)** | Manage accounts, transactions, and loans through the app |
| **React Components** | Building blocks — each a self‑contained part of the UI |
| **State Hooks** | Live registers for account balances & form inputs |
| **Effect Hooks** | The "postmen" fetching and syncing data |
| **Context API** | The central vault for shared state like authentication |
| **Reducer** | The double‑entry ledger for complex updates |
| **Routing** | Lanes of DhanPur guiding navigation |
| **Error Boundaries/Suspense** | Guards and loading gates |

---

## 🗺️ High‑Level Architecture (ASCII)

\`\`\`
+------------------+          +------------------+
|   Browser/App    |          |  React Router     |
+---------+--------+          +---------+---------+
|                             |
+-------v-----------------------------v------+
|                App.jsx                     |
+------+--------------+-------------+--------+
|              |             |
+-----v----+   +-----v-----+  +-----v-----+
| Accounts |   | Transactions| | LoanCalc |
+-----+----+   +------+------+ +-----+----+
|             |                |
useFetch/useState  useReducer        Render Props
|             |                |
Fetch API    Ledger State     EMI Computation
\`\`\`

---

## 🌳 Component Hierarchy Tree

\`\`\`
App
├── Navbar
├── Dashboard
├── Accounts
│    ├── AccountCard
│    └── AccountForm
├── Transactions
│    ├── TransactionList
│    └── TransactionForm
└── LoanCalculator
\`\`\`

---

## 🔄 Data Flow in the App

\`\`\`
[User Action] ---> [Component Event Handler]
|                      |
v                      v
setState / dispatch   API Call via useEffect/useFetch
|                      |
v                      v
React Re-render <--- State/Props Updated
\`\`\`

---

## 📖 Narrative

In bustling **DhanPur**, banker‑developer **Arjun** builds the village’s **digital finance hub** with React, moving from foundation to polished features.

---

## 1️⃣ Opening the Bank — _create‑react‑app_

\`\`\`bash
npx create-react-app banking-hub
cd banking-hub
npm start
\`\`\`

🏗️ **Foundation:** \`public/index.html\` (plot of land) and \`src/index.js\` (main gate).

---

## 2️⃣ Account Window — _Functional Components_

\`\`\`jsx
function AccountCard({ name, balance }) {
return (
<div className="account-card">
<h3>{name}</h3>
<p>Balance: ₹{balance}</p>
</div>
);
}
\`\`\`

---

## 3️⃣ Counting Deposits — _useState_

\`\`\`jsx
function DepositCounter() {
const [deposits, setDeposits] = useState(0);
return (
<div>
<p>Deposits today: {deposits}</p>
<button onClick={() => setDeposits(d => d + 1)}>
New Deposit
</button>
</div>
);
}
\`\`\`

---

## 4️⃣ Fetching Transactions — _useEffect_

\`\`\`jsx
function TransactionsList() {
const [txns, setTxns] = useState([]);
useEffect(() => {
fetch('/api/transactions')
.then(r => r.json())
.then(setTxns);
}, []);
return (
<ul>
{txns.map(t => (
<li key={t.id}>{t.date}: ₹{t.amount}</li>
))}
</ul>
);
}
\`\`\`

---

## 5️⃣ A Custom Ritual — _useFetch Hook_

\`\`\`jsx
export function useFetch(url) {
const [data, setData] = useState(null);
useEffect(() => {
fetch(url).then(r => r.json()).then(setData);
}, [url]);
return data;
}
\`\`\`

---

## 6️⃣ The Bank Vault — _Context API_

\`\`\`jsx
const AuthContext = createContext();
export function AuthProvider({ children }) {
const [user, setUser] = useState(null);
return (
<AuthContext.Provider value={{ user, setUser }}>
{children}
</AuthContext.Provider>
);
}
export function useAuth() { return useContext(AuthContext); }
\`\`\`

---

## 7️⃣ Balancing the Books — _useReducer_

\`\`\`js
export function ledgerReducer(state, action) {
switch (action.type) {
case 'ADD_TXN':    return [...state, action.txn];
case 'REMOVE_TXN': return state.filter(t => t.id !== action.id);
default:           return state;
}
}
\`\`\`

---

## 8️⃣ Loading Spinner — _HOC_

\`\`\`jsx
function withSpinner(Component) {
return ({ isLoading, ...props }) =>
isLoading ? <p>Loading…</p> : <Component {...props} />;
}
\`\`\`

---

## 9️⃣ Flexible Calculations — _Render Props_

\`\`\`jsx
function LoanCalculator({ render }) {
const rate = 0.08;
return <div>{render(rate)}</div>;
}
\`\`\`

---

## 🔟 Vault Tabs — _Compound Components_

*(Tab container + Tab content using shared context)*

---

## 1️⃣1️⃣ Safety Net — _Error Boundaries_

\`\`\`jsx
class TransactionErrorBoundary extends React.Component {
state = { hasError: false };
static getDerivedStateFromError() { return { hasError: true }; }
componentDidCatch(err) { console.error(err); }
render() {
return this.state.hasError
? <p>Failed to load transactions.</p>
: this.props.children;
}
}
\`\`\`

---

## 1️⃣2️⃣ Secret Safe — _Code Splitting_

\`\`\`jsx
const Accounts = React.lazy(() => import('./Accounts'));
const Transactions = React.lazy(() => import('./Transactions'));
\`\`\`

---

## 1️⃣3️⃣ Walking the Ledger — _React Router_

\`\`\`jsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
\`\`\`

---

## 1️⃣4️⃣ Performance Tuning — _useMemo & useCallback_

\`\`\`jsx
const highValueTxns = useMemo(
() => txns.filter(t => t.amount > 10000),
[txns]
);
\`\`\`

---

## 1️⃣5️⃣ The Grand Ledger — _Bringing It All Together_

Integrate all modules inside \`App.jsx\` with Auth, Routing, Suspense, and Error Boundaries.

---

## 📊 Visual Recap — React Concept Coverage

\`\`\`
+------------------------+    +-----------------------+
|   Basic Building Blocks|    |  State Management     |
| - Components           |    | - useState            |
| - Props                |    | - useReducer          |
+------------------------+    +-----------------------+
|                           |
v                           v
+------------------------+    +-----------------------+
| Side Effects & Data    |    |   App-wide State      |
| - useEffect            |    | - Context API         |
| - Custom Hooks         |    +-----------------------+
+------------------------+              |
|                           v
v                 +-----------------------+
+------------------------+     |   Advanced Patterns   |
| Routing / Code Splitting|    | - HOC                 |
| Error Boundaries       |     | - Render Props        |
+------------------------+     | - Compound Components |
+-----------------------+
\`\`\`

---

### 🌟 Epilogue

Every hook, pattern, and component Arjun built became a road, vault, or ledger entry in DhanPur’s new digital heart — a story told in code, diagrams, and the hum of smooth transactions.
`
}
]
},
{
category: 'react',
title: 'Healthcare App React',
subItems: [
{
question: 'How do I build a “Healthcare Hub” React app from scratch covering every core React concept, using an Indian storytelling format — with diagrams?',
answerMd: `
# 🏥 Healthcare Hub React App — An Indian Tale with Visual Maps

## 👥 Main participants and their roles

| Participant | Role in the app |
|-------------|-----------------|
| **Dr. Kavya (Developer)** | Designs and builds the digital clinic |
| **Patients** | View profiles, records, book appointments |
| **Staff (Reception/Doctors)** | Manage schedules, records, and triage |
| **React Components** | Rooms and widgets composing the UI |
| **State Hooks** | Live tallies and form inputs |
| **Effect Hooks** | Fetch and sync data with the server |
| **Context API** | Shared auth and global clinic settings |
| **Reducer** | Complex schedule/records updates |
| **Router** | Navigation across wards (pages) |
| **Error Boundaries/Suspense** | Safety nets and loading gates |

---

## 🗺️ High‑level architecture (ASCII)

\`\`\`
+-----------------+        +-----------------+
| Browser / App   |        | React Router    |
+--------+--------+        +--------+--------+
|                          |
+-------v--------------------------v-----+
|               App.jsx                  |
+-------+---------------+----------------+
|               |
+------v----+   +------v-------+    +-----------+
| Patients  |   | Appointments |    | Records   |
+-----+-----+   +------+-------+    +-----+-----+
|               |                  |
useFetch/useState  useReducer           useEffect
|               |                  |
Fetch API Data    Manage Schedule     Load Diagnostics
\`\`\`

---

## 🌳 Component hierarchy tree

\`\`\`
App
├── Navbar
├── Home
├── Patients
│    ├── PatientCard
│    └── PatientForm
├── Appointments
│    ├── AppointmentCounter
│    └── AppointmentList
├── MedicalRecords
└── Tabs (Compound)
├── TabList
├── Tab
└── TabPanel
\`\`\`

---

## 🔄 Data flow in the app

\`\`\`
[User Action] --> [Event Handler]
|                |
v                v
setState / dispatch   API call via useEffect/useFetch
|                |
v                v
React Re-render  <--  State / Props updated
\`\`\`

---

## 📖 Narrative

In the heart of **AarogyaPur**, **Dr. Kavya** envisioned a clinic without walls — a **Healthcare Hub** to serve every villager. With React as her stethoscope and keyboard as her scalpel, she shaped wards, counters, and records into a living, breathing app.

---

## 1️⃣ Laying the foundation — create‑react‑app

\`\`\`bash
npx create-react-app healthcare-hub
cd healthcare-hub
npm start
\`\`\`

---

## 2️⃣ Consultation room — Functional components

\`\`\`jsx
// src/components/PatientCard.jsx
import React from 'react';

export default function PatientCard({ name, age }) {
return (
<div className="patient-card" role="article" aria-label="Patient card">
<h3>{name}</h3>
<p>Age: {age}</p>
</div>
);
}
\`\`\`

---

## 3️⃣ Counting appointments — useState

\`\`\`jsx
import React, { useState } from 'react';

export function AppointmentCounter() {
const [count, setCount] = useState(0);
return (
<div>
<p>Appointments booked: {count}</p>
<button onClick={() => setCount(c => c + 1)}>
Book Appointment
</button>
</div>
);
}
\`\`\`

---

## 4️⃣ Fetching records — useEffect

\`\`\`jsx
import React, { useState, useEffect } from 'react';

export function MedicalRecords() {
const [records, setRecords] = useState([]);
const [error, setError] = useState(null);

useEffect(() => {
let cancelled = false;
fetch('/api/records')
.then(r => {
if (!r.ok) throw new Error('Failed to fetch records');
return r.json();
})
.then(data => { if (!cancelled) setRecords(data); })
.catch(e => { if (!cancelled) setError(e.message); });
return () => { cancelled = true; };
}, []);

if (error) return <p role="alert">Error: {error}</p>;
return (
<ul>
{records.map(r => (
<li key={r.id}>{r.patientName}: {r.diagnosis}</li>
))}
</ul>
);
}
\`\`\`

---

## 5️⃣ A reusable ritual — Custom hook useFetch

\`\`\`jsx
// src/hooks/useFetch.js
import { useState, useEffect } from 'react';

export function useFetch(url, opts) {
const [data, setData] = useState(null);
const [loading, setLoading] = useState(!!url);
const [error, setError] = useState(null);

useEffect(() => {
if (!url) return;
let cancelled = false;
setLoading(true);
fetch(url, opts)
.then(r => (r.ok ? r.json() : Promise.reject(new Error(r.statusText))))
.then(d => { if (!cancelled) setData(d); })
.catch(e => { if (!cancelled) setError(e); })
.finally(() => { if (!cancelled) setLoading(false); });
return () => { cancelled = true; };
}, [url]);

return { data, loading, error };
}
\`\`\`

---

## 6️⃣ Shared clinic — Context API (Auth)

\`\`\`jsx
// src/AuthContext.js
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
const [user, setUser] = useState(null);
const login = (u) => setUser(u);
const logout = () => setUser(null);
return (
<AuthContext.Provider value={{ user, login, logout }}>
{children}
</AuthContext.Provider>
);
}

export function useAuth() {
const ctx = useContext(AuthContext);
if (!ctx) throw new Error('useAuth must be used within AuthProvider');
return ctx;
}
\`\`\`

---

## 7️⃣ Managing schedules — useReducer

\`\`\`js
// src/scheduleReducer.js
export function scheduleReducer(state, action) {
switch (action.type) {
case 'ADD':
return [...state, action.appointment];
case 'REMOVE':
return state.filter(a => a.id !== action.id);
case 'UPDATE':
return state.map(a => a.id === action.appointment.id ? action.appointment : a);
default:
return state;
}
}
\`\`\`

---

## 8️⃣ Loading spinner — Higher‑order component

\`\`\`jsx
export function withSpinner(Component) {
return function Wrapped({ isLoading, ...props }) {
return isLoading ? <p>Loading…</p> : <Component {...props} />;
};
}
\`\`\`

---

## 9️⃣ Customizable banner — Render props

\`\`\`jsx
export function AlertBox({ render }) {
const style = { border: '1px solid #d33', padding: 10, borderRadius: 6 };
return <div style={style} role="region" aria-label="Alert">{render()}</div>;
}
\`\`\`

---

## 🔟 Clinic tabs — Compound components

\`\`\`jsx
// src/components/Tabs.jsx
import React, { createContext, useContext, useState } from 'react';

const TabsCtx = createContext();

export function Tabs({ defaultIndex = 0, children }) {
const [active, setActive] = useState(defaultIndex);
return <TabsCtx.Provider value={{ active, setActive }}>{children}</TabsCtx.Provider>;
}
export function TabList({ children }) { return <div role="tablist">{children}</div>; }
export function Tab({ index, children }) {
const { active, setActive } = useContext(TabsCtx);
const isActive = active === index;
return (
<button
role="tab"
aria-selected={isActive}
onClick={() => setActive(index)}
style={{ fontWeight: isActive ? '700' : '400', marginRight: 8 }}
>
{children}
</button>
);
}
export function TabPanel({ index, children }) {
const { active } = useContext(TabsCtx);
return active === index ? <div role="tabpanel">{children}</div> : null;
}
\`\`\`

Usage:

\`\`\`jsx
<Tabs defaultIndex={0}>
<TabList>
<Tab index={0}>Patients</Tab>
<Tab index={1}>Appointments</Tab>
</TabList>
<TabPanel index={0}><Patients /></TabPanel>
<TabPanel index={1}><Appointments /></TabPanel>
</Tabs>
\`\`\`

---

## 1️⃣1️⃣ Safety net — Error boundaries

\`\`\`jsx
export class ErrorBoundary extends React.Component {
state = { hasError: false };
static getDerivedStateFromError() { return { hasError: true }; }
componentDidCatch(err, info) { console.error('Boundary caught:', err, info); }
render() {
return this.state.hasError ? <p>Something went wrong.</p> : this.props.children;
}
}
\`\`\`

---

## 1️⃣2️⃣ Code splitting — React.lazy & Suspense

\`\`\`jsx
import React, { lazy, Suspense } from 'react';
const Patients = lazy(() => import('./Patients'));
const Appointments = lazy(() => import('./Appointments'));

export function Modules() {
return (
<Suspense fallback={<p>Loading module…</p>}>
<Patients />
<Appointments />
</Suspense>
);
}
\`\`\`

---

## 1️⃣3️⃣ Navigating wards — React Router

\`\`\`jsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import Patients from './Patients';
import Appointments from './Appointments';

export function RouterRoot() {
return (
<BrowserRouter>
<nav aria-label="Primary">
<Link to="/">Home</Link>
<Link to="/patients">Patients</Link>
<Link to="/appointments">Appointments</Link>
</nav>
<Routes>
<Route path="/" element={<Home />} />
<Route path="/patients" element={<Patients />} />
<Route path="/appointments" element={<Appointments />} />
</Routes>
</BrowserRouter>
);
}
\`\`\`

---

## 1️⃣4️⃣ Performance tuning — useMemo & useCallback

\`\`\`jsx
import React, { useMemo, useCallback } from 'react';

export function PatientsOptimized({ patients, bookAppointment }) {
const sortedPatients = useMemo(
() => [...patients].sort((a, b) => a.name.localeCompare(b.name)),
[patients]
);
const handleBook = useCallback((id) => bookAppointment(id), [bookAppointment]);

return (
<ul>
{sortedPatients.map(p => (
<li key={p.id}>
{p.name} — {p.age}
<button onClick={() => handleBook(p.id)}>Book</button>
</li>
))}
</ul>
);
}
\`\`\`

---

## 1️⃣5️⃣ The grand opening — Bringing it all together

\`\`\`jsx
// src/App.jsx
import React, { lazy, Suspense } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import { ErrorBoundary } from './ErrorBoundary';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

const Home = () => <p>Welcome to AarogyaPur Healthcare Hub</p>;
const Patients = lazy(() => import('./Patients'));
const Appointments = lazy(() => import('./Appointments'));
const MedicalRecords = lazy(() => import('./MedicalRecords'));

function Shell() {
const { user, login, logout } = useAuth();
return (
<div>
<header>
<h1>Healthcare Hub{user ? \`, Dr. \${user.name}\` : ''}</h1>
{user ? (
<button onClick={logout}>Logout</button>
) : (
<button onClick={() => login({ name: 'Kavya' })}>Login</button>
)}
</header>

<BrowserRouter>
<nav>
<Link to="/">Home</Link>
<Link to="/patients">Patients</Link>
<Link to="/appointments">Appointments</Link>
<Link to="/records">Records</Link>
</nav>

<ErrorBoundary>
<Suspense fallback={<p>Loading…</p>}>
<Routes>
<Route path="/" element={<Home />} />
<Route path="/patients" element={<Patients />} />
<Route path="/appointments" element={<Appointments />} />
<Route path="/records" element={<MedicalRecords />} />
</Routes>
</Suspense>
</ErrorBoundary>
</BrowserRouter>
</div>
);
}

export default function App() {
return (
<AuthProvider>
<Shell />
</AuthProvider>
);
}
\`\`\`

---

## 🧭 Optional mermaid diagrams (rendered when supported)

\`\`\`mermaid
flowchart TD
A[User Action] --> B[Event Handler]
B --> C{State Update?}
C -->|setState| D[Re-render]
C -->|dispatch| E[Reducer]
E --> D
D --> F[Effects run]
F -->|fetch| G[Server]
G --> F
\`\`\`

\`\`\`mermaid
graph TD
App --> Navbar
App --> Patients
App --> Appointments
App --> MedicalRecords
Patients --> PatientCard
Patients --> PatientForm
Appointments --> AppointmentCounter
Appointments --> AppointmentList
\`\`\`

---

## 📊 Visual recap — React concept coverage

\`\`\`
+------------------------+    +-----------------------+
|   Basic Building Blocks|    |  State Management     |
| - Components           |    | - useState            |
| - Props                |    | - useReducer          |
+------------------------+    +-----------------------+
|                           |
v                           v
+------------------------+    +-----------------------+
| Side Effects & Data    |    |   App-wide State      |
| - useEffect            |    | - Context API         |
| - Custom Hooks         |    +-----------------------+
+------------------------+              |
|                           v
v                 +-----------------------+
+------------------------+     |   Advanced Patterns   |
| Routing / Code Splitting|    | - HOC                 |
| Error Boundaries       |     | - Render Props        |
+------------------------+     | - Compound Components |
+-----------------------+
\`\`\`

---

### 🌟 Epilogue

With components as consultation rooms, context as the clinic’s vault, reducers as the master schedule, and effects as messengers to the server, **AarogyaPur’s Healthcare Hub** hums with care. Every click becomes kindness, every render a reassurance — React, in service of healing.
`
}
]
},

{
category: 'react',
title: 'Village Market React App',
subItems: [
{
question: 'How do I build a “Village Market” React app from scratch covering every core React concept, using an Indian storytelling format?',
answerMd: `
### The Village Market React App: An Indian Tale

Once upon a time in the dusty lanes of Reactpur, young Aanya set out to build a “Village Market” web app that would teach every core React concept. Let’s walk with her as she lays each brick and thatches every roof.

---

#### 1. Bootstrapping the Village
Aanya starts by calling the village architect:

\`\`\`bash
npx create-react-app village-market
cd village-market
npm start
\`\`\`

This scaffolds the map (\`public/index.html\`) and the main gate (\`src/index.js\`).

---

#### 2. Houses and Cottages: Functional Components
Each shop is a React component:

\`\`\`jsx
// src/components/Shop.jsx
import React from 'react';

function Shop({ name }) {
return <h2>Welcome to {name} Shop</h2>;
}

export default Shop;
\`\`\`

Props like \`name\` are the shop’s signboard.

---

#### 3. Inside the Shop: State with useState
To count mangoes sold:

\`\`\`jsx
import React, { useState } from 'react';

function MangoCounter() {
const [count, setCount] = useState(0);
return (
<div>
<p>Mangoes sold: {count}</p>
<button onClick={() => setCount(c => c + 1)}>
Sell one more
</button>
</div>
);
}
\`\`\`

\`useState\` is the shopkeeper’s ledger.

---

#### 4. Fetching Supplies: Side Effects with useEffect

\`\`\`jsx
import React, { useState, useEffect } from 'react';

function PriceBoard() {
const [price, setPrice] = useState(null);

useEffect(() => {
fetch('/api/mango-price')
.then(res => res.json())
.then(data => setPrice(data.price));
}, []); // run once at dawn

  return <p>Current price: ₹{price ?? 'loading…'}</p>;
}
\`\`\`

\`useEffect\` is the daily trip to the city market.

---

#### 5. A Custom Ritual: useFetch Hook
Aanya crafts a reusable data-fetching ritual:

\`\`\`jsx
// src/hooks/useFetch.js
import { useState, useEffect } from 'react';

export function useFetch(url) {
const [data, setData] = useState(null);
useEffect(() => {
fetch(url).then(r => r.json()).then(setData);
}, [url]);
return data;
}
\`\`\`

Now any shop calls \`const items = useFetch('/api/items')\`.

---

#### 6. The Village Council: Context API
A shared cart across shops:

\`\`\`jsx
// src/CartContext.js
import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
const [items, setItems] = useState([]);
return (
<CartContext.Provider value={{ items, setItems }}>
{children}
</CartContext.Provider>
);
}

export function useCart() {
return useContext(CartContext);
}
\`\`\`

Wrap \`<CartProvider><App/></CartProvider>\` in \`src/index.js\`.

---

#### 7. Complex Accounting: useReducer
When the ledger grows:

\`\`\`js
// src/cartReducer.js
export function cartReducer(state, action) {
switch (action.type) {
case 'ADD':    return [...state, action.item];
case 'REMOVE': return state.filter(i => i.id !== action.id);
default:       return state;
}
}
\`\`\`

In the provider use \`useReducer(cartReducer, [])\`.

---

#### 8. Decorating Shops: HOCs
Show a spinner around shops:

\`\`\`jsx
function withSpinner(Component) {
return function Wrapped({ isLoading, ...rest }) {
return isLoading
? <p>Loading shop…</p>
: <Component {...rest} />;
};
}
\`\`\`

Use: \`const ShopWithSpinner = withSpinner(Shop);\`

---

#### 9. Flexible Gifts: Render Props
Wrap any gift dynamically:

\`\`\`jsx
function GiftWrapper({ render }) {
const style = { border: '2px dotted green', padding: 10 };
return <div style={style}>{render()}</div>;
}

// Usage:
<GiftWrapper render={() => <p>Your mango gift pack!</p>} />
\`\`\`

---

#### 10. Seasonal Offers: Compound Components
Build a tab system with shared context—just like grouping villagers at a festival.

---

#### 11. Saving Honor: Error Boundaries

\`\`\`jsx
class ShopErrorBoundary extends React.Component {
state = { hasError: false };
static getDerivedStateFromError() { return { hasError: true }; }
componentDidCatch(err) { console.error(err); }
render() {
return this.state.hasError
? <p>Sorry, this shop is closed.</p>
: this.props.children;
}
}
\`\`\`

---

#### 12. Secret Scrolls: Code Splitting

\`\`\`jsx
const Shop = React.lazy(() => import('./Shop'));

function App() {
return (
<Suspense fallback={<p>Loading village…</p>}>
<Shop name="Mango" />
</Suspense>
);
}
\`\`\`

---

#### 13. Navigating Lanes: React Router
Stroll between Home, Market, Cart:

\`\`\`bash
npm install react-router-dom
\`\`\`

\`\`\`jsx
import {
BrowserRouter,
Routes,
Route,
Link
} from 'react-router-dom';

function App() {
return (
<BrowserRouter>
<nav>
<Link to="/">Home</Link>
<Link to="/market">Market</Link>
<Link to="/cart">Cart</Link>
</nav>
<Routes>
<Route path="/"      element={<Home />} />
<Route path="/market" element={<Market />} />
<Route path="/cart"   element={<Cart />} />
</Routes>
</BrowserRouter>
);
}
\`\`\`

---

#### 14. Spices & Performance: useMemo & useCallback

\`\`\`jsx
const expensiveValue = useMemo(() => computeBlend(items), [items]);
const handleClick    = useCallback(() => addToCart(item), [item]);
\`\`\`

---

#### 15. The Grand Feast: Bringing It All Together

\`\`\`jsx
// src/App.jsx
import React, { lazy, Suspense } from 'react';
import { useCart } from './CartContext';
import ShopErrorBoundary from './ShopErrorBoundary';

const Market = lazy(() => import('./Market'));
const Cart   = lazy(() => import('./Cart'));

function App() {
const { items } = useCart();
return (
<div>
<h1>Welcome to Village Market</h1>
<p>In cart: {items.length} items</p>
<ShopErrorBoundary>
<Suspense fallback={<p>Loading section…</p>}>
<Market />
<Cart />
</Suspense>
</ShopErrorBoundary>
</div>
);
}

export default App;
\`\`\`

Through functional and class components, props, state, effects, hooks, context, reducers, HOCs, render props, error boundaries, code splitting, routing, and performance optimizations, Aanya’s Village Market became the most vibrant bazaar in all the web lands.
`
}
]
},
{
category: 'react',
title: 'React Basic Concepts',
subItems: [
{
question: 'What is JSX and how does it work?',
answerMd: `
### What Is JSX?

\`\`\`mermaid
flowchart LR
JSX["JSX Code"] --> Babel["Babel / TypeScript Compiler"]
Babel --> JS["JavaScript"]
JS --> Browser["Browser Runtime"]
\`\`\`

JSX is a syntax extension that lets you write HTML-like code in JavaScript. Under the hood, Babel transforms JSX into \`React.createElement\` calls, which produce React elements.

\`\`\`jsx
// JSX
const element = <h1 className="title">Hello, world!</h1>;

// Transpiled JavaScript
const element = React.createElement(
'h1',
{ className: 'title' },
'Hello, world!'
);
\`\`\`
`
},
{
question: 'What is a React component, and how do you define one?',
answerMd: `
Imagine you’re building a house out of Lego. Each Lego brick is a small, self-contained piece that has its own shape and color. In React, a “component” is like one of those bricks—it’s a standalone building block of your UI.

- You define it by writing a JavaScript function or class that takes inputs (props) and returns a description of what it should look like (JSX).
- Just as you can snap bricks together to form walls or towers, you compose React components to form your complete app.
`
},
{
question: 'How do you create a functional component?',
answerMd: `
Think of a functional component as a Lego instruction card that just says “take these bricks (props) and snap them together this way (JSX).”

\`\`\`jsx
function Greeting({ name }) {
return <h1>Hello, {name}!</h1>;
}
export default Greeting;
\`\`\`

- Props are like the colors or shapes you choose on the instruction card.
- Hooks (useState, useEffect) are like little timers or sticky notes you attach to track state or side-jobs without changing the instructions themselves.
`
},
{
question: 'When and how would you use a class component?',
answerMd: `
A class component is like an elaborate, old-school factory machine with on/off switches, status lights, and maintenance callbacks. You use it when you need lifecycle hooks—points where you want the machine to:

- power up (\`componentDidMount\`)
- check safety pre-flight (\`shouldComponentUpdate\`)
- handle breakdowns (\`componentDidCatch\`)

\`\`\`jsx
class Counter extends React.Component {
state = { count: 0 };
increment = () => this.setState({ count: this.state.count + 1 });
render() {
return (
<div>
<p>{this.state.count}</p>
<button onClick={this.increment}>+1</button>
</div>
);
}
}
\`\`\`
`
},
{
question: 'What is the role of props and the `children` prop in composition?',
answerMd: `
Picture a gift box (the parent component) that you can customize with a ribbon color and gift tag (props). Inside the box you can drop any gift you like—chocolates, a toy car, or jewelry (children).

\`\`\`jsx
function Card({ title, children }) {
return (
<div className="card">
<h2>{title}</h2>
<div>{children}</div>
</div>
);
}
\`\`\`

- \`title\` is like the label on the box.
- \`children\` is whatever you choose to put inside—pure flexibility for nesting content.
`
},
{
question: 'How do Higher-Order Components (HOCs) share logic?',
answerMd: `
Imagine a gift-wrapping service: you hand them any gift (component) and they wrap it in fancy paper and ribbon (added behavior), then hand it back. That’s exactly what an HOC does.

\`\`\`jsx
function withLoading(WrappedComponent) {
return function Loader({ isLoading, ...props }) {
return isLoading
? <p>Loading…</p>
: <WrappedComponent {...props} />;
};
}
\`\`\`

- You never change the original gift—you just enhance it externally.
`
},
{
question: 'What are render props, and how do they work?',
answerMd: `
Think of a theme park ride where at the end you get a “design your own souvenir” token. The ride operator (parent component) passes you your ride stats (state) and you use that to craft your own souvenir (render function).

\`\`\`jsx
<MouseTracker render={({ x, y }) => (
<p>You moved to {x}, {y}</p>
)} />
\`\`\`

- The parent doesn’t know exactly what you’ll build, but it provides the raw data and you decide how to present it.
`
},
{
question: 'What are compound components, and when should you use them?',
answerMd: `
Imagine a restaurant: you have a Menu (Tabs), MenuItems (Tab buttons), and Dishes (TabPanels). They share the same table reservation (context) so when you pick a MenuItem, the right Dish shows up—no waiter (prop-drilling) needed.

\`\`\`jsx
<Tabs>
<TabList>
<Tab index={0}>Starters</Tab>
<Tab index={1}>Mains</Tab>
</TabList>
<TabPanels>
<div>Soup & Salad</div>
<div>Steak & Potatoes</div>
</TabPanels>
</Tabs>
\`\`\`

- They work as a group, sharing state invisibly via context—just like everyone at your table knows your reservation code.
`
},
{
question: 'How do you manage global or deeply nested state?',
answerMd: `
Picture a building’s central air-conditioning system (Context). Instead of running a tiny cooler in every room (passing props down dozens of levels), you wire each room to the central unit and just flip a switch (useContext).

\`\`\`jsx
const AuthContext = React.createContext();
function AuthProvider({ children }) {
const [user, setUser] = useState(null);
return (
<AuthContext.Provider value={{ user, setUser }}>
{children}
</AuthContext.Provider>
);
}
\`\`\`

- Any component can call \`useContext(AuthContext)\` and get the current “temperature” (user).
`
},
{
question: 'How can you visualize component composition?',
answerMd: `
Think of your UI as a skyscraper blueprint—each floor (component) contains rooms (sub-components), and rooms contain furniture (leaf components).

\`\`\`mermaid
graph TD
App --> Header
App --> Main
Main --> Sidebar
Main --> Content
Content --> WidgetA
Content --> WidgetB
\`\`\`
`
},
{
question: 'What are props and state in React?',
answerMd: `
### Props vs State

\`\`\`mermaid
flowchart LR
Parent["Parent"] --props--> Child["Child"]
Child --reads--> Display["Display Output"]

Child --calls setState--> StateChanged["Component Re-renders"]
\`\`\`

- **Props** are read-only inputs passed from parent to child.
- **State** is managed within a component and can change over time, triggering re-renders.

\`\`\`jsx
function Counter({ initial }) {
const [count, setCount] = useState(initial); // state

  return (
<div>
<p>Count: {count}</p>
<button onClick={() => setCount(count + 1)}>Increase</button>
</div>
);
}

// Usage
<Counter initial={0} />
\`\`\`
`
},
{
question: 'What is the Virtual DOM and how does reconciliation work?',
answerMd: `
### Virtual DOM & Reconciliation

\`\`\`mermaid
flowchart TD
Render1["Virtual DOM A"] -->|User Event| Render2["Virtual DOM B"]
Render1 -->|diff| Diff["Compute minimal changes"]
Diff --> Patch["Apply patches to Real DOM"]
\`\`\`

React keeps a lightweight copy of the DOM (Virtual DOM). On state or prop changes, it diffs old vs new Virtual DOM trees, computes the smallest set of updates, and patches the real DOM, optimizing performance.
`
},
{
question: 'What are React Hooks?',
answerMd: `
### Introduction to Hooks

Hooks are functions that let you “hook into” React features in functional components.

- **useState**: add local state
- **useEffect**: side effects and lifecycle
- **useContext**, **useReducer**, etc.

Hooks let you reuse stateful logic without classes.

\`\`\`jsx
import React, { useState, useEffect } from 'react';
\`\`\`
`
},
{
question: 'How do useState and useEffect work?',
answerMd: `
### useState & useEffect

\`\`\`mermaid
flowchart LR
Init["Initial Render"] --> useState1["useState Hook"]
useState1 --> Render["Render UI"]
Render --> useEffect1["useEffect Hook"]
useEffect1 -->|runs after paint| Effect["Perform side effect"]
\`\`\`

\`\`\`jsx
function Timer() {
const [seconds, setSeconds] = useState(0);

useEffect(() => {
const id = setInterval(() => setSeconds(s => s + 1), 1000);
return () => clearInterval(id); // cleanup on unmount
  }, []); // empty deps: run once

  return <div>Seconds: {seconds}</div>;
}
\`\`\`
`
},
{
question: 'How do you handle events in React?',
answerMd: `
### Event Handling

\`\`\`mermaid
flowchart LR
User["User Click"] -->|onClick| Button["<button>"]
Button --> Handler["handler function"]
Handler --> Update["State update"]
\`\`\`

React events use camelCase and receive a SyntheticEvent.

\`\`\`jsx
function Toggle() {
const [on, setOn] = useState(false);

function handleClick(e) {
console.log(e.target); // SyntheticEvent
    setOn(prev => !prev);
}

return (
<button onClick={handleClick}>
{on ? 'ON' : 'OFF'}
</button>
);
}
\`\`\`
`
},
{
question: 'What is conditional rendering in React?',
answerMd: `
### Conditional Rendering

\`\`\`mermaid
flowchart TB
State["state.show"] -->|true| A["<ComponentA />"]
State -->|false| B["<ComponentB />"]
\`\`\`

Render UI based on conditions using JavaScript expressions.

\`\`\`jsx
function Greeting({ isLoggedIn }) {
return (
<div>
{isLoggedIn ? <h1>Welcome back!</h1> : <h1>Please sign in.</h1>}
{isLoggedIn && <LogoutButton />}
</div>
);
}
\`\`\`
`
}
]
},// Add this as the next card in your src/qa-data.ts

{
category: 'react',
title: 'Context vs Redux for State Management',
subItems: [
{
question: 'What is React Context API and when to use it?',
answerMd: `
### React Context API

\`\`\`mermaid
flowchart LR
Provider["<ThemeContext.Provider>"]
Consumer["useContext(ThemeContext)"]
Provider --> Consumer
\`\`\`

Context lets you share values (theme, locale, auth) across the component tree without prop-drilling.

\`\`\`jsx
import React, { useContext } from 'react';

const ThemeContext = React.createContext('light');

function App() {
return (
<ThemeContext.Provider value="dark">
<Toolbar />
</ThemeContext.Provider>
);
}

function Toolbar() {
return <ThemedButton />;
}

function ThemedButton() {
const theme = useContext(ThemeContext);
return <button className={theme}>Current theme: {theme}</button>;
}
\`\`\`

Use Context for low-frequency updates and small slices of global data.
`
},
{
question: 'What is Redux and how does it work?',
answerMd: `
### Redux Architecture

\`\`\`mermaid
flowchart TD
Dispatch["dispatch(action)"] --> Store["Redux Store"]
Store --> Reducer["reducer(state, action)"]
Reducer --> State["new state"]
State --> Subscribers["UI updates via useSelector"]
\`\`\`

Redux centralizes state in a single immutable store.
- **Actions** describe “what happened.”
- **Reducers** compute new state.
- **Store** holds the state and dispatches updates.

\`\`\`jsx
import { createStore } from 'redux';

const initialState = { count: 0 };

function counterReducer(state = initialState, action) {
switch (action.type) {
case 'INCREMENT':
return { count: state.count + 1 };
default:
return state;
}
}

const store = createStore(counterReducer);

store.subscribe(() => console.log(store.getState()));
store.dispatch({ type: 'INCREMENT' }); // { count: 1 }
\`\`\`
`
},
{
question: 'How do you wire up Redux in a React app?',
answerMd: `
### Integrating Redux with React

\`\`\`mermaid
flowchart TD
Store["Redux Store"] --> Provider["<Provider store>"]
Provider --> App["<App />"]
App --> useSelector["useSelector()"]
App --> useDispatch["useDispatch()"]
\`\`\`

\`\`\`jsx
import React from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { createStore } from 'redux';

const store = createStore(counterReducer);

function Counter() {
const count = useSelector(state => state.count);
const dispatch = useDispatch();
return (
<div>
<p>{count}</p>
<button onClick={() => dispatch({ type: 'INCREMENT' })}>
+
</button>
</div>
);
}

function App() {
return <Counter />;
}

export default function Root() {
return (
<Provider store={store}>
<App />
</Provider>
);
}
\`\`\`
`
},
{
question: 'What are the key differences between Context API and Redux?',
answerMd: `
### Context vs Redux: Feature Comparison

| Aspect                | Context API                                         | Redux                                                          |
|-----------------------|-----------------------------------------------------|----------------------------------------------------------------|
| Data Source           | Multiple independent contexts                       | Single centralized store                                       |
| Updates Frequency     | Low to medium                                       | Can handle high-frequency updates                              |
| Boilerplate           | Minimal                                             | More setup (actions, reducers, middleware)                     |
| DevTools              | No built-in                                       | Redux DevTools for time-travel debugging                       |
| Ecosystem             | Built into React                                    | Rich middleware (Thunk, Saga), community plugins               |
| Performance Concerns  | Propagates to all consumers unless memoized         | Scoped updates via selectors, middleware for async flows       |

Use Context for simple, static data. Choose Redux for complex state logic, caching, or cross-cutting concerns.
`
},
{
question: 'How can you combine Context with useReducer as a lightweight alternative to Redux?',
answerMd: `
### Context + useReducer Pattern

\`\`\`mermaid
flowchart TB
Reducer["useReducer"] --> State["state, dispatch"]
State & Dispatch --> Provider["Context.Provider"]
Provider --> Consumers["useContext"]
\`\`\`

\`\`\`jsx
import React, { useReducer, useContext } from 'react';

const AuthContext = React.createContext();

const initialAuth = { user: null };

function authReducer(state, action) {
switch (action.type) {
case 'LOGIN':
return { user: action.payload };
case 'LOGOUT':
return { user: null };
default:
return state;
}
}

export function AuthProvider({ children }) {
const [state, dispatch] = useReducer(authReducer, initialAuth);
return (
<AuthContext.Provider value={{ state, dispatch }}>
{children}
</AuthContext.Provider>
);
}

export function useAuth() {
return useContext(AuthContext);
}
\`\`\`

This pattern gives you Redux-like reducers and dispatch, with zero extra dependencies.
`
},
{
question: 'When should you choose Context over Redux (and vice versa)?',
answerMd: `
### Choosing the Right Tool

- Use Context API when:
- You have a few global values (theme, locale, user).
- Updates are infrequent.
- You want minimal boilerplate.

- Use Redux when:
- Your app has complex, interconnected state.
- You need time-travel debugging or middleware.
- You handle high-frequency updates (e.g., real-time data).

Both can coexist—use Redux for core business logic and Context for UI concerns like theming.
`
}
]
},// Add this as the next card in your src/qa-data.ts

{
category: 'react',
title: 'React Router and Dynamic Routes',
subItems: [
{
question: 'How do you install and set up React Router?',
answerMd: `
### 1. Installation

\`\`\`bash
npm install react-router-dom
\`\`\`

### 2. Root Setup

\`\`\`jsx
// index.tsx or main.tsx
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

ReactDOM.render(
<BrowserRouter>
<App />
</BrowserRouter>,
document.getElementById('root')
);
\`\`\`
`
},
{
question: 'How do you define and render basic routes?',
answerMd: `
### Defining Routes

\`\`\`mermaid
flowchart LR
BrowserRouter --> Routes
Routes --> RouteHome[/"path: \"/\" -> Home"/]
Routes --> RouteAbout[/"path: \"/about\" -> About"/]
\`\`\`

\`\`\`jsx
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import About from './About';

function App() {
return (
<Routes>
<Route path="/" element={<Home />} />
<Route path="/about" element={<About />} />
</Routes>
);
}
\`\`\`
`
},
{
question: 'How do you create navigation links?',
answerMd: `
### Navigation with Links

\`\`\`mermaid
flowchart LR
Navbar --> LinkHome["<Link to='/'/> Home"]
Navbar --> LinkAbout["<Link to='/about'/> About"]
\`\`\`

\`\`\`jsx
import { Link } from 'react-router-dom';

function Navbar() {
return (
<nav>
<Link to="/">Home</Link>
<Link to="/about">About</Link>
</nav>
);
}
\`\`\`
`
},
{
question: 'What are dynamic routes and how do you define them?',
answerMd: `
### Dynamic Routes

\`\`\`mermaid
flowchart LR
Routes --> RouteUser[/"path: \"/users/:id\" -> UserProfile"/]
\`\`\`

\`\`\`jsx
// In App.tsx
<Routes>
<Route path="/users/:id" element={<UserProfile />} />
</Routes>
\`\`\`
`
},
{
question: 'How do you access URL parameters in a component?',
answerMd: `
### Accessing URL Params

\`\`\`jsx
import { useParams } from 'react-router-dom';

function UserProfile() {
const { id } = useParams();
// fetch user by id or display
  return <div>User Profile for ID: {id}</div>;
}
\`\`\`
`
},
{
question: 'How do you handle 404 Not Found pages?',
answerMd: `
### 404 Not Found

\`\`\`jsx
import NotFound from './NotFound';

<Routes>
{/* other routes */}
<Route path="*" element={<NotFound />} />
</Routes>
\`\`\`
`
},
{
question: 'How do you navigate programmatically?',
answerMd: `
### Programmatic Navigation

\`\`\`mermaid
flowchart LR
Component --> useNavigate["useNavigate() hook"]
useNavigate --> navigate["navigate('/path')"]
\`\`\`

\`\`\`jsx
import { useNavigate } from 'react-router-dom';

function Login() {
const navigate = useNavigate();

function onLoginSuccess() {
// after your logic, redirect
    navigate('/dashboard');
}

return <button onClick={onLoginSuccess}>Log In</button>;
}
\`\`\`
`
}
]
},// Add this as the next card in your src/qa-data.ts

{
category: 'react',
title: 'Best Practices for Custom Hooks and Performance Tuning',
subItems: [
{
question: 'What is a custom Hook and when should you create one?',
answerMd: `
### Defining Custom Hooks

\`\`\`mermaid
flowchart LR
ComponentA --> HookA["useCustomHook()"]
HookA --> Logic["shared logic"]
Logic --> State["useState / useEffect"]
\`\`\`

A custom Hook is a JavaScript function whose name starts with "use" and that can call other Hooks. Create one when:
- You have reusable stateful logic across components.
- You need to encapsulate side effects or subscriptions.
- You want to improve separation of concerns in your UI.
`
},
{
question: 'How should you name and structure your custom Hooks?',
answerMd: `
### Naming & Structure

1. Prefix with "use" so React can enforce the Rules of Hooks.
2. Keep parameters minimal and explicit.
3. Return a consistent API (array for ordering, object for named values).

\`\`\`jsx
// Good: clear signature and return shape
function useFetch(url) {
const [data, setData] = useState(null);
const [error, setError] = useState(null);

useEffect(() => {
fetch(url)
.then(res => res.json())
.then(setData)
.catch(setError);
}, [url]);

return { data, error };
}
\`\`\`
`
},
{
question: 'How do you manage dependencies and avoid stale closures?',
answerMd: `
### Dependency Management

\`\`\`mermaid
flowchart LR
useCallback --> deps["dependency array"]
StateChange --> Recreate["recreate callback"]
NoDeps --> Stale["stale variables"]
\`\`\`

- Always list every external variable in your dependency array.
- Use \`useCallback\` or \`useMemo\` when passing functions/objects to children.
- Prefer stable references (e.g., refs) for values you don’t want to re-trigger effects.
`
},
{
question: 'What are best practices for testing custom Hooks?',
answerMd: `
### Testing Custom Hooks

\`\`\`jsx
import { renderHook, act } from '@testing-library/react-hooks';

function useCounter(initial = 0) {
const [count, setCount] = useState(initial);
const increment = () => setCount(c => c + 1);
return { count, increment };
}

test('should increment counter', () => {
const { result } = renderHook(() => useCounter(5));

act(() => {
result.current.increment();
});

expect(result.current.count).toBe(6);
});
\`\`\`

- Use \`@testing-library/react-hooks\` for isolated hook tests.
- Wrap hook calls in \`act()\` for state updates.
- Mock external modules or APIs to avoid side effects.
`
},
{
question: 'How do you use useMemo and useCallback for performance tuning?',
answerMd: `
### Memoization with Hooks

\`\`\`mermaid
flowchart LR
Render1 --> useMemo["heavy computation"] --> Cache
Render2 --> useMemo["skipped if deps unchanged"]
\`\`\`

\`\`\`jsx
function ExpensiveList({ items }) {
const sorted = useMemo(() => {
// heavy sort
    return [...items].sort((a, b) => a.value - b.value);
}, [items]);

const handleClick = useCallback(id => {
console.log('clicked', id);
}, []);

return sorted.map(item => (
<div key={item.id} onClick={() => handleClick(item.id)}>
{item.name}
</div>
));
}
\`\`\`

- useMemo: cache expensive computations.
- useCallback: memoize functions passed to children.
`
},
{
question: 'When should you apply React.memo and component-level memoization?',
answerMd: `
### Component Memoization

\`\`\`mermaid
flowchart LR
Parent["Parent renders"] --> Cond["props unchanged?"]
Cond -- yes --> ChildMemo["skip re-render"]
Cond -- no --> Child["re-render child"]
\`\`\`

\`\`\`jsx
const Item = React.memo(function Item({ data, onSelect }) {
return <div onClick={() => onSelect(data.id)}>{data.name}</div>;
});
\`\`\`

- Wrap pure functional components in \`React.memo\` to skip renders when props are shallowly equal.
- Combine with \`useCallback\` to stabilize handler references.
`
},
{
question: 'How do you implement lazy loading and code splitting in React?',
answerMd: `
### Lazy Loading & Code Splitting

\`\`\`mermaid
flowchart LR
import --> ReactLazy["React.lazy()"]
Suspense["<Suspense>"] --> fallback["Loading..."]
LazyComponent --> Suspense
\`\`\`

\`\`\`jsx
import React, { Suspense, lazy } from 'react';

const Chart = lazy(() => import('./Chart'));

function Dashboard() {
return (
<Suspense fallback={<div>Loading chart...</div>}>
<Chart />
</Suspense>
);
}
\`\`\`

- Use \`React.lazy\` for dynamic imports of large modules.
- Wrap lazy components in \`<Suspense>\` with an appropriate fallback.
`
},
{
question: 'What tools and techniques can you use for profiling and tuning React performance?',
answerMd: `
### Profiling & Optimization Workflow

- Use React DevTools Profiler to record render timings and flame charts.
- Identify “costly” components by render duration and frequency.
- Apply memoization or split out heavy logic into web workers.
- Use virtualization libraries (react-window, react-virtualized) for long lists.
- Monitor bundle size with webpack-bundle-analyzer and trim unused code.
`
}
]
},// Add this as the next card in your src/qa-data.ts

{
category: 'react',
title: 'Integrating TypeScript end-to-end in your React codebase',
subItems: [
{
question: 'How do you set up a new React project with TypeScript?',
answerMd: `
### Bootstrapping a React+TypeScript App

\`\`\`bash
# Create React App
npx create-react-app my-app --template typescript

# Vite
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
npm run dev
\`\`\`

Both templates generate:
- .tsx entry files
- tsconfig.json with sensible defaults
- Type definitions for React and DOM
`
},
{
question: 'How do you configure tsconfig.json for React?',
answerMd: `
### Key tsconfig.json Settings

\`\`\`json
{
"compilerOptions": {
"target": "es6",
"jsx": "react-jsx",
"strict": true,
"moduleResolution": "node",
"esModuleInterop": true,
"skipLibCheck": true,
"forceConsistentCasingInFileNames": true,
"resolveJsonModule": true
},
"include": ["src"]
}
\`\`\`

- **jsx**: \`react-jsx\` enables the new JSX transform
- **strict**: turns on all strict type-checking options
- **resolveJsonModule**: import JSON files directly
`
},
{
question: 'How do you migrate existing .js/.jsx files to .ts/.tsx?',
answerMd: `
### Step-by-Step Migration

1. Rename \`.js/.jsx\` → \`.ts/.tsx\`.
2. Fix import errors:
\`\`\`ts
import Foo from './Foo'; // ensure Foo.tsx exists
   \`\`\`
3. Annotate missing types or add \`// @ts-ignore\` temporarily.
4. Replace \`propTypes\` with TypeScript interfaces/types.
5. Remove any runtime type checks once compile-time types pass.
`
},
{
question: 'How do you type component props and state?',
answerMd: `
### Typing Props & State

\`\`\`typescript
// Functional component with props
interface ButtonProps {
label: string;
disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ label, disabled = false }) => {
const [clicked, setClicked] = React.useState<boolean>(false);

return (
<button disabled={disabled} onClick={() => setClicked(true)}>
{clicked ? 'Clicked!' : label}
</button>
);
};
\`\`\`

- Define an interface or type alias for your props.
- Use \`React.FC<Props>\` or explicitly type the function signature.
- State hooks accept a generic for the state type.
`
},
{
question: 'How do you type hooks, refs, and events?',
answerMd: `
### Typing Hooks, Refs & Events

\`\`\`typescript
// useRef for a DOM node
const inputRef = React.useRef<HTMLInputElement | null>(null);

// useContext with a typed context
interface AuthContextType { user: string | null }
const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

// Event handler props
function TextInput() {
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
console.log(e.target.value);
};

return <input ref={inputRef} onChange={handleChange} />;
}
\`\`\`

- Pass generics to \`useRef<ElementType>\`.
- Create Contexts with a default typed value or \`undefined\`.
- Use React’s built–in event types like \`MouseEvent\` and \`ChangeEvent\`.
`
},
{
question: 'How do you declare module types for assets and CSS modules?',
answerMd: `
### Asset & CSS Module Declarations

\`\`\`typescript
// src/custom.d.ts
declare module '*.png';
declare module '*.svg' {
const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
export default ReactComponent;
}
declare module '*.module.css' {
const classes: { [key: string]: string };
export default classes;
}
\`\`\`

Add a \`custom.d.ts\` to let TS know how to import images, SVGs, and CSS modules.
`
},
{
question: 'How do you create generic components and custom hooks?',
answerMd: `
### Using Generics

\`\`\`typescript
// Generic List component
interface ListProps<T> {
items: T[];
renderItem: (item: T) => React.ReactNode;
}

function List<T>({ items, renderItem }: ListProps<T>) {
return <ul>{items.map((item, i) => <li key={i}>{renderItem(item)}</li>)}</ul>;
}

// Generic custom hook
function usePrevious<T>(value: T): T | undefined {
const ref = React.useRef<T>();
React.useEffect(() => {
ref.current = value;
}, [value]);
return ref.current;
}
\`\`\`

Generics let you write reusable, strongly-typed components and hooks.
`
},
{
question: 'How do you enforce linting, formatting, and type-checking?',
answerMd: `
### CI & Tooling Workflow

\`\`\`bash
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier eslint-config-prettier
\`\`\`

.eslintrc.js
\`\`\`javascript
module.exports = {
parser: '@typescript-eslint/parser',
extends: [
'react-app',
'plugin:@typescript-eslint/recommended',
'prettier'
],
plugins: ['@typescript-eslint'],
rules: { /* your overrides */ }
};
\`\`\`

package.json scripts
\`\`\`json
{
"scripts": {
"lint": "eslint 'src/**/*.{ts,tsx}'",
"format": "prettier --write 'src/**/*.{ts,tsx,css}'",
"type-check": "tsc --noEmit"
}
}
\`\`\`

Integrate these into your CI pipeline to catch errors before merge.
`
}
]
},// Add these as the next cards in your src/qa-data.ts
{
category: 'angular',
title: 'Developing a Banking Application with Angular — Story + Patterns + Code',
subItems: [
{
question: 'How do you develop a banking application using Angular?',
answerMd: `
# 🏦 Building a Banking Application with Angular — Story-Driven Guide

## 👥 Main Participants & Their Roles

| Participant             | Role                                                                                 |
|-------------------------|--------------------------------------------------------------------------------------|
| User                    | Customer interacting with the banking UI                                            |
| Angular App             | Single-Page Application coordinating components, services, and routing               |
| Components              | UI building blocks (LoginForm, Dashboard, AccountDetails, TransferForm, HistoryList) |
| Services                | Business logic and HTTP communication (AuthService, AccountService, TransactionService) |
| HTTP Interceptors       | Inject auth tokens, handle errors, show loaders                                     |
| State Management        | Centralized store (NgRx or RxJS BehaviorSubjects) for shared data                    |
| Routing & Guards        | Lazy-loaded modules, AuthGuard, RoleGuard to protect routes                          |
| Forms & Validation      | ReactiveFormsModule for secure and robust form handling                              |
| Environment Config      | \`environment.ts\` for API endpoints, feature toggles                                |
| UI Library              | Angular Material or Bootstrap for consistent styling                                 |
| Testing Tools           | Jasmine/Karma for unit tests, Protractor/Cypress for end-to-end tests                 |
| CI/CD Pipeline          | GitHub Actions/GitLab CI for build, test, lint, and deploy                           |
| Monitoring & Logging     | Sentry or Elasticsearch/Kibana for runtime errors and usage analytics                |

---

## 📖 Narrative

Imagine **Bankopolis**, a grand digital bank. You, the **Frontend Architect**, design a sleek **Lobby** (Angular App) with tellers (Components) and vault managers (Services). When a customer logs in, the **Security Guard** (AuthGuard + Interceptor) checks their badge (JWT). Account balances and transaction histories flow through secure channels (HTTP Services), and every deposit or transfer is validated by your meticulous **Form Validator**. Behind the scenes, a centralized **Ledger** (State Store) keeps everything in sync.

---

## 🎯 Goals & Guarantees

| Goal                          | Detail                                                          |
|-------------------------------|-----------------------------------------------------------------|
| ⚡ Fast & Responsive UI       | OnPush change detection, lazy loading, and optimized bundle size |
| 🔒 Robust Security            | JWT-based auth, route guards, input sanitization, HTTPS only    |
| 📐 Modular & Maintainable     | Feature modules, shared modules, clear folder structure         |
| 🔄 Reactive Data Flow         | RxJS streams, NgRx store or service subjects                   |
| ✔️ Form Accuracy              | ReactiveForms with custom validators for financial rules       |
| 🧪 Testability                | Comprehensive unit and e2e tests with high coverage            |
| 🌐 Cross-Browser & Accessibility | WCAG compliance, responsive layouts using Material/Grid        |

---

## 🗺️ Architecture at a Glance (ASCII)

\`\`\`
User
│
▼
Angular App ──▶ Router ──▶ Feature Modules (Auth, Accounts, Transactions)
│                       │              │
│                       ▼              ▼
├─ HTTP Interceptor ──▶ AuthService  TransactionService
│                       │              │
▼                       ▼              ▼
State Store ──────────────▶ AccountService
│
▼
LocalStorage / SessionStorage
\`\`\`

---

## 🔄 Core Patterns & Pitfalls

| Pattern                   | Problem Solved                                      | What to Verify                            | Fix / Best Practice                                     |
|---------------------------|-----------------------------------------------------|-------------------------------------------|---------------------------------------------------------|
| Modular Architecture      | Monolithic codebase, slow builds                    | Cross-module dependencies                 | Create feature and shared modules; lazy load features   |
| Reactive State Management | Inconsistent UI state across components             | Overfetching, stale data                  | Use NgRx or BehaviorSubject services; selectors & effects|
| HTTP Interception         | Repetitive token injection and error handling       | Silent token expiration, unhandled errors | Global interceptor for auth, retry logic, loaders       |
| Reactive Forms            | Complex validation and dynamic form needs           | Uncaught invalid states                   | Custom validators, async validation, form groups        |
| Route Guards              | Unauthorized access to sensitive routes             | Incomplete guard checks                   | AuthGuard + RoleGuard with clear fallback redirects     |
| Code Splitting            | Large initial bundle, slow first paint               | Missing chunk preloading                  | Lazy-load modules; prefetch important routes            |
| Accessibility             | Inaccessible UI elements                            | Low contrast, missing ARIA labels         | Use Angular Material, run axe audits                    |

---

## 🛠️ Step-by-Step Implementation Guide

1. Scaffold the Project
- \`ng new banking-app --routing --style=scss\`
- Install Angular Material: \`ng add @angular/material\`.

2. Set Up Environment Configuration
- Define \`apiBaseUrl\` and feature flags in \`environment.ts\` and \`environment.prod.ts\`.

3. Create Core & Shared Modules
- \`ng generate module core\` for services and interceptors.
- \`ng generate module shared\` for common components, pipes, directives.

4. Implement Authentication
- AuthService: login(), logout(), refreshToken().
- HTTP Interceptor: attach JWT, handle 401 by redirecting to login.
- AuthGuard + RoleGuard for route protection.

5. Build Feature Modules
- Accounts Module: AccountDashboardComponent, AccountService, AccountEffects (if NgRx).
- Transactions Module: TransferFormComponent (Reactive Form), TransactionService, TransactionHistoryComponent.

6. Design Reactive Forms
- Use FormBuilder, FormGroup, Validators for account transfers:
\`\`\`typescript
this.transferForm = this.fb.group({
fromAccount: ['', Validators.required],
toAccount: ['', Validators.required],
amount: [
'',
[Validators.required, Validators.min(1), this.currencyValidator]
]
});
\`\`\`

7. Integrate State Management
- Define Actions, Reducers, Effects (NgRx) or BehaviorSubject-based services.
- Selectors to fetch account balance, transaction list.

8. Implement Routing & Lazy Loading
- Define route config:
\`\`\`typescript
{ path: 'accounts', loadChildren: () => import('./accounts/accounts.module').then(m => m.AccountsModule), canActivate: [AuthGuard] }
\`\`\`

9. Add UI & Styling
- Use Angular Material components (mat-table, mat-form-field, mat-button).
- Responsive grid layout with Flex Layout or CSS Grid.

10. Testing & CI/CD
- Unit tests for services and components: \`ng test\`.
- e2e tests with Cypress: \`ng e2e\`.
- GitHub Actions: install dependencies, run lint/test/build, deploy to Firebase/Netlify.

---

## 💻 Code Examples

### 1. HTTP Interceptor for Auth & Errors
\`\`\`typescript
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
constructor(private auth: AuthService, private router: Router) {}

intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
let cloned = req.clone({
setHeaders: { Authorization: \`Bearer \${this.auth.token}\` }
});
return next.handle(cloned).pipe(
catchError(err => {
if (err.status === 401) this.router.navigate(['/login']);
return throwError(() => err);
})
);
}
}
\`\`\`

### 2. Reactive Transfer Form Component
\`\`\`typescript
@Component({ selector: 'app-transfer', templateUrl: './transfer.component.html' })
export class TransferComponent implements OnInit {
transferForm!: FormGroup;
constructor(private fb: FormBuilder, private txService: TransactionService) {}
ngOnInit() {
this.transferForm = this.fb.group({
fromAccount: ['', Validators.required],
toAccount: ['', Validators.required],
amount: ['', [Validators.required, Validators.min(1)]]
});
}

onSubmit() {
if (this.transferForm.valid) {
this.txService.transfer(this.transferForm.value).subscribe({
next: () => alert('Transfer successful'),
error: err => console.error(err)
});
}
}
}
\`\`\`

### 3. Account Service with RxJS State
\`\`\`typescript
@Injectable({ providedIn: 'root' })
export class AccountService {
private balanceSubject = new BehaviorSubject<number>(0);
balance$ = this.balanceSubject.asObservable();

constructor(private http: HttpClient) {}

loadBalance(accountId: string) {
this.http.get<AccountBalance>(\`\${apiBase}/accounts/\${accountId}/balance\`)
.subscribe(res => this.balanceSubject.next(res.amount));
}
}
\`\`\`

---

## 🚀 Beyond the Basics

- Progressive Web App (PWA) support for offline banking.
- WebSocket or SSE for real-time balance and transaction updates.
- Multi-factor authentication (MFA) and biometric login.
- Feature flags for gradual rollouts using ngx-launchdarkly.
- Internationalization (i18n) and currency formatting with Angular i18n.
- Accessibility audit and WCAG compliance.
- Integration with micro-frontend architecture for scaling large teams.
- End-to-end encryption of sensitive data in forms and storage.
`
}
]
},
{
category: 'javascript',
title: 'JavaScript Fundamental Concepts',
subItems: [
{
question: 'What are the differences between var, let, and const?',
answerMd: `
### var, let, const

\`\`\`mermaid
flowchart LR
Global["Global/Function Scope"]
Block["Block Scope"]
Global --> varVar["var declaration"]
Block --> letVar["let declaration"]
Block --> constVar["const declaration"]
\`\`\`

- var is function- or global-scoped and hoisted with an initial value of undefined.
- let and const are block-scoped and hoisted into a temporal dead zone until initialized.
- const creates a read-only binding; object contents can still change.

\`\`\`js
console.log(a, b); // undefined, ReferenceError
var a = 10;
let b = 20;
const c = 30;
\`\`\`
`
},
{
question: 'How do closures work in JavaScript?',
answerMd: `
### Closures

\`\`\`mermaid
flowchart TD
OuterFunc["outer() creates x"] --> InnerFunc["inner() closes over x"]
InnerFunc --> Access["inner() can access x even after outer() returns"]
\`\`\`

A closure is a function bundled with its lexical environment. Inner functions “remember” variables from their outer scope.

\`\`\`js
function outer() {
let count = 0;
return function inner() {
count++;
console.log(count);
};
}

const fn = outer();
fn(); // 1
fn(); // 2
\`\`\`
`
},
{
question: 'What is prototypical inheritance?',
answerMd: `
### Prototypal Inheritance

\`\`\`mermaid
flowchart LR
Obj1["obj1"] --> Proto["[[Prototype]]"] --> Obj2["obj2"]
\`\`\`

Objects inherit properties through a prototype chain. Each object has an internal link to its prototype.

\`\`\`js
const proto = { greet() { return 'hi'; } };
const obj = Object.create(proto);
console.log(obj.greet()); // 'hi'
\`\`\`
`
},
{
question: 'How does the JavaScript event loop work?',
answerMd: `
### Event Loop

\`\`\`mermaid
flowchart LR
CallStack["Call Stack"] -->|push function| Execute
WebAPIs["Web APIs"] --> CallbackQueue["Callback Queue"]
CallbackQueue -->|queue callbacks| EventLoop["Event Loop"]
EventLoop -->|drain when stack empty| CallStack
\`\`\`

JavaScript is single-threaded. Asynchronous callbacks wait in the task queue and run only when the call stack is empty.

\`\`\`js
setTimeout(() => console.log('task'), 0);
console.log('sync');
// Output: "sync" then "task"
\`\`\`
`
},
{
question: 'What are Promises and async/await?',
answerMd: `
### Promises & Async/Await

\`\`\`mermaid
flowchart TD
Promise["new Promise()"] --> then[".then()/.catch()"]
AsyncFunc["async function"] --> Await["await expression"]
Await --> Continue["pauses until resolved"]
\`\`\`

Promises represent future values. async/await is syntactic sugar over Promises for clearer async code.

\`\`\`js
function fetchData() {
return new Promise(res => setTimeout(() => res('data'), 1000));
}

async function logData() {
const result = await fetchData();
console.log(result);
}
\`\`\`
`
},
{
question: 'How do ES modules work?',
answerMd: `
### ES Modules

\`\`\`mermaid
flowchart LR
Exporting["export const x"] --> Importing["import { x } from './mod.js'"]
\`\`\`

ES modules let you split code into files. Imports are static and support tree-shaking.

\`\`\`js
// math.js
export function add(a, b) { return a + b; }

// app.js
import { add } from './math.js';
console.log(add(2, 3)); // 5
\`\`\`
`
}
]
},
{
category: 'javascript',
title: 'TypeScript Fundamental Concepts',
subItems: [
{
question: 'How does TypeScript type inference work?',
answerMd: `
### Type Inference

\`\`\`mermaid
flowchart LR
Declaration["let x = 5;"] --> TS["TypeScript infers x: number"]
\`\`\`

TypeScript automatically infers types from initial values and function return types. You only need annotations when inference falls short.

\`\`\`ts
let count = 10;       // inferred as number
const name = 'Alice'; // inferred as string

function square(n: number) {
return n * n;       // return type inferred as number
}
\`\`\`
`
},
{
question: 'What is the difference between interface and type?',
answerMd: `
### interface vs type

\`\`\`mermaid
flowchart LR
Interface["interface User { ... }"] --> Extend["can extend: interface Admin extends User"]
TypeAlias["type Point = { x: number }"] --> Union["can create unions/intersections"]
\`\`\`

- interface is extendable and mergeable; ideal for object shapes.
- type aliases are more flexible (unions, primitives, tuples) but cannot be reopened.

\`\`\`ts
interface User { id: number; name: string }
type ID = string | number;
\`\`\`
`
},
{
question: 'What are union and intersection types?',
answerMd: `
### Union & Intersection

\`\`\`mermaid
flowchart TD
A["A | B"] --> Value["value of A or B"]
A["A & B"] --> Combined["value must satisfy both A and B"]
\`\`\`

- Union (\`|\`) allows one of several types.
- Intersection (\`&\`) combines multiple types into one.

\`\`\`ts
type A = { x: number };
type B = { y: string };

let u: A | B = { x: 1 };
let i: A & B = { x: 1, y: 'ok' };
\`\`\`
`
},
{
question: 'How do generics work in TypeScript?',
answerMd: `
### Generics

\`\`\`mermaid
flowchart LR
Component["function identity<T>(arg: T)"] --> Return["returns T"]
\`\`\`

Generics allow you to write reusable components and functions that work with any type.

\`\`\`ts
function identity<T>(arg: T): T {
return arg;
}

const num = identity<number>(123);   // num: number
const str = identity('hello');       // str: string (inferred)
\`\`\`
`
},
{
question: 'What are utility types (e.g., Partial, Omit)?',
answerMd: `
### Utility Types

\`\`\`mermaid
flowchart LR
Partial["Partial<T>"] --> { all props optional }
Omit["Omit<T, K>"] --> { remove keys K from T }
\`\`\`

Built-in mapped types to transform existing types:

\`\`\`ts
interface Todo { id: number; title: string; completed: boolean }

type TodoPreview = Partial<Todo>;        // all props optional
type TodoWithoutID = Omit<Todo, 'id'>;   // remove id
\`\`\`
`
},
{
question: 'How do you implement type guards and narrowing?',
answerMd: `
### Type Guards & Narrowing

\`\`\`mermaid
flowchart LR
Value["unknown value"] --> Guard["if (typeof x === 'string')"] --> Narrow["x is string"]
\`\`\`

Use \`typeof\`, \`instanceof\`, or custom user-defined guards to inform the compiler of more specific types.

\`\`\`ts
function isString(x: unknown): x is string {
return typeof x === 'string';
}

function process(x: unknown) {
if (isString(x)) {
console.log(x.toUpperCase()); // safe
  }
}
\`\`\`
`
}
]
},// Add this as the next card in your src/qa-data.ts

{
category: 'cloud',
title: 'Spring Cloud Architecture & Microservices Patterns',
subItems: [
{
question: 'What is spring cloud architecture in microservices?',
answerMd: `
# ☁️ Spring Cloud Architecture in Microservices — Story-Driven Guide

## 👥 Main Participants & Their Roles

| Participant                 | Role                                                               |
|-----------------------------|--------------------------------------------------------------------|
| Client App                  | Initiates requests to the system                                   |
| Spring Cloud Gateway        | Central entry point: routing, filtering, authentication            |
| Config Server               | Externalizes and centralizes application configuration             |
| Service Registry (Eureka)   | Maintains dynamic list of service instances for discovery          |
| API Consumers (Feign, Rest) | Clients with built-in load balancing (Ribbon / Spring LoadBalancer)|
| Microservices               | Business domain services, each with its own data store and logic   |
| Circuit Breaker             | Fails fast on unhealthy instances and provides fallback           |
| Distributed Tracing         | Tracks and correlates requests across services (Sleuth + Zipkin)   |
| Message Broker              | Enables asynchronous communication (RabbitMQ / Kafka)              |
| Monitoring & Logging        | Actuator, Prometheus, Grafana for health metrics and logs          |

---

## 📖 Narrative

Imagine **Cloud City**, a bustling metropolis of tiny shops (microservices). Travellers (requests) arrive at the **Grand Gateway**, where guards check their credentials and direct them to the right district. To remember every shop’s address, there’s a **Registry Hall** that keeps the map up to date. Each shop consults the **Config Library** for its custom rules and can call on helpers (Circuit Breakers) when lanes get congested. Observers (Tracing & Monitoring) watch every step, ensuring harmony across the city.

---

## 🎯 Goals & Guarantees

| Goal                        | Detail                                                                       |
|-----------------------------|------------------------------------------------------------------------------|
| 🔍 Service Discoverability  | New instances automatically register and deregister without hard-coding URLs |
| 🛠️ Centralized Config       | Change properties at runtime for all environments from one Config Server     |
| 🚦 Load Balancing           | Distribute client calls evenly across healthy instances                     |
| 🛡️ Fault Tolerance          | Short-circuit failing calls, provide fallback responses                      |
| 📊 Observability            | Trace, metric-collect, and log every request flow throughout services        |
| 🔐 Security                 | Enforce authentication and SSL/TLS at the gateway                           |

---

## 🗺️ Architecture at a Glance (ASCII)

\`\`\`
Client App
│
▼
Spring Cloud Gateway ──▶ Config Server
│                    ▲
│                    │
▼                    │
Service Registry ◀───────┘
│
▼
┌──────────────┐     ┌──────────────┐
│  Service A   │     │  Service B   │
│ (Feign + CB) │     │ (Rest + MQ)  │
└──────────────┘     └──────────────┘
│                    │
│                    ▼
│               Message Broker
│                    │
▼                    ▼
Distributed Tracing → Monitoring & Logging
\`\`\`

---

## 🔄 Core Patterns & Pitfalls

| Pattern                | Problem Solved                                  | What to Verify                              | Fix                                                         |
|------------------------|-------------------------------------------------|---------------------------------------------|-------------------------------------------------------------|
| Config Server          | Hard-coded or inconsistent configuration        | Refresh scope, security of config data      | Enable \`spring.cloud.config.refresh\`, encrypt sensitive keys |
| Service Registry       | Static endpoints causing tight coupling         | Health checks, TTL on registrations         | Use Eureka with heartbeats and metadata                     |
| Client-Side Load-Balancing | Overloading single instance                    | Version skew, sticky sessions              | Leverage Ribbon or Spring LoadBalancer with metadata rules  |
| Circuit Breaker        | Cascading failures across services              | Threshold too low or high                   | Tune failure rate, sliding window size, fallback logic      |
| Distributed Tracing    | Blind spots in request flow                     | High overhead with full sampling            | Apply sampling strategy, tag important spans               |
| Messaging              | Tight sync coupling leading to latency          | Message ordering, duplicates                  | Use ack, dead-letter queues, idempotent consumers           |

---

## 🛠️ Step-by-Step Implementation Guide

1. **Bootstrap the Config Server**
- Create a Spring Boot app with \`@EnableConfigServer\`.
- Point \`spring.cloud.config.server.git.uri\` to your repo.
- Secure endpoints and enable auto-refresh.

2. **Deploy the Eureka Service Registry**
- Annotate with \`@EnableEurekaServer\`.
- Configure health-check URLs and instance eviction.
- Protect with basic auth or token.

3. **Set Up Spring Cloud Gateway**
- Add routes in \`application.yml\`.
- Apply global filters (auth, rate limit, retry).
- Integrate with Eureka for dynamic routing.

4. **Build Your Microservices**
- Include \`spring-cloud-starter-netflix-eureka-client\`.
- Annotate with \`@EnableDiscoveryClient\`.
- Use Feign clients or RestTemplate with LoadBalancer.

5. **Integrate Circuit Breakers**
- Add \`spring-cloud-starter-circuitbreaker-resilience4j\`.
- Annotate service methods with \`@CircuitBreaker\` and \`@Retry\`.
- Define fallback handlers for degraded responses.

6. **Implement Distributed Tracing**
- Add \`spring-cloud-starter-sleuth\` and Zipkin server.
- Correlate spans across Gateway and services.
- Visualize traces in Zipkin UI.

7. **Incorporate Asynchronous Messaging**
- Add RabbitMQ/Kafka starters.
- Define producers and consumers with idempotent handling.
- Monitor queue depth and DLQs.

8. **Secure, Monitor & Scale**
- Expose Actuator endpoints and collect metrics in Prometheus.
- Dashboard in Grafana; set alerts on anomalies.
- Horizontally scale services; Kubernetes is a natural fit.

---

## 💻 Code Examples

### 1. Config Server (application.yml)
\`\`\`yaml
server:
port: 8888
spring:
cloud:
config:
server:
git:
uri: https://github.com/your-org/config-repo
          search-paths: '{application}'
heartbeat:
enabled: true
management:
endpoints:
web:
exposure:
include: refresh, health
\`\`\`

### 2. Eureka Client & Feign (pom.xml + annotations)
\`\`\`xml
<dependency>
<groupId>org.springframework.cloud</groupId>
<artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
<dependency>
<groupId>org.springframework.cloud</groupId>
<artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
\`\`\`

\`\`\`java
@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
public class OrderServiceApp { }

@FeignClient(name = "inventory-service")
public interface InventoryClient {
@GetMapping("/inventory/{sku}")
Inventory checkStock(@PathVariable String sku);
}
\`\`\`

### 3. Circuit Breaker & Retry
\`\`\`yaml
resilience4j:
circuitbreaker:
instances:
paymentCB:
sliding-window-size: 20
failure-rate-threshold: 50
wait-duration-in-open-state: 30s
retry:
instances:
paymentRetry:
max-attempts: 3
wait-duration: 1s
\`\`\`

\`\`\`java
@Service
public class PaymentService {

@CircuitBreaker(name = "paymentCB", fallbackMethod = "fallbackPay")
@Retry(name = "paymentRetry")
public Receipt processPayment(PaymentRequest req) {
return restTemplate.postForObject("/payments", req, Receipt.class);
}

public Receipt fallbackPay(PaymentRequest req, Throwable t) {
return Receipt.builder()
.status("PENDING")
.message("Service unavailable, payment queued")
.build();
}
}
\`\`\`

---

## 🚀 Beyond the Basics

- Dynamic routing and rate limiting with custom Gateway filters.
- Config Server Git hooks for automated refresh on push.
- Multi-region Eureka federations for global failover.
- Canary and blue-green deployments via metadata tagging.
- Service Mesh (Istio / Linkerd) for advanced traffic control.
- Auto-scaling based on custom Actuator metrics.
- Chaos engineering: inject latency/faults and verify resilience.

`
},
{
question: 'What are core microservices design patterns',
answerMd: `
# 🚧 Core Microservices Design Patterns — Story-Driven Guide

## 👥 Main Participants & Their Roles

| Participant                 | Role                                                          |
|-----------------------------|---------------------------------------------------------------|
| Client                      | Initiates HTTP/gRPC calls to your system                      |
| API Gateway                 | Single entry for routing, auth, rate limiting                 |
| Microservice                | Owns a single business capability and its private datastore   |
| Service Registry & Discovery| Tracks service instances for dynamic lookups                  |
| Resiliency Components       | Circuit Breakers, Bulkheads, Retries for fault isolation      |
| Event Bus / Message Broker  | Supports async communication, sagas, and event sourcing       |
| Saga Orchestrator           | Coordinates distributed transactions when needed              |

---

## 📖 Narrative

In the kingdom of **Microville**, each business capability lives in its own cottage, speaking only its own language and owning its own garden of data. You’re the **Architect-King**, crafting pathways, messenger ravens, and safety nets so the villagers can cooperate without collapsing when storms hit.

---

## 🎯 Goals & Guarantees

| Goal           | Detail                                                                 |
|----------------|------------------------------------------------------------------------|
| ⚡ Low latency  | Keep inter-service calls under 100 ms p95                              |
| 📈 Scalability | Scale each service independently based on demand                       |
| 💪 Resilience   | Contain failures—no single service can topple the entire system        |
| 🔄 Consistency | Maintain eventual consistency across distributed data changes          |
| 🔐 Security     | Authenticate at the edge, authorize per service, encrypt in transit   |

---

## 🗺️ Architecture at a Glance (ASCII)

\`\`\`
Client
│
▼
API Gateway ──▶ Auth Service
│
├──▶ Order Service ──▶ Circuit Breaker ──▶ Payment Service
│                         │
│                         └──▶ Bulkhead / Retry
│
└──▶ Inventory Service ──▶ Event Bus ──▶ Saga Orchestrator
│
└──▶ Shipping Service
\`\`\`

---

## 🔄 Core Patterns & Pitfalls

| Pattern                          | Problem Solved                                              | What to Verify                                                | Fix                                                             |
|----------------------------------|-------------------------------------------------------------|---------------------------------------------------------------|-----------------------------------------------------------------|
| API Gateway                      | Centralizes routing, auth, rate-limiting                    | Single point of failure                                       | Run multiple gateway instances behind a load balancer           |
| Database per Service             | Avoids shared-DB coupling                                   | Accidental cross-service joins                                | Enforce data ownership; use APIs/events for cross-service data |
| Service Discovery                | Locates running service instances dynamically               | Hard-coded endpoints                                          | Use Consul/Eureka or DNS-based discovery                        |
| Circuit Breaker                  | Prevents cascading failures                                 | Wrong timeout thresholds                                      | Tune thresholds; implement fallback logic                       |
| Bulkhead                         | Isolates failures to a partition                            | Shared thread pools or connection pools                       | Allocate dedicated pools per service or feature                 |
| Retry                            | Handles transient faults                                    | Retries blocking resources without backoff/jitter             | Add exponential backoff and random jitter                       |
| Saga (Choreography/Orchestration)| Coordinates long-running transactions                       | Orphaned or out-of-order events                               | Define compensating actions; pick choreography vs orchestration|
| Event Sourcing                   | Captures state changes as immutable events                  | Event schema evolution                                        | Implement versioned events; migration strategies                |
| Strangler                         | Incrementally replaces a monolith                           | Dual writes causing data drift                                | Phase migration; route traffic gradually                        |
| Externalized Configuration       | Centralizes service settings                                | Hard-coded configs                                            | Use Config Server or Vault for dynamic configurations           |

---

## 🛠️ Step-by-Step Implementation Guide

1. Define service boundaries by mapping each business capability to one microservice.
2. Select a private datastore per service (Database per Service) to ensure data encapsulation.
3. Deploy an API Gateway to handle routing, authentication, and cross-cutting concerns.
4. Implement service discovery with a registry (Consul, Eureka) or DNS for dynamic endpoint resolution.
5. Wrap external calls in circuit breakers; partition resources with bulkheads; add retries with backoff.
6. Choose a saga pattern for distributed workflows: choreography for loose coupling; orchestration for clarity.
7. Externalize configuration and secrets using a config server or vault; enable hot reload.
8. Build observability: instrument tracing (OpenTelemetry), centralize logs, and emit metrics.

---

## 🚀 Beyond the Basics

- Sidecar/Ambassador patterns to offload networking, security, and logging.
- Anti-Corruption Layer when integrating legacy systems.
- CQRS + Cache-Aside for high-throughput read scenarios.
- Feature Flags & Canary Releases for safe rollouts.
- API Versioning & Backward Compatibility strategies.
- Chaos Engineering to proactively test failure modes.
`
},
{
question: 'How do you implement rate limiting, retry and fallback mechanisms?',
answerMd: `
# 🛡️ Rate Limiting, Retries & Fallbacks — Story-Driven Guide

## 👥 Main Participants & Their Roles

| Participant           | Role                                                         |
|-----------------------|--------------------------------------------------------------|
| Client                | Makes API calls to your services                             |
| API Gateway           | Enforces global rate limits and routes requests              |
| Rate Limiter          | Throttles calls using token-bucket or leaky-bucket           |
| Microservice          | Business logic, idempotent endpoints                         |
| Resiliency Components | Retry logic, Circuit Breakers, Fallback handlers, Timeouts   |
| Cache / Redis         | Holds counters/tokens for distributed limits                 |
| Monitoring & Alerts   | Tracks limiter hits, retries, circuit-breaker events         |

---

## 📖 Narrative

In **Microville**, the town gates (APIs) get swarmed at rush hour. You’re the **Gatekeeper**, issuing tickets (tokens) to control flow. When roads jam (services slow), you tell travellers to try again later (retries) and guide them to safe rest stops (fallbacks) so the town never grinds to a halt.

---

## 🎯 Goals & Guarantees

| Goal                    | Detail                                                              |
|-------------------------|---------------------------------------------------------------------|
| 🚦 Smooth Traffic       | Prevent API overload by throttling request rate                     |
| 🔄 Robustness           | Retry transient failures with backoff and jitter                    |
| 🛡️ Graceful Degradation | Offer safe defaults or cached data when downstream is unavailable   |
| 📊 Observability        | Emit metrics on rate hits, retry attempts, and circuit states       |
| 🔐 Fairness             | Enforce per-client or per-endpoint quotas to prevent abuse          |

---

## 🗺️ Architecture at a Glance (ASCII)

\`\`\`
Client
│
▼
API Gateway ──▶ Rate Limiter (Redis / In-Memory)
│
▼
Microservice ──▶ Business Logic
│
└──▶ Resiliency Components
├─ Retry (Exp. Backoff + Jitter)
├─ Circuit Breaker ──▶ Fallback Handler
└─ Timeout
\`\`\`

---

## 🔄 Core Patterns & Pitfalls

| Pattern            | Problem Solved                                            | What to Verify                                         | Fix                                                        |
|--------------------|-----------------------------------------------------------|--------------------------------------------------------|------------------------------------------------------------|
| Rate Limiter       | Controls request spikes, prevents overload                | Clock skew, burst size, per-client vs global quotas    | Use distributed counters; align windows; tune bucket size  |
| Retry              | Recovers from transient errors                            | Idempotency, retry storms, resource blocking           | Use exponential backoff; add random jitter; cap attempts   |
| Circuit Breaker    | Stops cascading failures by short-circuiting calls         | Thresholds too sensitive or too lenient                | Tune error/slow thresholds; adjust reset timeout           |
| Timeout            | Prevents hanging calls from tying up threads              | Missing or too-long deadlines                          | Set per-call timeouts on clients and servers               |
| Fallback Handler   | Provides default or cached response when service fails     | Stale or incorrect fallback data                       | Define clear fallback logic; use fresh cache or defaults   |

---

## 🛠️ Step-by-Step Implementation Guide

1. Implement a distributed rate limiter:
- Choose an algorithm (fixed window, sliding window, token bucket).
- Use Redis atomic INCR/EXPIRE or a library like Bucket4j.
- Enforce at API Gateway and optionally at each service.

2. Build retry logic:
- Use Resilience4j, Spring Retry, or Polly.
- Configure exponential backoff plus random jitter.
- Ensure idempotent endpoints and cap max attempts.

3. Add timeouts:
- Define per-call timeouts for HTTP, DB, and downstream services.
- Fail fast to free resources and trigger fallback logic.

4. Configure circuit breakers:
- Use Resilience4j, Hystrix, or a service mesh (Envoy).
- Set sliding window, failure rate threshold, and wait duration.
- On OPEN state, short-circuit calls and invoke fallback.

5. Define fallback mechanisms:
- Return cached or default data for read operations.
- Queue or defer writes gracefully.
- Log fallback events and emit metrics.

6. Monitor and tune:
- Collect metrics: limiter hits, retries, circuit-breaker states.
- Visualize in dashboards; set alerts on anomalies.
- Continuously adjust limits, backoff, and thresholds.

---

## 💻 Code Examples

### 1. Resilience4j Configuration (application.yml)
\`\`\`yaml
resilience4j:
retry:
instances:
externalApiRetry:
max-attempts: 3
wait-duration: 500ms
retry-exceptions:
- org.springframework.web.client.ResourceAccessException
circuitbreaker:
instances:
externalApiCB:
register-health-indicator: true
sliding-window-size: 10
failure-rate-threshold: 50
wait-duration-in-open-state: 60s
\`\`\`

### 2. Java Service with Annotations
\`\`\`java
@Service
public class ExternalApiService {

@Autowired
private RestTemplate restTemplate;

@Retry(name = "externalApiRetry", fallbackMethod = "onRetryFailure")
@CircuitBreaker(name = "externalApiCB", fallbackMethod = "onCircuitOpen")
public String fetchData() {
return restTemplate.getForObject("https://api.external.com/data", String.class);
}

// Called after retries are exhausted
  public String onRetryFailure(Exception ex) {
return "default-data-after-retry";
}

// Called when circuit breaker is open
  public String onCircuitOpen(CallNotPermittedException ex) {
return "default-data-from-circuit-breaker";
}
}
\`\`\`

### 3. Rate Limiting with Bucket4j in Spring Interceptor
\`\`\`java
@Component
public class RateLimitInterceptor implements HandlerInterceptor {
private final Bucket bucket;

public RateLimitInterceptor() {
Bandwidth limit = Bandwidth.simple(5, Duration.ofSeconds(1));
this.bucket = Bucket.builder()
.addLimit(limit)
.build();
}

@Override
public boolean preHandle(HttpServletRequest req,
HttpServletResponse res,
Object handler) throws IOException {
if (bucket.tryConsume(1)) {
return true;
}
res.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
res.getWriter().write("Rate limit exceeded");
return false;
}
}
\`\`\`

---

## 🚀 Beyond the Basics

- Stateful vs stateless rate limiting (Redis vs in-memory).
- Dynamic per-user or per-tier limits loaded from configuration.
- Distributed circuit-breakers sharing state via a central store.
- Retry with idempotency keys for safe side-effects.
- Adaptive backoff based on real-time service health.
- Chaos tests: inject latency or forced open circuits to validate resilience.
`
}
]
},{
  category: 'systemDesign',
  title: 'System Design Basics — Story + Pillars + Patterns',
  subItems: [
    {
      question: 'What are the basics of system design?',
      answerMd: `
# 🧱 System Design Basics — Story-Driven Primer

## 👥 Main Participants & Their Roles

| Participant         | Role                                                                 |
|---------------------|----------------------------------------------------------------------|
| Client              | Initiates requests (e.g., browser, mobile app)                       |
| Load Balancer       | Distributes traffic across servers                                   |
| Application Server  | Handles business logic and APIs                                      |
| Database            | Stores structured or unstructured data                              |
| Cache               | Speeds up reads by storing frequently accessed data                  |
| Message Queue       | Decouples services and handles asynchronous tasks                    |
| Storage             | Persists files, logs, backups                                        |
| Monitoring System   | Tracks health, performance, and failures                             |

---

## 📖 Narrative

Imagine building **BookBazaar**, an online bookstore. Users browse books, add to cart, and checkout. Behind the scenes, your system juggles traffic, stores data, handles payments, and scales during flash sales. System design is the blueprint that ensures **BookBazaar** runs smoothly, even when a million users show up.

---

## 🎯 Core Pillars of System Design

| Pillar               | Description                                                                 |
|----------------------|-----------------------------------------------------------------------------|
| 🧠 Scalability        | Can the system handle increasing load gracefully?                          |
| 🛡️ Reliability        | Does it work correctly even under failure or stress?                       |
| ⚡ Performance        | Is it fast and responsive for users?                                       |
| 🔐 Security           | Is data protected from unauthorized access?                                |
| 🔄 Maintainability    | Can developers easily update, debug, and extend the system?                |
| 📊 Observability      | Can you monitor and understand system behavior in real time?               |

---

## 🗺️ Typical Architecture (ASCII)

\`\`\`
Client
  │
  ▼
Load Balancer ──▶ App Servers ──▶ Cache ──▶ Database
                                │
                                └──▶ Message Queue ──▶ Worker Services
\`\`\`

---

## 🔄 Common Design Patterns

| Pattern             | Purpose                                           | Example Use Case                          |
|---------------------|---------------------------------------------------|-------------------------------------------|
| Load Balancing      | Distribute traffic evenly                         | Round-robin across app servers            |
| Caching             | Reduce latency and DB load                        | Redis for product catalog                 |
| Sharding            | Split DB into partitions                         | User data split by region                 |
| Replication         | Increase availability and read throughput         | Read replicas for analytics               |
| Asynchronous Queue  | Decouple slow tasks                               | Email sending via RabbitMQ                |
| Rate Limiting       | Prevent abuse                                     | API gateway throttling                    |
| Circuit Breaker     | Avoid cascading failures                          | Fallback when payment service fails       |

---

## 🛠️ Step-by-Step Design Approach

1. **Clarify Requirements**  
   - Functional: What should the system do?  
   - Non-functional: Scale, latency, availability, etc.

2. **Estimate Scale**  
   - Users per day, requests per second, data size.

3. **Define APIs & Data Models**  
   - REST endpoints, request/response formats, DB schema.

4. **Choose Architecture**  
   - Monolith vs Microservices, cloud vs on-prem.

5. **Design Components**  
   - Load balancer, app servers, DB, cache, queue, etc.

6. **Plan for Failures**  
   - Redundancy, retries, backups, disaster recovery.

7. **Add Observability**  
   - Logs, metrics, alerts, dashboards.

---

## 💡 Tips for Interviews

- Start with requirements and constraints.  
- Use diagrams to explain architecture.  
- Justify trade-offs (e.g., SQL vs NoSQL).  
- Discuss bottlenecks and mitigation.  
- Mention scaling strategies (vertical vs horizontal).  
- Think about real-world edge cases.

---

## 🚀 Beyond the Basics

- CAP Theorem: Consistency, Availability, Partition Tolerance.  
- Event-driven architecture with Kafka or Pulsar.  
- Service mesh for observability and traffic control.  
- Multi-region deployments for global scale.  
- Zero-downtime deployments and blue-green strategies.  
- Chaos engineering to test resilience.  
`
    }
  ]
},{
category: 'systemDesign',
title: 'Design shortUrl in Java with architectural diagram (story + implementation)',
subItems: [
{
question: 'Design shortUrl in Java with architectural diagram',
answerMd: `
# 🚀 TinyURL in Java — Story‑Driven System Design

## 👥 Main Participants & Their Roles

| Participant | Role in the Short URL System |
|-------------|------------------------------|
| **Client (Browser / App)** | Sends requests to shorten URLs and follows redirect links. |
| **API Service (Spring Boot)** | Central brain — handles requests, validates input, coordinates ID generation, DB, and cache. |
| **ID Generator** | Creates unique numeric IDs to be encoded into short aliases (Base62). |
| **Base62 Encoder** | Converts numeric IDs into compact, human‑friendly short codes. |
| **Database** | Stores the alias → original URL mapping with metadata. |
| **Cache (Redis)** | Holds hot mappings for lightning‑fast lookups. |
| **Analytics / MQ (Optional)** | Tracks click events, feeds into reporting. |
| **Monitoring & Logging** | Observes performance, errors, usage patterns for ops teams. |

---

## 📖 Narrative

Once upon a time in **LinkNagar**, every long winding address wanted a simpler nickname to move faster through the streets. You’re the chief at the 🏢 **Alias Office**, issuing short aliases and guiding travellers there instantly — even during rush hour.

---

## 🎯 Goals & Guarantees

| Goal | Detail |
|------|--------|
| ⚡ Speed | Sub‑50 ms p95 redirect latency |
| 📈 Scale | Millions of redirects/day |
| 🛡️ Correctness | Unique alias per original URL |
| 💪 Resilience | No single point of failure |
| 🚫 Abuse control | Prevent brute force & spam |

---

## 🗺️ Architecture at a Glance (ASCII)

\`\`\`
+---------+         +------------------+
Client  | Browser |  POST   |   API Service    |
+---------+ ------> | (Spring Boot)    |
GET /a1B2          +------------------+
|                   |
|        +----------+-----------+
|        |                      |
v        v                      v
+-----------+  +-----------+     +-----------+
|   Cache   |  |  Database |     |  ID Gen    |
| (Redis)   |  | (alias→URL)|     | (Counter / |
+-----------+  +-----------+     |  Base62)   |
|   ^                          +-----------+
hit ->   |   |  miss
v   |
+-----------+
|  Redirect |
|  Response |
+-----------+
\`\`\`

---

## 🔄 Core Flows

1. **Shorten URL**:
POST → Validate → ID Gen → Base62 encode → Store in DB → Cache → Respond alias.

2. **Redirect**:
GET → Check cache → Hit → Redirect;
Miss → DB lookup → Cache → Redirect → (Optional: publish click event).

---

## 🗃️ Data Model

\`\`\`sql
CREATE TABLE url_mapping (
alias        VARCHAR(12) PRIMARY KEY,
original_url TEXT        NOT NULL,
created_at   TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
last_access  TIMESTAMP   NULL,
clicks       BIGINT      DEFAULT 0
);
CREATE INDEX idx_url_mapping_created ON url_mapping(created_at);
\`\`\`

---

## 💻 Java Essentials

### Base62 Encoder
\`\`\`java
public final class Base62 {
private static final char[] ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".toCharArray();
public static String encode(long num) {
if (num == 0) return "0";
StringBuilder sb = new StringBuilder();
while (num > 0) {
sb.append(ALPHABET[(int)(num % 62)]);
num /= 62;
}
return sb.reverse().toString();
}
}
\`\`\`

### ID Generator
\`\`\`java
@Component
public class IdGenerator {
private final AtomicLong counter;
public IdGenerator(@Value("\${tinyurl.start-seq:1}") long start) {
this.counter = new AtomicLong(start);
}
public long nextId() {
return counter.getAndIncrement();
}
}
\`\`\`

### Entity
\`\`\`java
@Entity
@Table(name = "url_mapping")
public class UrlMapping {
@Id private String alias;
@Column(name="original_url", nullable=false, length=2048)
private String originalUrl;
private Instant createdAt = Instant.now();
private Instant lastAccess;
private long clicks;
}
\`\`\`

### Service
\`\`\`java
@Service
public class TinyUrlService {
private final UrlRepo repo;
private final IdGenerator ids;
private final String domain;

public TinyUrlService(UrlRepo repo, IdGenerator ids, @Value("\${tinyurl.domain}") String domain) {
this.repo = repo; this.ids = ids; this.domain = domain;
}

public String shorten(String rawUrl) {
String url = normalize(rawUrl);
validate(url);
for (int i = 0; i < 3; i++) {
String alias = Base62.encode(ids.nextId());
if (!repo.existsById(alias)) {
UrlMapping m = new UrlMapping();
m.setAlias(alias);
m.setOriginalUrl(url);
repo.save(m);
return domain + "/" + alias;
}
}
throw new IllegalStateException("Failed to allocate alias");
}

@Transactional
public Optional<String> resolve(String alias) {
return repo.findById(alias).map(m -> {
m.setClicks(m.getClicks() + 1);
m.setLastAccess(Instant.now());
return m.getOriginalUrl();
});
}
}
\`\`\`

### Controller
\`\`\`java
@RestController
public class TinyUrlController {
private final TinyUrlService svc;
public TinyUrlController(TinyUrlService svc) { this.svc = svc; }

@PostMapping("/shorten")
public ResponseEntity<Map<String,String>> shorten(@RequestBody Map<String,String> body) {
String aliasUrl = svc.shorten(body.get("url"));
return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("alias", aliasUrl));
}

@GetMapping("/{alias}")
public ResponseEntity<Void> redirect(@PathVariable String alias) {
return svc.resolve(alias)
.map(u -> ResponseEntity.status(HttpStatus.FOUND).location(URI.create(u)).build())
.orElse(ResponseEntity.notFound().build());
}
}
\`\`\`

---

## 📊 Scaling & Ops

- Cache hot aliases in Redis 🗄️
- Distributed ID gen (Snowflake/DB sequence) for multi‑node 🚦
- Shard DB by alias hash for scale 🧩
- Publish click events to Kafka/MQ for analytics 📈
- Global low‑latency via CDN/edge 🌍
- Observability: monitor QPS, latency, cache hit rate, errors 📡
- URL validation & rate‑limit per client 🔒
`
}
]
},{
category: 'systemDesign',
title: 'Event Booking System with Concurrency and Validation — Story + Patterns + Code',
subItems: [
{
question: 'How do you implement an event booking system that prevents overbooking under concurrent requests, allows cancellations, and provides event-wise summaries using in-memory storage?',
answerMd: `
# 🏟️ Event Booking System with Concurrency & Validation — Story-Driven Guide

## 👥 Main Participants & Their Roles

| Participant         | Role                                          |
|---------------------|-----------------------------------------------|
| Client              | Sends booking and cancellation requests       |
| Event Repository    | Stores events with seat counts                |
| Booking Repository  | Manages booking records                       |
| Booking Service     | Contains thread-safe booking logic            |
| REST Controllers    | Expose API endpoints                          |
| Testing Tools       | JUnit and Spring Test for unit & integration  |

---

## 📖 Narrative

Imagine you're managing ticket sales for a blockbuster concert in **Microtown**. The moment the tickets go live, hundreds of fans swarm your API. Your mission: ensure nobody secures more seats than exist, even when dozens of booking requests race in parallel. When someone cancels, free up a seat immediately. And at any point, provide an accurate summary of total vs. booked seats.

---

## 🎯 Goals & Guarantees

| Goal                         | Detail                                                         |
|------------------------------|----------------------------------------------------------------|
| 🚦 Prevent Overbooking       | Use per-event locks to serialize seat updates                   |
| 🔁 Safe Cancellations        | Release a seat and remove the booking record                   |
| 📋 Accurate Summaries        | Return total and booked seats in real-time                     |
| 🔐 Input Validation          | Reject invalid event IDs, user IDs, and non-positive seats     |
| 🧪 Comprehensive Testing     | Unit tests for concurrency; integration tests for endpoint flow|

---

## 🗺️ Architecture at a Glance (ASCII)

\`\`\`
Client
│
├─ POST /events ──▶ EventController ──▶ EventRepository
│
├─ POST /bookings ─▶ BookingController ──▶ BookingService ──▶ [EventRepo + BookingRepo]
│      │                         │
│      │                         └─ Locks per Event
│      │
│      └─ Input Validation
│
├─ DELETE /bookings/{id} ─▶ BookingController ─▶ BookingService ─▶ Repos
│
└─ GET /events/{id}/summary ─▶ EventController ─▶ BookingService ─▶ Summary
\`\`\`

---

## 🔄 Core Patterns & Pitfalls

| Pattern            | Problem Solved                               | Pitfall to Watch                         |
|--------------------|----------------------------------------------|------------------------------------------|
| ReentrantLock      | Serialize seat updates per event             | Forgetting unlock() in exception block   |
| ConcurrentHashMap  | Thread-safe in-memory storage                | Race conditions if external locking skipped |
| UUID IDs           | Unique identifiers for events/bookings       | Practically no collision risk            |
| Input Validation   | Early rejection of bad requests              | Inconsistent error codes if missing checks |
| Exception Handling | Meaningful HTTP statuses for clients         | Swallowed exceptions obscure bugs        |

---

## 🛠️ Step-by-Step Implementation Guide

1. **Define Entities**
- Event: id, name, totalSeats, bookedSeats, lock
- Booking: id, eventId, userId

2. **Build In-Memory Repositories**
- Use ConcurrentHashMap for thread-safe storage of events/bookings

3. **Implement BookingService**
- Acquire event.lock
- Check and atomically update bookedSeats
- Save or delete Booking record

4. **Create REST Controllers**
- POST /events: validate payload, create Event
- POST /bookings: validate userId, call createBooking()
- DELETE /bookings/{id}: cancelBooking()
- GET /events/{id}/summary: getEventSummary()

5. **Write Tests**
- **Unit**: spawn concurrent booking attempts, assert no overbooking
- **Integration**: end-to-end flow, verify conflict response and summary

---

## 💻 Code Examples

### Entity Definitions

\`\`\`java
public class Event {
private final String id;
private final String name;
private final int totalSeats;
private int bookedSeats;
private final ReentrantLock lock = new ReentrantLock();
// constructors, getters, setters
}

public class Booking {
private final String id;
private final String eventId;
private final String userId;
// constructors, getters
}
\`\`\`

### BookingService (Thread-Safe)

\`\`\`java
@Service
public class BookingService {
private final EventRepository eventRepo;
private final BookingRepository bookingRepo;

public BookingService(EventRepository er, BookingRepository br) {
this.eventRepo = er;
this.bookingRepo = br;
}

public Booking createBooking(String eventId, String userId) {
Event event = eventRepo.findById(eventId)
.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found"));

event.getLock().lock();
try {
if (event.getBookedSeats() >= event.getTotalSeats()) {
throw new ResponseStatusException(HttpStatus.CONFLICT, "No seats available");
}
event.setBookedSeats(event.getBookedSeats() + 1);
Booking booking = new Booking(UUID.randomUUID().toString(), eventId, userId);
bookingRepo.save(booking);
return booking;
} finally {
event.getLock().unlock();
}
}

public void cancelBooking(String bookingId) {
Booking booking = bookingRepo.findById(bookingId)
.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));

Event event = eventRepo.findById(booking.getEventId())
.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found"));

event.getLock().lock();
try {
event.setBookedSeats(event.getBookedSeats() - 1);
bookingRepo.delete(bookingId);
} finally {
event.getLock().unlock();
}
}

public EventSummary getEventSummary(String eventId) {
Event event = eventRepo.findById(eventId)
.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found"));
return new EventSummary(event.getTotalSeats(), event.getBookedSeats());
}
}
\`\`\`

### Unit Test for Concurrency

\`\`\`java
@Test
void concurrentBookingsDoNotOverbook() throws InterruptedException {
Event event = new Event("e1", "Concert", 5, 0);
eventRepo.save(event);

ExecutorService executor = Executors.newFixedThreadPool(10);
CountDownLatch latch = new CountDownLatch(10);
for (int i = 0; i < 10; i++) {
executor.submit(() -> {
try {
bookingService.createBooking("e1", UUID.randomUUID().toString());
} catch (ResponseStatusException ignored) {}
finally { latch.countDown(); }
});
}
latch.await();
assertEquals(5, eventRepo.findById("e1").get().getBookedSeats());
executor.shutdown();
}
\`\`\`

---

## 🚀 Beyond the Basics

- Persist events and bookings in a database with optimistic locking
- Expose metrics and health indicators for seat availability
- Introduce JWT-based user authentication
- Push live seat counts via WebSocket
- Implement soft deletes and audit trails for cancellations
`
}
]
},{
  category: 'systemDesign',
  title: 'Designing a Large-Scale E-Commerce Platform (Amazon/Flipkart) — Story + Patterns + Code',
  subItems: [
    {
      question: 'How would you design Amazon.com/Flipkart?',
      answerMd: `
# 🛒 Designing Amazon.com/Flipkart — Story-Driven Guide

## 👥 Main Participants & Their Roles

| Participant             | Role                                                               |
|-------------------------|--------------------------------------------------------------------|
| User / Client App       | Browses products, adds to cart, places orders                      |
| DNS & CDN               | Routes domain to nearest edge cache for static assets              |
| Load Balancer           | Distributes inbound traffic across service instances               |
| API Gateway             | Central entry point: routing, auth, throttling                     |
| Service Discovery       | Enables services to register and locate each other                 |
| Front-end Service       | Renders UI, aggregates APIs                                       |
| Product Catalog Service | CRUD on product metadata, indexing for search                      |
| Search Service          | Full-text and faceted search (e.g., Elasticsearch)                 |
| Shopping Cart Service   | Manages user carts, stores transient data in Redis                 |
| Order Service           | Orchestrates order placement, idempotency, saga coordination       |
| Payment Service         | Integrates with payment gateways, handles retries & fallbacks      |
| Inventory Service       | Tracks stock levels, reservations, publishes updates via messaging |
| Notification Service    | Sends emails/SMS for order confirmations and alerts                |
| Message Broker          | Asynchronous bus for events (Kafka / RabbitMQ)                     |
| Relational Database     | ACID for transactions (orders, payments)                           |
| NoSQL / Search Index    | High-throughput reads (catalog, sessions)                           |
| Monitoring & Logging    | Metrics, logs, distributed tracing (Prometheus, Grafana, Jaeger)   |

---

## 📖 Narrative

Imagine **Marketopolis**, a sprawling bazaar where millions of shoppers flood the gates every second. You play the role of the **Bazaar Architect**, carving lanes (services) for vendors (catalog, search, cart) and couriers (order, payment) to flow smoothly. When too many shoppers pile in, your **Load Balancer Guards** keep queues short. Orders are processed handshake-style through an **Event Bridge** (messaging), ensuring no purchase is lost. Observers (tracing & metrics) watch every stall, ready to raise the alarm at the first hiccup.

---

## 🎯 Goals & Guarantees

| Goal                          | Detail                                                            |
|-------------------------------|-------------------------------------------------------------------|
| ⚡ Scalability                | Auto-scale front-end, product catalog, search, and order services |
| 🔄 High Availability          | Multi-AZ deployment, health checks, circuit breakers              |
| 🎯 Consistent Shopping Cart   | Use Redis + persistence to prevent data loss                      |
| 🛡️ Data Integrity             | ACID for order placement, idempotent APIs                         |
| 📩 Loose Coupling             | Asynchronous flows via message broker for inventory & notifications |
| 🔍 Fast Search & Discovery    | Real-time indexing in Elasticsearch                               |
| 📊 Observability              | End-to-end tracing, metrics, alerts on anomalies                   |

---

## 🗺️ Architecture at a Glance (ASCII)

\`\`\`
                     ┌────────────┐
      Internet CDN → │    DNS     │
                     └────┬───────┘
                          │
                   ┌──────▼──────┐
                   │ Load Balancer│
                   └──────┬──────┘
                          │
       ┌──────────────────▼───────────────────┐
       │           API Gateway                │
       └┬────────────────┬──────────────────┬─┘
        │                │                  │
  ┌─────▼─────┐    ┌─────▼─────┐      ┌─────▼─────┐
  │CatalogSvc │    │SearchSvc  │      │CartSvc    │
  └─────┬─────┘    └─────┬─────┘      └─────┬─────┘
        │               │                 │
        │               │                 ▼
        │               │           ┌─────▼─────┐
        │               │           │ Redis     │
        │               │           │ (Cart)    │
        │               │           └───────────┘
        │               │                     
        │               └─────┐               
        │                     │               
        │               ┌─────▼─────┐      
        │               │Elasticsearch│      
        │               └─────────────┘      
        │                               
        │                ┌───────────────┐
        └────────────────► Order Service │
                         ├───────────────┤
                         │ InventorySvc  │
                         └──────┬────────┘
                                │
                          ┌─────▼─────┐
                          │ Message   │
                          │ Broker    │
                          └─────┬─────┘
                                │
                    ┌───────────▼───────────┐
                    │ Payment, Notify, etc. │
                    └───────────────────────┘
\`\`\`

---

## 🔄 Core Patterns & Pitfalls

| Pattern                 | Problem Solved                                           | What to Verify                         | Fix / Best Practice                                     |
|-------------------------|----------------------------------------------------------|----------------------------------------|---------------------------------------------------------|
| API Gateway             | Centralized auth, routing, rate limiting                 | Single point of failure                | Deploy in pair; health checks; fail-open policies       |
| Caching                 | Offload read traffic, accelerate product lookups          | Cache invalidation                     | Use short TTLs; publish invalidation events             |
| CQRS & Event Sourcing   | Separate read/write load; audit trail of changes         | Event ordering, idempotency            | Partition topics; use deduplication logic               |
| Sharding & Partitioning | Scale databases by key range                              | Hot partitions                         | Hash keys; monitor and rebalance shards                 |
| Asynchronous Decoupling | Resilience under load, smooth peak processing            | Dead-letter queues, backpressure       | Configure DLQs; consumer concurrency limits             |
| Circuit Breaker         | Fail fast on downstream issues                           | Too-sensitive thresholds               | Gradually tune failure rate and timeout                 |
| Saga / Orchestration    | Long-running transactions across services                | Partial failures                       | Implement compensation logic; track saga state          |
| Data Denormalization    | Fast composite reads (e.g., product + reviews)           | Stale data                             | Use change-data-capture; streaming updates              |

---

## 🛠️ Step-by-Step Implementation Guide

1. **Foundation: Networking & Infra**  
   - Provision VPC with public/private subnets, ALB/NLB, Route 53.  
   - Deploy services on Kubernetes/ECS with auto-scaling groups.

2. **Core Services**  
   - **Catalog Service**: Spring Boot / Express; CRUD on products; persist in MySQL.  
   - **Search Service**: Stream catalog updates to Elasticsearch via Logstash or Kafka Connect.

3. **Shopping Cart**  
   - Store cart in Redis with a TTL; persist snapshots to DynamoDB/MySQL for recovery.

4. **Order Placement**  
   - Expose idempotent REST endpoint; validate cart; begin saga; write to Order DB; publish \`OrderCreated\` event.

5. **Inventory Management**  
   - Consume \`OrderCreated\`; reserve stock in a transactional store; on failure, publish \`OrderFailed\`.

6. **Payment Processing**  
   - Listen to \`OrderReserved\`; call external gateway with retries + backoff; on success, publish \`PaymentConfirmed\`.

7. **Sagas & Orchestration**  
   - Use a lightweight orchestrator (AWS Step Functions / Camunda) or choreography via events.

8. **Notifications**  
   - Consume final events; send email/SMS; update order status.

9. **Observability & Resilience**  
   - Integrate OpenTelemetry, Prometheus, Grafana, Jaeger.  
   - Configure alarms on error rates, queue depths, latency.

10. **Performance Tuning & Scaling**  
    - Enable auto-scale based on CPU, request rate, custom metrics.  
    - Use read replicas, multi-AZ writes, caching layers.

---

## 💻 Code Examples

### 1. Add Item to Cart (Node.js + Redis)
\`\`\`javascript
app.post('/cart/:userId/items', async (req, res) => {
  const { userId } = req.params;
  const { productId, qty } = req.body;
  const key = \`cart:\${userId}\`;
  // Redis hash: field = productId, value = qty
  await redis.hincrby(key, productId, qty);
  await redis.expire(key, 3600);
  res.status(200).send({ message: 'Item added' });
});
\`\`\`

### 2. Publish Order Event (Java + Kafka)
\`\`\`java
OrderCreated order = OrderCreated.builder()
    .orderId(uuid).userId(userId).items(items).build();
kafkaTemplate.send("orders", order.getOrderId(), order);
\`\`\`

### 3. Elasticsearch Indexing (Python + Kafka Consumer)
\`\`\`python
for msg in consumer:
    doc = msg.value
    es.index(index="products", id=doc["id"], body=doc)
\`\`\`

---

## 🚀 Beyond the Basics

- Multi-region deployments with global DNS failover.  
- Dynamic pricing engine driven by real-time analytics.  
- Recommendation system powered by collaborative filtering.  
- Feature flags and canary releases for safe rollout.  
- GraphQL gateway for aggregated reads.  
- Machine-learning inference at the edge for personalization.  
- Chaos engineering: inject latency, fail primary databases, verify fallback.  
- GDPR & PCI compliance: data encryption, tokenization, audit trails.  
`
    }
  ]
},{
  category: 'systemDesign',
  title: 'Designing Generative AI Systems — Story + Patterns + Code',
  subItems: [
    {
      question: 'How would you design Generative AI Systems?',
      answerMd: `
# 🤖 Generative AI System Design — Story-Driven Guide

## 👥 Main Participants & Their Roles

| Participant               | Role                                                                  |
|---------------------------|-----------------------------------------------------------------------|
| Client / Frontend         | Sends user prompt and displays generated content                     |
| API Gateway               | Authenticates, rate-limits, routes requests                           |
| Orchestrator Service      | Coordinates pipeline: retrieval, inference, post-processing            |
| Prompt Processor          | Sanitizes, templates, and augments user prompts                       |
| Model Registry            | Stores model artifacts, metadata, versions                             |
| Inference Service         | Loads LLMs (local or via managed API), runs forward passes            |
| Retrieval Service         | Fetches relevant context via embeddings + vector store                |
| Vector Store              | Performs similarity search over embeddings (e.g., Pinecone, FAISS)     |
| Cache / Fallback Cache    | Caches recent prompts + responses to amortize costs                   |
| Post-Processing Module    | Filters output: safety checks, formatting, token trimming             |
| Logging & Monitoring      | Tracks usage, latency, errors, cost metrics                            |
| Cost & Quota Manager      | Enforces budget limits and quota per user or tenant                   |

---

## 📖 Narrative

In **AIropolis**, curious Citizens (users) approach the **Oracle Gateway** with a request. The **Master of Ceremonies** (Orchestrator) prepares their question, consults the **Archive** (vector store) for context, then summons the **Great Model** (LLM) to craft an answer. After a **Guardian** (post-processor) ensures safety and style, the finished scroll returns to the Citizen—all within a blink, backed by vigilant **Observers** (monitoring) and cost-watchers (quota manager).

---

## 🎯 Goals & Guarantees

| Goal                         | Detail                                                              |
|------------------------------|---------------------------------------------------------------------|
| ⚡ Low Latency                | Optimize each stage for sub-second end-to-end response              |
| 🎛️ Scalability               | Auto-scale retrieval and inference tiers based on concurrent load    |
| 💲 Cost-Efficiency            | Cache frequent prompts, route to smaller models when possible       |
| 🛡️ Safety & Guardrails       | Apply content filters and RLHF-informed policies                    |
| 🔗 Contextual Coherence       | Retrieve and inject relevant context for factual consistency        |
| 📊 Observability             | Emit metrics: token count, p99 latency, cost per request            |
| 🔐 Multi-Tenant Isolation     | Enforce quotas, encrypt per-tenant data at rest and in motion       |

---

## 🗺️ Architecture at a Glance (ASCII)

\`\`\`
User
  │
  ▼
API Gateway ──▶ Auth / Rate Limit
  │
  ▼
Orchestrator ──▶ Prompt Processor
  │              │
  │              ▼
  │         Retrieval Service ──▶ Vector Store
  │              │
  │              ▼
  │         Inference Service ──▶ Model Registry / LLM
  │              │
  │              ▼
  │         Post-Processing
  │              │
  ▼              │
Cache ◀──────────┘
  │
  ▼
Logging & Monitoring → Dashboard / Alerts
\`\`\`

---

## 🔄 Core Patterns & Pitfalls

| Pattern                 | Problem Solved                                | What to Verify                       | Fix / Best Practice                                     |
|-------------------------|-----------------------------------------------|--------------------------------------|---------------------------------------------------------|
| Retrieval-Augmented Gen | Prevent hallucinations by grounding LLM       | Context relevance, index freshness   | Vector embeddings + semantic filters; periodic reindex  |
| Prompt Caching          | Reduce repeated inference costs               | Cache key collisions, TTLs           | Hash prompt + context; set eviction policies            |
| Model Cascade           | Balance cost vs accuracy with multi-tier LLMs | Wrong model selection                | Route simple prompts to small LLM; escalate on failure  |
| Safety Filters          | Block toxic or disallowed content             | Over-blocking, latency impact        | Lightweight classifiers pre- and post-inference         |
| Autoscaling             | Handle sudden traffic spikes                  | Cold starts, resource exhaustion     | Warm pools; scale-to-zero for idle models               |
| Cost Quota Enforcement  | Prevent runaway bills                         | Quota bypass by clients              | Embed usage metering in orchestrator; reject excess     |

---

## 🛠️ Step-by-Step Implementation Guide

1. **Provision Core Infrastructure**  
   - Deploy API Gateway, Orchestrator, and services in Kubernetes/ECS.  
   - Configure autoscaling on CPU/GPU and queue depths.

2. **Set Up Model Registry & Serving**  
   - Store model binaries in an artifact repo (S3, MLflow).  
   - Expose inference endpoints via Triton, TorchServe, or managed APIs.

3. **Build Retrieval Layer**  
   - Embed your knowledge base with OpenAI/HuggingFace embeddings.  
   - Index vectors in Pinecone/FAISS; expose similarity search API.

4. **Implement Orchestration Pipeline**  
   - Ingest user prompt → sanitize → fetch context → call LLM → post-process.  
   - Use a workflow engine (Temporal) or async workers (Celery).

5. **Enable Caching & Fallbacks**  
   - Cache prompt + context hash → response.  
   - On inference failure or timeout, return cached or safe default.

6. **Integrate Safety & Filters**  
   - Run pre-filters on prompts; post-filters on outputs (toxicity, PII).  
   - Log violations; optionally escalate to human review.

7. **Monitor, Alert & Optimize**  
   - Collect metrics: token usage, p95/p99 latency, error rates, cost.  
   - Visualize in Grafana; set alerts on budget overshoot or high error spikes.

8. **Iterate & A/B Test**  
   - Experiment with prompt templates, context window sizes, model variants.  
   - Track success metrics: user satisfaction, coherence, factual accuracy.

---

## 💻 Code Examples

### 1. FastAPI Orchestrator (Python)
\`\`\`python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import httpx, redis

app = FastAPI()
cache = redis.Redis()

class Prompt(BaseModel):
    user_id: str
    text: str

@app.post("/generate")
async def generate(p: Prompt):
    key = f"cache:{hash(p.text)}"
    if resp := cache.get(key):
        return {"response": resp.decode()}
    # 1. Retrieve context
    ctx = await httpx.get("http://retrieval/api", json={"query": p.text})
    # 2. Call LLM
    llm = await httpx.post("http://inference/api", json={
        "model": "gpt-4", "prompt": ctx.json() + p.text
    })
    out = llm.json()["text"]
    # 3. Post-process & cache
    safe = await httpx.post("http://filter/api", json={"text": out})
    cache.set(key, safe.json()["text"], ex=3600)
    return {"response": safe.json()["text"]}
\`\`\`

### 2. Embedding + Vector Search (Python)
\`\`\`python
from sentence_transformers import SentenceTransformer
from pinecone import init, Index

model = SentenceTransformer("all-MiniLM-L6-v2")
init(api_key="PINECONE_KEY", environment="us-west1-gcp")
index = Index("knowledge")

def retrieve(query):
    emb = model.encode(query).tolist()
    res = index.query(vector=emb, top_k=5, include_values=False)
    return [m['id'] for m in res['matches']]
\`\`\`

---

## 🚀 Beyond the Basics

- Multi-modal generation: mix text, image, audio models in one pipeline.  
- Personalization: maintain user embeddings / memories for long-term context.  
- Dynamic model routing based on real-time cost vs latency SLAs.  
- Federated learning: update models with on-device or on-tenant data.  
- Responsible AI: implement bias audits and differential privacy.  
- Explainability: generate rationales or provenance for model outputs.  
- Auto-ML pipelines: retrain models when data drift is detected.  
`
    }
  ]
},{
  category: 'systemDesign',
  title: 'Designing a Large-Scale Video Streaming Platform (YouTube/Netflix/Prime Video) — Story + Patterns + Code',
  subItems: [
    {
      question: 'How would you design YouTube/Netflix/Prime Video?',
      answerMd: `
# 📺 Designing a Video Streaming Platform — Story-Driven Guide

## 👥 Main Participants & Their Roles

| Participant               | Role                                                         |
|---------------------------|--------------------------------------------------------------|
| Client App                | Initiates video uploads and playback requests                |
| DNS & CDN                 | Routes clients to nearest edge for low-latency playback      |
| Load Balancer             | Distributes traffic across API and streaming servers         |
| API Gateway               | Handles authentication, authorization, and routing           |
| Upload Service            | Accepts user video uploads and stores raw files              |
| Transcoding Service       | Converts raw video into adaptive bitrate segments            |
| Object Storage (S3/GCS)   | Stores raw uploads and encoded video segments                |
| Metadata Service          | Manages video metadata, manifests, and thumbnails            |
| Streaming Service         | Serves video segments via HTTP(S) using HLS/DASH protocols   |
| Recommendation Service    | Provides personalized video suggestions                      |
| Search Service            | Enables catalog search and discovery                         |
| Analytics Service         | Collects playback metrics, QoS data, and user events         |
| Monitoring & Logging      | Tracks system health, logs errors, and triggers alerts       |

---

## 📖 Narrative

In **Streamopolis**, creators bring their videos to the grand **Upload Plaza**. The **Transcode Guild** masterfully slices and encodes each video into many resolutions. When viewers arrive, the **Edge Keepers** (CDN) serve the nearest copy for smooth playback. Meanwhile, the **Oracle of Recommendations** whispers new videos to each user, and the **Scribes of Analytics** record every play, pause, and buffer to optimize the experience.

---

## 🎯 Goals & Guarantees

| Goal                         | Detail                                                               |
|------------------------------|----------------------------------------------------------------------|
| ⚡ Low Latency Playback       | Edge caching and adaptive bitrate streaming for minimal buffering   |
| 📈 Unlimited Scalability      | Auto-scale ingest, transcoding, and streaming tiers                  |
| 🔄 High Availability          | Multi-region deployment, failover, and data replication              |
| 🔒 Access Control & DRM       | Auth tokens, signed URLs, DRM license servers                        |
| 🧠 Personalization            | Real-time recommendations based on user behavior                     |
| 🔍 Fast Discovery             | Full-text search and faceted browsing over large catalogs            |
| 📊 Observability             | End-to-end tracing, metrics, and alerting                            |

---

## 🗺️ Architecture at a Glance (ASCII)

\`\`\`
User
  │
  ▼
DNS ──▶ CDN Edge Cache ──▶ Client Playback

Upload Flow:
User │
  ▼
API Gateway ──▶ Upload Service ──▶ Object Storage (raw)
                          │
                          ▼
               Transcoding Service ──▶ Object Storage (segments)
                          │
                          ▼
               Metadata Service (manifests, thumbnails)

Read Flow:
User ──▶ DNS ──▶ CDN ──▶ Streaming Service ──▶ Object Storage

Auxiliary Paths:
Metadata / Recommendations / Search / Analytics
\`\`\`

---

## 🔄 Core Patterns & Pitfalls

| Pattern                    | Problem Solved                                    | What to Verify                                | Fix / Best Practice                                    |
|----------------------------|---------------------------------------------------|------------------------------------------------|--------------------------------------------------------|
| CDN Caching                | Reduces origin load, lowers latency               | Cache invalidation on new uploads              | Use versioned URLs; short TTL for fresh content        |
| Adaptive Bitrate Streaming | Delivers best quality under varying network conditions | Correct segment duration and codecs            | Encode multiple bitrates; adjust segment size (2–6s)   |
| Microservices              | Isolates functionality and scales independently    | Cross-service communication & data consistency | Use gRPC/REST APIs; maintain idempotency and schema    |
| Sharding & Partitioning    | Scales metadata and analytics stores              | Hot partitions, uneven key distribution        | Hash-based sharding; auto-rebalancing shards           |
| Asynchronous Workflows     | Handles long-running transcoding and analytics    | Task retries and dead-letter handling          | Use message queues; track job status and retries      |
| Token-Based Auth & DRM     | Secure video access and license enforcement       | Token expiration, leaked URLs                 | Signed URLs with expiration; integrate DRM license server |
| Observability & Alerting   | Rapid detection of faults and performance issues  | Blind spots, incomplete metrics                | Instrument all services with traces, metrics, logs     |

---

## 🛠️ Step-by-Step Implementation Guide

1. **Provision Infrastructure**  
   - Set up multi-region VPC and Kubernetes/ECS clusters.  
   - Deploy ALB/NLB in front of API and streaming services.

2. **Implement Upload Service**  
   - Use resumable uploads (tus protocol or multipart).  
   - Store raw files in object storage with unique versioned keys.

3. **Build Transcoding Pipeline**  
   - Trigger jobs via message broker (Kafka/SQS).  
   - Use FFmpeg or managed services (Elastic Transcoder, MediaConvert).  
   - Output HLS/DASH segments and manifest files.

4. **Store and Serve Content**  
   - Store segments and manifests in object storage.  
   - Configure CDN (CloudFront) with origin pointing to storage and streaming service.

5. **Metadata and Search**  
   - Persist video metadata in a NoSQL database (DynamoDB/Cassandra).  
   - Index searchable fields in Elasticsearch/OpenSearch.

6. **Streaming Service Logic**  
   - Validate signed URLs or JWT tokens.  
   - Serve manifest and segment URIs.  
   - Implement range requests for fast seek.

7. **Recommendation Engine**  
   - Collect user events (views, likes, watch time).  
   - Use collaborative filtering or graph-based algorithms.  
   - Expose recommendations via a REST API.

8. **Analytics & Monitoring**  
   - Stream logs and events to Kafka/Kinesis.  
   - Process with Spark/Flink for real-time dashboards.  
   - Set up Prometheus + Grafana + Alertmanager.

9. **Scale and Harden**  
   - Auto-scale pods based on CPU, memory, and queue length.  
   - Use chaos testing to validate failover.  
   - Encrypt data at rest and in transit.

---

## 💻 Code Examples

### 1. Signed URL Generation (Node.js)
\`\`\`javascript
const AWS = require('aws-sdk');
const s3 = new AWS.S3({ region: 'us-east-1' });

function generateSignedUrl(key) {
  return s3.getSignedUrl('getObject', {
    Bucket: 'video-segments',
    Key: key,
    Expires: 3600
  });
}
\`\`\`

### 2. Transcoding with FFmpeg (Bash)
\`\`\`bash
ffmpeg -i input.mp4 \
  -vf scale=-2:720 -c:v libx264 -b:v 1500k -g 48 -sc_threshold 0 \
  -hls_time 4 -hls_playlist_type vod \
  -master_pl_name master.m3u8 \
  -hls_segment_filename '720p_%03d.ts' 720p.m3u8
\`\`\`

### 3. HLS Playback Endpoint (Java + Spring Boot)
\`\`\`java
@GetMapping("/videos/{id}/manifest")
public ResponseEntity<Resource> getManifest(@PathVariable String id) {
    String manifestKey = metadataService.getManifestKey(id);
    URL url = s3Client.generatePresignedUrl(bucket, manifestKey, expiration);
    return ResponseEntity.status(HttpStatus.FOUND)
                         .location(url.toURI())
                         .build();
}
\`\`\`

---

## 🚀 Beyond the Basics

- Live streaming with WebRTC or low-latency HLS/DASH.  
- Per-title encoding optimization for cost-quality trade-offs.  
- Server-side ad insertion (SSAI) and personalized ad stitching.  
- DRM integration with Widevine, PlayReady, FairPlay.  
- Multi-language subtitles and audio tracks.  
- AI-driven thumbnails and content tagging.  
- Edge compute for personalized storyboards.  
- Compliance: GDPR, COPPA, and accessibility (closed captions).  
`
    }
  ]
},{
  category: 'devOps',
  title: 'Understanding Kubernetes Key Concepts — Story + Patterns + Code',
  subItems: [
    {
      question: 'What are Kubernetes key concepts in minute detail from an understanding perspective?',
      answerMd: `
# 🐳 Kubernetes Key Concepts in Minute Detail — Story-Driven Guide

## 👥 Main Participants & Their Roles

| Participant                      | Role                                                                                 |
|----------------------------------|--------------------------------------------------------------------------------------|
| Cluster                          | Logical group of nodes managed by the control plane                                  |
| Control Plane                    | Coordinates the cluster: API Server, etcd, Controller Manager, Scheduler             |
| kube-apiserver                   | Exposes the Kubernetes API                                                          |
| etcd                             | Consistent key–value store for cluster state                                        |
| kube-scheduler                   | Assigns Pods to Nodes based on resource constraints and policies                     |
| kube-controller-manager          | Runs controllers to reconcile desired and actual cluster state                       |
| Node (Worker)                    | Executes Pods via kubelet and container runtime                                      |
| kubelet                          | Agent on each node ensuring containers are running                                   |
| Container Runtime                | Docker, containerd, or CRI-O that runs containers                                    |
| Pod                              | Smallest deployable unit: one or more co-located containers                          |
| Deployment                       | Declarative controller for managing ReplicaSets and Pods                             |
| ReplicaSet                       | Ensures a specified number of pod replicas are running                               |
| Service                          | Stable network endpoint that load balances traffic to Pods                           |
| Ingress                          | Manages external HTTP/S access to Services with routing rules                        |
| ConfigMap & Secret               | Stores non-sensitive and sensitive configuration data respectively                   |
| Volume & PersistentVolumeClaim   | Abstracts storage for Pods, decoupling lifecycle of storage from Pods                |
| Namespace                        | Virtual cluster partition to isolate resources and workloads                         |
| Label & Selector                 | Key-value pairs to organize and select Kubernetes objects                            |
| StatefulSet                      | Controller for stateful applications, providing stable identities and storage        |
| DaemonSet                        | Ensures a copy of a Pod runs on all (or selected) Nodes                              |
| Job & CronJob                    | Controllers for one-time or scheduled batch tasks                                    |

---

## 📖 Narrative

In **Kube City**, you, the **Cluster Architect**, draft a **Blueprint** (YAML manifest) that describes your ideal world. The **Mayor** (kube-apiserver) accepts your blueprint and stores it in the **Charter Hall** (etcd). The **Scheduler** then assigns **Citizens** (Pods) to **Districts** (Nodes) based on resources and policies. If reality drifts from your blueprint, **Controllers** spring into action to restore balance. Developers interact through the **Town Gate** (kubectl), weaving together networking (Services, Ingress), storage (Volumes), and configuration (ConfigMaps, Secrets).

---

## 🎯 Goals & Guarantees

| Goal                   | Detail                                                                 |
|------------------------|------------------------------------------------------------------------|
| Declarative Management | Describe desired state; Kubernetes continuously reconciles actual state |
| Self-healing           | Automatically restart, replace, or reschedule failed Pods              |
| Scalability            | Scale workloads horizontally with ease                                 |
| Abstraction            | Abstract compute, storage, and networking primitives                   |
| Portability            | Consistent behavior across cloud and on-prem environments              |
| Resource Isolation     | Enforce boundaries with Namespaces, NetworkPolicies, and Quotas        |

---

## 🗺️ Architecture at a Glance (ASCII)

\`\`\`
             +------------+
             |  kubectl   |
             +-----+------+
                   |
                   v
         +---------+-----------+
         |     API Server      |
         +---+---+----+---+----+
             |   |    |   |
   +---------+   |    |   +-----------+
   |             |    |               |
   v             v    v               v
Scheduler   Controller  Manager     etcd
                  |
        +---------+---------+
        |   Cluster Network |
        +---------+---------+
                  |
     +------------+------------+
     |            |            |
   Node A       Node B       Node C
   +--------+   +--------+   +--------+
   | kubelet|   | kubelet|   | kubelet|
   +---+----+   +---+----+   +---+----+
       |            |            |
   +---+---+    +---+---+    +---+---+
   | Pod(s) |    | Pod(s) |    | Pod(s) |
   +-------+    +-------+    +-------+
\`\`\`

---

## 🔄 Core Patterns & Pitfalls

| Pattern            | Problem Solved                                  | What to Verify                             | Fix / Best Practice                              |
|--------------------|-------------------------------------------------|--------------------------------------------|--------------------------------------------------|
| Declarative Config | Prevents undocumented changes and drift         | Difference between desired and actual state| Apply GitOps; version manifests in Git           |
| Health Checks      | Detects unhealthy containers before routing     | Lax or missing readiness/liveness probes   | Define probes with correct endpoints and timings |
| Autoscaling        | Manually scaling is error-prone and slow        | Improper metrics or thresholds             | Use HPA/VPA based on realistic CPU/memory metrics |
| Namespace Quotas   | No isolation across teams                       | Unlimited resource consumption             | Set ResourceQuota and LimitRange per namespace   |
| Network Policies   | Unrestricted Pod-to-Pod communication           | Overly permissive allow rules              | Define strict ingress/egress rules by labels     |
| PVC Binding        | Pods stuck in pending state waiting for storage | Incorrect StorageClass or access modes     | Use dynamic provisioning or pre-provision PVs     |
| Ingress TLS        | Unsecured external traffic                      | Manual certificate rotation                | Automate with cert-manager and ACME              |

---

## 🛠️ Step-by-Step Implementation Guide

1. Bootstrap the Cluster  
   - Use managed (EKS/GKE/AKS) or kubeadm for self-managed clusters.  
   - Ensure etcd is highly available with backups.

2. Create Namespaces & RBAC  
   - \`kubectl create namespace dev\`.  
   - Define Roles and RoleBindings for least-privilege access.

3. Deploy Applications Declaratively  
   - Write Deployment YAML with image, replicas, and resource requests/limits.  
   - Apply: \`kubectl apply -f deployment.yaml\`.

4. Expose Services & Ingress  
   - Define a Service (ClusterIP/NodePort/LoadBalancer).  
   - Configure Ingress with HTTP/S rules and TLS certificates.

5. Manage Config & Secrets  
   - Create ConfigMaps and Secrets:  
     \`kubectl apply -f configmap.yaml\`, \`secret.yaml\`.  
   - Mount as environment variables or volumes.

6. Attach Persistent Storage  
   - Define PersistentVolume and PersistentVolumeClaim.  
   - Mount PVC in Pod spec for stateful workloads.

7. Enable Autoscaling & Monitoring  
   - Configure HPA:  
     \`kubectl autoscale deployment web --cpu-percent=50 --min=2 --max=10\`.  
   - Instrument Prometheus, Grafana, and Alertmanager.

8. Secure & Harden  
   - Apply NetworkPolicies per namespace.  
   - Enforce PodSecurityPolicies (or OPA Gatekeeper).  
   - Enable audit logs and enforce RBAC policies.

9. Adopt Continuous Delivery  
   - Use GitOps tools like Argo CD or Flux.  
   - Validate manifests with kubeval and kube-linter.

---

## 💻 Code Examples

### 1. Deployment
\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
        - name: web
          image: nginx:latest
          ports:
            - containerPort: 80
          resources:
            requests:
              cpu: "100m"
              memory: "128Mi"
            limits:
              cpu: "500m"
              memory: "512Mi"
          readinessProbe:
            httpGet:
              path: /
              port: 80
            initialDelaySeconds: 5
            periodSeconds: 10
\`\`\`

### 2. Service & Ingress
\`\`\`yaml
apiVersion: v1
kind: Service
metadata:
  name: web-svc
spec:
  type: LoadBalancer
  selector:
    app: web
  ports:
    - port: 80
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: web-ingress
spec:
  rules:
    - host: example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: web-svc
                port:
                  number: 80
\`\`\`

### 3. ConfigMap & Secret
\`\`\`yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  LOG_LEVEL: "debug"

---
apiVersion: v1
kind: Secret
metadata:
  name: db-credentials
type: Opaque
stringData:
  username: admin
  password: s3cr3t
\`\`\`

### 4. PersistentVolume & Claim
\`\`\`yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: data-pv
spec:
  capacity:
    storage: 5Gi
  accessModes:
    - ReadWriteOnce
  storageClassName: standard
  hostPath:
    path: /mnt/data

---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: data-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi
  storageClassName: standard
\`\`\`

---

## 🚀 Beyond the Basics

- Extend Kubernetes with Custom Resource Definitions (CRDs) and Operators.  
- Deploy a Service Mesh (Istio or Linkerd) for advanced traffic control and telemetry.  
- Implement Cluster Federation for multi-cluster strategies.  
- Use PodDisruptionBudgets and PodTopologySpreadConstraints for reliability.  
- Perform Blue/Green and Canary deployments with Argo Rollouts or Flagger.  
- Optimize resource usage with Cluster Autoscaler and Vertical Pod Autoscaler.  
- Run serverless workloads with Knative.  
- Practice chaos testing with LitmusChaos or Chaos Mesh to validate resilience.  
`
    }
  ]
},{
  category: 'systemDesign',
  title: 'Designing a High-Scale Video Streaming Platform — In-Depth Guide',
  subItems: [
    {
      question: 'Design a video streaming app for 100 countries, 100M users, 10M active users, 1M uploaders (video sizes 200 MB–2 GB). What are the key challenges and mitigations while maintaining all core NFRs?',
      answerMd: `
# High-Scale Video Streaming Platform

## 👥 Main Participants & Their Roles

| Participant               | Role                                                                            |
|---------------------------|---------------------------------------------------------------------------------|
| Viewer Client             | Requests video playback, adaptive streaming chunks                              |
| Uploader Client           | Initiates chunked uploads (200 MB–2 GB)                                          |
| API Gateway               | Routes requests, enforces auth, rate limits                                     |
| Authentication Service    | Issues and validates JWT/OAuth tokens                                           |
| Upload Service            | Coordinates chunked uploads, assembles files, writes to object storage          |
| Message Queue (Kafka)     | Buffers upload events for asynchronous processing                               |
| Transcoding Service       | Converts source video into multiple bitrates/formats (HLS/DASH)                 |
| Object Storage (S3/GCS)   | Stores original and transcoded video segments, durable and geo-replicated       |
| Metadata Database (NoSQL) | Stores video metadata, user info, upload status                                 |
| Streaming Service         | Serves manifest files and video segments to CDN                                 |
| CDN (Edge Cache)          | Caches and delivers video segments globally with low latency                    |
| Monitoring & Analytics    | Tracks QoS, errors, throughput, user engagement                                 |
| Recommendation Engine     | Suggests videos based on watch history and ML models                            |

---

## 📖 Narrative

In **StreamVille**, millions of **Viewers** across 100 countries tune in to watch HD and 4K content, while **Uploaders** send large master files in chunks. The **Upload Service** stitches uploads and emits events to **Kafka**, waking up **Transcoding Workers** to generate ABR streams. Once segments land in **Object Storage**, the **Streaming Service** publishes manifests for **CDN Edges**. Behind the scenes, **Auth Guards** protect content, and **Monitors** alert on any performance drift, ensuring a smooth experience in every region.

---

## 🎯 Goals & Guarantees

| Goal                   | Detail                                                                                 |
|------------------------|----------------------------------------------------------------------------------------|
| Scalability            | Support 10 M concurrent viewers and 1 M monthly uploaders                              |
| Availability           | 99.99% uptime with active-active multi-region deployments                              |
| Performance            | < 2 s startup latency, < 100 ms chunk delivery to user’s player                          |
| Durability             | 11 9’s object durability for master and transcoded segments                            |
| Consistency            | Strong metadata consistency, eventual consistency for caches and replicas              |
| Security               | Encrypted transport (TLS), signed URLs, DRM integration                                |
| Observability          | End-to-end tracing (OpenTelemetry), real-time metrics, alerts on SLA breaches          |

---

## 🗺️ Architecture at a Glance (ASCII)

\`\`\`plaintext
       [Viewer]
          │
          ▼
      API Gateway ──▶ Auth Service
          │
          ▼
    Streaming Service ──▶ CDN Edges ──▶ Viewer
          │
    (Manifests & Segments)
          
[Uploader]
     │
     ▼
 Upload Service ──▶ Kafka Topic
          │          │
          ▼          ▼
 Object Storage   Transcoding Service
   (masters,       │
   segments)       ▼
               Object Storage
\`\`\`

---

## 🔄 Core Challenges & Mitigations

| Challenge                          | Impact                                              | Mitigation                                     |
|------------------------------------|-----------------------------------------------------|------------------------------------------------|
| High Concurrent Viewers            | API overload, origin stress                          | Auto-scale fleets, load balance at edge        |
| Large File Uploads                 | Slow, failed uploads                                 | Chunked uploads with resumable protocol         |
| Transcoding Throughput             | Backlog causes playback delays                       | Elastic worker pool, GPU acceleration           |
| Global Delivery Latency            | Buffering and rebuffering for distant users          | Multi-CDN, geo-DNS routing, edge prefetch       |
| Storage Cost & Durability          | High egress, long-term retention                     | Lifecycle policies, tiered storage, erasure coding |
| Metadata Consistency               | Stale manifests or missing segments                  | Region-wide database replication, leader election |
| CDN Cache Invalidation             | Viewers see old segments after update                | Versioned manifests, cache-invalid hooks        |
| DRM & Content Protection           | Unauthorized access or piracy                        | Signed URLs, tokenized DRM, watermarking        |

---

## 🛠️ Step-by-Step Implementation Guide

1. Build Chunked Upload API  
   - Client splits file into N chunks, uploads via \`PUT /videos/{id}/chunks\`.  
   - Track progress in Metadata DB; support resume on failure.

2. Orchestrate Transcoding  
   - On upload completion, push event to Kafka.  
   - Worker pool picks up tasks, transcodes into ABR renditions (H.264/H.265).  
   - Store segments in Object Storage using manifest-driven paths.

3. Deploy Streaming Service  
   - Generate HLS/DASH manifests referencing segment URLs.  
   - Sign URLs with short-lived tokens for secure delivery.

4. Integrate with CDN  
   - Purge or version manifests on new uploads.  
   - Leverage edge prefetch for trending videos.

5. Scale Globally  
   - Deploy microservices in multiple regions (AWS/GCP).  
   - Use geo-DNS to route clients to nearest region/CDN.

6. Implement Observability  
   - Instrument services with OpenTelemetry.  
   - Aggregate logs/metrics in Prometheus/Grafana; set SLIs/SLOs.

---

## 💻 Infrastructure as Code Snippet

\`\`\`yaml
resources:
  - name: videoBucket
    type: storage.v1.bucket
    properties:
      location: GLOBAL
      versioning:
        enabled: true
      lifecycle:
        rule:
          - action: { type: Delete }
            condition: { age: 365 }
  - name: transcoderCloudFunction
    type: cloudfunctions.v1.function
    properties:
      entryPoint: transcodeHandler
      runtime: nodejs18
      trigger:
        eventType: google.storage.object.finalize
        resource: "$(videoBucket)"
\`\`\`

---

## 🚀 Beyond the Basics

- Live streaming with low-latency protocols (WebRTC, CMAF-LL).  
- AI-driven encoding optimizations (scene detection, bitrate ladder).  
- Personalized CDN edge caching using ML for popular segments.  
- Offline downloads & DRM-managed secure download packages.  
- Real-time recommendation integration in player.  
- Chaos engineering on streaming pipeline to validate resilience.  
`
    }
  ]
},{
  category: 'database',
  title: 'Key Database Design Q&A for a Global Video Streaming Platform',
  subItems: [
    {
      question: 'Which database technologies (relational, document, key–value, time–series) make sense for storing video metadata, user profiles, watch history, and analytics—and what are the trade-offs?',
      answerMd: `
# 🗄️ Choosing the Right Database Technology — Story-Driven Guide

## 👥 Main Participants & Their Roles

| Participant         | Role                                                                         |
|---------------------|------------------------------------------------------------------------------|
| Video Metadata Store| Holds title, description, tags, upload date, owner, thumbnail URLs           |
| User Profile Store  | Persists user credentials, preferences, subscription status                  |
| Watch-History Store | Appends user view events, timestamps, progress markers                       |
| Analytics Store     | Aggregates play, pause, buffer, error events keyed by video/user/timewindow  |
| Cache Layer         | Serves hot metadata and trending lists with low-latency in-memory lookup      |
| Search Index        | Provides full-text search and faceted filtering on titles and descriptions    |

---

## 📖 Narrative

In **DataVille**, you’re the **Archivist** deciding where each record lives. You keep product facts (metadata) in a structured ledger (relational DB), user profiles in a schemaless scrollbook (document store), and a flood of click-streams (watch history, analytics) in specialized time-series vats. When editors request trending clips, an in-memory Cache Butler fetches summaries in milliseconds. When researchers run ad-hoc ad campaigns, a Search Maven uses the Search Index to quickly pinpoint videos by keyword.

---

## 🎯 Goals & Guarantees

| Goal                       | Detail                                                                                     |
|----------------------------|--------------------------------------------------------------------------------------------|
| Schema Flexibility         | Allow evolving metadata (new fields) without rigid migrations                              |
| High Write Throughput      | Ingest millions of view events per minute for real-time analytics                          |
| Low Read Latency           | Serve video pages and recommendations in <100 ms globally                                  |
| Complex Queries            | Support joins (video→uploader), aggregations (views per day), and full-text search         |
| Scalability & Sharding     | Horizontally partition across user/video dimensions to handle 100 M users, 1 M uploads     |
| Consistency vs Availability| Balance strong user-profile consistency vs eventual consistency for global analytics       |

---

## 🗺️ Architecture at a Glance (ASCII)

\`\`\`
                         +-------------------+
                         |  User Profile DB  |
                         |  (Document Store) |
                         +---------+---------+
                                   |
                                   ▼
+---------+    +----------+    +--------+    +------------+
| Metadata|<───|  Cache   |<───| Relational |    Search   |
|   DB    |    | (Redis)  |    |   DB      |   Index     |
+----+----+    +----+-----+    +-----+-----+    (ES/Solr) |
     |               |               |                   |
     ▼               ▼               ▼                   ▼
 Watch-History    Analytics      Recommendation        Discovery
 (Time-Series)    (TSDB)         Service              Service
\`\`\`

---

## 🔄 Core Patterns & Pitfalls

| Pattern               | Problem Solved                                    | Pitfall                                   | Fix / Best Practice                                    |
|-----------------------|---------------------------------------------------|-------------------------------------------|--------------------------------------------------------|
| Polyglot Persistence  | Use best-fit DB per data type                     | Operational complexity                    | Automate provisioning; unify monitoring & backup       |
| CQRS                  | Separate write and read models                     | Data staleness on reads                   | Implement event-driven pub/sub for read model updates  |
| Time-Series DB        | Optimized for high-cardinality, append-only writes | Querying across multiple tags             | Pre-aggregate metrics; shard by time + video/user      |
| Document Store        | Flexible metadata schema                          | Large documents slow queries              | Keep docs small; embed vs reference based on access    |
| Search Index          | Full-text and faceted search                       | Index lag vs source of truth              | Schedule incremental indexing; use RBAC on update paths|

---

## 🛠️ Step-by-Step Recommendation

1. Deploy a Relational DB (PostgreSQL/MySQL) for core metadata –  
   • Schema with video_id PK, uploader_id FK, genre, tags table for many-to-many.  
   • Read replicas for scaling reads; partition by upload date.  

2. Use a Document DB (MongoDB/CosmosDB) for user profiles –  
   • Store JSON user settings and preferences; evolve schema freely.  
   • Shard by user_id; TTL collections for ephemeral sessions.  

3. Ingest watch events into a Time-Series DB (InfluxDB/TimescaleDB) –  
   • Batch or stream writes via Kafka; shard by region+video_id.  
   • Build continuous aggregates for daily/week view counts.  

4. Cache hot metadata in Redis –  
   • Key pattern: \`video:meta:\${video_id}\`; expire 1 hr or on update.  

5. Index searchable fields into Elasticsearch –  
   • Use a change-data-capture pipeline from relational DB.  
   • Provide autocomplete and faceted browse on tags, categories.  

6. Aggregate analytics in BigQuery/ClickHouse –  
   • Export enriched events nightly; archive raw feeds in object storage.  

---

## 💻 Code Snippet: Metadata Table DDL (PostgreSQL)

\`\`\`sql
CREATE TABLE video_metadata (
  video_id      UUID PRIMARY KEY,
  uploader_id   UUID NOT NULL,
  title         TEXT NOT NULL,
  description   TEXT,
  upload_date   TIMESTAMPTZ NOT NULL DEFAULT now(),
  privacy       VARCHAR(10)  NOT NULL,
  thumbnail_url TEXT,
  tags          TEXT[]      -- GIN index for array ops
);

CREATE INDEX idx_video_tags ON video_metadata USING GIN (tags);
CREATE INDEX idx_upload_date ON video_metadata (upload_date);
\`\`\`

---

## 🚀 Beyond the Basics

- Introduce a graph database (Neo4j/Dgraph) for social–video networks and recommendations.  
- Implement per-user event buffering with Redis Streams for multi-region write tolerance.  
- Leverage cloud-native serverless databases (Aurora Serverless, DynamoDB) for auto-scaling.  
- GDPR-compliant data partitioning and on-demand erasure workflows.  
- Unified observability with OpenTelemetry across all data stores.  
`
    },
    // stubs for further questions; fill in using the same story-driven format
    {
      question: 'How do you model video metadata (title, description, tags, upload date, owner) to support both point-lookups (by video ID) and secondary queries (by tag, category, uploader)?',
      answerMd: `\n# 🎨 Modeling Video Metadata — Story-Driven Guide\n\n*(Answer in the above format with participants, narrative, patterns, …)*\n`
    },
    {
      question: 'What sharding or partitioning strategy will you apply to the metadata store to handle 100 M users and 1 M monthly uploads, and how will you rebalance shards as data grows?',
      answerMd: `\n# 📐 Sharding & Partitioning Strategy — Story-Driven Guide\n\n*(Answer in the above format with participants, narrative, patterns, …)*\n`
    },
    {
      question: 'How will you replicate and cache metadata across 100 countries to achieve low-latency reads while maintaining acceptable consistency—master/slave, multi-master, or geo-distributed NoSQL?',
      answerMd: `\n# 🌍 Global Replication & Caching — Story-Driven Guide\n\n*(Answer in the above format with participants, narrative, patterns, …)*\n`
    },
    {
      question: 'What consistency model will you choose for user-centric data (watch history, likes, comments)? Strong consistency, eventual consistency, or a hybrid—and why?',
      answerMd: `\n# 🔗 Consistency Models — Story-Driven Guide\n\n*(Answer in the above format with participants, narrative, patterns, …)*\n`
    },
    {
      question: 'How do you ensure transactional integrity when a video upload transaction spans object storage (for chunks) and the metadata database?',
      answerMd: `\n# 🔄 Cross-System Transactions — Story-Driven Guide\n\n*(Answer in the above format with participants, narrative, patterns, …)*\n`
    },
    {
      question: 'How will you design the schema and indexing for user watch history and engagement events to power real-time analytics and recommendations at scale?',
      answerMd: `\n# 📈 Watch History & Engagement Schema — Story-Driven Guide\n\n*(Answer in the above format with participants, narrative, patterns, …)*\n`
    },
    {
      question: 'What archival and data-lifecycle policies will you enforce on the metadata database and analytics store to control storage costs and meet compliance (e.g., GDPR)?',
      answerMd: `\n# 🗄️ Archival & Data-Lifecycle Policies — Story-Driven Guide\n\n*(Answer in the above format with participants, narrative, patterns, …)*\n`
    },
    {
      question: 'How will you handle schema migrations and versioning across millions of records and multiple regions without downtime?',
      answerMd: `\n# 🔧 Zero-Downtime Migrations — Story-Driven Guide\n\n*(Answer in the above format with participants, narrative, patterns, …)*\n`
    },
    {
      question: 'What caching layer (Redis, Memcached, in-memory) and invalidation strategy will you use to reduce load on the primary database for high-frequency queries (e.g., “trending now”)?',
      answerMd: `\n# ⚡ Caching & Invalidation Strategy — Story-Driven Guide\n\n*(Answer in the above format with participants, narrative, patterns, …)*\n`
    },
    {
      question: 'How do you design the comments, ratings, and playlist tables (or collections) to optimize for frequent writes, reads, and pagination?',
      answerMd: `\n# 📝 Comments, Ratings & Playlists Schema — Story-Driven Guide\n\n*(Answer in the above format with participants, narrative, patterns, …)*\n`
    },
    {
      question: 'What backup, restore, and disaster-recovery plan will you implement to meet a 99.99% availability SLA for your metadata store?',
      answerMd: `\n# 🚨 Backup, Restore & Disaster Recovery — Story-Driven Guide\n\n*(Answer in the above format with participants, narrative, patterns, …)*\n`
    },
    {
      question: 'How do you monitor database health and performance (throughput, latency, error rates) and alert on anomalies for proactive scaling and tuning?',
      answerMd: `\n# 🔍 Monitoring & Alerting — Story-Driven Guide\n\n*(Answer in the above format with participants, narrative, patterns, …)*\n`
    },
    {
      question: 'How will you secure the metadata and analytics databases—encryption at rest/in transit, role-based access control, audit logging—to protect user and content data?',
      answerMd: `\n# 🔐 Database Security — Story-Driven Guide\n\n*(Answer in the above format with participants, narrative, patterns, …)*\n`
    },
    {
      question: 'When and how would you introduce a specialized search engine (Elasticsearch, Solr) alongside your primary database for full-text search on video titles/descriptions?',
      answerMd: `\n# 🔎 Full-Text Search Integration — Story-Driven Guide\n\n*(Answer in the above format with participants, narrative, patterns, …)*\n`
    }
  ]
},{
  category: 'systemDesign',
  title: 'Designing a Parking Garage System — Story + Patterns + Code',
  subItems: [
    {
      question: 'How would you design a Parking Garage system?',
      answerMd: `
# 🚗 Designing a Parking Garage System — Story-Driven Guide

## 👥 Main Participants & Their Roles

| Participant         | Role                                                                 |
|---------------------|----------------------------------------------------------------------|
| Vehicle             | Enters and exits the garage                                          |
| Entry/Exit Gate     | Controls access, scans tickets or license plates                     |
| Parking Spot        | Assigned to vehicles based on availability and type                  |
| Parking Floor       | Contains multiple spots, may be categorized (compact, large, EV)     |
| Ticketing System    | Issues entry tickets or logs license plate with timestamp            |
| Payment Processor   | Calculates fees based on duration and vehicle type                   |
| Garage Controller   | Central brain managing availability, assignments, and billing        |
| Display System      | Shows available spots per floor or section                           |
| Admin Dashboard     | Tracks occupancy, revenue, and alerts                                |

---

## 📖 Narrative

In **Parkopolis**, vehicles arrive at the **Entry Gate**, where they’re issued a **Ticket** or scanned via license plate recognition. The **Garage Controller** checks for available spots and guides the vehicle to a suitable **Parking Spot**. When exiting, the **Payment Processor** calculates the fee based on time and vehicle type. The **Admin Dashboard** monitors real-time occupancy, alerts for full floors, and tracks revenue trends.

---

## 🎯 Goals & Guarantees

| Goal                     | Detail                                                                 |
|--------------------------|------------------------------------------------------------------------|
| 🅿️ Efficient Allocation  | Assign spots quickly based on type and availability                    |
| 💳 Accurate Billing      | Calculate fees based on entry/exit timestamps and pricing rules        |
| 📊 Real-Time Monitoring  | Track occupancy, spot status, and alerts                               |
| 🔐 Secure Access         | Prevent unauthorized entry or exit                                     |
| 🔄 Scalability           | Support multi-floor, multi-garage deployments                          |
| 🧠 Extensibility         | Add support for EV charging, reservations, valet, etc.                 |

---

## 🗺️ Architecture at a Glance (ASCII)

\`\`\`
Vehicle
  │
  ▼
Entry Gate ──▶ Ticketing System ──▶ Garage Controller
                                │
                                ▼
                        Parking Spot Assignment
                                │
                                ▼
                          Payment Processor
                                │
                                ▼
                            Exit Gate
                                │
                                ▼
                          Admin Dashboard
\`\`\`

---

## 🔄 Core Patterns & Pitfalls

| Pattern                  | Problem Solved                                  | Pitfall                                | Fix / Best Practice                                  |
|--------------------------|--------------------------------------------------|----------------------------------------|------------------------------------------------------|
| Spot Allocation          | Prevents overbooking or inefficient usage        | Race conditions in concurrent entries  | Use atomic spot reservation; lock per floor          |
| Time-Based Billing       | Ensures fair pricing                             | Clock drift or missed exit scans       | Sync time sources; fallback to manual override       |
| License Plate Recognition| Enables ticketless entry                         | OCR errors or duplicate plates         | Combine with RFID or QR fallback                     |
| Multi-Floor Management   | Scales across large garages                      | Uneven distribution of vehicles        | Balance load via smart assignment                    |
| Real-Time Display        | Guides drivers efficiently                       | Stale or lagging data                  | Use push updates via WebSocket or MQTT               |

---

## 🛠️ Step-by-Step Implementation Guide

1. **Model the Entities**  
   - Vehicle, ParkingSpot, ParkingFloor, Ticket, PaymentRecord.  
   - Define enums for spot type (COMPACT, LARGE, EV) and status (AVAILABLE, OCCUPIED).

2. **Design Spot Allocation Logic**  
   - On entry, assign nearest available spot matching vehicle type.  
   - Lock spot during assignment to prevent race conditions.

3. **Implement Ticketing System**  
   - Generate ticket with entry timestamp and spot ID.  
   - For license plate mode, store plate and timestamp.

4. **Build Payment Processor**  
   - On exit, calculate duration and apply pricing rules.  
   - Support hourly, daily, and flat rate models.

5. **Create Admin Dashboard**  
   - Show occupancy per floor, revenue reports, alerts.  
   - Enable manual overrides and spot reservation.

6. **Add Real-Time Display System**  
   - Push updates to LED boards or mobile apps.  
   - Show available spots per section/floor.

---

## 💻 Code Snippets

### 1. Parking Spot Model (Java)
\`\`\`java
public class ParkingSpot {
  private String id;
  private SpotType type;
  private boolean isAvailable;
  private String assignedVehicleId;
}
\`\`\`

### 2. Spot Allocation Logic
\`\`\`java
public ParkingSpot assignSpot(Vehicle vehicle) {
  List<ParkingSpot> available = spotRepo.findAvailableByType(vehicle.getType());
  if (available.isEmpty()) throw new RuntimeException("No spots available");
  ParkingSpot spot = available.get(0);
  spot.setAvailable(false);
  spot.setAssignedVehicleId(vehicle.getId());
  spotRepo.save(spot);
  return spot;
}
\`\`\`

### 3. Billing Calculation
\`\`\`java
public double calculateFee(LocalDateTime entry, LocalDateTime exit, VehicleType type) {
  long minutes = Duration.between(entry, exit).toMinutes();
  double rate = pricingService.getRate(type);
  return Math.ceil(minutes / 60.0) * rate;
}
\`\`\`

---

## 🚀 Beyond the Basics

- Reservation system for pre-booked spots via mobile app.  
- EV charging integration with usage-based billing.  
- Valet mode with spot reassignment and tracking.  
- Dynamic pricing based on occupancy and time of day.  
- Integration with license plate databases for enforcement.  
- Predictive analytics for peak hours and staffing.  
`
    }
  ]
},{
  category: 'database',
  title: 'SQL vs NoSQL & Aurora vs DynamoDB — In-Depth Use Cases & Scenarios',
  subItems: [
    {
      question: 'When should you choose SQL vs NoSQL?',
      answerMd: `
# 🗄️ SQL vs NoSQL — Use Case Scenarios

## 👥 Main Participants & Their Roles

| Participant    | Role                                                      |
|----------------|-----------------------------------------------------------|
| Developer      | Defines data model and access patterns                    |
| SQL Database   | Enforces ACID, fixed schema                               |
| NoSQL Database | Offers flexible schema and horizontal scale               |
| Analytics Team | Queries large volumes of semi-structured or unstructured data |
| Operations     | Manages scaling, backups, and migrations                   |

---

## 📖 Narrative

You’re building two services for **Acme Corp**:
1. An **Order Processing** system handling payments and inventory updates.
2. A **Telemetry Collector** ingesting millions of IoT events per hour.

Each demands a different database approach.

---

## 🎯 Use Case Scenarios

| Scenario                    | Workload                          | Requirements                                 | Recommended DB    |
|-----------------------------|-----------------------------------|----------------------------------------------|-------------------|
| 1. Financial Transactions   | 500 TPS, multi-table transactions | Strong ACID, joins, strict schema            | SQL (Postgres)    |
| 2. Evolving Product Catalog | 100 RPS, frequent attribute changes | Flexible schema, dynamic fields             | NoSQL (MongoDB)   |
| 3. IoT Telemetry Aggregation| 50k EPS, append-only writes       | High write throughput, eventual consistency  | NoSQL (Cassandra) |

**Scenario 1: Financial Transactions**  
We need atomic transfers between accounts and inventory updates. Multi-row transactions and foreign keys guarantee correctness. Schema changes are rare.

**Scenario 2: Evolving Product Catalog**  
New product attributes (e.g., dimensions, tags) appear weekly. A document store lets you add fields without downtime or migrations.

**Scenario 3: IoT Telemetry Aggregation**  
Sensors push JSON blobs at 10K EPS. Data is mostly append-only and queried later in batch. Horizontal partitioning (sharding) across nodes handles scale.

---

## 🔄 Comparative Patterns & Pitfalls

| Factor            | SQL                                                | NoSQL                                               |
|-------------------|----------------------------------------------------|-----------------------------------------------------|
| Schema            | Rigid: ALTER TABLE, migrations                     | Flexible: add fields per document                   |
| Transactions      | ACID: safe multi-row updates                       | BASE: eventual consistency, lighter transactional support |
| Scaling           | Vertical (bigger instance), read-replicas          | Horizontal (add nodes, auto-sharding)               |
| Query Power       | Rich joins & aggregates                            | Primary-key lookups, map-reduce, secondary indexes  |
| Evolution Speed   | Slower (migrations)                                | Faster (schema-on-read)                             |

---

## 🛠️ Decision Flow

1. List access patterns (joins vs key-value lookups).  
2. Measure RPS/EPS and data growth rate.  
3. Identify consistency vs availability trade-off.  
4. Prototype critical queries and benchmark.  
5. Choose SQL when transactions and complex queries dominate; choose NoSQL when schema flexibility and scale dominate.

---

## 💻 Quick Code Examples

### SQL Transaction (Postgres)
\`\`\`sql
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
\`\`\`

### NoSQL Insert (MongoDB)
\`\`\`js
db.products.insertOne({
  sku: 'X123',
  name: 'Widget',
  attributes: { color: 'red', weight: '2kg', warranty: '2 years' }
});
\`\`\`  
`
    },
    {
      question: 'Aurora vs DynamoDB: which for which workload?',
      answerMd: `
# ☁️ Aurora vs DynamoDB — Workload-Driven Scenarios

## 👥 Main Participants & Their Roles

| Participant         | Role                                               |
|---------------------|----------------------------------------------------|
| Application         | Issues reads/writes                                |
| Aurora Cluster      | Relational storage with MySQL/PostgreSQL engine    |
| DynamoDB Table      | Serverless key-value/document store                |
| DevOps              | Configures scaling policies and backups            |
| Data Analyst        | Queries large datasets for reporting               |

---

## 📖 Narrative

Your team at **StreamFlix** needs two services:
1. A **Subscription Billing** engine with complex joins and reports.
2. A **Global Activity Log** capturing every click or playback event.

They steer you toward Aurora for one and DynamoDB for the other.

---

## 🎯 Workload Scenarios

| Scenario                   | RPS / Storage            | Access Pattern                              | Recommended Service  |
|----------------------------|--------------------------|----------------------------------------------|----------------------|
| 1. Subscription Billing    | 1k RPS, 5 TB             | Complex joins, ad-hoc reporting              | Aurora Serverless    |
| 2. Real-Time Leaderboard   | 50k RPS, 200 GB          | Single-key reads/writes, atomic counters     | DynamoDB (DAX)       |
| 3. Global Event Store      | 100M events/day, 50 TB   | Append-only, event replay                    | DynamoDB Streams     |

**Scenario 1: Subscription Billing**  
Monthly billing runs complex SQL queries, joins between users, plans, payments. Aurora’s read replicas offload reporting; strong ACID ensures invoice accuracy.

**Scenario 2: Real-Time Leaderboard**  
Leaderboards increment counters on each game result. DynamoDB with atomic UpdateItem calls and DAX accelerator gives microsecond latency at any scale.

**Scenario 3: Global Event Store**  
Every user interaction is logged. DynamoDB Streams triggers Lambda consumers for ETL pipelines. Unlimited scale and point-in-time recovery simplify operations.

---

## 🔄 Comparative Table

| Aspect             | Aurora                                                       | DynamoDB                                                 |
|--------------------|--------------------------------------------------------------|----------------------------------------------------------|
| Data Model         | Relational (tables, joins)                                   | Key-value / document                                     |
| Scaling            | Auto-scale storage to 128 TiB, read-replicas                 | Virtually unlimited, auto-sharding                       |
| Latency            | Single-digit ms                                               | Single-digit ms, accelerated by DAX                      |
| Consistency        | Strong, configurable via session settings                    | Eventual by default, transactional API for strong reads  |
| Pricing            | Pay per ACU & I/O                                            | Pay per RCUs/WCUs & storage                              |

---

## 🛠️ Selection Checklist

1. Do you need SQL features (joins, window functions)? → Choose Aurora.  
2. Is schema evolving or access pattern known upfront? → DynamoDB for fixed keys, Aurora otherwise.  
3. Can you tolerate eventual consistency? → DynamoDB, else Aurora.  
4. What latency SLA do you target? → Both single-digit ms, but DAX gives microseconds with DynamoDB.

---

## 🚀 Advanced Tips

- Use **Aurora Global Database** for cross-region reads with < 100 ms lag.  
- Combine **DynamoDB + Aurora**: hot paths in Dynamo, heavy analytics in Aurora.  
- Leverage **Serverless Aurora** for unpredictable workloads.  
- Enable **Time-to-Live** on Dynamo tables to purge old events automatically.  
`
    }
  ]
},{
category: 'systemDesign',
title: 'Caching & Redis vs Memcached Caching Strategies — Story + Use Cases + Patterns',
subItems: [
{
question: 'What are the common caching strategies?',
answerMd: `
# ⚡ Caching Strategies — Story-Driven Guide

## 👥 Main Participants & Their Roles

| Participant      | Role                                                      |
|------------------|-----------------------------------------------------------|
| Client App       | Issues read/write requests                                |
| Cache Layer      | Stores and serves in-memory data for fast access          |
| Primary Database | Source of truth                                          |
| Cache Manager    | Applies caching patterns (e.g., lazy, write-through)      |
| Eviction Policy  | Decides which items to remove when cache memory is full   |
| Monitoring       | Tracks cache hit/miss rates and performance              |

---

## 📖 Narrative

In **CacheCity**, the **Client App** races to fetch product details during flash sales. The **Cache Layer** stands ready like a fast-track lane, serving hot data at lightning speed. The **Cache Manager** applies the right strategy—lazy loading for on-demand entries or write-through to keep data fresh—while the **Eviction Policy** patrols memory limits to keep only the most valuable items on the fast lane.

---

## 🎯 Use Case Scenarios

| Strategy          | When to Use                                  | Pros                                     | Cons                                      |
|-------------------|----------------------------------------------|------------------------------------------|-------------------------------------------|
| Cache-Aside       | Read-heavy, unpredictable keys               | Simple, cost-effective                   | Cold-start penalty on cache miss          |
| Write-Through     | High write consistency needs                 | Data always fresh in cache               | Write latency adds to database operations |
| Write-Back        | Write-heavy workloads with batch updates     | Fast writes to cache                     | Risk of data loss if cache fails          |
| Refresh-Ahead     | Predictable hot keys (e.g., homepage stats)  | Avoids cache misses                      | Complex to schedule and prefetch logic    |

**Scenario 1: E-Commerce Product Catalog (Cache-Aside)**
Users browse products; each page request checks cache first. On a miss, data is loaded from the database and cached. Miss penalties are acceptable, but a high cache hit rate keeps page load snappy.

**Scenario 2: User Profiles (Write-Through)**
Profile updates must reflect immediately. Every profile update writes to both the database and cache in one atomic step, ensuring reads always fetch fresh data.

**Scenario 3: Analytics Counter (Write-Back)**
High-frequency event counters increment in cache and flush to the database in batches every minute. Write-back reduces database load but requires careful flush and failure handling.

**Scenario 4: Leaderboard Refresh (Refresh-Ahead)**
Top scores are recalculated every few seconds and pushed into cache before users request them, eliminating cold starts during traffic spikes.

---

## 🔄 Common Pitfalls & Mitigations

| Pitfall                 | Impact                          | Mitigation                                   |
|-------------------------|---------------------------------|----------------------------------------------|
| Stale Data              | Serving outdated info           | Invalidate on write or set short TTL         |
| Cache Stampede          | Many misses stampede database   | Use locks or request coalescing              |
| Memory Exhaustion       | Evicts critical entries         | Choose LRU/LFU, monitor usage, scale memory  |
| Inconsistent Writes     | Writes missing in cache/DB      | Use atomic writes or transactions            |

---

## 🗺️ Architecture at a Glance (ASCII)

\`\`\`
Client App
│
▼
Cache Layer ────▶ Primary Database
│   ▲
│   └─ Eviction Policy & TTL
└─ Cache Manager applies patterns
\`\`\`
`
},
{
question: 'When should you choose Redis vs Memcached?',
answerMd: `
# 🗃️ Redis vs Memcached — Use Case Scenarios

## 👥 Main Participants & Their Roles

| Participant       | Role                                                      |
|-------------------|-----------------------------------------------------------|
| Application       | Reads/writes cache via client library                     |
| Redis Server      | In-memory data store with rich data structures            |
| Memcached Server  | Simple in-memory key-value store                          |
| Persistence Layer | Optional disk backing (Redis only)                        |
| Cluster Manager   | Manages sharding and replication                          |
| Monitoring        | Tracks memory usage, operations, and evictions            |

---

## 📖 Narrative

In **VelocityVille**, your **Application** needs a caching engine. On one side, **Redis** offers lists, sets, sorted sets and persistence—like a Swiss Army knife. On the other, **Memcached** excels at pure key-value speed—the nitro boost for web assets. You pick your champion based on feature needs and workload patterns.

---

## 🎯 Workload Scenarios

| Scenario                    | Workload Characteristics                           | Recommended Choice  |
|-----------------------------|-----------------------------------------------------|---------------------|
| Session Store               | User sessions with TTL, small simple keys           | Memcached           |
| Leaderboards & Queues       | Sorted scores, push/pop operations                  | Redis               |
| Full-Page Caching           | HTML pages, string blobs                            | Memcached           |
| Analytics & Counters        | Atomic increments, time-series, hyperloglog         | Redis               |
| Distributed Locks           | Locks with expiration                               | Redis (SETNX)       |
| Short-Lived Feature Flags   | Boolean flags, low volume                           | Memcached           |

---

## 🔄 Comparative Table

| Aspect             | Redis                                                                 | Memcached                             |
|--------------------|-----------------------------------------------------------------------|---------------------------------------|
| Data Structures    | Strings, Lists, Sets, Sorted Sets, Hashes, Bitmaps                    | Simple key-value strings              |
| Persistence        | RDB, AOF, hybrid modes                                                | In-memory only                        |
| Eviction Policies  | LRU, LFU, TTL-based                                                   | LRU, configurable                     |
| Scaling            | Redis Cluster, Sentinel for HA                                        | Client-side consistent hashing        |
| Throughput & Latency | Slightly higher latency, rich ops                                 | Ultra-low latency, simpler ops        |
| Memory Efficiency  | Stores metadata per entry, slightly more overhead                     | More compact, less overhead           |

---

## 🛠️ Code Snippets

### Redis Leaderboard (Sorted Set)
\`\`\`js
// Add or update score
redis.zadd('leaderboard', score, userId);
// Get top 10
redis.zrevrange('leaderboard', 0, 9, 'WITHSCORES');
\`\`\`

### Memcached Session Store (Node.js)
\`\`\`js
const memjs = require('memjs');
const client = memjs.Client.create();
client.set('session123', JSON.stringify(sessionData), { expires: 3600 });
client.get('session123', (err, val) => { /* ... */ });
\`\`\`

---

## 🚀 Advanced Tips

- Use Redis Modules (e.g., RedisJSON, RediSearch) for specialized workloads.
- Combine Memcached for ephemeral cache and Redis for stateful structures.
- Tune TTLs and eviction policies based on access patterns.
- Monitor keyspace notifications in Redis for cache invalidation events.
- Horizontally scale via Redis Cluster or Memcached consistent hashing.
`
}
]
},
{
category: 'leadership',
title: 'Handling Tough Situations — STAR Q&A',
subItems: [
{
question: 'Describe a situation at Wipro where you handled a critical migration smoothly.',
answerMd: `
# STAR Example: Zero-Downtime Core Banking Migration at Wipro

## 🗺️ Architecture at a Glance (ASCII)

\`\`\`
Customer Transactions
│
▼
Legacy STAR System
│
▼
Oracle ESB
┌───────┴───────┐
▼               ▼
STAR Adapter       T24 Adapter
└───────┬───────┘
▼
Relationship Summary Service
│
▼
Data Stores
\`\`\`

## Situation

At Wipro, our team was responsible for migrating SAMBA Financial Group’s 1 million+ retail banking customers from a legacy STAR system to the Temenos T24 core banking platform. We needed to process over 40 000 transactions daily with zero downtime, while meeting strict regulatory requirements and ensuring data consistency across two disparate systems.

## Task

As the Senior Software Engineer and onsite coordinator, I was charged with:
- Designing and executing a zero-downtime migration strategy.
- Ensuring real-time data synchronization between STAR and T24 throughout the cut-over.
- Building robust integration layers for both legacy and new system transactions.
- Coordinating cross-functional teams across Hyderabad and Riyadh to hit a fixed go-live deadline.

## Action

1. Architected Oracle ESB Integration
- Developed two ESB routes: a STAR adapter for legacy flows and a T24 adapter for migrated accounts.
- Employed message queuing and guaranteed-delivery patterns to prevent data loss.

2. Designed Hybrid Data Consolidation
- Created a “Relationship Summary” service to merge customer profiles in real time.
- Implemented nightly reconciliation jobs that auto-corrected minor mismatches.

3. Built Critical Modules
- Exchange Rate Management for live currency conversion.
- E-Statement Digitization, reducing manual request volume by 40%.
- Speedcash Transfers to streamline cross-border remittances.

4. Coordinated Cross-Functional Execution
- Ran daily stand-ups between Hyderabad and Riyadh to track progress.
- Drafted detailed runbooks, rollback plans, and conducted parallel dry-run migrations.
- Liaised with regulatory auditors ahead of go-live to validate compliance checkpoints.

## Result

- Achieved zero downtime on cut-over day; processed 40 000+ transactions seamlessly.
- Maintained 100% data integrity, with nightly jobs auto-resolving 98% of minor mismatches.
- Reduced manual statements by 40%, boosting customer satisfaction scores.
- Earned Wipro’s “Excellence in Delivery” award for flawless execution.
`
},
{
question: 'Describe a challenging re-architecture at Carelon Global Solutions and how you resolved it.',
answerMd: `
# STAR Example: Cost-Effective Claims Pipeline Re-architecture at Carelon Global Solutions

## 🗺️ Architecture at a Glance (ASCII)

\`\`\`
Client / Dashboard
│
▼
Amazon S3
│ (Put Event)
▼
AWS Lambda
│
┌─────┴─────┐
▼           ▼
DocumentDB   AWS Transfer Family
│
▼
FileNet
\`\`\`

## Situation

At Carelon, we processed over 1 million healthcare claims per day through an AWS event-driven pipeline. Rising S3 egress fees and intermittent SFTP failures to FileNet threatened our cost targets and 99.9% SLA commitment.

## Task

As Technical Lead, I needed to re-architect the ingestion and transfer workflow to:
- Eliminate performance bottlenecks.
- Reduce annual infrastructure costs by at least \$15 000.
- Guarantee reliable, end-to-end delivery without disrupting downstream systems.

## Action

1. Designed a Lambda-centric Pipeline
- Lambdas subscribed to S3 event notifications, processed claims in batches with idempotent checks, and stored metadata in DocumentDB.

2. Migrated to Serverless SFTP
- Replaced EC2-based SFTP jobs with S3 event–triggered AWS Transfer Family transfers, enabling near-real-time movement to FileNet.

3. Implemented Automated Remediations
- Added granular CloudWatch metrics and alarm-driven automations (Lambda retries, dead-letter queues) to resolve failures within minutes.

4. Optimized Costs
- Consolidated small file writes into larger S3 objects, leveraged Intelligent-Tiering, and right-sized Lambda memory configurations.

## Result

- Cut annual infrastructure costs by \$18 000 (20% better than target).
- Achieved 99.9% SLA compliance over six months with zero unplanned downtime.
- Reduced end-to-end claim-processing latency by 35%, improving partner satisfaction.
- Automated error remediation, reducing manual interventions by 80%.
`
},
{
question: 'Describe a demanding platform overhaul at DBS Bank and how you managed it effectively.',
answerMd: `
# STAR Example: Automated Trade-Reporting Platform at DBS Bank

## 🗺️ Architecture at a Glance (ASCII)

\`\`\`
Murex Trade Events
│
▼
Kafka
│
▼
Golang Reconciliation Service
┌──────────┴──────────┐
▼                     ▼
React Dashboard      Spring Batch ETL
│
▼
MariaDB
\`\`\`

## Situation

DBS needed to modernize its HKTR/SGTR trade-reporting platforms by migrating from a legacy mainframe and disparate systems to a unified, cloud-native Golang and React stack. Manual reconciliations consumed 50% of an analyst’s workweek and were error-prone.

## Task

As Lead Development Engineer, I was tasked with:
- Delivering a production-grade reconciliation system within a four-month regulatory deadline.
- Halving manual effort while preserving data accuracy for millions of daily transactions.

## Action

1. Built Golang Microservices
- Consumed Murex trade events via Kafka, applied business validations, and generated reconciliation records.

2. Developed a Real-Time React Dashboard
- Displayed mismatches and audit trails, enabling analysts to drill into discrepancies.

3. Automated Nightly ETL Workflows
- Used Spring Batch to load enriched data into MariaDB and perform consistency checks against mainframe exports.

4. Streamlined CI/CD
- Implemented Jenkins pipelines and Terraform on OpenShift, reducing release cycles from two weeks to four days.

5. Fostered Cross-Team Collaboration
- Held bi-weekly demos with compliance, QA, and infrastructure teams to stay ahead of regulatory checkpoints.

## Result

- Reduced manual reconciliation effort by 50%, saving 1 000 analyst hours per quarter.
- Delivered the platform on schedule with zero critical audit findings.
- Increased deployment frequency by 40%, enabling rapid feature iterations.
- Won DBS’s Delivery Excellence Award for innovation in trade-reporting automation.
`
},
]
},{
category: 'leadership',
title: 'Q&A Platform Architecture — Q&A Format',
subItems: [
{
question: 'Draw and explain the application architecture you are currently working on.',
answerMd: `
# Q&A Platform Architecture — Overview

## 🗺️ Architecture at a Glance (ASCII)

\`\`\`
+------------+
|   Client   |
+-----+------+
|
v
+---------+
|   CDN   |
+---------+
|
v
+----------------------+
|    Frontend App      |
| (Next.js / React)    |
+----------+-----------+
|
v
+----------------------+
|   API Gateway / LB   |
+----------+-----------+
|
+--------------+--------------+
|              |              |
v              v              v
+--------+    +-----------+    +------------+
| Auth   |    | QA Service|    | DiagramSvc |
| Service|    |           |    |            |
+--------+    +-----+-----+    +-----+------+
|                |
v                v
+-----------+    +---------------+
| Database  |    | Object Store  |
+-----------+    +---------------+
|
v
+-----------+
|  Redis    |
+-----------+



Provider Claims Attachments
=============================
Availity → [CFX] → [S3] → [Lambda] → [DocumentDB] → [Textract/PDF Merging] → [SFTP → FileNet]
↗ (EventBridge)



Client / Dashboard
│
▼
Amazon S3
│ (Writes data)
▼
AWS Lambda
│
├───────────────────────────────────────┐
│                                       │
▼                                       ▼
Producer Queue                          Amazon SNS
│
▼
Kubernetes Cluster
│
├─────────────┬───────────────┬───────────────┐
│             │               │               │
▼             ▼               ▼               ▼
Horizontal    Cluster          Horizontal      Output
Autoscaler    Autoscaler       Autoscaler      Bucket
│
▼
Administers Containers
│
├─────────────┬───────────────┬───────────────┐
│             │               │               │
▼             ▼               ▼               ▼
Executor      Runs             Validates       PostgreSQL
Containers    Validation       Outputs         PersistentVolume


Additional services: SearchSvc (Elasticsearch), Analytics (Kafka → DW), CI/CD Pipeline.
\`\`\`

---


Key Components
1.	File Ingestion (AWS S3 + CFX)
o	Cloud File Exchange (CFX):
	Polled Availity’s SFTP for new claim batches (ZIP files).
	File Size Handling: Split >10MB files into chunks using AWS Transfer Family.
2.	Event-Driven Processing (Lambda)
o	Trigger: S3 ObjectCreated events.
o	Workflow:
1.	Unzip & Validate: Extracted attachments (PDF, CSV, TIFF) using libarchive (Python).
2.	Merge to PDF:
	Converted non-PDF files (e.g., CSV → PDF tables) with PyPDF2/reportlab.
	Stitched multi-page TIFFs into single PDFs using Pillow.
3.	Metadata Extraction:
	Used AWS Textract to OCR scanned PDFs and extract fields like patient_id, claim_amount.
	Stored raw and processed files in DocumentDB for audit trails.
2.	Downstream Integration
o	SFTP to FileNet:
	Transformed PDFs into FileNet-compatible formats (e.g., TIFF for legacy systems).
	Retry Logic: AWS Step Functions to handle SFTP timeouts.
	Post-Processing (AWS Glue):
	Batch-processed merged PDFs to flag anomalies (e.g., overpayments).
	Error Handling
	Dead-Letter Queue (SQS): Captured failed Lambda invocations for reprocessing.
	SNS Alerts: Notified ops team for manual review of corrupted files.
Impact
•	20% Faster Settlements: Reduced manual document handling for overpayment claims.
•	Cost Savings: Cut Availity’s storage costs by 40% via AWS S3 lifecycle policies.



## 👥 Main Components & Responsibilities

| Component         | Responsibility                                         |
|-------------------|--------------------------------------------------------|
| Client            | Browse, author, and preview Q&A content                |
| CDN               | Cache static assets for low-latency delivery           |
| Frontend App      | Renders UI, handles live preview and diagram editing   |
| API Gateway / LB  | Routes requests, enforces auth and rate limits         |
| Auth Service      | OAuth/JWT issuance and session management              |
| QA Service        | CRUD operations on questions, answers, metadata        |
| DiagramSvc        | Renders Mermaid, ASCII art, and image diagrams         |
| Database          | Persists user data, content, version history           |
| Redis             | Caches sessions, rate-limit counters                   |
| Object Store      | Stores markdown, diagram exports, assets (S3/Git)      |
| SearchSvc         | Ingests content events, serves full-text search (ES)   |
| Analytics         | Streams usage events via Kafka into data warehouse     |
| CI/CD Pipeline    | Automates build, test, and deployment to Kubernetes    |

---

## 📖 Narrative

Our platform empowers technical authors to create rich Q&A articles blending code, diagrams, and narrative. Readers get sub-second load times, real-time search, and live preview of Mermaid or ASCII diagrams. Behind the scenes, an event-driven pipeline keeps search and analytics in sync, while a robust CI/CD workflow guarantees safe, repeatable releases.

---

## 🎯 Goals & Constraints

| Goal                          | Detail                                                              |
|-------------------------------|---------------------------------------------------------------------|
| Real-time Editing & Preview   | Instant markdown and diagram rendering in the browser               |
| Scalable Content Storage      | Handle thousands of concurrent reads/writes with strong consistency |
| Rich Diagram & Code Support   | Embed and render Mermaid, ASCII art, and syntax-highlighted code    |
| Low-Latency Search            | Full-text search with tag filtering and autocomplete                |
| Multi-Tenancy & Access Control| Isolate customer data and enforce role-based permissions            |
| Automated Deployment          | Zero-downtime releases via blue-green/Kubernetes                    |

---

## 🔄 Data Flow

1. User loads page → CDN → Frontend App.
2. Editor requests content → API Gateway → Auth → QA Service → DB/Redis.
3. Diagram preview request → DiagramSvc → Object Store → returns URL.
4. Content changes → QA Service emits Kafka event → SearchSvc indexes into Elasticsearch.
5. User interactions → Analytics events → Kafka → Data Warehouse for dashboards.
6. Git push → CI/CD Pipeline builds containers → deploys to Kubernetes → invalidates CDN.

---

## 🔄 Core Patterns & Considerations

| Pattern           | Problem Solved                                | Verification                      | Mitigation                         |
|-------------------|-----------------------------------------------|-----------------------------------|------------------------------------|
| CDN Caching       | Reduces load and latency                      | Cache invalidation on updates     | Use ETags, cache-busting headers   |
| Rate Limiting     | Prevents abuse and overload                   | Burst vs sustained thresholds     | Token bucket in Redis              |
| Circuit Breaker   | Fails fast on external diagram or search APIs | Sensitivity of thresholds         | Resilience4j with fallback         |
| Event-Driven Sync | Decouples services for scalable indexing      | Ordering and duplication          | Idempotent consumers, DLQs         |
| CI/CD Automation  | Ensures reproducible, zero-downtime deploys   | Pipeline flakiness                | Automated rollback on failure      |

---

## 🚀 Advanced Considerations

- Multi-region active-active deployment with global DB replication
- Blue-green deployments and feature flags for safe rollouts
- Predictive CDN pre-warming via usage analytics
- ML-driven content recommendations and synonym expansion
- End-to-end encryption and GDPR audit logging
`
}
]
},{
category: 'communication',
title: 'Conflict Management',
subItems: [
{
question: 'What are the main internal conflict scenarios in the IT industry and how can you resolve them?',
answerMd: `
# Internal Conflict Scenarios and Resolution in IT

IT organizations frequently encounter friction arising from misaligned goals, scarce resources, process mismatches, and interpersonal dynamics. Below are ten common interview-style questions—each tied to a real conflict scenario—and a step-by-step approach to resolve them.

---

## 1. Describe your approach to resolving a conflict between two team members.
**Scenario:** Two developers clash over choosing the optimal technical solution.
**Resolution:**
1. Meet each developer individually and listen actively.
2. Identify the root cause (style difference, ownership ambiguity, missing data).
3. Facilitate a joint workshop to compare pros and cons objectively.
4. Define clear success criteria and document the decision.
5. Follow up to ensure both parties adhere to the agreed approach.

---

## 2. Explain a time you mediated a dispute over resource allocation.
**Scenario:** Two project teams compete for the same limited servers or budget.
**Resolution:**
1. Convene both teams in a neutral setting.
2. Clarify resource constraints and project timelines.
3. Co-create a prioritization framework based on impact, deadlines, and ROI.
4. Negotiate a phased or shared allocation plan.
5. Monitor usage and KPIs jointly to prevent future conflicts.

---

## 3. How would you resolve a situation where vague directives cause repeated mistakes?
**Scenario:** Miscommunication between management and front-line engineers leads to errors.
**Resolution:**
1. Hold separate listening sessions with engineers and managers.
2. Surface ambiguous policies and unclear expectations.
3. Draft precise, written guidelines and workflow diagrams.
4. Roll out guidelines in interactive workshops with Q&A.
5. Establish a monthly feedback loop for continuous refinement.

---

## 4. Give an example of bridging a gap between teams using different methodologies.
**Scenario:** Agile and Waterfall teams clash over cadence and deliverables.
**Resolution:**
1. Visually map both processes to identify common goals and hand-offs.
2. Design a hybrid workflow (e.g., short sprints with stage-gate reviews).
3. Agree on a shared communication cadence (daily stand-ups + milestone reviews).
4. Pilot the hybrid model on one feature.
5. Revisit and refine after two cycles based on retrospectives.

---

## 5. Tell me about a time you managed conflict arising from shifting or vague specs.
**Scenario:** Repeated bugs and rework due to unclear requirements.
**Resolution:**
1. Host a spec-refinement workshop with all stakeholders.
2. Define user stories with clear acceptance criteria.
3. Build quick prototypes or spikes for ambiguous features.
4. Lock in a versioned requirements document.
5. Enforce change-control for any subsequent tweaks.

---

## 6. How do you handle a team member who consistently resists change?
**Scenario:** A developer refuses to adopt a new process or tool.
**Resolution:**
1. Schedule a one-on-one to understand their concerns.
2. Empathize and validate their fears (learning curve, loss of ownership).
3. Run a small pilot to demonstrate benefits.
4. Provide targeted training and pair them with a champion.
5. Celebrate early wins publicly to build momentum.

---

## 7. Describe how you diffused a personality-based conflict on your team.
**Scenario:** Two colleagues have a deep personality clash affecting morale.
**Resolution:**
1. Mediate a private conversation focusing on behaviors, not character.
2. Establish team norms and communication ground rules.
3. Pair them on a low-risk task to foster empathy.
4. Recognize and reward collaborative successes.
5. Revisit norms in regular retrospectives.

---

## 8. Explain a time you resolved friction between dev, QA, and operations.
**Scenario:** Blockers in cross-functional projects due to unclear hand-offs.
**Resolution:**
1. Clarify roles and hand-off responsibilities in a RACI matrix.
2. Create a shared “swimlane” Kanban board for end-to-end visibility.
3. Schedule regular sync-ups with rotating facilitators.
4. Track and publicize key metrics (e.g., time-to-resolve).
5. Adjust processes based on retrospective feedback.

---

## 9. How have you managed conflicts in a distributed or remote team?
**Scenario:** Collaboration breakdown with remote or offshore teams.
**Resolution:**
1. Define overlapping “core hours” for live collaboration.
2. Standardize documentation in a shared wiki or knowledge base.
3. Schedule weekly video stand-ups and daily async check-ins.
4. Rotate pair-programming or mentoring across locations.
5. Use pulse surveys to surface issues early.

---

## 10. Can you share an example of resolving a conflict when two groups competed for funding?
**Scenario:** Teams vie for a tight budget or headcount.
**Resolution:**
1. Present data-driven business cases from both sides.
2. Score each request against agreed criteria (ROI, risk, strategic fit).
3. Negotiate a phased funding or headcount release.
4. Offer cross-team support once initial deliverables are met.
5. Review ROI jointly post-delivery to inform future allocations.
`
}
]
},

];

export default data;