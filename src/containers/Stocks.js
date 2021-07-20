import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { API } from "aws-amplify";
import { onError } from "../libs/errorLib";
import Form from "react-bootstrap/Form";
import LoaderButton from "../components/LoaderButton";
import "./Stocks.css";

export default function Stocks() {
  const { id } = useParams();
  const history = useHistory();
  const [stock, setStock] = useState(null);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    function loadStock() {
      return API.get("stocks", `/stocks/${id}`);
    }

    async function onLoad() {
      try {
        const stock = await loadStock();
        const { content } = stock;

        setContent(content);
        setStock(stock);
      } catch (e) {
        onError(e);
      }
    }
    onLoad();
  }, [id]);

  function validateForm() {
    return content && content.length > 0;
  }

  function saveStock(stock) {
    return API.put("stocks", `/stocks/${id}`, {
      body: stock
    });
  }
  
  async function handleSubmit(event) {
    event.preventDefault();  
    setIsLoading(true);
    try {
        await saveStock({
            content,
        });
        history.push("/");
        } catch (e) {
        onError(e);
        setIsLoading(false);
    }
  }

  function deleteStock() {
    return API.del("stocks", `/stocks/${id}`);
  }
  
  async function handleDelete(event) {
    event.preventDefault();
    const confirmed = window.confirm(
      "Are you sure you want to delete this stock?"
    );
    if (!confirmed) {
      return;
    }
    setIsDeleting(true);
    try {
      await deleteStock();
      history.push("/");
    } catch (e) {
      onError(e);
      setIsDeleting(false);
    }
  }
  
  return (
    <div className="Stocks">
      {stock && (
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="content">
            <h3>Edit stock journal record for {localStorage.getItem("currStock")}</h3>
            <Form.Control
              as="textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </Form.Group>
          <LoaderButton
            block
            size="lg"
            type="submit"
            isLoading={isLoading}
            disabled={!validateForm()}
          >
            Save
          </LoaderButton>
          <LoaderButton
            block
            size="lg"
            variant="danger"
            onClick={handleDelete}
            isLoading={isDeleting}
          >
            Delete
          </LoaderButton>
        </Form>
      )}
    </div>
  );
}