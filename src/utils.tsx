export const validateUsername = (username: string) => {
  const strippedUserName = username.replace(/\s/g, "");
  if (strippedUserName === "") {
    throw new Error("Please enter a username");
  }
  return strippedUserName;
};

export const validatepaymentAmount = (amount: any): Number => {
  const possibleNumber = convertToNumber(amount);
  if (possibleNumber <= 0) {
    throw new Error("Only enter whole numbers greater than 0");
  }
  return possibleNumber;
};

const isValidString = (str: string): Boolean => {
  if (str === undefined || str === null || str === "") {
    return false;
  }
  return true;
};

const convertToNumber = (value: string): Number => {
  if (value.includes(".")) {
    return 0;
  }
  if (value.includes(",")) {
    return 0;
  }
  if (isValidString(value) === false) {
    return 0;
  }
  const possibleNumber = Number(value);
  if (isNaN(possibleNumber)) {
    return 0;
  }
  return possibleNumber;
};

/**
 * Human readable elapsed or remaining time (example: 3 minutes ago)
 * @param  {Date|Number|String} date A Date object, timestamp or string parsable with Date.parse()
 * @param  {Date|Number|String} [nowDate] A Date object, timestamp or string parsable with Date.parse()
 * @param  {Intl.RelativeTimeFormat} [trf] A Intl formater
 * @return {string} Human readable elapsed or remaining time
 * @author github.com/victornpb
 * @see https://stackoverflow.com/a/67338038/938822
 */
export function fromNow(
  date: any,
  nowDate: any = Date.now(),
  rft = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" })
) {
  const SECOND = 1000;
  const MINUTE = 60 * SECOND;
  const HOUR = 60 * MINUTE;
  const DAY = 24 * HOUR;
  const WEEK = 7 * DAY;
  const MONTH = 30 * DAY;
  const YEAR = 365 * DAY;
  const intervals: any = [
    { ge: YEAR, divisor: YEAR, unit: "year" },
    { ge: MONTH, divisor: MONTH, unit: "month" },
    { ge: WEEK, divisor: WEEK, unit: "week" },
    { ge: DAY, divisor: DAY, unit: "day" },
    { ge: HOUR, divisor: HOUR, unit: "hour" },
    { ge: MINUTE, divisor: MINUTE, unit: "minute" },
    { ge: 30 * SECOND, divisor: SECOND, unit: "seconds" },
    { ge: 0, divisor: 1, text: "just now" },
  ];
  const now =
    typeof nowDate === "object"
      ? nowDate.getTime()
      : new Date(nowDate).getTime();
  const diff =
    now - (typeof date === "object" ? date : new Date(date)).getTime();
  const diffAbs = Math.abs(diff);
  for (const interval of intervals) {
    if (diffAbs >= interval.ge) {
      const x = Math.round(Math.abs(diff) / interval.divisor);
      const isFuture = diff < 0;
      return interval.unit
        ? rft.format(isFuture ? x : -x, interval.unit)
        : interval.text;
    }
  }
}
