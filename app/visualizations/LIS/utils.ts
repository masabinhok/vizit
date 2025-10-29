export function* lisDpSteps(arr: number[]) {
  const n = arr.length;
  const dp = Array(n).fill(1);
  yield { dp: [...dp], step: "Initialized DP array" };

  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (arr[i] > arr[j]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
        yield { dp: [...dp], step: `Updated dp[${i}] using dp[${j}]` };
      }
    }
  }
  yield { dp: [...dp], step: "Final DP array" };
}
