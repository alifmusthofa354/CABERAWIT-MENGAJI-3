export const formatFriendlyDate = (dateString: string | null): string => {
  if (!dateString) return "Tanggal tidak tersedia";

  try {
    const dateObject = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Jakarta",
    };
    const formattedDate = new Intl.DateTimeFormat("id-ID", options).format(
      dateObject
    );
    return `${formattedDate} WIB`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Format tanggal salah";
  }
};

export const formatCurrentDate = () => {
  const today = new Date();

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long", // Must be 'long', 'short', or 'narrow'
    year: "numeric", // Must be 'numeric' or '2-digit'
    month: "long", // Must be 'numeric', '2-digit', 'long', 'short', or 'narrow'
    day: "numeric", // Must be 'numeric' or '2-digit'
    hour: "2-digit", // Must be 'numeric' or '2-digit'
    minute: "2-digit", // Must be 'numeric' or '2-digit'
    second: "2-digit",
    hour12: false,
    timeZone: "Asia/Jakarta",
  };

  const formattedDate = new Intl.DateTimeFormat("id-ID", options).format(today);
  return `${formattedDate}`;
};
