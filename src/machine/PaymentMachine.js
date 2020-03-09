import { Machine, assign } from "xstate";

function fakePayment() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const dice = Math.floor(Math.random() * Math.floor(2));

      if (dice === 0) return resolve("Payment succeeded.");

      return reject("Payment failed.");
    }, 1000);
  });
}

const PaymentMachine = Machine({
  initial: "idle",
  states: {
    idle: {
      on: {
        SUBMIT: [
          {
            target: "loading",
            cond: (ctx, event) =>
              event.data.name !== "" && event.data.card !== ""
          },
          {
            target: "error"
          }
        ]
      }
    },
    loading: {
      invoke: {
        id: "doPayment",
        src: () => fakePayment(),
        onDone: {
          target: "success",
          actions: assign({ msg: (ctx, event) => event.data })
        },
        onError: {
          target: "error",
          actions: assign({ msg: (ctx, event) => event.data })
        }
      }
    },
    error: {
      on: {
        SUBMIT: {
          target: "loading",
          cond: (ctx, event) => event.data.name !== "" && event.data.card !== ""
        }
      }
    },
    success: {
      type: "final"
    }
  }
});

export default PaymentMachine;
