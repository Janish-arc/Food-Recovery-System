import React from "react";

export const Pagination = ({
    currentPage,
    totalPages,
    setCurrentPage,
}) => {
    return (
        <div className="d-flex justify-content-center gap-2 mt-4">
            <button
                className="btn btn-outline-dark m-1"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
            >
                Previous
            </button>

            {
                Array.from({ length: totalPages }, (_, i) => (
                    <div
                        key={i}
                        className="d-inline-flex border border-primary border-2 rounded-circle p-1 m-1"
                    >
                        <button
                        className={`btn ${
                            currentPage === i + 1
                            ? "btn-primary rounded-circle"
                            : " rounded-circle"
                        }`}
                        onClick={() => setCurrentPage(i + 1)}
                        >
                        {i + 1}
                        </button>
                    </div>
                    ))
            }

            <button
                className="btn btn-outline-dark m-1"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
            >
                Next
            </button>

        </div>
    );
};