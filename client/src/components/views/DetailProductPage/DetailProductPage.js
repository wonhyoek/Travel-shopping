import React, { useEffect, useState } from 'react';
import { Col, Row } from "antd";
import axios from "axios";
import ProductImage from "./Sections/ProductImage";
import ProductInfo from "./Sections/ProductInfo";

export default (props) => {

    const productId = props.match.params.productId;
    const [Product, setProduct] = useState([]);

    useEffect(() => {
       axios.get(`/api/product/products_by_id?id=${productId}&type=single`) 
       .then(response => {
            setProduct(response.data[0])
       })
    }, [])

    return (
        <div className = "postPage" style = {{width: '100%', padding: '3rem 4rem'}}>
            <div style = {{display: 'flex', justifyContent: 'center'}}>
                <h1>product Title</h1>
            </div>

            <br/>

            <Row gutter = {[16, 16]}>
                <Col lg = {12} xs = {24}>
                    <ProductImage/>
                </Col>
                <Col lg = {12} xs = {24}>
                    <ProductInfo/>
                </Col>
            </Row>
        </div>
    )
}
