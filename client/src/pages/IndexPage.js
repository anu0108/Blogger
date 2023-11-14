import Post from "../Post";
import { useEffect, useState } from "react";
const BASE_URL = "https://blogger-a1rxqtb9o-anu0108.vercel.app/"


export default function IndexPage(){
    const [posts,setPosts] = useState([])
    useEffect(()=>{
        const response = fetch(`${BASE_URL}/post`).then(response => {
            response.json().then(posts => {
                setPosts(posts)
            });
        })
    },[])
    return(
        <>
        {posts.length > 0 && posts.map(post => (
            <Post {...post} />
        ))}
        </>
    )
}