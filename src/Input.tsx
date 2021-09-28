import React from "react";
import { Input, Flex, Text, FlexProps } from "@chakra-ui/react";
import {
  incrementHours,
  decrementHours,
  incrementMinutes,
  decrementMinutes,
  shouldSkipAsap,
  setNewTime
} from "./utils";

interface Props extends FlexProps {
  hours: string | undefined;
  minutes: string | undefined;
  setHours: (value: string | undefined) => void;
  setMinutes: (value: string | undefined) => void;
  shallClear: boolean;
  isReadOnly?: boolean;
  isDisabled?: boolean;
}

const Inputs = (props: Props) => {
  const {
    hours,
    minutes,
    setHours,
    setMinutes,
    shallClear,
    isReadOnly,
    isDisabled,
    ...rest
  } = props;
  const localMinutes = minutes ? [...minutes] : ["-", "-"];
  const localHours = hours ? [...hours] : ["-", "-"];
  const [skip, setSkip] = React.useState(false);
  const [idx, setIndex] = React.useState(0);

  const hoursRef = React.useRef<HTMLInputElement>(null);
  const minutesRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (idx > 1) {
      setIndex(0);
      setSkip(true);
    }
  }, [idx]);

  React.useEffect(() => {
    if (skip) {
      minutesRef.current?.select();
      setIndex(0);
      setSkip(false);
    }
  }, [skip]);

  React.useEffect(() => {
    if (shallClear) {
      setHours(undefined);
      setMinutes(undefined);
      setIndex(0);
    }
  }, [shallClear, setHours, setMinutes]);

  const handleSelect = (unit: "hours" | "minutes") => {
    if (hoursRef && unit === "hours") {
      hoursRef.current?.select();
    }
    if (minutesRef && unit === "minutes") {
      minutesRef.current?.select();
    }
  };

  const handleOnChange = () => {
    return;
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    unit: "hours" | "minutes"
  ) => {
    const key = e.key;
    let newValue: string;

    const currentValue = unit === "hours" ? localHours : localMinutes;
    const adjusted =
      currentValue.join("") === "--" ? "00" : currentValue.join("");
    const remoteDispatch = unit === "hours" ? setHours : setMinutes;
    const increase = unit === "hours" ? incrementHours : incrementMinutes;
    const decrease = unit === "hours" ? decrementHours : decrementMinutes;

    if (key === "ArrowUp") {
      newValue = increase(adjusted);
      remoteDispatch(newValue);
      return;
    }

    if (key === "ArrowDown") {
      newValue = decrease(adjusted);
      remoteDispatch(newValue);
      return;
    }

    if (key.match(/[0-9]{1,2}/)) {
      if (shouldSkipAsap(key, idx, unit)) {
        setIndex(0);
        setSkip(true);
        remoteDispatch(`0${key}`);
        return;
      }

      newValue = setNewTime(adjusted, key, idx, unit);
      remoteDispatch(newValue);
      setIndex((prev) => (prev += 1));
      return;
    }
  };

  return (
    <Flex alignItems="center" pl="10px" flex={3} position="relative" {...rest}>
      <Input
        ref={hoursRef}
        isReadOnly={isReadOnly}
        isDisabled={isDisabled}
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
      <Text pr="3px">:</Text>
      <Input
        isReadOnly={isReadOnly}
        isDisabled={isDisabled}
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
