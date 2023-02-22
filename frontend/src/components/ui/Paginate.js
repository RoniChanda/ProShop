import React from "react";
import { Pagination } from "react-bootstrap";
import { useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";

function Paginate({ keyword, pageNumber, isAdmin = false, type }) {
  const { pagesNeeded } = useSelector((state) => state.shared);

  return (
    pagesNeeded > 1 && (
      <Pagination>
        {[...Array(pagesNeeded).keys()].map((x) => (
          <LinkContainer
            key={x + 1}
            to={
              !isAdmin
                ? keyword
                  ? `/search/${keyword}/page/${x + 1}`
                  : `/page/${x + 1}`
                : `/admin/${type}/${x + 1}`
            }
          >
            <Pagination.Item active={x + 1 === pageNumber}>
              {x + 1}
            </Pagination.Item>
          </LinkContainer>
        ))}
      </Pagination>
    )
  );
}

export default Paginate;
