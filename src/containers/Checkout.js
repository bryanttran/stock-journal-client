import React, { useState, useEffect } from "react";
import { API } from "aws-amplify";
import { useHistory } from "react-router-dom";
import { onError } from "../libs/errorLib";
import config from "../config";
import { Elements, StripeProvider } from "react-stripe-elements";
import BillingForm from "../components/BillingForm";
import "./Checkout.css";
import { useAppContext } from "../libs/contextLib";

export default function Checkout() {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [stripe, setStripe] = useState(null);
  let { tier } = useAppContext();

  console.log(tier);

  useEffect(() => {
    setStripe(window.Stripe(config.STRIPE_KEY));
  }, []);
  
  function billUser(details) {
    console.log(details);
    return API.post("stocks", "/billing", {
      body: details
    });
  }

  async function handleFormSubmit(storage, { token, error }) {
    if (error) {
      onError(error);
      return;
    }
  
    setIsLoading(true);
  
    try {
      let dataTier = (tier === "Pro") ? "pro" : "pre";
      await billUser({
        tier: dataTier,
        source: token.id
      });
  
      alert("Your card has been charged successfully!");
      localStorage.setItem("tier", dataTier);
      history.push("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }
  
  return (
    <div className="Settings">
      <h2>Checkout for Stock Journal <span className={tier === "Pro" ? "pro-title" : "pre-title"}>{tier}</span></h2>
      <StripeProvider stripe={stripe}>
        <Elements
          fonts={[
            {
              cssSrc:
                "https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700,800",
            },
          ]}
        >
          <BillingForm isLoading={isLoading} onSubmit={handleFormSubmit} />
        </Elements>
      </StripeProvider>
    </div>
  );
}