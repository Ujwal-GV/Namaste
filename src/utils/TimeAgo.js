export const getTimeAgo = (date) => {
    const now = new Date();
    const created  = new Date(date);

    const diffMs = now - created;

    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);

    if (hours < 24) return "New";
    if (days === 1) return "1 day ago";
    if (days < 7) return `${days} days ago`;
    if (weeks === 1) return "1 week ago";
    if (weeks < 4) return `${weeks} weeks ago`;
    if (months === 1) return "1 month ago";

    return `${months} months ago`;
}

export const getFormattedDate = (createdAt) => {

    const date = new Date(createdAt);

    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
                    "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

    let day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    if (day < 10) {
        day = "0" + day;
    }

    return `${day} ${month} ${year}`;
}