import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Button,
  CardImg,
} from "reactstrap";
import Rating from "@mui/material/Rating";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [productList, setProductList] = useState([]);
  const Navigate = useNavigate();

  useEffect(() => {
    //to fetch product List
    fetch("https://fakestoreapi.com/products", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => setProductList(data));
  }, []);

  return (
    <>
      <Container className="mt-5" fluid>
        <Row className="p-2 pt-4">
          {productList?.map((value, index) => (
            <Col
              key={index}
              className="mb-4 d-flex justify-content-center"
              xs="12"
              sm="6"
              lg="4"
              xl="3"
            >
              <Card
                style={{
                  width: "17rem",
                  boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                }}
              >
                <CardImg
                  alt="Card image cap"
                  style={{
                    height: 180,
                  }}
                  src={value.image}
                  top
                  width="100%"
                />
                <CardBody>
                  <CardTitle
                    tag="h5"
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {value.title}
                  </CardTitle>
                  <CardText>
                    Price:${value.price} <br />
                    <Rating size="small" value={value.rating.rate} readOnly />
                  </CardText>

                  <Button
                    color="primary"
                    onClick={() => Navigate(`/ProductDetail/${value.id}`)}
                  >
                    Product Detail
                  </Button>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default Home;
