function PaginationComponent(props) {
    if (props.total <= 0) {
        return null;
    }

    const totalPages = Math.ceil(props.total / props.perPage);

    const handlePageChange = (pageNumber) => {
        props.onChange(pageNumber);
    };

    return (
        <nav>
            <ul className={`pagination justify-content-${props.position} mb-0`}>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                    <li
                        key={page}
                        className={`page-item ${
                            page === props.currentPage ? "active" : ""
                        }`}
                    >
                        <button
                            type="button"
                            className="page-link"
                            onClick={() => handlePageChange(page)}
                        >
                            {page}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default PaginationComponent;