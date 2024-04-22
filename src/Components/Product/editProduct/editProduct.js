import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { backendActions, productActions } from "../../../store";
import classes from "../product.module.css";
import Posts from "./posts";
import Pagination from "./pagination";

const EditProduct = () => {
    const { products } = useSelector((state) => state.backend);
    const dispatch = useDispatch();
    const [selectedId, setSelectedId] = useState("");
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostPerPage] = useState(100); // Number of posts per page.

    const handleEdit = () => {
        dispatch(
            productActions.set(
                products.find((product) => product.id === selectedId)
            )
        );
    };

    const handleDelete = () => {
        dispatch(backendActions.deleteProduct(selectedId));
    };

    useEffect (() => {
        const fetchPosts = async ()  => {
            setLoading(true);
            const res = await axios.get('http://localhost:3001/api/v1/products');
            setPosts(res.data);
            setLoading(false);
        }

        fetchPosts();
    }, []);

    console.log(posts);

    // Get current posts
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    // Change  page
    const  paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <>
            <div>Select a product to edit or delete:</div>
            {products.map((product) => (
                <div
                    key={product.id}
                    onClick={() => setSelectedId(product.id)}
                    className={`${classes.cursor} ${
                        selectedId === product.id
                            ? classes.active
                            : classes.background
                    }`}
                >
                    {product.name}
                </div>
            ))}
            {selectedId && (
                <>
                    <button onClick={handleEdit}>Edit</button>
                    <button onClick={handleDelete}>Delete</button>
                </>
            )}

            <div>
            <Posts posts={currentPosts} loading={loading} />
            <Pagination postsperPage={postsPerPage} totalPosts={posts.length} paginate={paginate} />
            </div>
        </>
    );
};

export default EditProduct;
