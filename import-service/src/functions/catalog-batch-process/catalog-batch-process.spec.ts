import emailNotificationService from "@libs/service/email-notification.service";
import { batchHandler } from "./catalog-batch-process";

jest.mock("@libs/api-gateway", () => ({
  tryCatch: (e) => e(),
}));

const mockData = [
  {
    body: "1",
  },
  {
    body: "2",
  },
  {
    body: "3",
  },
  {
    body: "4",
  },
];

describe("batchHandler", () => {
  let notifySpy: any;

  beforeEach(() => {
    notifySpy = jest
      .spyOn(emailNotificationService, "emailNotification")
      .mockReturnValue(notifySpy);
    console.log(notifySpy);
  });

  it("should process all records", async () => {
    await batchHandler(
      {
        Records: mockData,
      } as any,
      null,
      null
    );

    expect(notifySpy.mock.calls).toEqual([["1"], ["2"], ["3"], ["4"]]);
  });
});