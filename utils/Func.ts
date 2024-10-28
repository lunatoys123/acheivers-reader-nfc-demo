import dayjs from "dayjs";

export const formatDate = (dateTimeString: any) => {

    const date = dayjs(dateTimeString);

    if (!date.isValid()) {
        console.error("Invalid date");
    }

    return date.format("YYYY/MM/DD");
};