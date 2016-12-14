/* eslint-disable react/prop-types */
import React from 'react';
import segmentize from 'segmentize';
import Paginator from 'react-pagify';

const Paging = ({
  labels, ellipsis, pagination, pages, onSelect, ...props
}) => (
  <Paginator.Context className="pagination" {...props}
    segments={segmentize({
      page: pagination.page,
      pages: pages,
      beginPages: 3,
      endPages: 3,
      sidePages: 2
    })} onSelect={onSelect}>
    
    <Paginator.Button className={pagination.page > 1 ? 'enabled prev' : 'disabled prev'} page={pagination.page - 1}>
    <button>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <title>{labels.previous}</title>
        <circle cx="100" cy="100" r="90" strokeWidth="15" fill="none" stroke="black" />
        <path d="M100 200C44.9 200 0 155.1 0 100S44.9 0 100 0s100 44.9 100 100-44.9 100-100 100zm0-180.4c-44.3 0-80.4 36.1-80.4 80.4 0 44.3 36.1 80.4 80.4 80.4s80.4-36.1 80.4-80.4c0-44.3-36.1-80.4-80.4-80.4z"/>
        <polygon points="70,145 145,100 70,55 " transform="matrix(-1,0,0,1,197,0)" />
      </svg>
    </button>
    </Paginator.Button>    
    
    <Paginator.Button className={pagination.page + 1 < pages ? 'enabled next' : 'disabled next'} page={pagination.page + 1}>
      <button>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
          <title>{labels.next}</title>
          <path d="M100 200C44.9 200 0 155.1 0 100S44.9 0 100 0s100 44.9 100 100-44.9 100-100 100zm0-180.4c-44.3 0-80.4 36.1-80.4 80.4 0 44.3 36.1 80.4 80.4 80.4s80.4-36.1 80.4-80.4c0-44.3-36.1-80.4-80.4-80.4z"/>
          <polygon points="70, 55 70, 145 145, 100"/>
        </svg>
      </button>
    </Paginator.Button>

  </Paginator.Context>
);
Paging.defaultProps = {
  labels: {
    previous: 'Previous',
    next: 'Next'
  }
}

export default Paging;