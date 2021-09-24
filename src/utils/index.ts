const minutesInHour = 60;
const hoursInDay = 24;

const getDateFromTime = (time: string) => {
  const stime = time.split(":").map(Number);
  const now = new Date();
  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    stime[0],
    stime[1]
  );
};

export const toTimeStringFormat = (time: number) => {
  if (time >= 10) return time;
  return `0${time}`;
};

const formatTimeString = (time: string) => {
  const date = getDateFromTime(time);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${toTimeStringFormat(hours)}:${toTimeStringFormat(minutes)}`;
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
