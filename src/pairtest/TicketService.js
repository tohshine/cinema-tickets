
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import TicketPaymentService from '../thirdparty/paymentgateway/TicketPaymentService.js';
import SeatReservationService from '../thirdparty/seatbooking/SeatReservationService.js';
 
export const TICKET_TYPE = Object.freeze({
  INFANT: "INFANT",
  CHILD: "CHILD",
  ADULT: "ADULT"
});
 
const TICKET_AMOUNT = Object.freeze({
  INFANT: 0,
  CHILD: 10,
  ADULT: 20
});
 
 
 
export default class TicketService {
  /**
   * Should only have private methods other than the one below.
   */
  static get MAX_NO_OF_TICKETS() { return 20 };
  static #paymentService = new TicketPaymentService();
  static #reservationService = new SeatReservationService();
 
  purchaseTickets(accountId, ...ticketTypeRequests) {
 
    if (!this.#isIdValid(accountId)) {
      throw new InvalidPurchaseException(`Invalid Id for  ${accountId}`)
    }
 
    const ticketTypeDict = this.#getTickets(ticketTypeRequests)
    const totalNoOfTicket = Object.values(ticketTypeDict).reduce((accum, curr) => accum + curr, 0)
 
    //minimum tickets purchase check
    if (totalNoOfTicket <= 0 || totalNoOfTicket > TicketService.MAX_NO_OF_TICKETS) {
      throw new InvalidPurchaseException(`Invalid number of purchase \n Max tickets: ${TicketService.MAX_NO_OF_TICKETS}`)
    }
    //routine check
    if (!this.#hasEnoughAdults(ticketTypeDict)) {
      throw new InvalidPurchaseException("Not enough adults to purchase ticket")
    }
   
    //reservation and payment
    const reservedSeatCount = this.#calculateNoOfSeat(ticketTypeDict)
    const ticketPrice = this.#calculateAmount(ticketTypeDict)
 
    TicketService.#paymentService.makePayment(accountId, ticketPrice)
    TicketService.#reservationService.reserveSeat(accountId, reservedSeatCount)
 
    console.log( `reserved seat: ${reservedSeatCount} \n ticketprice: ${ticketPrice}`)
  }
 
  #isIdValid(accountId) {
    if (accountId < 1) {
      return false
    }
    return true
  }
 
  #getTickets(ticketTypeRequest) {
    const add_tickets = (accumulator, current) => {
      const ticketType = current.getTicketType()
      if (accumulator[ticketType] === undefined) {
        accumulator[ticketType] = 0;
      }
 
      accumulator[ticketType] += current.getNoOfTickets()
      return accumulator
    }
    
    return ticketTypeRequest.reduce(add_tickets, {})
  }
 
  #hasEnoughAdults(ticketTypes) {
    const adultCount = ticketTypes[TICKET_TYPE.ADULT]
    if(adultCount === undefined || adultCount <= 0) 
      return false 
 
    return adultCount >= ticketTypes[TICKET_TYPE.INFANT]
  }
 
  #calculateAmount(ticketType) {
    const adultAmount = ticketType[TICKET_TYPE.ADULT] * TICKET_AMOUNT[TICKET_TYPE.ADULT]
    const childAmount = ticketType[TICKET_TYPE.CHILD] * TICKET_AMOUNT[TICKET_TYPE.CHILD]
 
    return adultAmount + childAmount
  }
 
  #calculateNoOfSeat(ticketType) {
    return ticketType[TICKET_TYPE.ADULT] + ticketType[TICKET_TYPE.CHILD]
  }
}