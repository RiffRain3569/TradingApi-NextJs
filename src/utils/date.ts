import {
    differenceInDays,
    differenceInHours,
    differenceInMinutes,
    differenceInMonths,
    differenceInSeconds,
    differenceInWeeks,
    differenceInYears,
} from 'date-fns';

const oneSec = 1000;
const oneMin = 60 * oneSec;
const oneHour = 60 * oneMin;

export const isStrDateFormat = (strDate: string) => {
    if (!strDate) return false;
    return /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(strDate) || /\d{4}-\d{2}-\d{2}/.test(strDate);
};

export const utc2KstDate = (date: string) => {
    let curDate = new Date(date);
    let utcDate = curDate.getTime() + curDate.getTimezoneOffset() * oneMin;
    return new Date(utcDate + 9 * oneHour);
};

/**
 * Date 형태의 날짜를 string 형태로 변환
 * @param {Date} date
 * @param {boolean} [isTimeShow=true] hh:mm:ss 부분을 출력 할 것인지?
 * @returns {string} 'yyyy-mm-dd hh:mm:ss'
 */
export const date2Str = (date: Date, isTimeShow: boolean = true): string => {
    const pad = (number: number) => (number < 10 ? '0' + number : number);

    return (
        date.getFullYear() +
        '-' +
        pad(date.getMonth() + 1) +
        '-' +
        pad(date.getDate()) +
        (isTimeShow ? ' ' + pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds()) : '')
    );
};

/**
 * string 형태의 날짜를 Date 형태로 변환
 * @param {string} strDate 'yyyy-mm-dd hh:mm:ss' or 'yyyy-mm-dd' or 'hh:mm:ss'
 * @returns {Date}
 */
export const str2Date = (strDate: string): Date => {
    let splitDate = strDate.split(/[-:\s]/).map((tmp: string) => Number(tmp));
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(strDate)) {
        let [yyyy, MM, dd, hh, mm, ss] = splitDate;
        return new Date(yyyy, MM - 1, dd, hh, mm, ss, 0);
    } else if (/^\d{4}-\d{2}-\d{2}$/.test(strDate)) {
        let [yyyy, MM, dd] = splitDate;
        return new Date(yyyy, MM - 1, dd, 0, 0, 0, 0);
    } else if (/^\d{2}:\d{2}:\d{2}$/.test(strDate)) {
        let [hh, mm, ss] = splitDate;
        return new Date(1970, 0, 1, hh, mm, ss, 0);
    } else {
        throw new Error('str2Date error');
    }
};

export const isValidDate = (date: Date) => date.toString() !== 'Invalid Date';

/**
 * iso 형태의 String 을 표준 형태의 String 으로 변환
 * @param {string} iso 'yyyy-mm-ddThh:mm:ss' or 'yyyy-mm-ddThh:mm:ss' or 'yyyy-mm-dd'
 * @param {boolean} [isTimeShow=true] hh:mm:ss 부분을 출력 할 것인지?
 * @returns {string}'yyyy-mm-dd hh:mm:ss' or 'yyyy-mm-dd'
 */
export const iso2Str = (iso: string, isTimeShow: boolean = true): string => {
    if (
        !iso ||
        (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(iso) &&
            !/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(iso) &&
            !/\d{4}-\d{2}-\d{2}/.test(iso))
    )
        return '';
    let dateStr = iso.replace(/T/g, '');
    return isTimeShow ? dateStr : dateStr.split(' ')[0];
};

export const iso2Date = (iso: string, isTime: boolean = true) => {
    return str2Date(iso2Str(iso, isTime));
};
/**
 * yyyymmdd 형태의 String 을 표준 형태의 String 으로 변환
 * @param {string} birth 'yyyymmdd'
 * @returns {string} 'yyyy-mm-dd'
 */
export const birth2Str = (birth: string): string | undefined => {
    let regex = /^(\d{4})(\d{2})(\d{2})$/;
    if (!regex.test(birth)) return undefined;
    return birth.replace(regex, '$1-$2-$3');
};

export const date2birth = (date: Date) => {
    return date2Str(date, false).replace(/-/g, '');
};

export const date2Iso = (date: Date) => {
    return date2Str(date).replace(' ', 'T');
};

export const timeDiffDisplay = (endDate: Date, startDate: Date) => {
    const years = differenceInYears(endDate, startDate);
    const months = differenceInMonths(endDate, startDate);
    const weeks = differenceInWeeks(endDate, startDate);
    const days = differenceInDays(endDate, startDate);
    const hours = differenceInHours(endDate, startDate);
    const minutes = differenceInMinutes(endDate, startDate);
    const seconds = differenceInSeconds(endDate, startDate);

    const [numDate, strDate] =
        years > 0
            ? [years, '년']
            : months > 0
            ? [months, '달']
            : weeks > 0
            ? [weeks, '주']
            : days > 0
            ? [days, '일']
            : hours > 0
            ? [hours, '시간']
            : minutes > 0
            ? [minutes, '분']
            : seconds > 0
            ? [seconds, '초']
            : [null, null];
    return [numDate, strDate];
};

export const getTimeLabel = (date: Date) => {
    const currentDate = new Date();
    const timeDifference = (currentDate.getTime() - date.getTime()) / 1000; // Time difference in seconds

    if (timeDifference <= 60) {
        return '지금';
    } else if (timeDifference <= 60 * 60) {
        const minutesDifference = Math.floor(timeDifference / 60);
        return `${minutesDifference}분 전`;
    } else if (timeDifference <= 60 * 60 * 24) {
        const hoursDifference = Math.floor(timeDifference / (60 * 60));
        return `${hoursDifference}시간 전`;
    } else if (timeDifference <= 60 * 60 * 24 * 7) {
        const daysDifference = Math.floor(timeDifference / (60 * 60 * 24));
        return `${daysDifference}일 전`;
    } else if (timeDifference <= 60 * 60 * 24 * 7 * 4) {
        const weeksDifference = Math.floor(timeDifference / (60 * 60 * 24 * 7));
        return `${weeksDifference}주 전`;
    } else {
        // If more than a month
        return '일개월';
    }
};

export const getMonthDates = (year: number, month: number) => {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const startingDate = startDate.getDate();
    const endingDate = endDate.getDate();

    return { month, startingDate, endingDate };
};

export const getMonthAndDate = (dateStr: string) => {
    const date = new Date(dateStr);

    const month = date.getMonth() + 1;
    const day = date.getDate();

    const formattedMonth = month < 10 ? `0${month}` : `${month}`;
    const formattedDay = day < 10 ? `0${day}` : `${day}`;

    return { formattedMonth, formattedDay };
};

export const getStartDate = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
};

export const getEndDateOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

export const convertEndDt = (dateStr: string): string | undefined => {
    const date = str2Date(dateStr);
    if (!date) return undefined;
    return date2Iso(new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1));
};

export const isRange = (startDate: Date, endDate: Date, targetDate: Date) => {
    const startTime = startDate.getTime();
    const endTime = endDate.getTime();
    const targetTime = targetDate.getTime();
    return startTime <= targetTime && endTime >= targetTime;
};

export const isNew = (targetDate: Date) => {
    const now = new Date();
    return now.getTime() - targetDate.getTime() < 24 * 60 * 60 * 1000;
};

export const convertFilterDate = (type: '오늘' | '1주일' | '1개월'): { startDt: string; endDt: string } => {
    const now = new Date();
    let endDt = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let startDt = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (type === '1주일') {
        startDt = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    } else if (type === '1개월') {
        startDt = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    }
    return {
        startDt: date2Str(startDt),
        endDt: date2Str(endDt),
    };
};
