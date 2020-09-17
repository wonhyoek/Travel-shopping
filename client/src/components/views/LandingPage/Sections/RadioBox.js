import React, { useState } from 'react';
import { Collapse, Radio } from "antd";

const { Panel } = Collapse;




export default (props) => {

    const [Value, setValue] = useState('0');
    
    const renderRadioBox = () => (
        props.list && props.list.map(value => (
            <Radio key = {value.id} value = {`${value.id}`}>{value.name}</Radio>
        ))
    )

    const handleChange = (event) => {
        setValue(event.target.value);
        props.handleFilters(event.target.value);
    }

    return (
        <div>
            <Collapse defaultActiveKey = {['0']}>
                <Panel header = "price" key = "1">
                    <Radio.Group onChange = {handleChange} value = {Value}>
                        {renderRadioBox()}
                    </Radio.Group>
                </Panel>
            </Collapse>
        </div>
    )
}
