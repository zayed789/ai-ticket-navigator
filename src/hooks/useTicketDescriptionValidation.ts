/**
 * Validation hook for ticket description fields
 * Ensures descriptions are clear, meaningful, and actionable
 */

export interface ValidationResult {
  isValid: boolean;
  errorMessage: string | null;
}

const ERROR_MESSAGE = "Please enter a clear and meaningful description of the issue.";

/**
 * Validates a ticket description based on multiple criteria:
 * - Minimum 15 characters
 * - Not only numbers
 * - Not only symbols/special characters
 * - Contains at least two alphabetic words
 * - Not random/meaningless text
 */
export const validateTicketDescription = (text: string): ValidationResult => {
  const trimmedText = text.trim();
  
  // Empty text is invalid
  if (!trimmedText) {
    return { isValid: false, errorMessage: null }; // Don't show error for empty (pristine state)
  }
  
  // Check minimum length (15 characters)
  if (trimmedText.length < 15) {
    return { isValid: false, errorMessage: ERROR_MESSAGE };
  }
  
  // Check if input contains only numbers
  if (/^\d+$/.test(trimmedText)) {
    return { isValid: false, errorMessage: ERROR_MESSAGE };
  }
  
  // Check if input contains only symbols/special characters (no alphanumeric)
  if (!/[a-zA-Z0-9]/.test(trimmedText)) {
    return { isValid: false, errorMessage: ERROR_MESSAGE };
  }
  
  // Check if input is only symbols and whitespace (no letters at all)
  if (!/[a-zA-Z]/.test(trimmedText)) {
    return { isValid: false, errorMessage: ERROR_MESSAGE };
  }
  
  // Extract alphabetic words (sequences of letters, min 2 chars to be a "word")
  const words = trimmedText.match(/[a-zA-Z]{2,}/g) || [];
  
  // Must have at least 2 alphabetic words
  if (words.length < 2) {
    return { isValid: false, errorMessage: ERROR_MESSAGE };
  }
  
  // Check for random/meaningless text patterns
  if (isRandomText(trimmedText, words)) {
    return { isValid: false, errorMessage: ERROR_MESSAGE };
  }
  
  return { isValid: true, errorMessage: null };
};

/**
 * Detects random/meaningless text patterns
 */
const isRandomText = (text: string, words: string[]): boolean => {
  // Check for keyboard mashing patterns (consecutive consonants without vowels)
  const hasExcessiveConsonants = words.some(word => {
    // Check for 4+ consecutive consonants (excluding common patterns)
    const consonantRun = word.match(/[bcdfghjklmnpqrstvwxyz]{4,}/i);
    if (consonantRun) {
      // Allow common patterns like "ght", "str", "thr"
      const commonPatterns = /(?:ght|str|thr|sch|spr|scr|ngt|nds|rth|nth)/i;
      if (!commonPatterns.test(consonantRun[0])) {
        return true;
      }
    }
    return false;
  });
  
  if (hasExcessiveConsonants) {
    return true;
  }
  
  // Check for repeated characters (e.g., "aaaa", "hhhh")
  if (/(.)\1{3,}/i.test(text)) {
    return true;
  }
  
  // Check if most words are very short gibberish (1-2 chars each)
  const shortWords = words.filter(w => w.length <= 2);
  if (shortWords.length >= words.length * 0.7 && words.length > 2) {
    return true;
  }
  
  // Known meaningless test patterns
  const meaninglessPatterns = [
    /^test+$/i,
    /^asdf/i,
    /^qwer/i,
    /^zxcv/i,
    /^hjkl/i,
    /^hello+\s*world+$/i,
    /^foo\s*bar$/i,
    /^lorem\s*ipsum$/i,
  ];
  
  const lowerText = text.toLowerCase();
  for (const pattern of meaninglessPatterns) {
    if (pattern.test(lowerText)) {
      return true;
    }
  }
  
  return false;
};

/**
 * Validates chat messages for ticket submission
 * Combines all user messages and validates the combined text
 */
export const validateChatMessages = (messages: { text: string; isUser: boolean }[]): ValidationResult => {
  const userMessages = messages.filter(m => m.isUser);
  
  if (userMessages.length === 0) {
    return { isValid: false, errorMessage: null };
  }
  
  const combinedText = userMessages.map(m => m.text).join(' ');
  return validateTicketDescription(combinedText);
};
