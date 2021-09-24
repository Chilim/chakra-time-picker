import React from "react";
import { TimeIcon, SmallCloseIcon } from "@chakra-ui/icons";
import { Input, Box, Flex, List, ListItem, Text } from "@chakra-ui/react";
import { getTimeSlots } from "./utils";
import "./styles.css";

type TimeUnit = "hours" | "minutes";

const TimeLine = ({
  list,
  unit,
  onSelect,
  selected
}: {
  list: string[];
  unit: TimeUnit;
  onSelect: (value: string) => void;
  selected: string | undefined;
}) => {
  const pos = unit === "hours" ? 0 : 1;

  const rows = [...new Set(list.map((item) => item.split(":")[pos]))];

  const handleClick = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    const val = (e.target as HTMLDivElement).innerHTML;
    onSelect(val);
  };

  return (
    <List overflowY="auto" w="100%" className="custom-scrollbar" m="10px">
      {rows.map((value, idx) => (
        <ListItem
          onClick={handleClick}
          key={idx}
          bg={value === selected ? "#106dc4" : "inherit"}
          color={value === selected ? "#ffffff" : "inherit"}
          fontWeight={value === selected ? "bold" : "inherit"}
          _hover={{
            backgroundColor: "#7cb9f2",
            cursor: "pointer"
          }}
          _active={{
            backgroundColor: value === selected ? "#106dc4" : "inherit"
          }}
        >
          {value}
        </ListItem>
      ))}
    </List>
  );
};

const TimePicker = ({
  parentRef,
  onPassHours,
  onPassMinutes,
  showTimeline,
  setShowTimeline
}: {
  parentRef: React.RefObject<HTMLDivElement>;
  onPassHours: (value: string) => void;
  onPassMinutes: (value: string) => void;
  showTimeline: boolean;
  setShowTimeline: (pred: boolean) => void;
}) => {
  const [hours, setHours] = React.useState<string | undefined>(undefined);
  const [minutes, setMinutes] = React.useState<string | undefined>(undefined);

  const rows = getTimeSlots(5);

  React.useEffect(() => {
    const hideTimeLine = (e: MouseEvent) => {
      if (parentRef.current && !parentRef.current.contains(e.target as Node)) {
        setShowTimeline(false);
        if (hours) {
          onPassHours(hours);
        }
        if (minutes) {
          onPassMinutes(minutes);
        }
        setHours(undefined);
        setMinutes(undefined);
      }
    };

    document.addEventListener("mousedown", hideTimeLine);
    return () => document.removeEventListener("mousedown", hideTimeLine);
  });

  const handleShowTimeline = () => setShowTimeline(true);

  return (
    <Box h="100%" display="inline-flex" right="10px" alignItems="center">
      <TimeIcon onClick={handleShowTimeline} />
      <Box position="relative" display={showTimeline ? "block" : "none"}>
        <Flex
          w="120px"
          h="200px"
          position="absolute"
          bg="#ffffff"
          bottom="25px"
          right="-10px"
          className="scrollbar-invisible"
          border="1px solid #084F8F"
          borderTopLeftRadius="5px"
          borderTopRightRadius="5px"
        >
          <TimeLine
            list={rows}
            unit="hours"
            onSelect={setHours}
            selected={hours}
          />
          <TimeLine
            list={rows}
            unit="minutes"
            onSelect={setMinutes}
            selected={minutes}
          />
        </Flex>
      </Box>
    </Box>
  );
};

const TimeInput = ({
  value,
  setShowTimeline
}: {
  value: string | undefined;
  setShowTimeline: (pred: boolean) => void;
}) => {
  const getValue = () => {
    return value ? value : "--";
  };

  return (
    <Input
      w="20px"
      p="1px 0px"
      pattern="[0-9]{2}"
      value={getValue()}
      onClick={() => setShowTimeline(true)}
      style={{
        borderColor: "transparent",
        boxShadow: "none"
      }}
    />
  );
};

const ChakraTimePicker = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [showTimeline, setShowTimeline] = React.useState(false);
  const [hours, setHours] = React.useState<string | undefined>(undefined);
  const [minutes, setMinutes] = React.useState<string | undefined>(undefined);

  const notEmpty = () => !!hours && !!minutes;

  const clearValues = () => {
    setHours(undefined);
    setMinutes(undefined);
  };

  return (
    <Box
      ref={containerRef}
      alignItems="center"
      display="inline-flex"
      border="1px solid #084F8F"
      borderRadius="5px"
      h="42px"
      minW="125px"
    >
      <Flex alignItems="center" pl="10px" flex={3}>
        <TimeInput value={hours} setShowTimeline={setShowTimeline} />
        <Text>:</Text>
        <TimeInput value={minutes} setShowTimeline={setShowTimeline} />
      </Flex>
      <Flex
        w="16px"
        h="100%"
        alignItems="center"
        align="center"
        justify="center"
      >
        {notEmpty() && (
          <SmallCloseIcon
            onClick={clearValues}
            _hover={{ cursor: "pointer" }}
          />
        )}
      </Flex>
      <Flex w="30px" h="100%" align="center" justify="center">
        <TimePicker
          onPassHours={setHours}
          onPassMinutes={setMinutes}
          parentRef={containerRef}
          showTimeline={showTimeline}
          setShowTimeline={setShowTimeline}
        />
      </Flex>
    </Box>
  );
};

export default function App() {
  return (
    <div style={{ textAlign: "center", paddingTop: "250px" }}>
      <div>Some sample text to test positioning</div>
      <ChakraTimePicker />
    </div>
  );
}
