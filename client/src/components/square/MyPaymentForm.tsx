import { CreditCard, PaymentForm } from "react-square-web-payments-sdk";

interface params {
  purchase: () => void;
}
const MyPaymentForm = ({ purchase }: params) => (
  <PaymentForm
    /**
     * Identifies the calling form with a verified application ID generated from
     * the Square Application Dashboard.
     */
    applicationId="sandbox-sq0idb-2nB2M9LHUh9D1gaU6_8JtQ"
    /**
     * Invoked when payment form receives the result of a tokenize generation
     * request. The result will be a valid credit card or wallet token, or an error.
     */
    cardTokenizeResponseReceived={(token, buyer) => {
      console.info({ token, buyer });
      purchase();
    }}
    /**
     * This function enable the Strong Customer Authentication (SCA) flow
     *
     * We strongly recommend use this function to verify the buyer and reduce
     * the chance of fraudulent transactions.
     */
    createVerificationDetails={() => ({
      amount: "1.00",
      /* collected from the buyer */
      billingContact: {
        addressLines: ["123 Main Street", "Apartment 1"],
        familyName: "Doe",
        givenName: "John",
        countryCode: "GB",
        city: "London",
      },
      currencyCode: "GBP",
      intent: "CHARGE",
    })}
    /**
     * Identifies the location of the merchant that is taking the payment.
     * Obtained from the Square Application Dashboard - Locations tab.
     */
    locationId="L6QYXQDYJD6M1"
  >
    <CreditCard />
  </PaymentForm>
);

export default MyPaymentForm;
