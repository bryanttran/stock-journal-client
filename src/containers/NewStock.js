import React, { useState } from "react";
import {Form} from "react-bootstrap";
import { useHistory } from "react-router-dom";
import LoaderButton from "../components/LoaderButton";
import { onError } from "../libs/errorLib";
import "./NewStock.css";
import { API } from "aws-amplify";
import { useFormFields } from "../libs/hooksLib";
import Moment from "moment";

export default function NewStock() {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);

  const [fields, handleFieldChange] = useFormFields({
    instruction: "BUY",
    ticker: "",
    price: "",
    date: "",
    accountNumber: localStorage.getItem("selectedAccount"),
    content: ""
  });

  function validateForm() {
    return (fields.instruction && fields.ticker && fields.price && fields.date && fields.content);
    //return (fields.content);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    try {
        await createStock({ fields });
        history.push("/");
    } catch(e) {
        onError(e);
        setIsLoading(false);
    }
  }

  function createStock(stock) {
    fields.date = Moment(fields.date).toISOString();
    fields.ticker = fields.ticker.toUpperCase();
    console.log(stock);
      return API.post("stocks", "/stocks", {
          body: stock
      })
  }

  function test() {
    console.log(Moment(fields.date).toISOString());
    console.log(fields);
  }
  return (
    <div className="NewStock">
      <h3>Create a new stock record</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="instruction">
          <Form.Label>Instruction</Form.Label>
          <Form.Control controlId="instruction"
            as="select"
            onChange={handleFieldChange}
            value={fields.instruction}
          >
            <option value="BUY">BUY</option>
            <option value="SELL">SELL</option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="ticker">
          <Form.Label>Stock Ticker</Form.Label>
          <Form.Control controlId="ticker"
            type="text" 
            placeholder="AAPL" 
            onChange={handleFieldChange} 
            value={fields.ticker} />
        </Form.Group>
        <Form.Group controlId="price">
          <Form.Label>Price</Form.Label>
          <Form.Control controlId="price"
            type="number" 
            placeholder="0" 
            onChange={handleFieldChange} 
            value={fields.price} />
        </Form.Group>
        <Form.Group controlId="date">
          <Form.Label>Transaction Date</Form.Label>
            <Form.Control controlId="content"
            type="date" 
            onChange={handleFieldChange} 
            value={fields.date} />
        </Form.Group>
        <Form.Group controlId="content">
          <Form.Label>Content</Form.Label>
          <Form.Control
            as="textarea"
            value={fields.content}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <LoaderButton onClick={test}>test</LoaderButton>
        <LoaderButton
          block
          type="submit"
          size="lg"
          variant="primary"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Create
        </LoaderButton>
      </Form>
    </div>
  );
}