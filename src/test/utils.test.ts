import * as utils from "../utils";
import { timeline1, timeline2, timeline3 } from "./timeline";

describe("testing creating time line", () => {
  it("should return in HH format", () => {
    const inputs = [7, 11, 23, 4];
    inputs.forEach((input) => {
      expect(utils.toTimeStringFormat(input)).toHaveLength(2);
    });
  });

  it("should create time slots with 10 minutes interval", () => {
    expect(utils.getTimeSlots(10)).toEqual(expect.arrayContaining(timeline1));
    expect(utils.getTimeSlots(10).length).toEqual(timeline1.length);
  });

  it("should create time slots with 20 minutes interval", () => {
    console.log();
    expect(utils.getTimeSlots(20)).toEqual(expect.arrayContaining(timeline2));
    expect(utils.getTimeSlots(20).length).toEqual(timeline2.length);
  });

  it("should create time slots with 35 minutes interval", () => {
    expect(utils.getTimeSlots(35)).toEqual(expect.arrayContaining(timeline3));
    expect(utils.getTimeSlots(35).length).toEqual(timeline3.length);
  });
});
