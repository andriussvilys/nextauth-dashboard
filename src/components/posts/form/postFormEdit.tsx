"use client"

import { processInput, updatePost } from "@/src/lib/posts"
import PostForm, { PostFormProps } from "./postForm"
import { Post, PostFormInput } from "@/src/lib/definitions/posts"

interface PostFormEditProps extends Omit<PostFormProps, "onSubmit">{
    initialData: Post
}

export default function PostFormEdit({tags, initialData}:PostFormEditProps){
    const handleSubmit = async (inputs: PostFormInput) => {
        try{
            const formData = processInput(inputs);
            await updatePost(formData, initialData._id);
        }
        catch(e){
            throw e
        }
    }
    return(
        <PostForm onSubmit={handleSubmit} tags={tags} initialData={initialData}/>
    )
}