export const minutesInHour = 60;
export const hoursInDay = 24;

export const toTimeStringFormat = (time: number) => {
  if (time >= 10) return time.toString();
  return `0${time}`;
};

export const incrementHours = (current: string) => {
  const num = Number(current) + 1;
  if (num === hoursInDay) return "00";
  return toTimeStringFormat(num);
};

export const decrementHours = (current: string) => {
  const num = Number(current) - 1;
  if (num < 0) return `${hoursInDay - 1}`;
  return toTimeStringFormat(num);
};

export const incrementMinutes = (current: string) => {
  const num = Number(current) + 1;
  if (num === minutesInHour) return "00";
  return toTimeStringFormat(num);
};

export const decrementMinutes = (current: string) => {
  const num = Number(current) - 1;
  if (num < 0) return `${minutesInHour - 1}`;
  return toTimeStringFormat(num);
};

export const getTimeUnitStr = (time: string, unit: "hours" | "minutes") => {
  const [hours, minutes] = time.split(":");
  return unit === "hours"
    ? `${toTimeStringFormat(Number(hours))}`
    : `${toTimeStringFormat(Number(minutes))}`;
};

const addMinutes = (step: number, prevTime: string) => {
  let left = 0;
  const [prevHours, prevMinutes] = prevTime.split(":").map(Number);
  let newMinutes = 0;

  if (prevMinutes + step >= minutesInHour) {
    newMinutes = prevMinutes + step - minutesInHour;
    left += 1;
  } else {
    newMinutes = prevMinutes + step;
  }
  return `${toTimeStringFormat(prevHours + left)}:${toTimeStringFormat(
    newMinutes
  )}`;
};

export const getTimeSlots = (step: number) => {
  const start = "00:00";
  const rowsNumber = (minutesInHour / step) * hoursInDay;
  let prevTime = start;
  const timeLine = [];
  for (let i = 0; i < rowsNumber; i += 1) {
    if (i === 0) {
      timeLine.push(start);
      prevTime = start;
    } else {
      const time = addMinutes(step, prevTime);
      timeLine.push(time);
      prevTime = time;
    }
  }

  return timeLine;
};

export const shouldSkipAsap = (
  input: string,
  currentIdx: number,
  unit: "hours" | "minutes"
) => {
  if (unit === "minutes") {
    return Number(`${input}0`) > minutesInHour && currentIdx === 0;
  }
  return Number(`${input}0`) > hoursInDay && currentIdx === 0;
};

export const setNewTime = (
  currentVal: string,
  input: string,
  currentIdx: number,
  unit: "hours" | "minutes"
) => {
  if (currentIdx === 0) return `0${input}`;
  const [, secondVal] = [...currentVal];
  const newVal = [secondVal, input].join("");
  if (Number(newVal) === hoursInDay && unit === "hours") return "00";
  if (Number(newVal) === minutesInHour && unit === "minutes") return "00";
  if (Number(newVal) > hoursInDay && unit === "hours") {
    return toTimeStringFormat(Number(newVal) - hoursInDay);
  }
  if (Number(newVal) > minutesInHour && unit === "minutes") {
    return toTimeStringFormat(Number(newVal) - hoursInDay);
  }

  return newVal;
};
