import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import config from "../config";
import "./Settings.css";
import { BsChevronRight } from "react-icons/bs";
import { Button } from "react-bootstrap";
import { useAppContext } from "../libs/contextLib";

export default function Settings() {
  const history = useHistory();
  const [stripe, setStripe] = useState(null);
  const premiumFeatures = ["30 prior days of past trades and all trades moving forward"];
  const proFeatures = ["365 prior days of past trades and all trades moving forward"];
  let { setTier } = useAppContext();
  let tier = localStorage.getItem("tier");

  function returnFeatures(features) {
    return (
        features.map((feat) => (
            <div className="feature">
                <p>
                    <BsChevronRight/> {feat}
                </p>
            </div>
        ))
    )
  }

  useEffect(() => {
    setStripe(window.Stripe(config.STRIPE_KEY));
  }, []);

  function selectPlan(tier) {
    setTier(tier);
    history.push({
        pathname: `/Checkout/${tier}`,
        state: { tier: tier}
    });
  }

  function proPlanButton() {
      if(tier === "pro") {
        return (
            <p className="current-plan">- CURRENT PLAN -</p>
        )
      } else {
          return (
            <Button
                onClick={() => selectPlan("Pro")}
                className={`btn-pro ${tier === "pro" ? "disabled" : ""}`}
                size="lg"
                type="submit">
                    Upgrade to PRO
            </Button>)
      }
  }

  function prePlanButton() {
    if(tier === "pre") {
      return (
          <p className="current-plan">- CURRENT PLAN -</p>
      )
    } else {
        return (
            <Button
                onClick={() => selectPlan("Premium")}
                className={`btn-pre`}
                size="lg"
                type="submit">
                    Upgrade to PREMIUM
            </Button>)
    }
}
  
  return (
    <div className="Settings">
        <div className="plans">
            <h2>Select the right plan for you</h2>
            <div className={`plan pre ${tier === "pre" ? "disabled" : ""}`}>
                <h3>Premium</h3>
                <p>only $5 /month</p>
                <hr/>
                <div className="features">
                    {returnFeatures(premiumFeatures)}
                </div>
                {prePlanButton()}
            </div>
            <div className={`plan pro ${tier === "pro" ? "disabled" : ""}`}>
                <h3>Pro</h3>
                <p>only $10 /month</p>
                <hr/>
                <div className="features">
                    {returnFeatures(proFeatures)}
                </div>
                {proPlanButton()}
            </div>
        </div>
    </div>
  );
}