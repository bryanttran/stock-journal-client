import React, { useState, useEffect } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import "./Home.css";
import { API } from "aws-amplify";
import { BsPencilSquare } from "react-icons/bs";
import { LinkContainer } from "react-router-bootstrap";
import Button from 'react-bootstrap/Button';
import { useHistory} from 'react-router';
import {isTokenValid} from '../libs/tokenLib';
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import Moment from "moment";

function instructionFormatter(cell) {
  return (
    <span><strong style = { {color: (cell === "BUY" ? 'green' : 'red')} }>{cell}</strong></span>
  )
}

const columns = [
  {
    dataField: "instruction",
    text: "Instruction",
    formatter: instructionFormatter,
  },
  {
    dataField: "ticker",
    text: "Stock Ticker",
  },
  {
    dataField: "price",
    text: "Price",
  },
  {
    dataField: "transactionDate",
    text: "Transaction Date",
    sort: true
  },
  {
    dataField: "content",
    text: "Content"
  }
];

export default function Home() {
  const [stocks, setStocks] = useState([]);
  let { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  let history = useHistory();

  const URL = process.env.REACT_APP_TD_URL;

  let tier = localStorage.getItem("tier");
  let selectedAccount = localStorage.getItem("selectedAccount");

  // Used for loading stocks
  useEffect(() => {
    async function onLoad() {
      if(!isAuthenticated) { return; }
      try {
        if(selectedAccount) {
          const transactions = await transactionsTD();
          console.log(transactions);
          if(!isTokenValid(transactions)) {
            console.log('invalidTokenTD');
            //history.push("/invalidTokenTD");
          }
        }
        let stocks = await loadStocks();
        for(let stock of stocks) {
          stock.transactionDate = Moment(stock.transactionDate).format("YYYY-MM-DD, h:mm:ss a");
        }
        console.log(stocks);
        setStocks(stocks);
      } catch(e) {
        onError(e);
      }
      setIsLoading(false);
    }
    onLoad();
  }, [isAuthenticated]);

  function transactionsTD() {
    return API.put("transactionsTD", "/transactionsTD", {
      body: {
        "tier": tier,
        "atoken": localStorage.getItem("atoken"),
        "rtoken": localStorage.getItem("rtoken"),
        "userTokenId": localStorage.getItem("userTokenId"),
        "selectedAccount": localStorage.getItem("selectedAccount"),
      }
    });
  }

  function loadStocks() {
    return API.get("stocks", "/stocks");
  }

  function isSubscribed() {
    return (localStorage.getItem("tier") === "pro" || localStorage.getItem("tier") === "pre") ? 
      <Button className="float-right" href={URL}>
        Login with TD
      </Button> 
     : "";
  }

  const rowEvents = {
    onClick: (e, row) => {
      console.log(row.stockId);
      localStorage.setItem("currStock", row.ticker);
      history.push(`/stocks/${row.stockId}`);
    }
  }

  function renderStocksList(stocks) {
    return (
      <>
        <div className="d-grid">
          {isSubscribed()}
        </div>
        <div className="newStockButton">
          <LinkContainer to="/newStock" >
            <ListGroup.Item action className="py-3 text-nowrap text-truncate">
              <BsPencilSquare size={17} />
              <span className="ml-2 font-weight-bold">Create a new entry</span>
            </ListGroup.Item>
          </LinkContainer>
        </div>
        <BootstrapTable
          pagination={paginationFactory({ sizePerPage: 10, withFirstAndLast: true })}
          bootstrap4
          striped
          hover
          sort={{ dataField: 'transactionDate', order: 'desc' }}
          keyField="stockId"
          data={stocks}
          columns={columns}
          rowEvents={rowEvents}
        />
      </>
    )
  }

  function renderLander() {
    return (
      <div className="lander">
        <h1>Stock Journal</h1>
        <p className="text-muted">A journal for all your previous trades</p>
      </div>
    );
  }

  function renderStocks() {
    return (
      <div className="stocks">
        <h2 className="pb-3 mt-4 mb-3 border-bottom">
          Your trades {(tier) ? `for account ${selectedAccount}` : ""}
        </h2>
        <ListGroup>{!isLoading && renderStocksList(stocks)}</ListGroup>
      </div>
    );
  }

  return (
    <div className="Home" key="header">
      {isAuthenticated ? renderStocks() : renderLander()}
    </div>
  );
}