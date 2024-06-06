export default function formatDate(dateString) {
    if (dateString === null) {
        return null;
    }
    const date = new Date(dateString);
    const formattedTime = date.toLocaleTimeString('en-US', { hour12: false });
    const formattedDate = `${formattedTime} - ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    return formattedDate;
}
