import { Switch } from '@chakra-ui/react';
// import React from 'react'
// import { useFormContext } from 'react-hook-form';

interface Props {
    data: any, 
    newData: any
}

function CustomSwitch(props: Props) {
    const {
        data,
        newData
    } = props 

    const handleChange = (item: any) => {   
        newData(item)
    }  

    return (

        <div className=" flex items-center justify-between " >
            <p>Make my email address public:</p>
            <Switch isChecked={data} onChange={(e)=> handleChange(e.target?.checked)} />
        </div>
    )
}

export default CustomSwitch
