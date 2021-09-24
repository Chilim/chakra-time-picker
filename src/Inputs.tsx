import React from "react";
import { Input, Flex, Text } from "@chakra-ui/react";
import {
  incrementHours,
  decrementHours,
  incrementMinutes,
  decrementMinutes
} from "./utils";

type Props = {
  hours: string | undefined;
  minutes: string | undefined;
  setHours: (value: string) => void;
  setMinutes: (value: string) => void;
  shallClear: boolean;
};

const Inputs = ({
  hours,
  minutes,
  setHours,
  setMinutes,
  shallClear
}: Props) => {
  const [localMinutes, setLocalMinutes] = React.useState(() =>
    minutes ? [...minutes] : ["-", "-"]
  );

  const [localHours, setLocalHours] = React.useState(() =>
    hours ? [...hours] : ["-", "-"]
  );

  const hoursRef = React.useRef<HTMLInputElement>(null);
  const minutesRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (hours) {
      setLocalHours(() => [...hours]);
    }
  }, [hours]);

  React.useEffect(() => {
    if (minutes) {
      setLocalMinutes(() => [...minutes]);
    }
  }, [minutes]);

  React.useEffect(() => {
    if (shallClear) {
      setLocalHours(() => ["-", "-"]);
      setLocalMinutes(() => ["-", "-"]);
    }
  }, [shallClear]);

  const handleSelect = (unit: "hours" | "minutes") => {
    if (hoursRef && unit === "hours") {
      hoursRef.current?.select();
    }
    if (minutesRef && unit === "minutes") {
      minutesRef.current?.select();
    }
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    return;
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    unit: "hours" | "minutes"
  ) => {
    const key = e.key;

    const currentState = unit === "hours" ? localHours : localMinutes;
    const currentDispatch = unit === "hours" ? setLocalHours : setLocalMinutes;
    const remoteDispatch = unit === "hours" ? setHours : setMinutes;
    const increase = unit === "hours" ? incrementHours : incrementMinutes;
    const decrease = unit === "hours" ? decrementHours : decrementMinutes;

    if (key === "ArrowUp") {
      const newValue = increase(currentState.join(""));
      currentDispatch([...newValue]);
      return;
    }

    if (key === "ArrowDown") {
      const newValue = decrease(currentState.join(""));
      currentDispatch([...newValue]);
      return;
    }

    if (!key.match(/[0-9]{1,2}/)) return;

    const [, ...rest] = currentState;
    const updated = rest.concat(key);
    currentDispatch(updated);
  };

  return (
    <Flex alignItems="center" pl="10px" flex={3}>
      <Input
        ref={hoursRef}
        w="20px"
        p="1px 0px"
        pattern="[0-9]{1,2}"
        value={localHours.join("")}
        onClick={() => handleSelect("hours")}
        onChange={handleOnChange}
        placeholder="--"
        onKeyDown={(e) => handleKeyDown(e, "hours")}
        style={{
          borderColor: "transparent",
          boxShadow: "none"
        }}
      />
      <Text>:</Text>
      <Input
        ref={minutesRef}
        w="20px"
        p="1px 0px"
        pattern="[0-9]{2}"
        value={localMinutes.join("")}
        onClick={() => handleSelect("minutes")}
        onChange={handleOnChange}
        placeholder="--"
        onKeyDown={(e) => handleKeyDown(e, "minutes")}
        style={{
          borderColor: "transparent",
          boxShadow: "none"
        }}
      />
    </Flex>
  );
};

export default Inputs;
