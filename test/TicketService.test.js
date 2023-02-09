import { expect, jest, test } from "@jest/globals";
import TicketService, { TICKET_TYPE } from "../src/pairtest/TicketService.js";
import TicketTypeRequest from "../src/pairtest/lib/TicketTypeRequest.js";

let foo;
let bar;
let foobar;
let tiketService;
const MAX_NO_OF_TICKETS = 20;

beforeEach(() => {
  foo = new TicketTypeRequest(TICKET_TYPE.ADULT, 5);
  bar = new TicketTypeRequest(TICKET_TYPE.CHILD, 1);
  foobar = new TicketTypeRequest(TICKET_TYPE.INFANT, 10);
  tiketService = new TicketService();
});

describe("TicketService", () => {
  describe("PurchaseTickets", () => {
    test("should throws an invalid account ID", () => {
      const accountID = 0;
      try {
        expect(tiketService.purchaseTickets(accountID, foo, bar, foobar));
      } catch (error) {
        expect(error.message).toBe(`Invalid Id for  ${accountID}`);
      }
    });
    
    test("should throws an invalid ticket amount per purchase", () => {
      const accountID = 1;
      try {
        const ticketTypeRequest = new TicketTypeRequest(TICKET_TYPE.ADULT, 21);
        expect(tiketService.purchaseTickets(accountID, ticketTypeRequest));
      } catch (error) {
        expect(error.message).toBe(
          `Invalid number of purchase \n Max tickets: ${TicketService.MAX_NO_OF_TICKETS}`
        );
      }
    });
    

    

    test("should throws invalid purchase if adult not involved", () => {
      const accountID = 1;
      try {
        const ticketTypeRequest = new TicketTypeRequest(TICKET_TYPE.INFANT, 4);
        expect(tiketService.purchaseTickets(accountID, ticketTypeRequest));
      } catch (error) {
        expect(error.message).toBe(`Not enough adults to purchase ticket`);
      }
    });
  });
});
