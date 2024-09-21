export function getRelativeTime(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const differenceInSeconds = Math.floor((now - time) / 1000);

    if (differenceInSeconds < 60) return "just now";
    if (differenceInSeconds < 3600) return `${Math.floor(differenceInSeconds / 60)} minutes ago`;
    if (differenceInSeconds < 86400) return `${Math.floor(differenceInSeconds / 3600)} hours ago`;
    if (differenceInSeconds < 172800) return "1 day ago"; // Less than 2 days
    return `${Math.floor(differenceInSeconds / 86400)} days ago`;
}