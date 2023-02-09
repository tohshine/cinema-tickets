export default class InvalidPurchaseException extends Error {
   constructor(message){
    super(message)
    this.message = message
   //Object.setPrototypeOf(this,InvalidPurchaseException.prototype)
  

     
   }

   

}
