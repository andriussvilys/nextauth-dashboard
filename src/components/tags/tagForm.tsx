"use client"

import { Box, Button, Divider, Stack, TextField, Typography } from "@mui/material"
import DeleteButton from "./deleteButton"
import { TagRecord, TagFormInput, TagBackground, TagBackgroundOptions } from "@/src/lib/definitions/tags"
import FileUploadField from "../fileUpload/fileUploadField"
import { FormProvider, useForm} from "react-hook-form"
import ControlledSelect from "./ControlledSelect"
import LoadingBackdrop from "../loading/backdrop/loadingBackdrop"
import useLoading from "../loading/backdrop/useLoading"
import Tag from "./tag"

interface TagFormProps {
    onSubmit: (inputs: TagFormInput) => Promise<any>,
    tag?: TagRecord
    categories: string[],
    successMessage?: string
}

export default function TagForm(props: TagFormProps){
    const {tag, categories, successMessage} = props

    const {backdrop, toast} = useLoading()
    const {loading, setLoading} = backdrop
    const {toastStatus, setToastStatus, closeToast} = toast
    
    const methods = useForm<TagFormInput>({
        defaultValues: {
            file: tag?.file || {key:"", url:"", metadata:{}},
            name: tag?.name ?? "",
            category: tag?.category ?? categories[0],
            categoryIndex: tag?.categoryIndex ?? Number.MAX_SAFE_INTEGER,
            background: tag?.background ?? TagBackground.NONE
        }
    })
    const {handleSubmit, control, register} = methods
    const initialData = tag ? {key: tag.file.key, url:tag.file.url!, metadata: tag.file.metadata} : undefined

    const loadingSubmit = async (inputs: TagFormInput) => {
        setLoading(true)
        try{
            await props.onSubmit(inputs)
            setToastStatus({message:successMessage ?? "Operation complete", open:true, severity:"success"})
            location.reload()
        }
        catch(e){
            setToastStatus({message:(e as Error).message, open:true, severity:"error"})
            throw e
        }
        finally{
            setLoading(false)
        }
    }

    return(
        <>
            <LoadingBackdrop open={loading} toastStatus={toastStatus} closeToast={closeToast}/>
            <FormProvider {...methods}>
                <Box 
                    component="form" 
                    onSubmit={handleSubmit(loadingSubmit)} 
                    sx={{display:"flex", flexWrap:"wrap", justifyContent:"center"}} 
                    gap={2}
                >
                    <Stack gap={2}>
                        <Box sx={{display:"flex"}} gap={2}>
                            <Stack sx={{maxWidth:"20ch", justifyContent:"center"}} gap={1}>
                                <Typography variant="overline">Upload new icon</Typography>
                                <FileUploadField rootFieldName="file"/>
                            </Stack>
                            <Divider orientation="vertical"/>
                            <Stack gap={2} sx={{justifyContent:"start"}}>
                                {tag ? <Box sx={{alignSelf:"center"}}><Tag data={tag} /></Box> : null}
                                <Stack gap={2}>
                                    <TextField 
                                        size="small" 
                                        InputLabelProps={{shrink:true}} 
                                        label="name" 
                                        variant="outlined"
                                        defaultValue={props.tag?.name}
                                        {...register("name")}
                                    />
                                    <ControlledSelect 
                                        fieldName="category"
                                        options={categories}
                                        control={control}
                                    />
                                    <ControlledSelect 
                                        fieldName="background"
                                        options={TagBackgroundOptions}
                                        control={control}
                                        defautValue={TagBackground.NONE}
                                    />
                                </Stack>
                            </Stack>
                        </Box>
                        <Divider/>
                        <Box sx={{alignSelf:"end", display:"flex"}} gap={2}>
                            <Button sx={{alignSelf:"end"}} variant="contained" type="submit">Submit</Button>
                            {tag?._id ? <DeleteButton disabled={false} _id={tag._id}/> : null}
                        </Box>
                    </Stack>
                </Box>
            </FormProvider>
        </>
    )
}

export type {TagFormProps}