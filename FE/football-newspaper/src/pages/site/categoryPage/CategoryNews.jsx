import { useState } from "react";
import { useParams } from "react-router-dom";

function CategoryNews() {
    const {slug} = useParams();
    const [newsData, setNewsData] = useState([]);
    
    return ( <>

    </> );
}

export default CategoryNews;