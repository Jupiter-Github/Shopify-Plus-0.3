import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchProductDetail } from "../Redux/EcomActions";
import { Rating } from "@mui/material";
import { Button, Container, Row, Col } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";
import { addToCart, incrementCartItem } from "../Redux/EcomActions";
import { useState } from "react";

const ProductDetail = () => {
  const dispatch = useDispatch();
  const { productId } = useParams();
  const productDetail = useSelector((state) => state.productDetail);
  const cartData = useSelector((state) => state.cartData);
  const Navigate = useNavigate();
  const { id, title, price, category, description, rating, image } =
    productDetail;
  const [isItemAlreadyInCart, setIsItemAlreadyInCart] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    dispatch(fetchProductDetail(productId));
  }, [dispatch, productId]);

  useEffect(() => {
    //to Check item already exist in cart ot not
    const existingItem = cartData.find((value) => value.id === id);
    setIsItemAlreadyInCart(!!existingItem);
  }, [cartData, id]);

  const handleAddToCart = () => {
    if (isItemAlreadyInCart) {
      Navigate("/CartMain");
    } else {
      dispatch(addToCart({ id, title, price, image, quantity: 1 }));
      setOpenSnackbar(true);
    }
  };

  const handleBuyNow = () => {
    if (isItemAlreadyInCart) {
      dispatch(incrementCartItem(id));
    } else {
      dispatch(addToCart({ id, title, price, image, quantity: 1 }));
    }
    Navigate("/CartMain");
  };

  return (
    <>
      {Object.keys(productDetail).length && (
        <Container fluid className="mt-5">
          <Row>
            <Col
              xs="12"
              md="6"
              className=" pt-4 justify-content-center  d-flex "
            >
              <div className="ProductImageDiv">
                <img src={productDetail.image} alt="Product " />
              </div>
            </Col>
            <Col
              xs="12"
              md="6"
              className=" pt-4 justify-content-center  d-flex "
            >
              <div className="ProductDetailDiv">
                <h3>{title}</h3>
                <h6>{category}</h6>
                <div className=" d-flex align-items-center">
                  <Rating
                    name="read-only"
                    size="small"
                    value={rating.rate}
                    precision={0.5}
                    readOnly
                  />
                  <small className="text-muted">({rating.count} Reviews)</small>
                </div>
                <h3>${price}</h3>
                <p>{description} </p>
                <Button
                  className="me-3"
                  onClick={handleAddToCart}
                  size="sm"
                  color="primary"
                >
                  {isItemAlreadyInCart ? "Go to Cart" : "Add to Cart"}
                </Button>
                <Button onClick={handleBuyNow} size="sm" color="primary">
                  Buy Now
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      )}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4500}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Succefully added {title} to Cart
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProductDetail;
