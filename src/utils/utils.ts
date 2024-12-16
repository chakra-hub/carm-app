export const extractDateFromString = (input) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  // Patterns for different date formats, prioritizing full date formats
  const datePatterns = [
    /\b\d{1,2}\s(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s\d{4}\b/i, // DD Month YYYY
    /\b\d{4}[-/]\d{2}[-/]\d{2}\b/, // YYYY-MM-DD or YYYY/MM/DD
    /\b\d{2}[-/]\d{2}[-/]\d{4}\b/, // DD-MM-YYYY or MM/DD/YYYY
    /\b\d{1,2}\s(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\b/i, // DD Month
    /\b\d{1,2}(?:st|nd|rd|th)?(?:\s+of\s+this\s+month)?\b/i, // 26th or 26th of this month
  ];

  for (const pattern of datePatterns) {
    const match = input.match(pattern);
    if (match) {
      let dateStr = match[0].trim();

      // Handle "DD Month" like "27 November"
      if (
        /^\d{1,2}\s(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i.test(
          dateStr
        )
      ) {
        dateStr += ` ${currentYear}`; // Add the current year if missing
      } else if (/of this month/i.test(dateStr)) {
        const day = dateStr.match(/\d{1,2}/)[0];
        dateStr = `${currentYear}-${currentMonth}-${day.padStart(2, "0")}`;
      }

      // Parse date without timezone issue
      const parsedDate = parseDateWithoutTimezone(dateStr);
      if (parsedDate) return parsedDate;
    }
  }
  return null;
};

// Function to handle date without timezone issues
const parseDateWithoutTimezone = (dateStr) => {
  const date = new Date(dateStr);
  if (isNaN(date)) return null;

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`; // Return in YYYY-MM-DD format
};
