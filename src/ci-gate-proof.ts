// Deliberate type error. This file exists only to prove that a red CI run blocks
// the merge button on a protected `main`. It is never merged and its branch is
// deleted immediately after the observation is recorded. See issue #5.
export const proof: number = 'this is not a number';
