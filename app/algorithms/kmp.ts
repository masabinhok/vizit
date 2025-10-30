// KMP (Knuth-Morris-Pratt) Pattern Searching Algorithm Implementation

export interface KMPStep {
    text: string;
    pattern: string;
    textIndex: number;
    patternIndex: number;
    lpsArray: number[];
    isMatch: boolean;
    comparison: boolean;
    shift: number;
}

export interface LPSStep {
    pattern: string;
    index: number;
    len: number;
    lpsArray: number[];
    comparing: boolean;
}

export function computeLPSArray(pattern: string): { lps: number[], steps: LPSStep[] } {
    const lps: number[] = new Array(pattern.length).fill(0);
    const steps: LPSStep[] = [];
    let len = 0;
    let i = 1;

    while (i < pattern.length) {
        steps.push({
            pattern,
            index: i,
            len,
            lpsArray: [...lps],
            comparing: true
        });

        if (pattern[i] === pattern[len]) {
            len++;
            lps[i] = len;
            i++;
        } else {
            if (len !== 0) {
                len = lps[len - 1];
            } else {
                lps[i] = 0;
                i++;
            }
        }

        steps.push({
            pattern,
            index: i - 1,
            len,
            lpsArray: [...lps],
            comparing: false
        });
    }

    return { lps, steps };
}

export function kmpSearch(text: string, pattern: string): { found: boolean[], steps: KMPStep[] } {
    const n = text.length;
    const m = pattern.length;
    const found: boolean[] = new Array(n).fill(false);
    const steps: KMPStep[] = [];
    
    // Compute LPS array
    const { lps } = computeLPSArray(pattern);
    
    let i = 0; // index for text
    let j = 0; // index for pattern
    
    while (i < n) {
        // Record current state
        steps.push({
            text,
            pattern,
            textIndex: i,
            patternIndex: j,
            lpsArray: [...lps],
            isMatch: false,
            comparison: true,
            shift: 0
        });

        if (pattern[j] === text[i]) {
            i++;
            j++;
        }

        if (j === m) {
            // Pattern found
            found[i - j] = true;
            steps.push({
                text,
                pattern,
                textIndex: i,
                patternIndex: j,
                lpsArray: [...lps],
                isMatch: true,
                comparison: false,
                shift: j - lps[j - 1]
            });
            j = lps[j - 1];
        } else if (i < n && pattern[j] !== text[i]) {
            // Mismatch after j matches
            steps.push({
                text,
                pattern,
                textIndex: i,
                patternIndex: j,
                lpsArray: [...lps],
                isMatch: false,
                comparison: false,
                shift: j > 0 ? j - lps[j - 1] : 1
            });
            
            if (j !== 0) {
                j = lps[j - 1];
            } else {
                i++;
            }
        }
    }

    return { found, steps };
}