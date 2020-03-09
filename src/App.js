import React, { useState } from "react";
import { useMachine } from "@xstate/react";
import PaymentMachine from "./machine/PaymentMachine";
import { makeStyles } from "@material-ui/core/styles";
import { TextField, Button, Grid, Typography } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2)
    }
  }
}));

function App() {
  const classes = useStyles();
  const [machine, send] = useMachine(PaymentMachine);
  const [form, setForm] = useState({
    name: "",
    card: ""
  });

  console.log(machine.value);
  return (
    <>
      <div className={classes.alert}>
        {machine.matches("error") ? (
          <Alert severity="error">Error -- Missing field / Transaction</Alert>
        ) : null}
        {machine.matches("success") ? (
          <Alert severity="success">Payment Success</Alert>
        ) : null}
        {machine.matches("loading") ? (
          <Alert severity="info">Sending to Server</Alert>
        ) : null}
      </div>
      <form
        autoComplete="off"
        onSubmit={e => {
          e.preventDefault();
          send({ type: "SUBMIT", data: { ...form } });
        }}
      >
        <Grid
          container
          spacing={1}
          direction="column"
          justify="center"
          alignItems="center"
          style={{ minHeight: "100vh", maxWidth: "100%" }}
        >
          <Grid item xs={4}>
            <Typography variant="h5">Credit card payment</Typography>
          </Grid>
          <Grid item xs={4}>
            <TextField
              id="NameOnCard"
              label="Card Holder Name"
              type="text"
              maxLength="255"
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              id="CreditCardNumber"
              label="Credit Card No."
              type="text"
              onChange={e => setForm({ ...form, card: e.target.value })}
            />
          </Grid>
          <Grid item xs={4}>
            <Button
              id="PayButton"
              type="submit"
              variant="contained"
              color="primary"
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
}

export default App;
