import React, { useEffect, useState } from 'react'
import { Input } from 'antd'

export default function MyInput(props) {
    
    const [value, setValue] = useState(props.value || props.defaultValue || '')

    useEffect(()=>{
        setValue(props.value || props.defaultValue || '')
    },[props.value,props.defaultValue])

    const onChange = (e) => {
        setValue(e.target.value)
        if (typeof props.onChange === 'function')
            props.onChange(props.id || props.name, e.target.value)
    }
    const onBlur = (e) => {
        console.log(e)
        setValue(e.target.value)
        if (typeof props.onBlur === 'function')
            props.onBlur(props.id || props.name, e.target.value)
    }
    return (
        <Input
            {...props}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
        />
    )
}

