export function minutesToHoursAndMinutes(minutes: number): string {
    const hours: number = Math.floor(minutes / 60);
    const remainingMinutes: number = minutes % 60;

    let result = '';
    if (hours > 0) {
        result += `${hours} hr `;
    }
    if (remainingMinutes > 0) {
        result += `${remainingMinutes} min`;
    }

    if (result === '') {
        result = '0 min'; // Handle the case when minutes is 0
    }

    return result;
}

type formatOption = 'YYYY-MM-DD' | 'DD-MM-YYYY' | 'MM/DD/YYYY';

export function formatDate(date: Date, format: formatOption): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();

    switch (format) {
        case 'YYYY-MM-DD':
            return `${year}-${month}-${day}`;
        case 'DD-MM-YYYY':
            return `${day}-${month}-${year}`;
        case 'MM/DD/YYYY':
            return `${month}/${day}/${year}`;
        // Add more cases for different formats as needed
        default:
            return date.toISOString(); // Default to ISO string format
    }
}