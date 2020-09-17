import React, { useState } from 'react'
import { Input } from "antd";

const { Search } = Input;

export default (props) => {

    const [SearchTerm, setSearchTerm] = useState('')
    
    const onChangeSearch = (e) => {
        setSearchTerm(e.currentTarget.value);
        props.refreshFunction(e.currentTarget.value);
    }

    return (
        <div>
            <Search
                value = {SearchTerm}
                onChange = {onChangeSearch}
                placeholder = "Search By Typing..."
            />
        </div>
    )
}
