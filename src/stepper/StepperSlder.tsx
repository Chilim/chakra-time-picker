import { Flex, Box, Text } from "@chakra-ui/react";

const First = () => <div>First</div>;
const Second = () => <div>Second</div>;
const Third = () => <div>Third</div>;

const Edge = ({ name }: { name: string }) => {
  return (
    <Box key={name}>
      {name}
      <Box w="20px" h="20px" bg="gray" borderRadius="50%" />
    </Box>
  );
};

const Space = () => {
  return <Box bg="yellow" />;
};

const steps = [
  { name: "One long title", component: First },
  { name: "Two long title two", component: Second },
  { name: "Three long title three", component: Third }
];

const current = { name: "One", component: First };

const StepperSlider = () => {
  const renderStepBoxes = () => {
    return steps.map((step, idx) => {
      return (
        <Box key={step.name} flex={1} position="relative">
          <Flex direction="column" align="center">
            <Box w="20px" h="20px" bg="gray" borderRadius="50%" />
            <Text fontSize={["12px", "12px", "14px", "inherit"]}>
              {step.name}
            </Text>
          </Flex>
          {idx > 0 && (
            <Box
              position="absolute"
              flex="1 1 auto"
              style={{
                top: "10px",
                left: "calc(-50% + 20px)",
                right: "calc(50% + 20px)"
              }}
            >
              <span
                style={{
                  borderTopStyle: "solid",
                  borderTopWidth: "1px",
                  borderColor: "gray",
                  display: "block"
                }}
              />
            </Box>
          )}
        </Box>
      );
    });
  };

  return (
    <Flex h="50px" w="100%" justify="space-between" position="relative">
      {renderStepBoxes()}
    </Flex>
  );
};

export default StepperSlider;
