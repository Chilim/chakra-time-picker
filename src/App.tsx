import React from "react";
import { TimeIcon, SmallCloseIcon } from "@chakra-ui/icons";
import { Box, Flex, List, ListItem, Input, InputProps } from "@chakra-ui/react";
import TimeInput from "./Input";
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

  const rows = getTimeSlots(35);

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
    <Box h="100%" display="inline-flex" alignItems="center">
      <TimeIcon onClick={handleShowTimeline} />
      <Box position="relative" display={showTimeline ? "block" : "none"}>
        <Flex
          w="120px"
          h="200px"
          position="absolute"
          bg="#ffffff"
          bottom="25px"
          right="-5px"
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

interface ChakraTimePickerProps extends InputProps {}

const ChakraTimePicker = (props: ChakraTimePickerProps) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [showTimeline, setShowTimeline] = React.useState(false);
  const [hours, setHours] = React.useState<string | undefined>(undefined);
  const [minutes, setMinutes] = React.useState<string | undefined>(undefined);
  const [shallClear, setShallClear] = React.useState(false);

  const notEmpty = () => !!hours || !!minutes;

  const clearTime = () => {
    setHours(undefined);
    setMinutes(undefined);
    setShallClear(true);
  };

  const getInputValues = () => {
    if (!hours || !minutes) return undefined;
    return `${hours}${minutes}`;
  };

  return (
    <Box
      position="relative"
      ref={containerRef}
      alignItems="center"
      display="inline-flex"
    >
      <Input
        {...props}
        fontSize="0"
        w="130px"
        borderColor="#084F8F"
        value={getInputValues()}
        h="42px"
        bg="transparent"
      />
      <TimeInput
        position="absolute"
        hours={hours}
        minutes={minutes}
        setHours={setHours}
        setMinutes={setMinutes}
        shallClear={shallClear}
      />
      <Flex
        h="100%"
        alignItems="center"
        align="center"
        justify="center"
        position="absolute"
        right="40px"
      >
        {notEmpty() && (
          <SmallCloseIcon onClick={clearTime} _hover={{ cursor: "pointer" }} />
        )}
      </Flex>
      <Flex
        h="100%"
        align="center"
        justify="center"
        position="absolute"
        right="10px"
      >
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
