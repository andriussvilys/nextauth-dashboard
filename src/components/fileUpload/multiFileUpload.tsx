import { useFieldArray, useFormContext } from "react-hook-form";
import { Box, Divider, Stack, Typography } from "@mui/material";
import MultiFielUploadField from "./multiFileUploadField";
import Sortable from "../sortable/sortable";
import SortableMultiFileUpload from "./sortableMultiFileUpload";
import { useEffect } from "react";
import { verticalListSortingStrategy } from "@dnd-kit/sortable";
import { StorageFile } from "@/src/lib/definitions/fileUpload";

const sortByRef = (ref:any[], src:any[]) => {
    const sorted = ref
    .filter((item: any) => src.some((srcItem: any) => item._id === srcItem._id))
    .map((item: any) => src.find((srcItem: any) => item._id === srcItem._id));

    const newItems = src.filter((item:any) => !sorted.includes(item))
    if(sorted.length === 0){
        return src
    }
    return [...newItems, ...sorted]
}

export default function MultiFileUpload(){
    const {control, watch, setValue} = useFormContext()
    const { fields:newFiles, remove:removeNewFile, append } = useFieldArray({
        control,
        name: "files"
    });
    const { remove:removeStorageFile } = useFieldArray({
        control,
        name: "storageFiles"
    });
    const watchedNewFiles = watch("files")
    const watchedStorageFiles = watch("storageFiles")
    const watchedFileOrder = watch("fileOrder")
    const lastNewFilesIndex = newFiles.length-1
    const lastNewFilesField = newFiles[lastNewFilesIndex]

    useEffect(()=>{
        const sortableStorageFiles = watchedStorageFiles.map((item:StorageFile, index: number) => {
            return {
                _id: item.key,
                initialData: item, 
                rootFieldName: "storageFiles",
                fieldIndex: index,
                remove: removeStorageFile,
                disabled: true
            }
        })
        const sortableNewFiles = watchedNewFiles.slice(0,-1).map((item: File, index: number) => {
            return {
                _id: item.name,
                initialData: item, 
                rootFieldName: "files",
                fieldIndex: index,
                remove: removeNewFile,
                disabled: true
            }
        })

        const allFiles = [...sortableStorageFiles, ...sortableNewFiles]

        const sorted = sortByRef(watchedFileOrder, allFiles)
        
        setValue("fileOrder", sorted)

    },[watchedNewFiles, watchedStorageFiles])

    return (
        <Box gap={2} sx={{display:"flex", height:1, width:1}}>
            <Stack gap={2}>
                <Stack>
                    <Typography variant="overline">Add new file</Typography>
                    <Divider/>
                </Stack>
                <MultiFielUploadField 
                    key={lastNewFilesField.id} 
                    initialData={watchedNewFiles[lastNewFilesIndex]} 
                    rootFieldName={"files"} 
                    fieldIndex={lastNewFilesIndex}
                    append={append}
                />
            </Stack>
            <Divider orientation="vertical"/>
            <Stack gap={2} sx={{overflow:"auto", flex:1}}>
                <Stack gap={2}>
                    <Stack>
                        <Typography variant="overline">Storage Files</Typography>
                        <Divider/>
                    </Stack>
                    <Box sx={{
                            display:"flex",
                            overflow:"auto",
                            justifyContent:"center"
                        }} 
                        gap={2}
                    >
                        <Sortable 
                            strategy={verticalListSortingStrategy}
                            items={watchedFileOrder} 
                            Component={SortableMultiFileUpload} 
                            rearrangeCallback={(items: any[]): void => {
                                setValue("fileOrder", items)
                            }} 
                        />
                    </Box>
                </Stack>
            </Stack>
        </Box>
    )
}