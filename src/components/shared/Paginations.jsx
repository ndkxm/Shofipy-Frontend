import Pagination from '@mui/material/Pagination';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
export const Paginations = ({numberOfPage, totalProducts}) => {

    const [searchParams] = useSearchParams();
    const params = new URLSearchParams(searchParams);
    const currentPage = searchParams.get("pageNumber") ? (Number(searchParams.get("pageNumber"))) : 1;
    const pathname = useLocation().pathname;
    const navigate = useNavigate();
    
    const onPageChangeHandler = (e, value) => {
        params.set("pageNumber", value.toString());
        navigate(`${pathname}?${params}`);
    }
    return (
            <Pagination
                page={currentPage} 
                count={numberOfPage}
                size='large'
                siblingCount={1}
                boundaryCount={2}
                onChange={onPageChangeHandler}
                color='primary'
                variant="outlined"
            >
            </Pagination>
    )
}