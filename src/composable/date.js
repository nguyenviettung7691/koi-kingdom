import { toValue } from "vue";

// by convention, composable function names start with "use"
export function useTimestampToString(input) {
    // If maybeRefOrGetter is a ref or a getter,
    // its normalized value will be returned.
    // Otherwise, it is returned as-is.
    const timestamp = toValue(input);
    if(!timestamp) return {timestamp, string: ''};
    // Create a Date object from the timestamp
    const date = new Date(timestamp);

    // Get individual date components
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Months are zero-based
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    // Format the date components into a human-readable string
    const string = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;

    // expose managed state as return value
    return { timestamp, string }
}