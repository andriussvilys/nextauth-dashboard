"use client"

import { ContactInput } from '@/src/lib/definitions/contact';
import { Button, Stack, TextField, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import messages from './errorMessages'
import LoadingBackdrop from '@/src/components/loading/backdrop/loadingBackdrop';
import { sendEmail } from '@/src/lib/contact';
import useLoading from '@/src/components/loading/backdrop/useLoading';

export default function ContactForm() {
    const theme = useTheme();
    const errorColor = theme.palette.error.main;
    const {backdrop, toast} = useLoading()
    const {loading, setLoading} = backdrop
    const {toastStatus, setToastStatus, closeToast} = toast
    const {handleSubmit, register, formState: { errors }} = useForm<ContactInput>();
    const onSubmit = async (inputs: ContactInput) => {
        setLoading(true)
        try{
            await sendEmail(inputs)
            setToastStatus({message:"Your message has been received. Thanks!", open:true, severity:"success"})
        }
        catch(e){
            setToastStatus({message:(e as Error).message, open:true, severity:"error"})
        }
        finally{
            setLoading(false)
        }
    }
    return (
        <>
            <LoadingBackdrop open={loading} toastStatus={toastStatus} closeToast={closeToast}/>
            <Stack 
                component="form" 
                onSubmit={handleSubmit(onSubmit)}
                gap={3}
            >
                <TextField 
                    size="small" 
                    label="name" 
                    variant="outlined"
                    InputLabelProps={{shrink:true}} 
                    {...register("name", {
                        required: messages.name,
                    })}
                    placeholder="Your name"
                />
                {errors.name && <Typography color={errorColor}>{errors.name.message}</Typography>}
                <TextField 
                    size="small" 
                    label="email" 
                    variant="outlined"
                    InputLabelProps={{shrink:true}} 
                    {...register("email", {
                        required: messages.email,
                        pattern: {
                            value:/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                            message: messages.emailPattern}
                    })}
                    placeholder="your@email.com"
                />
                {errors.email && <Typography color={errorColor}>{errors.email.message}</Typography>}
                <TextField 
                    size="small" 
                    label="message" 
                    variant="outlined" 
                    InputLabelProps={{shrink:true}} 
                    multiline rows={4} 
                    type="textArea"
                    {...register("message", {
                        required: messages.message,
                    })}
                    placeholder='...'
                />
                {errors.message && <Typography color={errorColor}>{errors.message.message}</Typography>}
                <Button 
                    type="submit"
                    sx={{alignSelf:"end"}}
                >
                    Submit
                </Button>
            </Stack>
        </>
    )
}
