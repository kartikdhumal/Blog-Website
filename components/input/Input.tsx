"use client"
import React from 'react'

interface InputProps{
    type:any,
    value:any,
    style?:any,
    minlength?:any,
    onChange:(event:React.ChangeEvent<HTMLInputElement>) => void,
    name?:string,
    textarea?:boolean,
    id:string,
    placeholder?:string,
    big?:boolean
}

function Input({type,value,style, minlength,onChange,name,id,placeholder,big}:InputProps) {
  return (
   <input type={type} value={value} onChange={onChange} name={name} id={id} placeholder={placeholder}
    className={style} minLength={minlength}/>
  )
}

export default Input
