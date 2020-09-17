import React, {useEffect, useState} from 'react'
import axios from "axios"
import { Icon, Col, Card, Row } from 'antd';
import ImageSlider from "../../utils/ImageSlider";
import CheckBox from './Sections/CheckBox';
import RadioBox from "./Sections/RadioBox";
import { price,continents } from "./Sections/Datas";
import SearchFeature from "./Sections/SearchFeature";

const { Meta } = Card

function LandingPage() {

    const [Products, setProducts] = useState([]);
    const [Skip, setSkip] = useState(0);
    const [Limit, setLimit] = useState(8);
    const [PostSize, setPostSize] = useState(0);
    const [SearchTerm, setSearchTerm] = useState('')

    const [Filters, setFilters] = useState({
        continents: [],
        price: []
    })

    useEffect(() => {

        const variables = {
            skip: Skip,
            limit: Limit
        }

        getProducts(variables)
    }, [])

    const getProducts = (variables) => {
        axios.post('/api/product/getProducts', variables)
        .then(response => {
            if(response.data.success){
                if(variables.loadMore){
                    setProducts([...Products, ...response.data.products])
                } else {
                    setProducts(response.data.products);
                }
                setPostSize(response.data.postSize);
            } else {
                alert("Failed to fetch product datas")
            }
        })
    }

    const onLoadMore = () => {
        let skip = Limit + Skip;

        const variables = {
            skip: skip,
            limit: Limit,
            loadMore: true
        }

        getProducts(variables)

        setSkip(skip)
    }

    const renderCards = Products.map((product, index) => {

        return <Col lg={6} md={8} xs={24} key = {index}>
            <Card
                hoverable={true}
                cover={<ImageSlider images={product.images} />}
            >
                <Meta
                    title={product.title}
                    description={`$${product.price}`}
                />
            </Card>
        </Col>
    })

    const showFilteredResults = (filters) => {
        const variables = {
            skip: 0,
            limit: Limit,
            filters: filters
        }
        getProducts(variables);
        setSkip(0);
    }

    const handlePrice = (value) => {
        const data = price;
        let array = [];

        for (let key in data) {
            if(data[key].id === parseInt(value, 10)){
                array = data[key].array;
            }
        }
        console.log('array', array);
        return array
    }

    const handleFilters = (filters, category) => {
        
        const newFilters = {...Filters};
        
        console.log(newFilters)
        newFilters[category] = filters;
        
        if(category === "price") {
            let priceValues = handlePrice(filters);
            newFilters[category] = priceValues;
        }

        showFilteredResults(newFilters);
        setFilters(newFilters);
    }
    
    const updateSearchTerm = (newSearchTerm) => {

        const variables = {
            skip: 0,
            limit: 8,
            filters: Filters,
            searchTerm: newSearchTerm
        }

        setSkip(0);
        setSearchTerm(newSearchTerm);

        getProducts(variables);
    }

    return (
        <div style = {{ width: '75%', margin: '3rem auto' }}>


            <div style = {{textAlign: 'center'}}>
                <h2> Let's Travel Anywhere <Icon type = "rocket"/></h2>
            </div>


            {/* Filter */}

            <Row gutter = {[16,16]}>
                <Col lg = {12} xs = {24}>
                    <CheckBox
                        list = {continents}
                        handleFilters = {filters => handleFilters(filters, "continents")}
                    />
                </Col>
                <Col lg = {12} xs = {24}>
                    <RadioBox
                        list = {price}
                        handleFilters = {filters => handleFilters(filters, "price")}
                    />
                </Col>
            </Row>

            {/* Search */}

            <div style = {{display: 'flex', justifyContent: 'flex-end', margin: '1rem auto'}}>
                <SearchFeature refreshFunction = {updateSearchTerm}/>
            </div>


            {Products.length === 0 ?
                <div style = {{display: 'flex', height: '300px', justifyContent: 'center', alignItems: 'center'}}>
                    <h2> No Post Yet ... </h2>
                </div> : 
                <div>
                    <Row gutter={[16, 16]}>
                        {renderCards}
                    </Row>
                </div>
            }

            <br/>
            <br/>

            {PostSize >= Limit &&
                <div style ={{ display : 'flex', justifyContent: 'center'}}>
                <button onClick = {onLoadMore}>Load More</button>
            </div>
            }

        </div>
    )
}

export default LandingPage
